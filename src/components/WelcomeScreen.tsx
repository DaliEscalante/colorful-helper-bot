
import React from "react";
import { Sparkles, MessageSquare, Image, Mic } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-700">
      <div className="max-w-md text-center p-8 glass rounded-3xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
        <div className="mb-8 flex justify-center">
          <div className="relative w-40 h-40 animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-chat-bot/30 to-chat-user/30 rounded-full blur-xl animate-pulse-slow"></div>
            <img 
              src="/lovable-uploads/5ab9c16a-161a-41a8-a371-f92626c9448f.png" 
              alt="ChatBot Mascot" 
              className="w-full h-full object-contain relative z-10"
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-chat-bot to-chat-user text-white rounded-full p-2 shadow-lg animate-pulse z-20">
              <Sparkles size={18} />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-chat-bot via-purple-500 to-chat-user bg-clip-text text-transparent animate-pulse-slow">
          ¡Bienvenido a tu Asistente Personal!
        </h2>
        
        <p className="mb-6 text-gray-600">
          Puedes preguntarme lo que quieras, subir imágenes o incluso hablar por el micrófono.
          ¿En qué puedo ayudarte hoy?
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-600 mb-5">
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full shadow-md">
              <MessageSquare size={15} className="text-chat-bot" />
              <span>Chat</span>
            </div>
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full shadow-md">
              <Image size={15} className="text-chat-user" />
              <span>Imágenes</span>
            </div>
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full shadow-md">
              <Mic size={15} className="text-red-500" />
              <span>Voz</span>
            </div>
          </div>
          
          {[
            "¿Puedes explicarme qué es la inteligencia artificial?",
            "¿Cuáles son los destinos turísticos más populares en 2024?",
            "Dame algunas ideas para una cena rápida y saludable"
          ].map((text, index) => (
            <button 
              key={index}
              onClick={() => onExampleClick(text)}
              className="w-full p-3.5 text-left rounded-xl hover:bg-white transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-lg bg-white/80 text-gray-700 transform hover:scale-102"
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
