
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, StopCircle } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  isListening, 
  setIsListening 
}) => {
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    // Create SpeechRecognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      
      onTranscript(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      setError("Error en el reconocimiento de voz.");
      setIsListening(false);
    };
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, setIsListening, isListening]);

  useEffect(() => {
    if (isListening) {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
      }
    } else {
      recognitionRef.current?.stop();
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`
          p-2.5 rounded-full transition-all duration-200 ease-in-out
          ${isListening 
            ? "bg-red-500 text-white shadow-md hover:bg-red-600" 
            : "bg-chat-bot/10 hover:bg-chat-bot/20 text-chat-bot"
          }
        `}
        title={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
        disabled={!!error}
      >
        {isListening ? (
          <StopCircle size={22} className="animate-pulse" />
        ) : (
          error ? <MicOff size={22} /> : <Mic size={22} />
        )}
      </button>
      
      {isListening && (
        <span className="absolute -top-1 -right-1 animate-ping h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
      )}
      
      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-red-100 text-red-600 text-xs p-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
