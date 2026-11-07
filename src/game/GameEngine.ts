import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import {
  GameMaterials,
  createPlayerAndTricycle,
  PlayerModelBundle,
  createSheep,
  SheepBundle,
  createShepherd,
  createVillageEnvironment,
  SheepBreed,
} from './models';
import { sounds } from './audio';

export type GameState = 'title' | 'cinematic_intro' | 'playing' | 'paused' | 'gameover' | 'victory';
export type CameraMode = 'chase' | 'front_meme' | 'first_person' | 'drone';

export interface GameStats {
  sheepInCart: number;
  maxCartCapacity: number;
  totalSheepStolen: number;
  totalScore: number;
  nitro: number; // 0 - 100
  speedKmh: number;
  shepherdAlert: boolean;
  timeLeft: number;
  mode: 'heist' | 'freeroam';
  activeNotification: string | null;
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  drift: boolean;
  nitro: boolean;
  bell: boolean;
  joystickX: number;
  joystickY: number;
}

interface UnloadingSheep {
  bundle: SheepBundle;
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  progress: number;
  speed: number;
  bleated: boolean;
}

export class GameEngine {
  public container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock!: THREE.Clock;
  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private destroyed: boolean = false;

  // Game entities
  private mats!: GameMaterials;
  private player!: PlayerModelBundle;
  private sheepList: SheepBundle[] = [];
  private unloadingSheepList: UnloadingSheep[] = [];
  private isUnloadingSheep: boolean = false;
  private shepherd!: { mesh: THREE.Group; alertIcon: THREE.Mesh; staff: THREE.Mesh };
  private villageColliders: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [];
  private dropZonePos!: THREE.Vector3;

  // Particle systems
  private tireSmokeGeo!: THREE.BufferGeometry;
  private tireSmokeMat!: THREE.PointsMaterial;
  private tireSmokePoints!: THREE.Points;
  private smokeParticles: { pos: THREE.Vector3; vel: THREE.Vector3; life: number }[] = [];

  // Vehicle Physics state
  private playerPos = new THREE.Vector3(0, 0, 15);
  private playerHeading: number = 0; // In radians (0 facing +Z)
  private playerSpeed: number = 0; // Units per second
  private steeringAngle: number = 0;
  private isDrifting: boolean = false;
  private pedalRotation: number = 0;

  // Game Logic state
  public state: GameState = 'title';
  public cameraMode: CameraMode = 'chase';
  public gameStats: GameStats = {
    sheepInCart: 0,
    maxCartCapacity: 6,
    totalSheepStolen: 0,
    totalScore: 0,
    nitro: 100,
    speedKmh: 0,
    shepherdAlert: false,
    timeLeft: 90,
    mode: 'heist',
    activeNotification: null,
  };

  // Intro Cinematic Camera Interpolation
  // Starts directly in FRONT of player (replicating the iconic meme photo),
  // then swoops smoothly behind him!
  private cinematicProgress: number = 0;
  private readonly CINEMATIC_DURATION: number = 2.4; // seconds

  // Input
  public input: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    drift: false,
    nitro: false,
    bell: false,
    joystickX: 0,
    joystickY: 0,
  };

  // Event callbacks for React HUD
  public onStatsUpdate?: (stats: GameStats) => void;
  public onStateChange?: (state: GameState) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init() {
    // 1. Detect Software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Three.js Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    // Warm golden hour sky matching the photo
    this.scene.background = new THREE.Color(0xd2bba0);
    this.scene.fog = new THREE.FogExp2(0xd2bba0, 0.0075);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 400);

    // 4. Lighting Rig (Warm golden sun + cool sky fill)
    const hemiLight = new THREE.HemisphereLight(0xffecd2, 0x5a6850, 0.75);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1dc, 1.8);
    sunLight.position.set(40, 60, 40);
    if (!this.isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 160;
      const d = 50;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Build Game Materials & World
    this.mats = new GameMaterials();

    const env = createVillageEnvironment(this.scene, this.mats);
    this.villageColliders = env.colliders;
    this.dropZonePos = env.dropZonePos;

    // 6. Spawn Player
    this.player = createPlayerAndTricycle(this.mats);
    this.scene.add(this.player.root);
    this.playerPos.set(0, 0, 15);
    this.playerHeading = Math.PI; // Initially facing toward camera for the photo pose!
    this.updatePlayerTransform();

    // 7. Spawn Flocks of Sheep
    this.spawnSheepFlocks();

    // 8. Spawn Shepherd
    this.shepherd = createShepherd(this.mats);
    this.shepherd.mesh.position.set(4, 0, 45);
    this.scene.add(this.shepherd.mesh);

    // 9. Particle System for Drifting Smoke
    this.initTireSmoke();

    // 10. Loop & Events
    this.bindEvents();

    // Start in Title view (looking directly from the front)
    this.setCameraFrontPhotoPose();

    // Start render loop
    this.loop();
  }

  private initTireSmoke() {
    const maxParticles = 60;
    const positions = new Float32Array(maxParticles * 3);
    for (let i = 0; i < maxParticles * 3; i++) {
      positions[i] = 0;
    }

    this.tireSmokeGeo = new THREE.BufferGeometry();
    this.tireSmokeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Simple procedural smoke circle texture
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 64;
    sCanvas.height = 64;
    const sCtx = sCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(230, 230, 230, 0.8)');
    grad.addColorStop(1, 'rgba(230, 230, 230, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);

    const sTex = new THREE.CanvasTexture(sCanvas);
    this.tireSmokeMat = new THREE.PointsMaterial({
      size: 0.8,
      map: sTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    this.tireSmokePoints = new THREE.Points(this.tireSmokeGeo, this.tireSmokeMat);
    this.scene.add(this.tireSmokePoints);

    for (let i = 0; i < maxParticles; i++) {
      this.smokeParticles.push({
        pos: new THREE.Vector3(0, -10, 0),
        vel: new THREE.Vector3(0, 0, 0),
        life: 0,
      });
    }
  }

  private spawnSheepFlocks() {
    // 1. Photo-recreation Flock right behind the player at spawn!
    // Just like the uploaded photo where dozens of sheep flock behind him on the road
    for (let i = 0; i < 22; i++) {
      const row = Math.floor(i / 5);
      const col = (i % 5) - 2;
      const breed: SheepBreed = i % 3 === 0 ? 'baluchi' : i % 7 === 0 ? 'spotted' : 'white';
      const sheep = createSheep(this.mats, breed);
      // Spawn behind the player on the road (Z between 20 and 38)
      sheep.mesh.position.set(col * 1.5 + (Math.random() - 0.5) * 0.8, 0, 22 + row * 2.8 + Math.random());
      sheep.mesh.rotation.y = Math.PI; // Looking toward front
      this.scene.add(sheep.mesh);
      this.sheepList.push(sheep);
    }

    // 2. Extra sheep roaming around village meadows & roads across the expanded 600x600 map!
    const pastureCenters = [
      { x: -18, z: 15, count: 6 },
      { x: 18, z: 25, count: 6 },
      { x: -20, z: -10, count: 7 },
      { x: 22, z: -15, count: 5 },
      { x: 0, z: 70, count: 8 },
      { x: -40, z: 35, count: 5 },
      { x: 42, z: 40, count: 5 },
      { x: -80, z: 100, count: 7 },
      { x: 85, z: 110, count: 6 },
      { x: -90, z: -100, count: 8 },
      { x: 95, z: -115, count: 7 },
      { x: -130, z: 30, count: 6 },
      { x: 135, z: -30, count: 6 },
    ];

    pastureCenters.forEach((pasture) => {
      for (let i = 0; i < pasture.count; i++) {
        const breed: SheepBreed = Math.random() < 0.6 ? 'baluchi' : Math.random() < 0.85 ? 'white' : 'spotted';
        const sheep = createSheep(this.mats, breed);
        const offsetX = (Math.random() - 0.5) * 16;
        const offsetZ = (Math.random() - 0.5) * 16;
        sheep.mesh.position.set(pasture.x + offsetX, 0, pasture.z + offsetZ);
        sheep.mesh.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(sheep.mesh);
        this.sheepList.push(sheep);
      }
    });

    // 3. Rare Golden Rams in secret spots across the map!
    const goldenSpots = [
      { x: -15, z: 42 },
      { x: 16, z: -35 },
      { x: 0, z: 110 },
      { x: -110, z: 130 },
      { x: 120, z: -120 },
    ];
    goldenSpots.forEach((spot) => {
      const goldenRam = createSheep(this.mats, 'golden');
      goldenRam.mesh.position.set(spot.x, 0, spot.z);
      this.scene.add(goldenRam.mesh);
      this.sheepList.push(goldenRam);
    });
  }

  /**
   * Poses the camera directly in FRONT of the player,
   * faithfully reproducing the exact shot from the uploaded photo!
   */
  private setCameraFrontPhotoPose() {
    // Camera placed low in front of the tricycle, looking straight at the character
    const forwardVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerHeading);
    const frontPos = this.playerPos.clone().add(forwardVec.clone().multiplyScalar(3.2));
    frontPos.y = 1.05; // Low angle looking up slightly

    this.camera.position.copy(frontPos);
    this.camera.lookAt(this.playerPos.x, 0.85, this.playerPos.z);
  }

  /**
   * Starts the game with the requested cinematic transition:
   * "با سه چرخش اول از جلو نشونش بده بعد بره دوربین پشتش و تو روستا دور بخوره"
   */
  public startHeist(mode: 'heist' | 'freeroam' = 'heist') {
    this.gameStats.mode = mode;
    this.gameStats.timeLeft = mode === 'heist' ? 90 : 999;
    this.gameStats.totalSheepStolen = 0;
    this.gameStats.totalScore = 0;
    this.gameStats.sheepInCart = 0;
    this.gameStats.nitro = 100;

    // Reset player position
    this.playerPos.set(0, 0, 15);
    this.playerHeading = Math.PI;
    this.playerSpeed = 0;
    this.updatePlayerTransform();

    // Start cinematic intro transition
    this.state = 'cinematic_intro';
    this.cinematicProgress = 0;
    this.notifyState();
    this.showNotification('🔥 دزد گوسفند وارد می‌شود! دوربین می‌چرخد...');

    sounds.playBicycleBell();
    sounds.startFolkRadio();
  }

  public resumeGame() {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.notifyState();
    }
  }

  public pauseGame() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.notifyState();
    }
  }

  public togglePause() {
    if (this.state === 'playing') this.pauseGame();
    else if (this.state === 'paused') this.resumeGame();
  }

  public triggerHaptic(pattern: number | number[] = 25) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored if vibration is blocked
      }
    }
  }

  public ringBell() {
    this.triggerHaptic(30);
    sounds.playBicycleBell();
    this.showNotification('🔔 دینگ دینگ! گوسفندا بیدار شید!');

    // Frighten nearby sheep causing them to hop
    const bellRadius = 14;
    this.sheepList.forEach((sheep) => {
      if (sheep.state === 'captured') return;
      const dist = sheep.mesh.position.distanceTo(this.playerPos);
      if (dist < bellRadius) {
        sheep.state = 'flee';
        sheep.velocity.set(
          sheep.mesh.position.x - this.playerPos.x,
          0,
          sheep.mesh.position.z - this.playerPos.z
        ).normalize().multiplyScalar(4.5);
        sounds.playSheepBleat(1.15);
      }
    });
  }

  public activateNitro() {
    if (this.gameStats.nitro > 15 && !this.input.nitro) {
      this.input.nitro = true;
      this.triggerHaptic([40, 30, 60]);
      sounds.playNitro();
      this.showNotification('⚡ سوپر نیترو شوتی فعال شد!');
    }
  }

  public showNotification(msg: string) {
    this.gameStats.activeNotification = msg;
    this.notifyStats();
    setTimeout(() => {
      if (this.gameStats.activeNotification === msg) {
        this.gameStats.activeNotification = null;
        this.notifyStats();
      }
    }, 2800);
  }

  private notifyStats() {
    if (this.onStatsUpdate) {
      this.onStatsUpdate({ ...this.gameStats });
    }
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  // --- Main Animation / Simulation Loop ---
  private loop = () => {
    if (this.destroyed) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05); // Clamp frame delta

    // 1. Update Game Logic according to current state
    if (this.state === 'title') {
      this.updateTitleMode(dt);
    } else if (this.state === 'cinematic_intro') {
      this.updateCinematicIntro(dt);
    } else if (this.state === 'playing') {
      this.updatePlaying(dt);
    }

    // 2. Update Shared Visuals
    this.updateSheepVisuals(dt);
    this.updateParticles(dt);

    // 3. Render Scene
    this.renderer.render(this.scene, this.camera);

    // Paced loop for Software WebGL vs GPU rAF
    if (this.isSoftwareGl) {
      this.afterDraw(this.loop);
    } else {
      this.frameId = requestAnimationFrame(this.loop);
    }
  };

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  // --- Title Screen Live Centerpiece ---
  private updateTitleMode(dt: number) {
    // Subtle gentle hero breathing & slow camera orbit
    const time = this.clock.getElapsedTime();
    const radius = 3.6;
    const camAngle = Math.PI + Math.sin(time * 0.4) * 0.25;

    this.camera.position.set(
      this.playerPos.x + Math.sin(camAngle) * radius,
      1.1 + Math.sin(time * 0.7) * 0.08,
      this.playerPos.z + Math.cos(camAngle) * radius
    );
    this.camera.lookAt(this.playerPos.x, 0.85, this.playerPos.z);

    // Character subtle head tilt looking cool
    this.player.head.rotation.y = Math.sin(time * 0.6) * 0.15;
  }

  // --- Cinematic Transition: Front Camera -> Swoops Behind Player! ---
  private updateCinematicIntro(dt: number) {
    this.cinematicProgress += dt / this.CINEMATIC_DURATION;

    // Smooth easeInOutCubic
    const t = Math.min(1.0, this.cinematicProgress);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Start angle: In FRONT of player (angle = 0 relative to player front)
    // End angle: Behind player (angle = Math.PI)
    // Sweeps around the right side in a heroic arc
    const sweepAngle = this.playerHeading + Math.PI * (1 - ease);
    const camDist = 3.2 + ease * 1.8;
    const camHeight = 1.05 + ease * 1.1;

    const camX = this.playerPos.x - Math.sin(sweepAngle) * camDist;
    const camZ = this.playerPos.z - Math.cos(sweepAngle) * camDist;

    this.camera.position.set(camX, camHeight, camZ);
    this.camera.lookAt(this.playerPos.x, 0.8 + ease * 0.2, this.playerPos.z);

    if (this.cinematicProgress >= 1.0) {
      this.state = 'playing';
      this.notifyState();
      this.showNotification('🎯 شروع شد! با گوسفندها برخورد کن تا تو بار بیفتن!');
    }
  }

  // --- Active Gameplay Simulation ---
  private updatePlaying(dt: number) {
    // 1. Timer countdown (for Heist mode)
    if (this.gameStats.mode === 'heist') {
      this.gameStats.timeLeft -= dt;
      if (this.gameStats.timeLeft <= 0) {
        this.gameStats.timeLeft = 0;
        this.handleGameOver();
        return;
      }
    }

    // 2. Nitro regeneration & consumption
    if (this.input.nitro && this.gameStats.nitro > 0) {
      this.gameStats.nitro -= dt * 28;
      if (this.gameStats.nitro <= 0) {
        this.gameStats.nitro = 0;
        this.input.nitro = false;
      }
    } else {
      this.gameStats.nitro = Math.min(100, this.gameStats.nitro + dt * 10);
    }

    // 3. Vehicle Physics (Tricycle mechanics!)
    const accelRate = this.input.nitro ? 24 : 14;
    const maxSpeed = this.input.nitro ? 22 : 13;
    const reverseMax = -6;
    const friction = 6.5;

    const joyY = this.input.joystickY;
    const joyX = this.input.joystickX;

    if (this.input.forward || joyY > 0.1) {
      const power = joyY > 0.1 ? joyY : 1.0;
      this.playerSpeed = Math.min(maxSpeed, this.playerSpeed + accelRate * power * dt);
    } else if (this.input.backward || joyY < -0.1) {
      const power = joyY < -0.1 ? -joyY : 1.0;
      this.playerSpeed = Math.max(reverseMax, this.playerSpeed - accelRate * 0.8 * power * dt);
    } else {
      // Natural deceleration / rolling friction
      if (this.playerSpeed > 0) {
        this.playerSpeed = Math.max(0, this.playerSpeed - friction * dt);
      } else if (this.playerSpeed < 0) {
        this.playerSpeed = Math.min(0, this.playerSpeed + friction * dt);
      }
    }

    // Drifting logic
    this.isDrifting = this.input.drift && Math.abs(this.playerSpeed) > 5;
    if (this.isDrifting) {
      sounds.playDriftScreech();
      this.spawnDriftSmoke();
    }

    // Steering: combined keys or analog joystick
    const buttonSteer = (this.input.left ? 1 : 0) + (this.input.right ? -1 : 0);
    const targetSteering = Math.abs(joyX) > 0.08 ? -joyX : buttonSteer;
    this.steeringAngle = THREE.MathUtils.damp(this.steeringAngle, targetSteering * 0.65, 12, dt);

    if (Math.abs(this.playerSpeed) > 0.1) {
      const turnMultiplier = this.isDrifting ? 1.6 : 1.0;
      const dirSign = this.playerSpeed >= 0 ? 1 : -1;
      this.playerHeading += this.steeringAngle * turnMultiplier * dirSign * dt * 2.2;
    }

    // Position displacement
    const moveDist = this.playerSpeed * dt;
    const nextX = this.playerPos.x + Math.sin(this.playerHeading) * moveDist;
    const nextZ = this.playerPos.z + Math.cos(this.playerHeading) * moveDist;

    // Check collision against village buildings / haystacks
    if (!this.checkBuildingCollision(nextX, nextZ)) {
      this.playerPos.x = nextX;
      this.playerPos.z = nextZ;
    } else {
      // Gentle bounce-back on obstacle hit
      this.playerSpeed = -this.playerSpeed * 0.4;
      sounds.playBicycleBell();
    }

    // Bound within expanded 600x600 village area
    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -260, 260);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -260, 260);

    // Update player transforms and animations
    this.updatePlayerTransform();

    // 4. Update Camera
    this.updateCamera(dt);

    // 5. Sheep Interaction & Rustling Mechanics
    this.updateSheepInteractions(dt);

    // 6. Butcher Shop Delivery & Animated Unloading
    this.checkDropZone();

    // 7. Shepherd AI & Pursuit
    this.updateShepherdAI(dt);

    // 8. Update Physical Unloading Sheep walking into Butcher Shop
    this.updateUnloadingSheep(dt);

    // Update stats for HUD
    this.gameStats.speedKmh = Math.round(Math.abs(this.playerSpeed) * 3.6);
    this.notifyStats();
  }

  private checkBuildingCollision(x: number, z: number): boolean {
    const r = 0.6; // player collider radius
    for (const c of this.villageColliders) {
      if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) {
        return true;
      }
    }
    return false;
  }

  private updatePlayerTransform() {
    this.player.root.position.copy(this.playerPos);
    this.player.root.rotation.y = this.playerHeading;

    // Dynamic bank / lean into turns
    const bankTarget = -this.steeringAngle * (this.playerSpeed / 14) * 0.28;
    this.player.tricycle.rotation.z = THREE.MathUtils.damp(this.player.tricycle.rotation.z, bankTarget, 8, 0.016);

    // Steer front fork
    this.player.frontFork.rotation.y = this.steeringAngle;

    // Pedaling and wheel rotation
    const wheelRotDelta = this.playerSpeed * 0.12;
    this.player.frontWheel.rotation.x += wheelRotDelta;
    this.player.rearWheels.forEach((w) => (w.rotation.x += wheelRotDelta));

    this.pedalRotation += wheelRotDelta * 2;
    this.player.pedalsGroup.rotation.x = this.pedalRotation;

    // Animate legs pumping pedals
    const leftPedalAngle = this.pedalRotation;
    const rightPedalAngle = this.pedalRotation + Math.PI;
    this.player.leftLeg.position.y = 0.08 + Math.sin(leftPedalAngle) * 0.06;
    this.player.rightLeg.position.y = 0.08 + Math.sin(rightPedalAngle) * 0.06;

    // Trailer slight fishtailing / inertia lag
    const trailerLag = -this.steeringAngle * (this.playerSpeed / 12) * 0.35;
    this.player.trailer.rotation.y = THREE.MathUtils.damp(this.player.trailer.rotation.y, trailerLag, 7, 0.016);

    // Bounce captured sheep inside trailer
    const bounceTime = (this.clock ? this.clock.getElapsedTime() : 0) * 6;
    this.player.cartSheepSlots.forEach((slot, idx) => {
      if (slot.visible) {
        slot.position.y = 0.42 + Math.sin(bounceTime + idx) * 0.035;
        slot.rotation.y = Math.sin(bounceTime * 0.5 + idx) * 0.15;
      }
    });
  }

  private updateCamera(dt: number) {
    if (this.cameraMode === 'chase') {
      // 3rd Person high-action chase camera
      const camDistance = 4.8 + Math.abs(this.playerSpeed) * 0.08;
      const camHeight = 2.2;
      const lookOffset = 1.0;

      const idealCamPos = new THREE.Vector3(
        this.playerPos.x - Math.sin(this.playerHeading) * camDistance,
        this.playerPos.y + camHeight,
        this.playerPos.z - Math.cos(this.playerHeading) * camDistance
      );

      // Smooth lag / damping
      this.camera.position.lerp(idealCamPos, 0.12);
      const targetLook = new THREE.Vector3(
        this.playerPos.x,
        this.playerPos.y + lookOffset,
        this.playerPos.z
      );
      this.camera.lookAt(targetLook);
    } else if (this.cameraMode === 'front_meme') {
      // The iconic front camera angle matching the photo!
      const forwardVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerHeading);
      const frontPos = this.playerPos.clone().add(forwardVec.clone().multiplyScalar(3.2));
      frontPos.y = 1.1;
      this.camera.position.lerp(frontPos, 0.15);
      this.camera.lookAt(this.playerPos.x, 0.85, this.playerPos.z);
    } else if (this.cameraMode === 'first_person') {
      // Cockpit / Handlebar view
      const headPos = this.playerPos.clone().add(new THREE.Vector3(0, 1.25, 0));
      this.camera.position.copy(headPos);
      const lookAtPos = headPos.clone().add(
        new THREE.Vector3(Math.sin(this.playerHeading), -0.05, Math.cos(this.playerHeading)).multiplyScalar(10)
      );
      this.camera.lookAt(lookAtPos);
    } else if (this.cameraMode === 'drone') {
      // Top-down tactical drone cam
      this.camera.position.set(this.playerPos.x, 24, this.playerPos.z);
      this.camera.lookAt(this.playerPos.x, 0, this.playerPos.z);
    }
  }

  // --- Sheep AI, Fleeing & Stealing Mechanics ---
  private updateSheepInteractions(dt: number) {
    const captureRadius = 2.4; // Distance to scoop sheep into trailer

    this.sheepList.forEach((sheep) => {
      if (sheep.state === 'captured') return;

      const distToPlayer = sheep.mesh.position.distanceTo(this.playerPos);

      // 1. Rustling / Capture Check!
      if (distToPlayer < captureRadius) {
        if (this.gameStats.sheepInCart < this.gameStats.maxCartCapacity) {
          this.captureSheep(sheep);
          return;
        } else {
          this.showNotification('⚠️ تریلر پر شده! برو مقر دزدان خالی کن!');
        }
      }

      // 2. Flee from player when close
      if (distToPlayer < 9.0) {
        sheep.state = 'flee';
        const fleeDir = new THREE.Vector3(
          sheep.mesh.position.x - this.playerPos.x,
          0,
          sheep.mesh.position.z - this.playerPos.z
        ).normalize();

        const fleeSpeed = sheep.breed === 'golden' ? 6.5 : 4.0;
        sheep.velocity.lerp(fleeDir.multiplyScalar(fleeSpeed), 0.1);
        sheep.mesh.rotation.y = Math.atan2(sheep.velocity.x, sheep.velocity.z);

        // Random bleat when scared
        if (Math.random() < 0.015) {
          sounds.playSheepBleat(sheep.breed === 'golden' ? 1.4 : 1.0);
        }
      } else {
        // Peaceful roaming / grazing
        sheep.state = 'graze';
        sheep.velocity.multiplyScalar(0.92);
        if (Math.random() < 0.008) {
          sheep.mesh.rotation.y += (Math.random() - 0.5) * 1.5;
        }
      }

      // Move sheep
      sheep.mesh.position.addScaledVector(sheep.velocity, dt);
      sheep.mesh.position.x = THREE.MathUtils.clamp(sheep.mesh.position.x, -120, 120);
      sheep.mesh.position.z = THREE.MathUtils.clamp(sheep.mesh.position.z, -120, 120);
    });
  }

  private captureSheep(sheep: SheepBundle) {
    sheep.state = 'captured';
    sheep.mesh.visible = false; // Vanishes from the field

    this.gameStats.sheepInCart++;
    this.gameStats.totalSheepStolen++;
    this.gameStats.totalScore += sheep.points;

    // Show a sheep in the trailer!
    const slotIdx = this.gameStats.sheepInCart - 1;
    if (this.player.cartSheepSlots[slotIdx]) {
      this.player.cartSheepSlots[slotIdx].visible = true;
    }

    // Audio & Visual celebratory feedback
    this.triggerHaptic(45);
    sounds.playSheepCapture();
    sounds.playSheepBleat(1.1);

    const breedNames: Record<SheepBreed, string> = {
      baluchi: 'گوسفند قزل بلوچی (کله سیاه)',
      white: 'گوسفند دنبه سفید',
      golden: 'قوچ طلایی اسطوره‌ای! (+350)',
      spotted: 'بره خالدار',
    };

    this.showNotification(`🐑 ${breedNames[sheep.breed]} دزدیده شد! (${this.gameStats.sheepInCart}/${this.gameStats.maxCartCapacity})`);

    // If golden sheep, give bonus nitro!
    if (sheep.breed === 'golden') {
      this.gameStats.nitro = 100;
      this.triggerConfetti();
    }

    // Check victory condition
    if (this.gameStats.mode === 'heist' && this.gameStats.totalSheepStolen >= 12) {
      this.showNotification('🎉 هدف تکمیل شد! برو به مقر برای پیروزی!');
    }

    this.notifyStats();
  }

  // --- Butcher Shop Delivery ("گوسفندان پیاده شده و وارد قصابی حاج عباس می‌شوند") ---
  private checkDropZone() {
    const distToBarn = this.playerPos.distanceTo(this.dropZonePos);
    if (distToBarn < 5.8 && this.gameStats.sheepInCart > 0 && !this.isUnloadingSheep) {
      this.isUnloadingSheep = true;
      const deliveredCount = this.gameStats.sheepInCart;
      const deliveryBonus = deliveredCount * 300;
      this.gameStats.totalScore += deliveryBonus;
      this.gameStats.sheepInCart = 0;

      // Hide all sheep slots in trailer
      this.player.cartSheepSlots.forEach((slot) => (slot.visible = false));

      sounds.playDeliverySuccess();
      this.triggerConfetti();
      this.showNotification(`🥩 ${deliveredCount} گوسفند از تریلر پیاده شدند و وارد قصابی حاج عباس شدند! (+${deliveryBonus} سکه)`);

      // Spawn physical walking sheep models stepping off cart toward Butcher Shop door at (35, 0, -38.48)
      const doorTargetPos = new THREE.Vector3(35, 0, -38.48);

      for (let i = 0; i < deliveredCount; i++) {
        const breed: SheepBreed = i % 2 === 0 ? 'baluchi' : 'white';
        const sheepBundle = createSheep(this.mats, breed);

        // Start position at player trailer
        const startX = this.playerPos.x + (Math.random() - 0.5) * 1.6;
        const startZ = this.playerPos.z + (Math.random() - 0.5) * 1.6;
        sheepBundle.mesh.position.set(startX, 0, startZ);
        this.scene.add(sheepBundle.mesh);

        const targetX = doorTargetPos.x + (Math.random() - 0.5) * 1.4;
        const targetZ = doorTargetPos.z;

        this.unloadingSheepList.push({
          bundle: sheepBundle,
          startPos: new THREE.Vector3(startX, 0, startZ),
          targetPos: new THREE.Vector3(targetX, 0, targetZ),
          progress: -i * 0.18, // staggered walking parade!
          speed: 0.45 + Math.random() * 0.1,
          bleated: false,
        });
      }

      if (this.gameStats.mode === 'heist' && this.gameStats.totalSheepStolen >= 10) {
        this.handleVictory();
      }

      this.notifyStats();
    }
  }

  private updateUnloadingSheep(dt: number) {
    for (let i = this.unloadingSheepList.length - 1; i >= 0; i--) {
      const item = this.unloadingSheepList[i];
      item.progress += dt * item.speed;

      if (item.progress <= 0) continue; // Waiting staggered start

      const p = Math.min(1.0, item.progress);
      // Interpolate position from cart to doorway
      item.bundle.mesh.position.lerpVectors(item.startPos, item.targetPos, p);

      // Turn sheep to face target entrance
      const dir = new THREE.Vector3().subVectors(item.targetPos, item.bundle.mesh.position);
      if (dir.lengthSq() > 0.01) {
        item.bundle.mesh.rotation.y = Math.atan2(dir.x, dir.z);
      }

      // Animate walking legs
      item.bundle.animTime += dt * 11;
      const walk = Math.sin(item.bundle.animTime);
      item.bundle.legs[0].rotation.x = walk * 0.5;
      item.bundle.legs[1].rotation.x = -walk * 0.5;
      item.bundle.legs[2].rotation.x = -walk * 0.5;
      item.bundle.legs[3].rotation.x = walk * 0.5;

      // Bleat sound halfway along walk to butcher shop
      if (p > 0.35 && !item.bleated) {
        item.bleated = true;
        sounds.playSheepBleat(1.15);
      }

      // Reached butcher doorway: step inside and enter building!
      if (p >= 1.0) {
        this.scene.remove(item.bundle.mesh);
        this.unloadingSheepList.splice(i, 1);
      }
    }

    if (this.unloadingSheepList.length === 0) {
      this.isUnloadingSheep = false;
    }
  }

  // --- Shepherd AI ("Mesh Ghorban") ---
  private updateShepherdAI(dt: number) {
    const shepherdPos = this.shepherd.mesh.position;
    const distToPlayer = shepherdPos.distanceTo(this.playerPos);

    // Shepherd becomes alert if player is stealing sheep nearby or close
    const alertDist = this.gameStats.sheepInCart > 0 ? 28 : 16;

    if (distToPlayer < alertDist) {
      if (!this.gameStats.shepherdAlert) {
        this.gameStats.shepherdAlert = true;
        this.shepherd.alertIcon.visible = true;
        sounds.playShepherdAlert();
        this.showNotification('🚨 چوپان مش قربان فهمید! داره میاد دنبالت!');
      }

      // Chase player!
      const chaseDir = new THREE.Vector3(
        this.playerPos.x - shepherdPos.x,
        0,
        this.playerPos.z - shepherdPos.z
      ).normalize();

      const shepherdSpeed = 7.2;
      shepherdPos.addScaledVector(chaseDir, shepherdSpeed * dt);
      this.shepherd.mesh.rotation.y = Math.atan2(chaseDir.x, chaseDir.z);

      // Swing staff animation
      this.shepherd.staff.rotation.x = Math.sin(this.clock.getElapsedTime() * 10) * 0.6;

      // Caught check!
      if (distToPlayer < 2.0) {
        this.handleCaughtByShepherd();
      }
    } else {
      if (this.gameStats.shepherdAlert) {
        this.gameStats.shepherdAlert = false;
        this.shepherd.alertIcon.visible = false;
        this.showNotification('💨 از دست چوپان در رفتی! ایول!');
      }
      // Gentle patrol around village center
      const t = this.clock.getElapsedTime() * 0.4;
      shepherdPos.x = 4 + Math.sin(t) * 12;
      shepherdPos.z = 45 + Math.cos(t) * 12;
      this.shepherd.mesh.rotation.y = t + Math.PI / 2;
    }
  }

  private handleCaughtByShepherd() {
    if (this.gameStats.sheepInCart > 0) {
      // Shepherd reclaims a sheep
      this.gameStats.sheepInCart--;
      const slot = this.player.cartSheepSlots[this.gameStats.sheepInCart];
      if (slot) slot.visible = false;

      sounds.playSheepBleat(0.85);
      sounds.playBicycleBell();
      this.showNotification('💥 مش قربان بهت رسید و یکی از گوسفندا رو پس گرفت!');

      // Push player away
      this.playerPos.add(
        new THREE.Vector3(
          this.playerPos.x - this.shepherd.mesh.position.x,
          0,
          this.playerPos.z - this.shepherd.mesh.position.z
        ).normalize().multiplyScalar(4)
      );
      this.playerSpeed = 6; // Auto sprint away
      this.notifyStats();
    }
  }

  private handleVictory() {
    this.state = 'victory';
    this.notifyState();
    this.triggerConfetti();
    sounds.playDeliverySuccess();
  }

  private handleGameOver() {
    this.state = 'gameover';
    this.notifyState();
  }

  private triggerConfetti() {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignored if confetti fails
    }
  }

  // --- Visuals & Particles ---
  private spawnDriftSmoke() {
    const rearPos = this.playerPos.clone().sub(
      new THREE.Vector3(Math.sin(this.playerHeading), 0, Math.cos(this.playerHeading)).multiplyScalar(0.7)
    );

    for (const p of this.smokeParticles) {
      if (p.life <= 0) {
        p.pos.set(
          rearPos.x + (Math.random() - 0.5) * 0.4,
          0.15,
          rearPos.z + (Math.random() - 0.5) * 0.4
        );
        p.vel.set((Math.random() - 0.5) * 0.8, Math.random() * 0.8 + 0.3, (Math.random() - 0.5) * 0.8);
        p.life = 0.5;
        break;
      }
    }
  }

  private updateParticles(dt: number) {
    if (!this.tireSmokeGeo) return;
    const posAttr = this.tireSmokeGeo.getAttribute('position') as THREE.BufferAttribute;

    this.smokeParticles.forEach((p, idx) => {
      if (p.life > 0) {
        p.life -= dt;
        p.pos.addScaledVector(p.vel, dt);
        posAttr.setXYZ(idx, p.pos.x, p.pos.y, p.pos.z);
      } else {
        posAttr.setXYZ(idx, 0, -20, 0);
      }
    });
    posAttr.needsUpdate = true;
  }

  private updateSheepVisuals(dt: number) {
    this.sheepList.forEach((sheep) => {
      if (sheep.state === 'captured') return;

      sheep.animTime += dt * (sheep.state === 'flee' ? 14 : 4);
      const walk = Math.sin(sheep.animTime);

      // Leg swing
      sheep.legs[0].rotation.x = walk * 0.45;
      sheep.legs[1].rotation.x = -walk * 0.45;
      sheep.legs[2].rotation.x = -walk * 0.45;
      sheep.legs[3].rotation.x = walk * 0.45;

      // Head bobbing & ear wiggle
      sheep.head.position.y = 0.58 + Math.abs(Math.sin(sheep.animTime * 0.5)) * 0.06;
      sheep.tail.rotation.z = Math.sin(sheep.animTime * 1.5) * 0.3;
    });
  }

  // --- Keyboard & Resize Listeners ---
  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('blur', this.handleBlur);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.input.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.input.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.input.drift = true;
        break;
      case 'Space':
        e.preventDefault();
        this.activateNitro();
        break;
      case 'KeyH':
      case 'KeyB':
        this.ringBell();
        break;
      case 'KeyC':
        // Cycle camera mode
        this.cycleCamera();
        break;
      case 'Escape':
        this.togglePause();
        break;
      case 'Enter':
        if (this.state === 'title' || this.state === 'gameover' || this.state === 'victory') {
          this.startHeist('heist');
        }
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.input.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.input.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.input.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.input.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.input.drift = false;
        break;
      case 'Space':
        this.input.nitro = false;
        break;
    }
  };

  private handleBlur = () => {
    // Clear all held inputs on window blur
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      drift: false,
      nitro: false,
      bell: false,
      joystickX: 0,
      joystickY: 0,
    };
  };

  public cycleCamera() {
    const modes: CameraMode[] = ['chase', 'front_meme', 'first_person', 'drone'];
    const idx = modes.indexOf(this.cameraMode);
    this.cameraMode = modes[(idx + 1) % modes.length];
    const modeNames: Record<CameraMode, string> = {
      chase: 'دوربین پشت (پیش‌فرض تعقیب)',
      front_meme: 'دوربین از جلو (عکس میم اصلی)',
      first_person: 'دوربین فرمان سه‌چرخه',
      drone: 'دوربین هوایی پهپادی',
    };
    this.showNotification(`🎥 دوربین: ${modeNames[this.cameraMode]}`);
  }

  public setCameraMode(mode: CameraMode) {
    this.cameraMode = mode;
  }

  private handleResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    this.destroyed = true;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      clearTimeout(this.frameId);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('blur', this.handleBlur);

    sounds.stopFolkRadio();
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }

  public getPlayerPosition(): THREE.Vector3 {
    return this.playerPos;
  }

  public getSheepList(): { pos: THREE.Vector3; captured: boolean; breed: SheepBreed }[] {
    return this.sheepList.map((s) => ({
      pos: s.mesh.position,
      captured: s.state === 'captured',
      breed: s.breed,
    }));
  }

  public getShepherdPosition(): THREE.Vector3 {
    return this.shepherd.mesh.position;
  }

  public getDropZonePosition(): THREE.Vector3 {
    return this.dropZonePos;
  }
}
