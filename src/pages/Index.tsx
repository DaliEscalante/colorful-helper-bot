
import React from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatInterface from "../components/ChatInterface";

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50/30 via-white/10 to-blue-50/30 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--chat-bot-rgb),0.05)_0,rgba(var(--chat-bot-rgb),0.05)_1px,transparent_1px)] bg-[size:18px_18px] -z-10"></div>
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </main>
  );
};

export default Index;
