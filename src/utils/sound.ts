// 100% Procedural Web Audio API synthesizer for Nobita's Room
// Zero external MP3 dependencies; respects autoplay & user volume/mute preferences.

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.75;
  private ambientVolume: number = 0.35;
  private sfxVolume: number = 0.7;
  private lastFootstepAt: number = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public updatePreferences(prefs: {
    isMuted: boolean;
    masterVolume: number;
    ambientVolume: number;
    sfxVolume: number;
  }) {
    this.isMuted = prefs.isMuted;
    this.masterVolume = prefs.masterVolume;
    this.ambientVolume = prefs.ambientVolume;
    this.sfxVolume = prefs.sfxVolume;

    if (this.ambientGain && this.ctx) {
      const target = this.isMuted ? 0 : this.masterVolume * this.ambientVolume * 0.035;
      this.ambientGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.15);
    }
  }

  public startAmbience() {
    const ctx = this.ensureContext();
    if (!ctx || this.ambientOsc) return;
    try {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = 174; // Warm nostalgic room harmonic
      osc2.type = 'triangle';
      osc2.frequency.value = 261.6; // Soft C4 fifth overtone

      filter.type = 'lowpass';
      filter.frequency.value = 340;

      const target = this.isMuted ? 0 : this.masterVolume * this.ambientVolume * 0.035;
      gain.gain.value = target;

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch {
      // Ignore audio errors on restricted environments
    }
  }

  public pauseAmbience(paused: boolean) {
    if (!this.ambientGain || !this.ctx) return;
    const target = paused || this.isMuted ? 0 : this.masterVolume * this.ambientVolume * 0.035;
    this.ambientGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
  }

  private getEffectiveSfxGain(base: number): number {
    if (this.isMuted) return 0;
    return Math.max(0, Math.min(1, base * this.masterVolume * this.sfxVolume));
  }

  public playFootstep(sprinting = false) {
    const now = performance.now();
    const minInterval = sprinting ? 290 : 430;
    if (now - this.lastFootstepAt < minInterval) return;
    this.lastFootstepAt = now;

    const gainVal = this.getEffectiveSfxGain(0.11);
    if (gainVal <= 0.001) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Soft tatami mat thud with slight pitch variation
      const pitchJitter = 0.94 + Math.random() * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(105 * pitchJitter, t);
      osc.frequency.exponentialRampToValueAtTime(48, t + 0.065);

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.075);
    } catch {}
  }

  public playInteractChime() {
    const gainVal = this.getEffectiveSfxGain(0.18);
    if (gainVal <= 0.001) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.06); // E5

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.23);
    } catch {}
  }

  public playComputerBoot() {
    const gainVal = this.getEffectiveSfxGain(0.2);
    if (gainVal <= 0.001) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const notes = [392.0, 523.25, 659.25, 783.99]; // G4 C5 E5 G5
      notes.forEach((freq, idx) => {
        const t = ctx.currentTime + idx * 0.065;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(gainVal, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      });
    } catch {}
  }

  public playDrawerOrBook() {
    const gainVal = this.getEffectiveSfxGain(0.16);
    if (gainVal <= 0.001) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.12);
      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } catch {}
  }

  public playLampClick() {
    const gainVal = this.getEffectiveSfxGain(0.2);
    if (gainVal <= 0.001) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.035);
      gain.gain.setValueAtTime(gainVal * 0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch {}
  }

  public playCollectStar() {
    const gainVal = this.getEffectiveSfxGain(0.24);
    if (gainVal <= 0.001) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const notes = [587.33, 783.99, 987.77, 1174.66]; // D5 G5 B5 D6
      notes.forEach((freq, i) => {
        const t = ctx.currentTime + i * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(gainVal, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();
