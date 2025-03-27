
import React from "react";
import { MessageType } from "../context/ChatContext";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: MessageType;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-slide-up`}
    >
      <div 
        className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} gap-3`}
      >
        <div 
          className={`
            flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
            ${isUser 
              ? "message-gradient-user text-white" 
              : "message-gradient-bot text-white"
            }
            shadow-lg hover:shadow-xl transition-shadow duration-300
          `}
        >
          {isUser ? (
            <User size={20} />
          ) : (
            <Bot size={20} />
          )}
        </div>
        
        <div 
          className={`
            p-4 rounded-2xl shadow-md
            ${isUser 
              ? "bg-gradient-to-br from-chat-user-light to-chat-user-light/80 border border-chat-user/20 text-gray-800" 
              : "bg-gradient-to-br from-chat-bot-light to-chat-bot-light/80 border border-chat-bot/20 text-gray-800"
            }
            ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}
            ${!message.content && isLatest ? "min-w-[60px] min-h-[40px]" : ""}
            transition-all duration-300 hover:shadow-lg transform hover:scale-102
          `}
        >
          {message.content ? (
            <>
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Display attachments if any */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.attachments.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`Attachment ${index + 1}`} 
                      className="max-w-full rounded-lg max-h-60 object-contain border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                    />
                  ))}
                </div>
              )}
            </>
          ) : isLatest ? (
            <div className="typing-indicator font-light text-gray-500">Pensando</div>
          ) : null}
          
          <div className="text-xs text-gray-500 mt-2 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
