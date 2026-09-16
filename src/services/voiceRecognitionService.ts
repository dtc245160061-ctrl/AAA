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

  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  static start(options: VoiceRecognitionOptions): boolean {
    if (!this.isSupported()) {
      options.onError?.('Trình duyệt không hỗ trợ Web Speech API.');
      return false;
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
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = options.lang || 'vi-VN';

    this.recognition.onstart = () => {
      this.isListening = true;
      options.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        options.onResult(finalTranscript, true);
      } else if (interimTranscript) {
        options.onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const errorMsg = event.error === 'not-allowed' 
        ? 'Vui lòng cấp quyền truy cập micro để tìm kiếm bằng giọng nói.' 
        : event.error === 'no-speech' 
        ? 'Không nhận diện được giọng nói. Vui lòng nói lại.'
        : `Lỗi micro: ${event.error}`;
      options.onError?.(errorMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
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
