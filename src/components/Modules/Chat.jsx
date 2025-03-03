// Frontend: src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { Send } from "lucide-react";
import { Toaster, toast } from "sonner";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const responseText = useRef("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      responseText.current = "";

      await axios.post('http://localhost:3001/api/chat-stream', { 
        message: input 
      }, {
        onDownloadProgress: (progressEvent) => {
          const chunk = progressEvent.event.target.responseText;
          
        
          const newContent = chunk.slice(responseText.current.length);
          responseText.current += newContent;

          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.content = responseText.current;
            }
            return newMessages;
          });
        }
      });
    } catch (error) {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(msg => msg.content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 bg-[#151515] text-white p-4">
      <div className="w-full">
        <div className="items-center pb-5 border-b border-gray-700">
          <h1 className="text-2xl font-bold">DentalAi</h1>
          <div className="text-gray-400 text-sm mt-1">Version 1.0.0</div>
        </div>

        <div className="h-[calc(100vh-200px)] overflow-y-auto py-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="bg-[#202123] rounded-full p-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-[#ff2c2c]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-medium">Hi, I'm DentalAI</h2>
              <p className="text-gray-400">How can I help you today?</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      message.role === "user"
                        ? "bg-[#6366f1] text-white"
                        : "bg-[#202123] text-white"
                    }`}
                >
                  {message.content}
                  {isLoading && index === messages.length - 1 && (
                    <span className=" inline-flex items-center">
                      <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"/>
                      <span className="text-sm ml-3 animate-pulse">Thinking...</span>
                    </span>
                  )}
                </div>

                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message DentalAi"
              className="flex-1 bg-[#202123] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ""}
              className="bg-[#000000] text-white hover:bg-[#ffffff] hover:text-black px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={20} className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <Toaster richColors visibleToasts={1} position="bottom-center" />
    </div>
  );
};

export default Chat;