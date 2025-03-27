
import React from "react";
import { ImageIcon, Mic } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-700 py-10">
      <div className="max-w-2xl w-full text-center p-8 flex flex-col items-center">
        {/* Circle Avatar with Image - Added animation and glow effect */}
        <div className="mb-10 relative animate-scale-in">
          <div className="w-52 h-52 rounded-full bg-white shadow-xl overflow-hidden border-4 border-purple-100 transition-all duration-500 hover:scale-105 hover:border-purple-200">
            <img 
              src="/lovable-uploads/5ab9c16a-161a-41a8-a371-f92626c9448f.png"
              alt="Asistente AI" 
              className="w-full h-full object-contain p-2"
            />
          </div>
          {/* Enhanced glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-purple-300/30 rounded-full blur-2xl z-[-1] animate-pulse"></div>
        </div>
        
        {/* Title and description - Enhanced with animation */}
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-fade-in">
          ¡Bienvenido al Chat!
        </h2>
        
        <p className="mb-10 text-gray-600 text-lg max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Pregúntame lo que quieras y haré mi mejor esfuerzo
          para ayudarte. Tus mensajes aparecerán aquí.
        </p>
        
        {/* Action buttons - Now side by side with improved spacing */}
        <div className="flex gap-10 justify-center w-full mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <button 
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 hover:shadow-lg transition-all duration-300 text-purple-600 max-w-xs transform hover:scale-105"
            onClick={() => document.getElementById('image-upload-button')?.click()}
          >
            <ImageIcon size={22} />
            <span className="font-medium">Sube una imagen</span>
          </button>
          
          <button 
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 hover:shadow-lg transition-all duration-300 text-purple-600 max-w-xs transform hover:scale-105"
            onClick={() => document.getElementById('voice-button')?.click()}
          >
            <Mic size={22} />
            <span className="font-medium">Habla conmigo</span>
          </button>
        </div>
        
        {/* Example queries - Enhanced with staggered animation */}
        <div className="mt-8 grid gap-4 max-w-xl mx-auto w-full">
          <p className="text-sm text-gray-500 mb-2 opacity-80">Prueba con estas preguntas:</p>
          {[
            "¿Puedes explicarme qué es la inteligencia artificial?",
            "¿Cuáles son los destinos turísticos más populares en 2024?",
            "Dame algunas ideas para una cena rápida y saludable"
          ].map((text, index) => (
            <button 
              key={index}
              onClick={() => onExampleClick(text)}
              className="w-full p-4 text-left rounded-xl hover:bg-white transition-all duration-300 border border-purple-100 shadow-sm hover:shadow-lg bg-white/80 text-gray-700 transform hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <span className="text-purple-400 mr-2">→</span> {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
