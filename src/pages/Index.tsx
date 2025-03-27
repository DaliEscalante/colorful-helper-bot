
import React from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatInterface from "../components/ChatInterface";

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--chat-bot-rgb),0.03)_0,rgba(var(--chat-bot-rgb),0.03)_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </main>
  );
};

export default Index;
