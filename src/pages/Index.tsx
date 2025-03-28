
import React from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatInterface from "../components/ChatInterface";

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--chat-bot-rgb),0.03)_0,rgba(var(--chat-bot-rgb),0.03)_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
      
      {/* Animated background elements */}
      <div className="fixed top-0 right-0 w-[40%] h-[50%] bg-gradient-to-b from-purple-200/20 to-transparent rounded-full blur-3xl -z-5 animate-pulse-slow"></div>
      <div className="fixed bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-t from-pink-200/20 to-transparent rounded-full blur-3xl -z-5 animate-pulse-slow"></div>
      
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </main>
  );
};

export default Index;
