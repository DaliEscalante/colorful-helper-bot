
import React from "react";
import { MessageType } from "../context/ChatContext";
import { User, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ChatMessageProps {
  message: MessageType;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-in`}
    >
      <div 
        className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} gap-3 items-start`}
      >
        <Avatar 
          className={`
            flex-shrink-0 h-10 w-10 border-2
            ${isUser 
              ? "border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30" 
              : "border-pink-200 dark:border-pink-700 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-800/30 dark:to-purple-800/30"
            }
          `}
        >
          {isUser ? (
            <AvatarFallback className="text-purple-500 dark:text-purple-400">
              <User size={18} />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage 
                src="/lovable-uploads/5ab9c16a-161a-41a8-a371-f92626c9448f.png"
                alt="AI Assistant"
              />
              <AvatarFallback className="text-pink-500 dark:text-pink-400">
                <Bot size={18} />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div 
          className={`
            p-4 rounded-2xl shadow-sm
            ${isUser 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white" 
              : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200"
            }
            ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}
            ${!message.content && isLatest ? "min-w-[60px] min-h-[40px]" : ""}
            transition-all duration-300 hover:shadow-md
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
                      className="max-w-full rounded-lg max-h-60 object-contain border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                    />
                  ))}
                </div>
              )}
            </>
          ) : isLatest ? (
            <div className="typing-indicator font-light text-gray-500 dark:text-gray-400">Pensando</div>
          ) : null}
          
          <div className={`text-xs mt-2 text-right ${isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
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
