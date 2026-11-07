/**
 * Procedural Web Audio API sound synthesizer
 * Zero external audio files / zero 404 dependencies!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicPlaying: boolean = false;
  private musicTimer: number | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicPlaying) {
      this.stopFolkRadio();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Classic double-ring bicycle bell (Ding-Ding!)
   */
  public playBicycleBell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const ring = (delay: number, freq: number) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.35);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        // Add harmonic overtone
        const overtone = this.ctx.createOscillator();
        const overGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2.76, now);
        overGain.gain.setValueAtTime(0.12, now);
        overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        overtone.connect(overGain);
        overGain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
        overtone.start(now);
        overtone.stop(now + 0.22);
      }, delay);
    };

    ring(0, 1850);
    ring(130, 2100);
  }

  /**
   * Comical procedural sheep bleat (Meeeh! / Baaa!)
   */
  public playSheepBleat(pitchMod: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = 0.45 + Math.random() * 0.25;

    // Rich buzz oscillator with resonant formant filter
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const tremolo = this.ctx.createOscillator();
    const tremoloGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = (220 + Math.random() * 60) * pitchMod;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.92, now + dur);

    // Sheep formant filter
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950 * pitchMod, now);
    filter.Q.setValueAtTime(4.0, now);

    // Tremolo for characteristic sheep vibrato
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(14 + Math.random() * 4, now); // 14-18 Hz vibrato
    tremoloGain.gain.setValueAtTime(baseFreq * 0.12, now);
    tremolo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.06);
    gain.gain.setValueAtTime(0.24, now + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    tremolo.start(now);
    osc.start(now);
    tremolo.stop(now + dur);
    osc.stop(now + dur);
  }

  /**
   * Comic capture yoink + celebratory coin chime
   */
  public playSheepCapture() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Upward pitch bend (Yoink!)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);

    // Celebratory sparkles
    const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const noteNow = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, noteNow);
        g.gain.setValueAtTime(0.2, noteNow);
        g.gain.exponentialRampToValueAtTime(0.001, noteNow + 0.25);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(noteNow);
        o.stop(noteNow + 0.26);
      }, 70 * (idx + 1));
    });
  }

  /**
   * Nitro / Turbo Boost sound
   */
  public playNitro() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const noise = this.ctx.createBufferSource();

    // Noise buffer
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.frequency.linearRampToValueAtTime(3200, now + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.4);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.5);
    osc.stop(now + 0.5);
  }

  /**
   * Tire screech / drift sound
   */
  public playDriftScreech() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(680 + Math.random() * 120, now);
    osc.frequency.linearRampToValueAtTime(540, now + 0.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  /**
   * Shepherd Alert whistle
   */
  public playShepherdAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.linearRampToValueAtTime(2400, now + 0.15);
    osc.frequency.linearRampToValueAtTime(1800, now + 0.35);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  /**
   * Deliver to secret hideout fanfare
   */
  public playDeliverySuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      }, idx * 90);
    });
  }

  /**
   * Upbeat Village Folk Radio synthesizer
   * Plays a catchy, looping Middle-Eastern / Iranian rustic acoustic rhythm
   */
  public toggleFolkRadio(): boolean {
    if (this.musicPlaying) {
      this.stopFolkRadio();
      return false;
    } else {
      this.startFolkRadio();
      return true;
    }
  }

  public getIsMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  public startFolkRadio() {
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    this.initCtx();

    // Catchy village modal melody notes (D minor / Shur feel)
    // D4, E4, F4, G4, A4, Bb4, C5, D5
    const melody = [
      { pitch: 293.66, dur: 0.25 }, // D4
      { pitch: 329.63, dur: 0.25 }, // E4
      { pitch: 349.23, dur: 0.5 },  // F4
      { pitch: 392.00, dur: 0.25 }, // G4
      { pitch: 440.00, dur: 0.25 }, // A4
      { pitch: 392.00, dur: 0.5 },  // G4
      { pitch: 349.23, dur: 0.25 }, // F4
      { pitch: 329.63, dur: 0.25 }, // E4
      { pitch: 293.66, dur: 0.75 }, // D4
      { pitch: 349.23, dur: 0.25 }, // F4
      { pitch: 329.63, dur: 0.5 },  // E4
      { pitch: 293.66, dur: 1.0 },  // D4
    ];

    let step = 0;
    const playNext = () => {
      if (!this.musicPlaying || this.isMuted || !this.ctx) {
        if (this.musicPlaying) {
          this.musicTimer = window.setTimeout(playNext, 250);
        }
        return;
      }

      const note = melody[step % melody.length];
      const now = this.ctx.currentTime;

      // Acoustic pluck (tar/setar simulation with rich harmonics)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.pitch, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.dur * 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + note.dur);

      // Percussive beat (Tonbak / Doumbek tap)
      if (step % 2 === 0) {
        const drumOsc = this.ctx.createOscillator();
        const drumGain = this.ctx.createGain();
        drumOsc.type = 'sine';
        drumOsc.frequency.setValueAtTime(110, now);
        drumOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
        drumGain.gain.setValueAtTime(0.18, now);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        drumOsc.connect(drumGain);
        drumGain.connect(this.ctx.destination);
        drumOsc.start(now);
        drumOsc.stop(now + 0.16);
      }

      step++;
      const nextDelay = note.dur * 400; // Tempo
      this.musicTimer = window.setTimeout(playNext, nextDelay);
    };

    playNext();
  }

  public stopFolkRadio() {
    this.musicPlaying = false;
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sounds = new SoundEngine();
