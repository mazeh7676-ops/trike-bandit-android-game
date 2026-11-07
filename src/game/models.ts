import * as THREE from 'three';

// Reusable shared materials with rich PBR properties
export class GameMaterials {
  public skin: THREE.MeshStandardMaterial;
  public hair: THREE.MeshStandardMaterial;
  public sunglasses: THREE.MeshStandardMaterial;
  public poloShirt: THREE.MeshStandardMaterial;
  public shorts: THREE.MeshStandardMaterial;
  public sneakers: THREE.MeshStandardMaterial;

  // Tricycle materials (matching the uploaded photo)
  public triYellowBody: THREE.MeshStandardMaterial;
  public triGreenBar: THREE.MeshStandardMaterial;
  public triRedGrip: THREE.MeshStandardMaterial;
  public triPinkWheel: THREE.MeshStandardMaterial;
  public triTireRubber: THREE.MeshStandardMaterial;
  public triBlueSeat: THREE.MeshStandardMaterial;
  public triMetal: THREE.MeshStandardMaterial;
  public triChrome: THREE.MeshStandardMaterial;

  // Cart & Village materials
  public cartWood: THREE.MeshStandardMaterial;
  public cartMetal: THREE.MeshStandardMaterial;
  public sheepWoolWhite: THREE.MeshStandardMaterial;
  public sheepWoolBlack: THREE.MeshStandardMaterial;
  public sheepWoolGolden: THREE.MeshStandardMaterial;
  public sheepSkinWhite: THREE.MeshStandardMaterial;
  public sheepSkinBlack: THREE.MeshStandardMaterial;
  public sheepHorns: THREE.MeshStandardMaterial;

  // Shepherd materials
  public shepherdVest: THREE.MeshStandardMaterial;
  public shepherdHat: THREE.MeshStandardMaterial;
  public shepherdWood: THREE.MeshStandardMaterial;

  // Village architecture materials
  public houseWall: THREE.MeshStandardMaterial;
  public houseStone: THREE.MeshStandardMaterial;
  public roofTile: THREE.MeshStandardMaterial;
  public windowFrame: THREE.MeshStandardMaterial;

  constructor() {
    this.skin = new THREE.MeshStandardMaterial({
      color: 0xdec0a5,
      roughness: 0.6,
      metalness: 0.05,
    });

    this.hair = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.1,
    });

    this.sunglasses = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.1,
      metalness: 0.95,
    });

    this.poloShirt = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Rich dark navy polo shirt
      roughness: 0.75,
      metalness: 0.05,
    });

    this.shorts = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Black shorts
      roughness: 0.8,
      metalness: 0.05,
    });

    this.sneakers = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Pure white sneakers
      roughness: 0.4,
      metalness: 0.05,
    });

    // Tricycle vivid toy plastics
    this.triYellowBody = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Shiny yellow front shroud
      roughness: 0.25,
      metalness: 0.15,
    });

    this.triGreenBar = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Vivid lime green handlebar
      roughness: 0.3,
      metalness: 0.1,
    });

    this.triRedGrip = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red grips & badges
      roughness: 0.35,
      metalness: 0.05,
    });

    this.triPinkWheel = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Hot pink rims
      roughness: 0.35,
      metalness: 0.1,
    });

    this.triTireRubber = new THREE.MeshStandardMaterial({
      color: 0x27272a, // Black rubber tire tread
      roughness: 0.85,
      metalness: 0.05,
    });

    this.triBlueSeat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Bright sky blue seat
      roughness: 0.35,
      metalness: 0.05,
    });

    this.triMetal = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.7,
    });

    this.triChrome = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    // Cart
    this.cartWood = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.8,
      metalness: 0.05,
    });

    this.cartMetal = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.8,
    });

    // Sheep
    this.sheepWoolWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      metalness: 0.0,
    });

    this.sheepWoolBlack = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.9,
      metalness: 0.0,
    });

    this.sheepWoolGolden = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
    });

    this.sheepSkinWhite = new THREE.MeshStandardMaterial({
      color: 0xf1dfd1,
      roughness: 0.65,
      metalness: 0.0,
    });

    this.sheepSkinBlack = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Baluchi sheep dark face
      roughness: 0.7,
      metalness: 0.05,
    });

    this.sheepHorns = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.45,
      metalness: 0.3,
    });

    // Shepherd
    this.shepherdVest = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.8,
    });

    this.shepherdHat = new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.85,
    });

    this.shepherdWood = new THREE.MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.7,
    });

    // Village Architecture
    this.houseWall = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Plaster/stucco wall
      roughness: 0.85,
    });

    this.houseStone = new THREE.MeshStandardMaterial({
      color: 0x78716c, // Stone foundation
      roughness: 0.9,
    });

    this.roofTile = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Red terracotta tile
      roughness: 0.65,
    });

    this.windowFrame = new THREE.MeshStandardMaterial({
      color: 0x451a03, // Dark wooden trim
      roughness: 0.75,
    });
  }
}

export interface PlayerModelBundle {
  root: THREE.Group;
  tricycle: THREE.Group;
  frontFork: THREE.Group;
  frontWheel: THREE.Mesh;
  pedalsGroup: THREE.Group;
  rearWheels: THREE.Mesh[];
  characterGroup: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  head: THREE.Group;
  trailer: THREE.Group;
  cartSheepSlots: THREE.Group[];
}

/**
 * Creates the complete high-fidelity 3D Player Character on the Tricycle
 * faithfully reproducing the guy from the uploaded photo!
 */
export function createPlayerAndTricycle(mats: GameMaterials): PlayerModelBundle {
  const root = new THREE.Group();
  root.name = 'playerRoot';

  // 1. Tricycle base frame
  const tricycle = new THREE.Group();
  tricycle.name = 'tricycle';
  root.add(tricycle);

  // Front yellow shroud (aerodynamic plastic cowl)
  const frontBodyGeo = new THREE.BoxGeometry(0.38, 0.46, 0.34);
  const frontBody = new THREE.Mesh(frontBodyGeo, mats.triYellowBody);
  frontBody.position.set(0, 0.55, 0.42);
  frontBody.castShadow = true;
  frontBody.receiveShadow = true;
  tricycle.add(frontBody);

  // Red front decorative badge / headlight reflector
  const badgeGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.04, 20);
  badgeGeo.rotateX(Math.PI / 2);
  const badge = new THREE.Mesh(badgeGeo, mats.triRedGrip);
  badge.position.set(0, 0.55, 0.6);
  badge.castShadow = true;
  tricycle.add(badge);

  // Chrome steerer tube & frame
  const mainBarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.68, 16);
  mainBarGeo.rotateX(Math.PI / 2);
  const mainBar = new THREE.Mesh(mainBarGeo, mats.triChrome);
  mainBar.position.set(0, 0.35, 0.1);
  mainBar.castShadow = true;
  tricycle.add(mainBar);

  // Rear axle beam
  const rearAxleGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.76, 16);
  rearAxleGeo.rotateZ(Math.PI / 2);
  const rearAxle = new THREE.Mesh(rearAxleGeo, mats.triChrome);
  rearAxle.position.set(0, 0.22, -0.25);
  rearAxle.castShadow = true;
  tricycle.add(rearAxle);

  // Rear wheels (Pink rims + Black rubber tire treads + Yellow hub caps)
  const createTricycleWheel = (xPos: number) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(xPos, 0.22, -0.25);

    // Tire Rubber
    const tireGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.11, 28);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, mats.triTireRubber);
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Inner Pink Rim
    const rimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, mats.triPinkWheel);
    wheelGroup.add(rim);

    // Yellow center cap
    const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.13, 16);
    capGeo.rotateZ(Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, mats.triYellowBody);
    wheelGroup.add(cap);

    tricycle.add(wheelGroup);
    return tire; // return mesh for rotation
  };

  const leftWheelMesh = createTricycleWheel(-0.38);
  const rightWheelMesh = createTricycleWheel(0.38);

  // Cyan scoop seat with ergonomic contour
  const seatGeo = new THREE.BoxGeometry(0.38, 0.08, 0.32);
  const seat = new THREE.Mesh(seatGeo, mats.triBlueSeat);
  seat.position.set(0, 0.42, -0.05);
  seat.castShadow = true;
  tricycle.add(seat);

  const seatBackGeo = new THREE.BoxGeometry(0.36, 0.26, 0.07);
  const seatBack = new THREE.Mesh(seatBackGeo, mats.triBlueSeat);
  seatBack.position.set(0, 0.55, -0.19);
  seatBack.castShadow = true;
  tricycle.add(seatBack);

  // Seat post metal support
  const seatPostGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12);
  const seatPost = new THREE.Mesh(seatPostGeo, mats.triChrome);
  seatPost.position.set(0, 0.32, -0.05);
  tricycle.add(seatPost);

  // Front Fork & Handlebars
  const frontFork = new THREE.Group();
  frontFork.position.set(0, 0.55, 0.42);
  tricycle.add(frontFork);

  // Chrome stem
  const stemGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.38, 12);
  const stem = new THREE.Mesh(stemGeo, mats.triChrome);
  stem.position.set(0, 0.22, 0);
  frontFork.add(stem);

  // Lime green handlebar curve
  const handleBarGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.68, 16);
  handleBarGeo.rotateZ(Math.PI / 2);
  const handleBar = new THREE.Mesh(handleBarGeo, mats.triGreenBar);
  handleBar.position.set(0, 0.38, 0.02);
  handleBar.castShadow = true;
  frontFork.add(handleBar);

  // Red rubber hand grips
  const gripGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.13, 16);
  gripGeo.rotateZ(Math.PI / 2);
  const leftGrip = new THREE.Mesh(gripGeo, mats.triRedGrip);
  leftGrip.position.set(-0.32, 0.38, 0.02);
  frontFork.add(leftGrip);

  const rightGrip = new THREE.Mesh(gripGeo, mats.triRedGrip);
  rightGrip.position.set(0.32, 0.38, 0.02);
  frontFork.add(rightGrip);

  // Shiny brass ring bell
  const bellGeo = new THREE.SphereGeometry(0.048, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  bellGeo.rotateX(Math.PI);
  const bell = new THREE.Mesh(bellGeo, mats.sheepWoolGolden);
  bell.position.set(-0.19, 0.42, 0.02);
  bell.castShadow = true;
  frontFork.add(bell);

  // Fork blades
  const bladeGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.42, 12);
  const leftBlade = new THREE.Mesh(bladeGeo, mats.triChrome);
  leftBlade.position.set(-0.13, -0.18, 0);
  frontFork.add(leftBlade);

  const rightBlade = new THREE.Mesh(bladeGeo, mats.triChrome);
  rightBlade.position.set(0.13, -0.18, 0);
  frontFork.add(rightBlade);

  // Front wheel assembly (Big pink wheel + rubber tire)
  const frontTireGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.13, 32);
  frontTireGeo.rotateZ(Math.PI / 2);
  const frontWheel = new THREE.Mesh(frontTireGeo, mats.triTireRubber);
  frontWheel.position.set(0, -0.34, 0);
  frontWheel.castShadow = true;
  frontFork.add(frontWheel);

  const frontRimGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.14, 28);
  frontRimGeo.rotateZ(Math.PI / 2);
  const frontRim = new THREE.Mesh(frontRimGeo, mats.triPinkWheel);
  frontWheel.add(frontRim);

  const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 20);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, mats.triYellowBody);
  frontWheel.add(hub);

  // Pedals Group
  const pedalsGroup = new THREE.Group();
  pedalsGroup.position.set(0, -0.34, 0);
  frontFork.add(pedalsGroup);

  const pedalCrankGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.4, 12);
  pedalCrankGeo.rotateZ(Math.PI / 2);
  const pedalCrank = new THREE.Mesh(pedalCrankGeo, mats.triChrome);
  pedalsGroup.add(pedalCrank);

  const pedalPadGeo = new THREE.BoxGeometry(0.07, 0.04, 0.11);
  const leftPedal = new THREE.Mesh(pedalPadGeo, mats.sneakers);
  leftPedal.position.set(-0.22, 0, 0);
  pedalsGroup.add(leftPedal);

  const rightPedal = new THREE.Mesh(pedalPadGeo, mats.sneakers);
  rightPedal.position.set(0.22, 0, 0);
  pedalsGroup.add(rightPedal);

  // 2. Character Model (The Dude from the photo!)
  const characterGroup = new THREE.Group();
  characterGroup.position.set(0, 0.44, -0.05);
  characterGroup.name = 'character';
  tricycle.add(characterGroup);

  // Load HD photo texture maps from user's actual photo
  const texLoader = new THREE.TextureLoader();

  const faceTex = texLoader.load('/assets/face_hd.png');
  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.anisotropy = 16;
  const faceMatFront = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.4,
    metalness: 0.1,
  });

  const torsoTex = texLoader.load('/assets/torso_hd.png');
  torsoTex.colorSpace = THREE.SRGBColorSpace;
  torsoTex.anisotropy = 16;
  const torsoMatFront = new THREE.MeshStandardMaterial({
    map: torsoTex,
    roughness: 0.7,
    metalness: 0.05,
  });

  // Torso (Dark Navy/Black polo shirt with photo texture)
  const torsoMaterials = [
    mats.poloShirt, // right
    mats.poloShirt, // left
    mats.poloShirt, // top
    mats.poloShirt, // bottom
    torsoMatFront,  // front (HD Photo)
    mats.poloShirt, // back
  ];

  const torsoGeo = new THREE.BoxGeometry(0.46, 0.54, 0.28);
  const torso = new THREE.Mesh(torsoGeo, torsoMaterials);
  torso.position.set(0, 0.35, 0);
  torso.castShadow = true;
  characterGroup.add(torso);

  // Polo Collar
  const collarGeo = new THREE.BoxGeometry(0.26, 0.06, 0.24);
  const collar = new THREE.Mesh(collarGeo, mats.poloShirt);
  collar.position.set(0, 0.62, 0.03);
  characterGroup.add(collar);

  // Head & Neck
  const head = new THREE.Group();
  head.position.set(0, 0.74, 0.03);
  characterGroup.add(head);

  const neckGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.1, 14);
  const neck = new THREE.Mesh(neckGeo, mats.skin);
  neck.position.set(0, -0.05, 0);
  head.add(neck);

  // 3D Head base
  const faceGeo = new THREE.BoxGeometry(0.28, 0.3, 0.24);
  const face = new THREE.Mesh(faceGeo, mats.skin);
  face.castShadow = true;
  head.add(face);

  // REAL FLAT PHOTO OF THIS PERSON'S FACE & SUNGLASSES MOUNTED DIRECTLY ON THE DRIVER!
  const realFaceTex = texLoader.load('/assets/real_face_cutout.png');
  realFaceTex.colorSpace = THREE.SRGBColorSpace;
  realFaceTex.anisotropy = 16;

  const realFaceMat = new THREE.MeshStandardMaterial({
    map: realFaceTex,
    transparent: true,
    alphaTest: 0.1,
    side: THREE.DoubleSide,
    roughness: 0.4,
    metalness: 0.05,
  });

  const flatFacePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.48), realFaceMat);
  flatFacePlane.position.set(0, 0.02, 0.125);
  flatFacePlane.castShadow = true;
  head.add(flatFacePlane);

  // Hairstyle (cropped sides, short top)
  const hairGeo = new THREE.BoxGeometry(0.29, 0.15, 0.26);
  const hair = new THREE.Mesh(hairGeo, mats.hair);
  hair.position.set(0, 0.13, -0.01);
  head.add(hair);

  // Arms leaning forward gripping green handlebars
  const armGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.46, 12);
  const leftArm = new THREE.Mesh(armGeo, mats.skin);
  leftArm.position.set(-0.26, 0.32, 0.2);
  leftArm.rotation.x = -Math.PI / 4;
  leftArm.rotation.z = Math.PI / 10;
  leftArm.castShadow = true;
  characterGroup.add(leftArm);

  const sleeveGeo = new THREE.CylinderGeometry(0.072, 0.072, 0.14, 12);
  const leftSleeve = new THREE.Mesh(sleeveGeo, mats.poloShirt);
  leftSleeve.position.set(-0.24, 0.45, 0.08);
  characterGroup.add(leftSleeve);

  const rightArm = new THREE.Mesh(armGeo, mats.skin);
  rightArm.position.set(0.26, 0.32, 0.2);
  rightArm.rotation.x = -Math.PI / 4;
  rightArm.rotation.z = -Math.PI / 10;
  rightArm.castShadow = true;
  characterGroup.add(rightArm);

  const rightSleeve = new THREE.Mesh(sleeveGeo, mats.poloShirt);
  rightSleeve.position.set(0.24, 0.45, 0.08);
  characterGroup.add(rightSleeve);

  // Legs in black shorts bent high and splayed outward
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, 0.08, 0.08);
  characterGroup.add(leftLeg);

  const thighGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.34, 12);
  thighGeo.rotateX(Math.PI / 2.6);
  thighGeo.rotateZ(-Math.PI / 6);
  const leftThigh = new THREE.Mesh(thighGeo, mats.shorts);
  leftThigh.position.set(-0.08, 0.05, 0.14);
  leftThigh.castShadow = true;
  leftLeg.add(leftThigh);

  const shinGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.36, 12);
  shinGeo.rotateX(-Math.PI / 6);
  const leftShin = new THREE.Mesh(shinGeo, mats.skin);
  leftShin.position.set(-0.14, -0.16, 0.3);
  leftShin.castShadow = true;
  leftLeg.add(leftShin);

  const shoeGeo = new THREE.BoxGeometry(0.11, 0.085, 0.19);
  const leftShoe = new THREE.Mesh(shoeGeo, mats.sneakers);
  leftShoe.position.set(-0.15, -0.32, 0.38);
  leftShoe.castShadow = true;
  leftLeg.add(leftShoe);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, 0.08, 0.08);
  characterGroup.add(rightLeg);

  const rightThigh = new THREE.Mesh(thighGeo, mats.shorts);
  rightThigh.position.set(0.08, 0.05, 0.14);
  rightThigh.rotation.y = Math.PI;
  rightThigh.castShadow = true;
  rightLeg.add(rightThigh);

  const rightShin = new THREE.Mesh(shinGeo, mats.skin);
  rightShin.position.set(0.14, -0.16, 0.3);
  rightShin.castShadow = true;
  rightLeg.add(rightShin);

  const rightShoe = new THREE.Mesh(shoeGeo, mats.sneakers);
  rightShoe.position.set(0.14, -0.32, 0.38);
  rightShoe.castShadow = true;
  rightLeg.add(rightShoe);

  // 3. Cargo Cart / Sheep Trailer attached behind tricycle
  const trailer = new THREE.Group();
  trailer.name = 'trailer';
  trailer.position.set(0, 0, -0.42);
  root.add(trailer);

  // Tow hitch coupler
  const hitchBarGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.36, 12);
  hitchBarGeo.rotateX(Math.PI / 2);
  const hitchBar = new THREE.Mesh(hitchBarGeo, mats.cartMetal);
  hitchBar.position.set(0, 0.22, -0.05);
  trailer.add(hitchBar);

  // Wooden Box Body
  const boxFloorGeo = new THREE.BoxGeometry(0.76, 0.06, 0.88);
  const boxFloor = new THREE.Mesh(boxFloorGeo, mats.cartWood);
  boxFloor.position.set(0, 0.24, -0.55);
  boxFloor.castShadow = true;
  boxFloor.receiveShadow = true;
  trailer.add(boxFloor);

  // Wooden slatted side walls
  const leftWallGeo = new THREE.BoxGeometry(0.04, 0.4, 0.88);
  const leftWall = new THREE.Mesh(leftWallGeo, mats.cartWood);
  leftWall.position.set(-0.36, 0.43, -0.55);
  leftWall.castShadow = true;
  trailer.add(leftWall);

  const rightWall = new THREE.Mesh(leftWallGeo, mats.cartWood);
  rightWall.position.set(0.36, 0.43, -0.55);
  rightWall.castShadow = true;
  trailer.add(rightWall);

  const backWallGeo = new THREE.BoxGeometry(0.76, 0.4, 0.04);
  const backWall = new THREE.Mesh(backWallGeo, mats.cartWood);
  backWall.position.set(0, 0.43, -0.97);
  backWall.castShadow = true;
  trailer.add(backWall);

  const frontWall = new THREE.Mesh(backWallGeo, mats.cartWood);
  frontWall.position.set(0, 0.43, -0.13);
  frontWall.castShadow = true;
  trailer.add(frontWall);

  // Trailer wheels
  const cartTireGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.07, 24);
  cartTireGeo.rotateZ(Math.PI / 2);

  const cartLeftWheel = new THREE.Mesh(cartTireGeo, mats.triTireRubber);
  cartLeftWheel.position.set(-0.43, 0.18, -0.55);
  cartLeftWheel.castShadow = true;
  trailer.add(cartLeftWheel);

  const cartRightWheel = new THREE.Mesh(cartTireGeo, mats.triTireRubber);
  cartRightWheel.position.set(0.43, 0.18, -0.55);
  cartRightWheel.castShadow = true;
  trailer.add(cartRightWheel);

  // Sheep slots inside the trailer (visible as sheep are stolen)
  const cartSheepSlots: THREE.Group[] = [];
  const slotPositions = [
    { x: -0.18, z: -0.4 },
    { x: 0.18, z: -0.4 },
    { x: -0.18, z: -0.7 },
    { x: 0.18, z: -0.7 },
    { x: 0.0, z: -0.55 },
    { x: -0.15, z: -0.55 },
    { x: 0.15, z: -0.55 },
    { x: 0.0, z: -0.8 },
  ];

  for (let i = 0; i < slotPositions.length; i++) {
    const slot = new THREE.Group();
    slot.position.set(slotPositions[i].x, 0.42, slotPositions[i].z);

    const miniWool = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 10),
      i % 2 === 0 ? mats.sheepWoolWhite : mats.sheepWoolBlack
    );
    miniWool.position.set(0, 0, 0);
    miniWool.castShadow = true;
    slot.add(miniWool);

    const miniHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.15, 0.15),
      i % 2 === 0 ? mats.sheepSkinWhite : mats.sheepSkinBlack
    );
    miniHead.position.set(0, 0.1, 0.08);
    miniHead.castShadow = true;
    slot.add(miniHead);

    const eyeGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.05, 0.12, 0.16);
    slot.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.05, 0.12, 0.16);
    slot.add(eyeR);

    slot.visible = false;
    trailer.add(slot);
    cartSheepSlots.push(slot);
  }

  return {
    root,
    tricycle,
    frontFork,
    frontWheel,
    pedalsGroup,
    rearWheels: [leftWheelMesh, rightWheelMesh, cartLeftWheel, cartRightWheel],
    characterGroup,
    leftLeg,
    rightLeg,
    head,
    trailer,
    cartSheepSlots,
  };
}

export type SheepBreed = 'baluchi' | 'white' | 'golden' | 'spotted';

export interface SheepBundle {
  mesh: THREE.Group;
  breed: SheepBreed;
  points: number;
  legs: THREE.Mesh[];
  head: THREE.Group;
  tail: THREE.Mesh;
  animTime: number;
  state: 'graze' | 'alert' | 'flee' | 'captured';
  velocity: THREE.Vector3;
}

/**
 * Creates an animated 3D sheep model
 * Baluchi breed (black head, white wool) perfectly matches the sheep in the uploaded photo!
 */
export function createSheep(mats: GameMaterials, breed: SheepBreed = 'baluchi'): SheepBundle {
  const mesh = new THREE.Group();
  mesh.name = `sheep_${breed}`;

  let woolMat = mats.sheepWoolWhite;
  let skinMat = mats.sheepSkinBlack; // Default Baluchi (from photo)
  let points = 100;

  if (breed === 'white') {
    woolMat = mats.sheepWoolWhite;
    skinMat = mats.sheepSkinWhite;
    points = 80;
  } else if (breed === 'golden') {
    woolMat = mats.sheepWoolGolden;
    skinMat = mats.sheepSkinWhite;
    points = 350;
  } else if (breed === 'spotted') {
    woolMat = mats.sheepWoolBlack;
    skinMat = mats.sheepSkinWhite;
    points = 150;
  }

  // Fluffy Wool Cloud Body
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, 0.48, 0);
  mesh.add(bodyGroup);

  const mainBodyGeo = new THREE.SphereGeometry(0.42, 14, 12);
  mainBodyGeo.scale(1.0, 0.85, 1.35);
  const mainWool = new THREE.Mesh(mainBodyGeo, woolMat);
  mainWool.castShadow = true;
  mainWool.receiveShadow = true;
  bodyGroup.add(mainWool);

  const puffGeo = new THREE.SphereGeometry(0.2, 10, 10);
  const puff1 = new THREE.Mesh(puffGeo, woolMat);
  puff1.position.set(-0.25, 0.1, 0.1);
  puff1.castShadow = true;
  bodyGroup.add(puff1);

  const puff2 = new THREE.Mesh(puffGeo, woolMat);
  puff2.position.set(0.25, 0.1, 0.1);
  puff2.castShadow = true;
  bodyGroup.add(puff2);

  const puff3 = new THREE.Mesh(puffGeo, woolMat);
  puff3.position.set(0, 0.25, -0.15);
  puff3.castShadow = true;
  bodyGroup.add(puff3);

  // Head & Neck
  const head = new THREE.Group();
  head.position.set(0, 0.58, 0.5);
  mesh.add(head);

  const headGeo = new THREE.BoxGeometry(0.22, 0.25, 0.32);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  const headWoolGeo = new THREE.SphereGeometry(0.16, 10, 10);
  const headWool = new THREE.Mesh(headWoolGeo, woolMat);
  headWool.position.set(0, 0.12, -0.05);
  head.add(headWool);

  const earGeo = new THREE.BoxGeometry(0.16, 0.05, 0.08);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.16, 0.04, -0.05);
  leftEar.rotation.z = -Math.PI / 6;
  head.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, skinMat);
  rightEar.position.set(0.16, 0.04, -0.05);
  rightEar.rotation.z = Math.PI / 6;
  head.add(rightEar);

  const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.1, 0.05, 0.14);
  head.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.1, 0.05, 0.14);
  head.add(eyeR);

  if (breed === 'golden') {
    const hornGeo = new THREE.TorusGeometry(0.14, 0.035, 10, 18, Math.PI * 1.2);
    const leftHorn = new THREE.Mesh(hornGeo, mats.sheepHorns);
    leftHorn.position.set(-0.16, 0.12, 0.0);
    leftHorn.rotation.y = -Math.PI / 3;
    head.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeo, mats.sheepHorns);
    rightHorn.position.set(0.16, 0.12, 0.0);
    rightHorn.rotation.y = Math.PI / 3;
    head.add(rightHorn);
  }

  // Four stubby legs
  const legGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.32, 10);
  const legs: THREE.Mesh[] = [];

  const legPositions = [
    { x: -0.16, z: 0.28 },
    { x: 0.16, z: 0.28 },
    { x: -0.16, z: -0.28 },
    { x: 0.16, z: -0.28 },
  ];

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeo, skinMat);
    leg.position.set(pos.x, 0.16, pos.z);
    leg.castShadow = true;
    mesh.add(leg);
    legs.push(leg);
  });

  // Tail
  const tailGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const tail = new THREE.Mesh(tailGeo, woolMat);
  tail.position.set(0, 0.45, -0.55);
  mesh.add(tail);

  return {
    mesh,
    breed,
    points,
    legs,
    head,
    tail,
    animTime: Math.random() * 10,
    state: 'graze',
    velocity: new THREE.Vector3(),
  };
}

/**
 * Creates the Shepherd NPC ("Mesh Ghorban")
 */
export function createShepherd(mats: GameMaterials): { mesh: THREE.Group; alertIcon: THREE.Mesh; staff: THREE.Mesh } {
  const mesh = new THREE.Group();
  mesh.name = 'shepherd';

  const bodyGeo = new THREE.BoxGeometry(0.44, 0.65, 0.28);
  const body = new THREE.Mesh(bodyGeo, mats.shepherdVest);
  body.position.set(0, 0.95, 0);
  body.castShadow = true;
  mesh.add(body);

  const headGeo = new THREE.BoxGeometry(0.25, 0.28, 0.25);
  const head = new THREE.Mesh(headGeo, mats.skin);
  head.position.set(0, 1.45, 0);
  mesh.add(head);

  const hatGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.18, 16);
  const hat = new THREE.Mesh(hatGeo, mats.shepherdHat);
  hat.position.set(0, 1.6, 0);
  mesh.add(hat);

  const stacheGeo = new THREE.BoxGeometry(0.2, 0.05, 0.06);
  const stache = new THREE.Mesh(stacheGeo, mats.sheepWoolWhite);
  stache.position.set(0, 1.4, 0.14);
  mesh.add(stache);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.65, 10);
  const leftLeg = new THREE.Mesh(legGeo, mats.shepherdHat);
  leftLeg.position.set(-0.13, 0.35, 0);
  mesh.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, mats.shepherdHat);
  rightLeg.position.set(0.13, 0.35, 0);
  mesh.add(rightLeg);

  const staff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.8, 10),
    mats.shepherdWood
  );
  staff.position.set(0.32, 0.9, 0.2);
  staff.castShadow = true;
  mesh.add(staff);

  const alertGeo = new THREE.PlaneGeometry(0.5, 0.5);
  const alertCanvas = document.createElement('canvas');
  alertCanvas.width = 128;
  alertCanvas.height = 128;
  const ctx = alertCanvas.getContext('2d')!;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 76px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 64, 64);

  const alertTex = new THREE.CanvasTexture(alertCanvas);
  alertTex.colorSpace = THREE.SRGBColorSpace;
  const alertMat = new THREE.MeshBasicMaterial({
    map: alertTex,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const alertIcon = new THREE.Mesh(alertGeo, alertMat);
  alertIcon.position.set(0, 1.95, 0);
  alertIcon.visible = false;
  mesh.add(alertIcon);

  return { mesh, alertIcon, staff };
}

/**
 * Creates realistic village environment: stone houses, tile roofs, asphalt road, haystacks & mountains
 */
export function createVillageEnvironment(scene: THREE.Scene, mats: GameMaterials): {
  hideoutBarn: THREE.Group;
  dropZonePos: THREE.Vector3;
  colliders: { minX: number; maxX: number; minZ: number; maxZ: number }[];
} {
  const colliders: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [];

  // 1. Terrain Ground (Golden Green Valley Grass - Expanded 600x600!)
  const groundGeo = new THREE.PlaneGeometry(600, 600, 48, 48);
  groundGeo.rotateX(-Math.PI / 2);

  const groundCanvas = document.createElement('canvas');
  groundCanvas.width = 512;
  groundCanvas.height = 512;
  const gCtx = groundCanvas.getContext('2d')!;
  gCtx.fillStyle = '#6b8e3a'; // Rich meadow grass
  gCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 7000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2.5 + 1;
    gCtx.fillStyle = Math.random() > 0.5 ? '#58782f' : '#7ba143';
    gCtx.beginPath();
    gCtx.arc(x, y, r, 0, Math.PI * 2);
    gCtx.fill();
  }

  const groundTex = new THREE.CanvasTexture(groundCanvas);
  groundTex.wrapS = THREE.RepeatWrapping;
  groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(45, 45);
  groundTex.colorSpace = THREE.SRGBColorSpace;

  const groundMat = new THREE.MeshStandardMaterial({
    map: groundTex,
    roughness: 0.9,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);

  // 2. Realistic Village Asphalt Roads Network
  const roadCanvas = document.createElement('canvas');
  roadCanvas.width = 256;
  roadCanvas.height = 512;
  const rCtx = roadCanvas.getContext('2d')!;
  rCtx.fillStyle = '#3a3f47'; // Dark asphalt
  rCtx.fillRect(0, 0, 256, 512);
  // Asphalt noise grain
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 512;
    rCtx.fillStyle = Math.random() > 0.5 ? '#2b2f35' : '#4a5059';
    rCtx.fillRect(x, y, 1.5, 1.5);
  }
  // Solid white edge lines
  rCtx.fillStyle = '#e2e8f0';
  rCtx.fillRect(10, 0, 8, 512);
  rCtx.fillRect(238, 0, 8, 512);
  // Center dashed yellow line
  rCtx.fillStyle = '#f59e0b';
  for (let y = 0; y < 512; y += 64) {
    rCtx.fillRect(124, y + 12, 8, 40);
  }

  const roadTex = new THREE.CanvasTexture(roadCanvas);
  roadTex.wrapS = THREE.RepeatWrapping;
  roadTex.wrapT = THREE.RepeatWrapping;
  roadTex.repeat.set(1, 24);
  roadTex.colorSpace = THREE.SRGBColorSpace;

  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.75,
    metalness: 0.1,
  });

  // Main Boulevard North-South (420m length)
  const mainRoad = new THREE.Mesh(
    new THREE.PlaneGeometry(9.0, 420).rotateX(-Math.PI / 2),
    roadMat
  );
  mainRoad.position.set(0, 0.02, 0);
  mainRoad.receiveShadow = true;
  scene.add(mainRoad);

  // Central Cross Road East-West
  const crossRoad1 = new THREE.Mesh(
    new THREE.PlaneGeometry(360, 8.0).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x3d434c, roughness: 0.8 })
  );
  crossRoad1.position.set(0, 0.02, -20);
  crossRoad1.receiveShadow = true;
  scene.add(crossRoad1);

  // Secondary North Cross Road
  const crossRoad2 = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 7.0).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x3d434c, roughness: 0.8 })
  );
  crossRoad2.position.set(0, 0.02, 110);
  crossRoad2.receiveShadow = true;
  scene.add(crossRoad2);

  // Secondary South Cross Road
  const crossRoad3 = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 7.0).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x3d434c, roughness: 0.8 })
  );
  crossRoad3.position.set(0, 0.02, -130);
  crossRoad3.receiveShadow = true;
  scene.add(crossRoad3);

  // 3. Rocky Mountains Ridge (Panoramic background cliffs)
  const mountainMat = new THREE.MeshStandardMaterial({
    color: 0xa87c4f,
    roughness: 0.95,
  });

  const mountainGroup = new THREE.Group();
  scene.add(mountainGroup);

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 1.2 + Math.PI * 0.15;
    const dist = 240 + (i % 3) * 25;
    const x = Math.cos(angle) * dist;
    const z = -Math.abs(Math.sin(angle) * dist) - 60;

    const height = 75 + Math.random() * 45;
    const radius = 55 + Math.random() * 30;
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, 8),
      mountainMat
    );
    cone.position.set(x, height / 2 - 2, z);
    mountainGroup.add(cone);
  }

  // 4. Village Butcher Shop ("قصابی حاج عباس / قصابی نمونه روستا")
  const butcherShop = new THREE.Group();
  butcherShop.position.set(35, 0, -45);
  scene.add(butcherShop);

  // Main shop building
  const shopBody = new THREE.Mesh(
    new THREE.BoxGeometry(15, 8.5, 13),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 }) // Rich red brick/plaster
  );
  shopBody.position.set(0, 4.25, 0);
  shopBody.castShadow = true;
  shopBody.receiveShadow = true;
  butcherShop.add(shopBody);

  // Terracotta Roof
  const shopRoof = new THREE.Mesh(
    new THREE.ConeGeometry(11.5, 5.2, 4).rotateY(Math.PI / 4),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 })
  );
  shopRoof.position.set(0, 11.1, 0);
  shopRoof.castShadow = true;
  butcherShop.add(shopRoof);

  // Butcher Shop Signboard ("🥩 قصابی نمونه روستا - حاج عباس")
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const sCtx = signCanvas.getContext('2d')!;
  sCtx.fillStyle = '#fef2f2';
  sCtx.fillRect(0, 0, 512, 128);
  sCtx.lineWidth = 10;
  sCtx.strokeStyle = '#dc2626';
  sCtx.strokeRect(5, 5, 502, 118);
  sCtx.fillStyle = '#991b1b';
  sCtx.font = 'bold 50px Vazirmatn, sans-serif';
  sCtx.textAlign = 'center';
  sCtx.textBaseline = 'middle';
  sCtx.fillText('🥩 قصابی نمونه روستا (حاج عباس)', 256, 64);

  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;
  const signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.5 });
  const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.2), signMat);
  signBoard.position.set(0, 7.2, 6.55);
  butcherShop.add(signBoard);

  // Red & White Striped Awning/Canopy
  const canopyCanvas = document.createElement('canvas');
  canopyCanvas.width = 256;
  canopyCanvas.height = 256;
  const cCtx = canopyCanvas.getContext('2d')!;
  for (let x = 0; x < 256; x += 32) {
    cCtx.fillStyle = (x / 32) % 2 === 0 ? '#ef4444' : '#ffffff';
    cCtx.fillRect(x, 0, 32, 256);
  }
  const canopyTex = new THREE.CanvasTexture(canopyCanvas);
  canopyTex.colorSpace = THREE.SRGBColorSpace;
  const canopyMat = new THREE.MeshStandardMaterial({ map: canopyTex, roughness: 0.6 });
  const canopy = new THREE.Mesh(new THREE.PlaneGeometry(9.5, 3.2).rotateX(Math.PI / 3), canopyMat);
  canopy.position.set(0, 5.5, 7.6);
  butcherShop.add(canopy);

  // Butcher Shop Open Entrance Doorway (sheep walk directly into here!)
  const shopDoor = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 4.8, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 }) // Dark open interior doorway
  );
  shopDoor.position.set(0, 2.4, 6.52);
  butcherShop.add(shopDoor);

  // Delivery drop-zone ring directly in front of Butcher Shop
  // Drop zone position: (35, 0, -32) -- sheep will unload here and walk to door at (35, 0, -38.48)
  const dropZonePos = new THREE.Vector3(35, 0, -32);
  const dropRing = new THREE.Mesh(
    new THREE.RingGeometry(4.0, 4.8, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
  );
  dropRing.position.copy(dropZonePos);
  dropRing.position.y = 0.05;
  scene.add(dropRing);

  // Store sign indicator pillar for drop zone
  const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.5, 12);
  const pillar = new THREE.Mesh(pillarGeo, mats.cartMetal);
  pillar.position.set(39.5, 2.25, -32);
  scene.add(pillar);

  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 256;
  flagCanvas.height = 128;
  const fCtx = flagCanvas.getContext('2d')!;
  fCtx.fillStyle = '#10b981';
  fCtx.fillRect(0, 0, 256, 128);
  fCtx.fillStyle = '#ffffff';
  fCtx.font = 'bold 36px Vazirmatn, sans-serif';
  fCtx.textAlign = 'center';
  fCtx.textBaseline = 'middle';
  fCtx.fillText('محل تحویل 🥩', 128, 64);
  const flagTex = new THREE.CanvasTexture(flagCanvas);
  flagTex.colorSpace = THREE.SRGBColorSpace;
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 1.2),
    new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide })
  );
  flag.position.set(39.5, 3.8, -32);
  scene.add(flag);

  colliders.push({ minX: 26, maxX: 44, minZ: -53, maxZ: -37 });

  // 5. Expanded Village Houses Clusters (Stone foundation + plaster wall + terracotta roof)
  const houseConfigs = [
    // Central village
    { x: -28, z: 20, w: 9, d: 8, h: 5.2 },
    { x: -32, z: 60, w: 10, d: 9, h: 6 },
    { x: 26, z: 30, w: 9, d: 8, h: 5.2 },
    { x: 30, z: 75, w: 11, d: 9, h: 5.8 },
    { x: -25, z: -40, w: 8, d: 8, h: 5 },
    { x: -55, z: -20, w: 10, d: 9, h: 6 },
    { x: 55, z: -20, w: 9, d: 8, h: 5.2 },
    // Expanded North Sector
    { x: -60, z: 110, w: 10, d: 9, h: 6 },
    { x: -25, z: 125, w: 9, d: 8, h: 5.5 },
    { x: 35, z: 120, w: 11, d: 10, h: 6.2 },
    { x: 70, z: 105, w: 8, d: 8, h: 5.0 },
    // Expanded South Sector
    { x: -65, z: -120, w: 10, d: 9, h: 5.8 },
    { x: -20, z: -140, w: 9, d: 8, h: 5.2 },
    { x: 40, z: -135, w: 11, d: 9, h: 6.0 },
    { x: 75, z: -110, w: 9, d: 8, h: 5.4 },
    // Far East & West Farmsteads
    { x: -110, z: -30, w: 12, d: 10, h: 6.5 },
    { x: -105, z: 45, w: 9, d: 8, h: 5.2 },
    { x: 115, z: -40, w: 10, d: 9, h: 5.8 },
    { x: 110, z: 50, w: 11, d: 9, h: 6.0 },
  ];

  houseConfigs.forEach((cfg) => {
    const hGroup = new THREE.Group();
    hGroup.position.set(cfg.x, 0, cfg.z);

    // Stone foundation
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w + 0.2, 1.2, cfg.d + 0.2),
      mats.houseStone
    );
    base.position.set(0, 0.6, 0);
    base.castShadow = true;
    hGroup.add(base);

    // Main wall
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, cfg.h - 1.2, cfg.d),
      mats.houseWall
    );
    wall.position.set(0, (cfg.h - 1.2) / 2 + 1.2, 0);
    wall.castShadow = true;
    wall.receiveShadow = true;
    hGroup.add(wall);

    // Terracotta roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(cfg.w, cfg.d) * 0.75, 3.4, 4).rotateY(Math.PI / 4),
      mats.roofTile
    );
    roof.position.set(0, cfg.h + 1.7, 0);
    roof.castShadow = true;
    hGroup.add(roof);

    // Wooden door
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.6, 0.1),
      mats.windowFrame
    );
    door.position.set(0, 1.3, cfg.d / 2 + 0.06);
    hGroup.add(door);

    scene.add(hGroup);
    colliders.push({
      minX: cfg.x - cfg.w / 2 - 1,
      maxX: cfg.x + cfg.w / 2 + 1,
      minZ: cfg.z - cfg.d / 2 - 1,
      maxZ: cfg.z + cfg.d / 2 + 1,
    });
  });

  // 6. Haystacks scattered around farms
  const hayMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.9 });
  const hayLocations = [
    { x: -14, z: 35 },
    { x: 16, z: 45 },
    { x: 18, z: -10 },
    { x: -18, z: -15 },
    { x: 42, z: 15 },
    { x: -80, z: 80 },
    { x: 85, z: 90 },
    { x: -75, z: -90 },
    { x: 80, z: -100 },
  ];

  hayLocations.forEach((pos) => {
    const hay = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2.2, 2.6, 12),
      hayMat
    );
    hay.position.set(pos.x, 1.3, pos.z);
    hay.castShadow = true;
    scene.add(hay);
    colliders.push({
      minX: pos.x - 2,
      maxX: pos.x + 2,
      minZ: pos.z - 2,
      maxZ: pos.z + 2,
    });
  });

  // 7. Trees & Pines across expanded map
  const treePositions = [
    { x: -12, z: 5 },
    { x: 12, z: -2 },
    { x: -14, z: 75 },
    { x: 15, z: 95 },
    { x: -8, z: 120 },
    { x: 12, z: 130 },
    { x: -45, z: 10 },
    { x: 48, z: 50 },
    { x: -35, z: -60 },
    { x: 5, z: -70 },
    { x: -90, z: 120 },
    { x: 95, z: 115 },
    { x: -100, z: -110 },
    { x: 105, z: -125 },
    { x: -140, z: 20 },
    { x: 140, z: -20 },
  ];

  treePositions.forEach((pos) => {
    const tree = new THREE.Group();
    tree.position.set(pos.x, 0, pos.z);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.45, 2.5, 8),
      mats.shepherdWood
    );
    trunk.position.set(0, 1.25, 0);
    trunk.castShadow = true;
    tree.add(trunk);

    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.85 })
    );
    foliage.position.set(0, 3.2, 0);
    foliage.castShadow = true;
    tree.add(foliage);

    scene.add(tree);
  });

  // 8. Tricycle Rider Props placed around village corners ("چنتا از اینا گوشه کنار روستا")
  const tricyclePropPositions = [
    { x: -55, z: 45, rot: Math.PI / 3 },
    { x: 60, z: 20, rot: -Math.PI / 4 },
    { x: -40, z: -80, rot: Math.PI / 2 },
    { x: 45, z: 85, rot: -Math.PI / 1.5 },
    { x: -95, z: 105, rot: Math.PI / 6 },
    { x: 100, z: -90, rot: -Math.PI / 3 },
    { x: -85, z: -130, rot: Math.PI * 0.8 },
    { x: 90, z: 125, rot: -Math.PI * 0.7 },
  ];

  tricyclePropPositions.forEach((pos) => {
    const triProp = createPlayerAndTricycle(mats);
    triProp.root.position.set(pos.x, 0, pos.z);
    triProp.root.rotation.y = pos.rot;
    scene.add(triProp.root);
    colliders.push({
      minX: pos.x - 1.2,
      maxX: pos.x + 1.2,
      minZ: pos.z - 1.2,
      maxZ: pos.z + 1.2,
    });
  });

  return { hideoutBarn: butcherShop, dropZonePos, colliders };
}

