// Sound Effects System
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
  }

  // Play sound effect
  play(soundName) {
    if (!this.enabled) return;
    
    // Create audio context if needed
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = this.volume;
    
    // Different sounds for different actions
    switch(soundName) {
      case 'success':
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        break;
      case 'click':
        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        break;
      case 'error':
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        break;
      case 'coin':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        break;
      case 'level_up':
        oscillator.frequency.value = 659.25; // E5
        oscillator.type = 'triangle';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        break;
      default:
        oscillator.frequency.value = 440;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
