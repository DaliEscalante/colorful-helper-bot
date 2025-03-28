
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-semibold text-purple-600">
                Configurar OpenAI API Key
              </h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Para usar este chatbot, necesitas configurar tu clave de API de OpenAI.
              Puedes obtener una en{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
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
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                autoFocus
              />
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors shadow-md"
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
          md:block bg-white border-r border-gray-100
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
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white shadow-sm z-10">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-purple-600">
                Asistente AI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
            
            <button
              onClick={() => currentConversation && deleteConversation(currentConversation.id)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Delete conversation"
            >
              <Trash2 size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* This is the main change: making sure the messages container has proper overflow settings */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 max-h-[calc(100vh-140px)]">
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

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center pl-4">
                <div id="voice-button">
                  <VoiceInput 
                    onTranscript={handleVoiceInput} 
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                </div>
                <div id="image-upload-button" className="ml-2">
                  <ImageUpload onImagesUploaded={handleImagesUploaded} />
                </div>
              </div>
              
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 py-3 px-4 bg-transparent resize-none focus:outline-none min-h-[48px] max-h-32"
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
                  p-3 rounded-full mr-2
                  ${(inputValue.trim() === "" && uploadedImages.length === 0) || isLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  }
                `}
              >
                <Send size={20} />
              </button>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative h-16 w-16">
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="h-full w-full object-cover rounded-md border border-gray-200"
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
