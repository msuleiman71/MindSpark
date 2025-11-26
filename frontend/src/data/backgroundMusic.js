// Background Music System using Web Audio API

class MusicManager {
  constructor() {
    this.audioContext = null;
    this.currentTrack = null;
    this.enabled = true;
    this.volume = 0.3;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play ambient background music
  playBackgroundMusic() {
    if (!this.enabled || !this.audioContext) return;

    // Create a simple ambient loop using oscillators
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    
    // Create harmony (C major chord)
    oscillator1.frequency.value = 261.63; // C4
    oscillator2.frequency.value = 329.63; // E4

    gainNode.gain.value = this.volume;

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.start();
    oscillator2.start();

    // Fade in
    gainNode.gain.exponentialRampToValueAtTime(
      this.volume,
      this.audioContext.currentTime + 2
    );

    this.currentTrack = { oscillator1, oscillator2, gainNode };
  }

  stopMusic() {
    if (this.currentTrack) {
      const { oscillator1, oscillator2, gainNode } = this.currentTrack;
      
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 1
      );

      setTimeout(() => {
        oscillator1.stop();
        oscillator2.stop();
      }, 1000);

      this.currentTrack = null;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else {
      this.playBackgroundMusic();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentTrack) {
      this.currentTrack.gainNode.gain.value = this.volume;
    }
  }
}

export const musicManager = new MusicManager();
