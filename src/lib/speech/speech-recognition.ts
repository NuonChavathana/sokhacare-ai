import { Language } from '@/types/triage';

// Augment window object for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechHandler {
  private recognition: any = null;
  private _isSupported: boolean | null = null;

  /**
   * Lazily initialise recognition on first use (client-side only).
   * This avoids SSR issues where window is undefined at module load time.
   */
  private init(): boolean {
    if (typeof window === 'undefined') return false;

    // Already initialised
    if (this.recognition !== null) return true;
    // Already confirmed unsupported
    if (this._isSupported === false) return false;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      this._isSupported = false;
      return false;
    }

    try {
      this.recognition = new SpeechRecognitionAPI();
      // continuous=false is required for iOS Safari — it stops after first result
      this.recognition.continuous = false;
      // interimResults must be false on iOS or it triggers errors mid-stream
      this.recognition.interimResults = false;
      // maxAlternatives helps on low-confidence mobile results
      this.recognition.maxAlternatives = 1;
      this._isSupported = true;
      return true;
    } catch {
      this._isSupported = false;
      return false;
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    if (this._isSupported !== null) return this._isSupported;
    return this.init();
  }

  /**
   * Detect if running on iOS / iPadOS (includes iPad in desktop mode).
   */
  public isiOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      // iPad in desktop mode reports as MacIntel with touch support
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  /**
   * Detect if we're in a browser that supports voice.
   * On iOS, only Safari supports webkitSpeechRecognition.
   */
  public getBrowserWarning(): string | null {
    if (typeof window === 'undefined') return null;

    const isIOS = this.isiOS();
    const ua = navigator.userAgent;

    // On iOS, Chrome/Firefox/Edge do NOT support speech recognition
    if (isIOS) {
      const isIOSSafari = /^((?!chrome|crios|fxios|EdgiOS).)*safari/i.test(ua);
      if (!isIOSSafari && !window.webkitSpeechRecognition && !window.SpeechRecognition) {
        return 'Voice requires Safari on iPhone/iPad. Please open in Safari.';
      }
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      return 'Your browser does not support voice input. Try Chrome or Safari.';
    }

    return null;
  }

  public startListening(
    language: Language,
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    // Lazy init — must be called from a user gesture on iOS
    const ready = this.init();
    if (!ready || !this.recognition) {
      const warning = this.getBrowserWarning();
      onError(warning || 'Voice input is not supported in this browser.');
      onEnd();
      return;
    }

    // Set language code
    this.recognition.lang = language === 'km' ? 'km-KH' : 'en-US';

    this.recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      switch (event.error) {
        case 'not-allowed':
          onError('Microphone access was denied. Please allow microphone in your browser settings.');
          break;
        case 'no-speech':
          onError('No speech detected. Please speak clearly and try again.');
          break;
        case 'network':
          onError('Network error. Please check your internet connection.');
          break;
        case 'audio-capture':
          onError('No microphone found. Please connect a microphone.');
          break;
        case 'language-not-supported':
          // Fallback to English if Khmer is not supported on device
          this.recognition.lang = 'en-US';
          onError('Khmer voice not supported on this device. Try speaking in English.');
          break;
        default:
          onError('Voice input error. Please try typing instead.');
      }
      onEnd();
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      // InvalidStateError: recognition already started — stop and restart
      if (e?.name === 'InvalidStateError') {
        try {
          this.recognition.stop();
          setTimeout(() => {
            try { this.recognition.start(); } catch { onError('Could not start voice. Please try again.'); onEnd(); }
          }, 300);
        } catch {
          onError('Could not access microphone. Please try again.');
          onEnd();
        }
      } else {
        console.error('Failed to start speech recognition:', e);
        onError('Could not access microphone. Please grant microphone permission.');
        onEnd();
      }
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }
}

// Do NOT instantiate at module level — defer to first user interaction
// to avoid SSR issues and iOS gesture requirement failures
export const speechHandler = new SpeechHandler();
