/**
 * Web Speech API Integration
 * Provides Speech-to-Text (Voice Dictation) and Text-to-Speech (Audio Playback)
 * Works natively in modern browsers with support for Indian accents
 */

class NyayaSpeech {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = window.speechSynthesis || null;

    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[NyayaSpeech] Web Speech API not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.isListening = true;
      const micBtn = document.getElementById('voiceMicBtn');
      if (micBtn) micBtn.classList.add('recording');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      const micBtn = document.getElementById('voiceMicBtn');
      if (micBtn) micBtn.classList.remove('recording');
    };

    this.recognition.onerror = (event) => {
      console.warn('[NyayaSpeech] Speech recognition error:', event.error);
      this.isListening = false;
      const micBtn = document.getElementById('voiceMicBtn');
      if (micBtn) micBtn.classList.remove('recording');
    };
  }

  toggleListening(languageCode = 'en', onResultCallback) {
    if (!this.recognition) {
      alert('Speech Recognition is not supported by your current browser. Try Chrome or Edge.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      return;
    }

    // Map language code to speech locale
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'pa': 'pa-IN'
    };

    this.recognition.lang = langMap[languageCode] || 'en-IN';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResultCallback) {
        onResultCallback(finalTranscript || interimTranscript, Boolean(finalTranscript));
      }
    };

    this.recognition.start();
  }

  speak(text, languageCode = 'en') {
    if (!this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
      return;
    }

    // Strip markdown tags and statutory noise for smoother audio reading
    const cleanText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*#>`]/g, '')
      .slice(0, 1000); // Read first chunk for prompt brevity

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN'
    };

    utterance.lang = langMap[languageCode] || 'en-IN';
    utterance.rate = 0.95;

    this.synth.speak(utterance);
  }
}

window.nyayaSpeech = new NyayaSpeech();
