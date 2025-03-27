import React, { useState, useRef, useEffect } from "react";
import { Send, ChevronLeft, ChevronRight, Settings, Trash2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import ImageUpload from "./ImageUpload";
import ChatHistory from "./ChatHistory";
import WelcomeScreen from "./WelcomeScreen";
import { toast } from "sonner";
import { getApiKey, setApiKey } from "../utils/openai";

const ChatInterface: React.FC = () => {
  const {
    conversations,
    currentConversation,
    isLoading,
    sendMessage,
    startNewConversation,
    setCurrentConversation,
    deleteConversation,
  } = useChat();

  const [inputValue, setInputValue] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey() || "");
  const [showApiKeyModal, setShowApiKeyModal] = useState(!getApiKey());
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!getApiKey()) {
      setShowApiKeyModal(true);
      return;
    }
    
    if ((inputValue.trim() === "" && uploadedImages.length === 0) || isLoading) {
      return;
    }
    
    await sendMessage(inputValue, uploadedImages);
    setInputValue("");
    setUploadedImages([]);
    setIsListening(false);
  };

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
  };

  const handleImagesUploaded = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      toast.error("Por favor, ingresa una clave de API válida");
      return;
    }
    
    setApiKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
    toast.success("Clave de API guardada correctamente");
  };

  const handleExampleClick = (text: string) => {
    setInputValue(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen">
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Configurar OpenAI API Key
              </h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Para usar este chatbot, necesitas configurar tu clave de API de OpenAI.
              Puedes obtener una en{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline hover:text-purple-700 transition-colors"
              >
                platform.openai.com
              </a>
            </p>
            
            <form onSubmit={handleSaveApiKey}>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="w-full p-4 border border-gray-300 rounded-lg mb-5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md transform hover:scale-105"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div 
        className={`
          ${showSidebar ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-in-out overflow-hidden
          md:block bg-white border-r border-gray-100 shadow-sm
          ${showSidebar ? 'md:w-80' : 'md:w-0'}
        `}
      >
        {showSidebar && (
          <ChatHistory
            conversations={conversations}
            currentConversationId={currentConversation?.id || null}
            onSelectConversation={setCurrentConversation}
            onDeleteConversation={deleteConversation}
            onNewConversation={startNewConversation}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col h-full relative">
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10 animate-fade-in">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Asistente AI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
              aria-label="Settings"
            >
              <Settings size={20} className="text-purple-500" />
            </button>
            
            <button
              onClick={() => currentConversation && deleteConversation(currentConversation.id)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
              aria-label="Delete conversation"
            >
              <Trash2 size={20} className="text-purple-500" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-32">
          {currentConversation?.messages && currentConversation.messages.length > 0 ? (
            currentConversation.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === currentConversation.messages.length - 1 && message.role === "assistant" && !message.content}
              />
            ))
          ) : (
            <WelcomeScreen onExampleClick={handleExampleClick} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 p-4 animate-fade-in shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center rounded-full border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center pl-4 gap-2">
                <div id="voice-button" className="transform hover:scale-110 transition-transform">
                  <VoiceInput 
                    onTranscript={handleVoiceInput} 
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                </div>
                <div id="image-upload-button" className="transform hover:scale-110 transition-transform">
                  <ImageUpload onImagesUploaded={handleImagesUploaded} />
                </div>
              </div>
              
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 py-4 px-5 bg-transparent resize-none focus:outline-none min-h-[52px] max-h-32"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              
              <button
                type="submit"
                disabled={isLoading || (inputValue.trim() === "" && uploadedImages.length === 0)}
                className={`
                  p-4 rounded-full mr-3
                  ${(inputValue.trim() === "" && uploadedImages.length === 0) || isLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  }
                `}
              >
                <Send size={20} />
              </button>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative h-16 w-16 transform hover:scale-105 transition-transform">
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="h-full w-full object-cover rounded-md border border-gray-200 shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
