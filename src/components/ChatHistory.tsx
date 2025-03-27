
import React from "react";
import { ConversationType } from "../context/ChatContext";
import { MessageSquare, Trash2, PlusCircle } from "lucide-react";

interface ChatHistoryProps {
  conversations: ConversationType[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-l-2xl shadow-md border-r border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial</h2>
        <button
          onClick={onNewConversation}
          className="w-full py-2.5 px-4 rounded-lg bg-chat-bot text-white font-medium flex items-center justify-center gap-2 transition-all hover:bg-chat-bot/90 hover:shadow-md"
        >
          <PlusCircle size={18} />
          <span>Nueva conversación</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No hay conversaciones aún
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`
                group relative p-3 rounded-lg cursor-pointer transition-all
                ${
                  currentConversationId === conversation.id
                    ? "bg-chat-bot/10 text-chat-bot"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start">
                <MessageSquare
                  size={18}
                  className={`mr-2 flex-shrink-0 ${
                    currentConversationId === conversation.id
                      ? "text-chat-bot"
                      : "text-gray-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{conversation.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 text-gray-500"
                  title="Eliminar conversación"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
