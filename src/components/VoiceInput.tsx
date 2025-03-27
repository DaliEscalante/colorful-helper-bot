
import React, { useState, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";

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
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        onTranscript(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error("Error de reconocimiento de voz: " + event.error);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("El reconocimiento de voz no está disponible en este navegador");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info("Escuchando... Habla ahora");
    }
  };
  
  return (
    <button
      onClick={toggleListening}
      type="button"
      className={`
        p-2.5 rounded-full transition-all duration-200 ease-in-out
        ${isListening 
          ? "bg-red-500/90 text-white animate-pulse" 
          : "bg-red-500/10 hover:bg-red-500/20 text-red-500"}
      `}
      title={isListening ? "Detener grabación" : "Grabar voz"}
    >
      {isListening ? (
        <Square size={22} />
      ) : (
        <Mic size={22} />
      )}
    </button>
  );
};

export default VoiceInput;
