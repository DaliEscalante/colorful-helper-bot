
import React from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatInterface from "../components/ChatInterface";

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </main>
  );
};

export default Index;
