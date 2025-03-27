
import React from "react";
import { ChatProvider } from "../context/ChatContext";
import ChatInterface from "../components/ChatInterface";

const Index: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    </main>
  );
};

export default Index;
