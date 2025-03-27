
import React, { createContext, useContext, useState, useEffect } from "react";
import { sendMessageToOpenAI } from "../utils/openai";
import { toast } from "sonner";

export type MessageType = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: string[]; // URLs or data URIs for images
};

export type ConversationType = {
  id: string;
  title: string;
  messages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
};

type ChatContextType = {
  conversations: ConversationType[];
  currentConversation: ConversationType | null;
  isLoading: boolean;
  sendMessage: (content: string, attachments?: string[]) => Promise<void>;
  startNewConversation: () => void;
  setCurrentConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const savedConversations = localStorage.getItem("chatConversations");
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        
        // Convert string dates back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        setConversations(conversationsWithDates);
        
        // Set the most recent conversation as current
        if (conversationsWithDates.length > 0) {
          setCurrentConversation(conversationsWithDates[0]);
        } else {
          // Create a new conversation if none exists
          createNewConversation();
        }
      } catch (error) {
        console.error("Error parsing conversations:", error);
        createNewConversation();
      }
    } else {
      createNewConversation();
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("chatConversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = (): ConversationType => {
    const newConversation: ConversationType = {
      id: generateId(),
      title: `Nueva conversación ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation;
  };

  const startNewConversation = () => {
    createNewConversation();
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If we're deleting the current conversation, select the first available one
    if (currentConversation?.id === conversationId) {
      const remainingConversations = conversations.filter(c => c.id !== conversationId);
      if (remainingConversations.length > 0) {
        setCurrentConversation(remainingConversations[0]);
      } else {
        createNewConversation();
      }
    }
  };

  const updateConversationTitle = (messages: MessageType[]) => {
    if (!currentConversation) return;
    
    // Update title based on first message if it's a new conversation with only 1 user message
    if (messages.length === 1 && messages[0].role === "user") {
      const userMessage = messages[0].content;
      const shortTitle = userMessage.length > 30 
        ? `${userMessage.substring(0, 30)}...` 
        : userMessage;
      
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation.id 
          ? { ...conv, title: shortTitle, updatedAt: new Date() } 
          : conv
      ));
      
      setCurrentConversation(prev => 
        prev ? { ...prev, title: shortTitle, updatedAt: new Date() } : null
      );
    }
  };

  const sendMessage = async (content: string, attachments: string[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    if (!currentConversation) return;

    // Create user message
    const userMessage: MessageType = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // Create pending assistant message
    const pendingAssistantMessage: MessageType = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    // Add both messages to conversation
    const updatedMessages = [...currentConversation.messages, userMessage, pendingAssistantMessage];
    
    // Update conversation
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: new Date(),
    };

    // Update state
    setCurrentConversation(updatedConversation);
    setConversations(prev =>
      prev.map(conv => (conv.id === updatedConversation.id ? updatedConversation : conv))
    );

    // Update title if this is the first message
    updateConversationTitle([...currentConversation.messages, userMessage]);

    try {
      // Set loading state
      setIsLoading(true);

      // Get AI response
      const aiResponse = await sendMessageToOpenAI(
        updatedMessages.filter(m => m.id !== pendingAssistantMessage.id)
      );

      // Replace pending message with actual response
      const finalMessages = updatedMessages.map(msg =>
        msg.id === pendingAssistantMessage.id
          ? {
              ...msg,
              content: aiResponse,
              timestamp: new Date(),
            }
          : msg
      );

      // Update conversation with final messages
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: new Date(),
      };

      // Update state
      setCurrentConversation(finalConversation);
      setConversations(prev =>
        prev.map(conv => (conv.id === finalConversation.id ? finalConversation : conv))
      );
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      toast.error("No se pudo enviar el mensaje. Intenta de nuevo.");
      
      // Remove the pending message on error
      const messagesWithoutPending = updatedMessages.filter(
        msg => msg.id !== pendingAssistantMessage.id
      );
      
      const conversationWithoutPending = {
        ...currentConversation,
        messages: messagesWithoutPending,
        updatedAt: new Date(),
      };
      
      setCurrentConversation(conversationWithoutPending);
      setConversations(prev =>
        prev.map(conv => 
          conv.id === conversationWithoutPending.id ? conversationWithoutPending : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    conversations,
    currentConversation,
    isLoading,
    sendMessage,
    startNewConversation,
    setCurrentConversation: selectConversation,
    deleteConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Helper function to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
