import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { api, type UserProfile, type ChatMessage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  userProfile: UserProfile | null;
}

export default function ChatInterface({ userProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm here to help with your creative journey. What would you like to explore today? 🎨",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (message: string) => api.sendChatMessage(message, userProfile || undefined),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString()
      }]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again! 😊",
        timestamp: new Date().toISOString()
      }]);
      toast({
        title: "Connection error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    chatMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll bg-gray-50 rounded-xl border border-gray-100">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex chat-message ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
              message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user" 
                  ? "bg-gray-300"
                  : "bg-domestika-red"
              }`}>
                {message.role === "user" ? (
                  <User className="text-gray-600" size={16} />
                ) : (
                  <Bot className="text-white" size={16} />
                )}
              </div>
              <div className={`px-4 py-2 rounded-2xl ${
                message.role === "user" 
                  ? "bg-domestika-red text-white rounded-tr-sm"
                  : "bg-white text-gray-900 rounded-tl-sm shadow-sm"
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-domestika-red rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your creative journey..."
            className="flex-1 border-gray-300 rounded-xl focus:border-domestika-red transition-colors"
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={sendMessage}
            disabled={chatMutation.isPending || !input.trim()}
            className="bg-domestika-red text-white rounded-xl hover:bg-domestika-red hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
