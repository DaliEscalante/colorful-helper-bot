
import { MessageType } from "../context/ChatContext";
import { toast } from "sonner";

// This would typically come from an environment variable
// For this demo, the user will need to input their API key
let OPENAI_API_KEY: string | null = localStorage.getItem("openai_api_key");

export const setApiKey = (key: string) => {
  OPENAI_API_KEY = key;
  localStorage.setItem("openai_api_key", key);
};

export const getApiKey = () => {
  return OPENAI_API_KEY;
};

export const clearApiKey = () => {
  OPENAI_API_KEY = null;
  localStorage.removeItem("openai_api_key");
};

export const sendMessageToOpenAI = async (messages: MessageType[]): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error("API key not set");
  }

  // Convert our message format to OpenAI's format
  const openAIMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    // Add image URLs as attachments if present
    ...(msg.attachments && msg.attachments.length > 0
      ? {
          content: [
            { type: "text", text: msg.content },
            ...msg.attachments.map(url => ({
              type: "image_url",
              image_url: { url }
            }))
          ]
        }
      : {})
  }));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using GPT-4o for better image understanding
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error communicating with OpenAI API");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error);
    toast.error("Error conectando con OpenAI: " + (error as Error).message);
    throw error;
  }
};
