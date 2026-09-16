// Voice Recognition Service using Web Speech API (SpeechRecognition / webkitSpeechRecognition)
export interface VoiceRecognitionOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  lang?: string;
}

export class VoiceRecognitionService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static silenceTimer: any = null;

  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  static start(options: VoiceRecognitionOptions): boolean {
    if (!this.isSupported()) {
      options.onError?.('Trình duyệt không hỗ trợ Web Speech API.');
      return false;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // If currently listening, stop first
    if (this.isListening && this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true; // Keep listening continuously until user finishes speaking
    this.recognition.interimResults = true;
    this.recognition.lang = options.lang || 'vi-VN';

    let currentAccumulated = '';

    this.recognition.onstart = () => {
      this.isListening = true;
      options.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let latestFinal = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          latestFinal += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (latestFinal) {
        currentAccumulated = (currentAccumulated + ' ' + latestFinal).trim();
      }

      const displayTranscript = (currentAccumulated + ' ' + interimTranscript).trim();
      if (displayTranscript) {
        options.onResult(displayTranscript, false);

        // Reset 2.0-second silence debounce timer before finalizing
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          if (this.isListening && displayTranscript) {
            options.onResult(displayTranscript, true);
            this.stop();
          }
        }, 2200); // 2.2s debounce buffer so it never abruptly cuts off!
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Don't kill abruptly on brief silence, allow user pause
        return;
      }
      this.isListening = false;
      const errorMsg = event.error === 'not-allowed' 
        ? 'Vui lòng cấp quyền truy cập micro để tìm kiếm bằng giọng nói.' 
        : `Lỗi micro: ${event.error}`;
      options.onError?.(errorMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
      options.onEnd?.();
    };

    try {
      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      options.onError?.(err.message || 'Không thể bật micro.');
      return false;
    }
  }

  static stop() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  static getIsListening(): boolean {
    return this.isListening;
  }
}
