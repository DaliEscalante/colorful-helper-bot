
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-start py-8 text-gray-700 overflow-auto">
      <div className="max-w-2xl w-full text-center p-8 flex flex-col items-center">
        {/* Circle Avatar with Image - Enhanced with animation and effects */}
        <div className={`mb-8 relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-48 h-48 rounded-full bg-white shadow-xl overflow-visible group relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 animate-pulse-slow group-hover:from-purple-300/50 group-hover:to-pink-300/50 transition-all duration-300"></div>
            <img 
              src="/lovable-uploads/5ab9c16a-161a-41a8-a371-f92626c9448f.png"
              alt="Asistente AI" 
              className="w-full h-full object-contain animate-float"
            />
          </div>
          <div className="absolute -inset-3 bg-white/10 rounded-full blur-xl z-[-1] animate-pulse-slow"></div>
          
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-2 text-purple-500/80 animate-spin-slow">
            <Sparkles size={28} />
          </div>
          <div className="absolute -left-6 bottom-6 text-pink-400/80 animate-pulse-slow">
            <Sparkles size={20} />
          </div>
        </div>
        
        {/* Title and description with animations */}
        <h2 
          className={`text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}
        >
          ¡Bienvenido al Chat!
        </h2>
        
        <p 
          className={`mb-10 text-gray-600 text-lg max-w-xl mx-auto transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Pregúntame lo que quieras y haré mi mejor esfuerzo
          para ayudarte. Tus mensajes aparecerán aquí.
        </p>
        
        {/* Example queries with enhanced styling */}
        <div className={`mt-6 grid gap-4 max-w-lg mx-auto w-full transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            "¿Puedes explicarme qué es la inteligencia artificial?",
            "¿Cuáles son los destinos turísticos más populares en 2024?",
            "Dame algunas ideas para una cena rápida y saludable"
          ].map((text, index) => (
            <button 
              key={index}
              onClick={() => onExampleClick(text)}
              className="w-full p-3.5 text-left rounded-xl hover:bg-white transition-all duration-300 border border-purple-100/50 shadow-sm hover:shadow-md bg-white/70 backdrop-blur-sm text-gray-700 transform hover:scale-102 group"
              style={{ 
                transitionDelay: `${(index + 1) * 100}ms`,
                animationDelay: `${(index + 1) * 100}ms` 
              }}
            >
              <span className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-r from-purple-400/80 to-pink-400/80 flex items-center justify-center text-white text-xs">
                  {index + 1}
                </span>
                <span className="group-hover:text-purple-600 transition-colors duration-200">"{text}"</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
