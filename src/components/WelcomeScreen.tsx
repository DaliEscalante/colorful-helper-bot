
import React from "react";
import { ImageIcon, Mic } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="h-full flex flex-col items-center justify-start py-8 text-gray-700 overflow-auto">
      <div className="max-w-2xl w-full text-center p-8 flex flex-col items-center">
        {/* Circle Avatar with Image - Modified for full visibility */}
        <div className="mb-8 relative">
          <div className="w-48 h-48 rounded-full bg-white shadow-xl overflow-visible">
            <img 
              src="/lovable-uploads/5ab9c16a-161a-41a8-a371-f92626c9448f.png"
              alt="Asistente AI" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -inset-3 bg-white/10 rounded-full blur-xl z-[-1]"></div>
        </div>
        
        {/* Title and description */}
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
          ¡Bienvenido al Chat!
        </h2>
        
        <p className="mb-10 text-gray-600 text-lg max-w-xl mx-auto">
          Pregúntame lo que quieras y haré mi mejor esfuerzo
          para ayudarte. Tus mensajes aparecerán aquí.
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-6 justify-center">
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 hover:shadow-lg transition-all duration-300 text-purple-500"
            onClick={() => document.getElementById('image-upload-button')?.click()}
          >
            <ImageIcon size={20} />
            <span>Sube una imagen</span>
          </button>
          
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 hover:shadow-lg transition-all duration-300 text-purple-500"
            onClick={() => document.getElementById('voice-button')?.click()}
          >
            <Mic size={20} />
            <span>Habla conmigo</span>
          </button>
        </div>
        
        {/* Example queries */}
        <div className="mt-12 grid gap-4 max-w-lg mx-auto w-full">
          {[
            "¿Puedes explicarme qué es la inteligencia artificial?",
            "¿Cuáles son los destinos turísticos más populares en 2024?",
            "Dame algunas ideas para una cena rápida y saludable"
          ].map((text, index) => (
            <button 
              key={index}
              onClick={() => onExampleClick(text)}
              className="w-full p-3.5 text-left rounded-xl hover:bg-white transition-all duration-300 border border-purple-100 shadow-sm hover:shadow-lg bg-white/80 text-gray-700 transform hover:scale-102"
            >
              "{text}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
