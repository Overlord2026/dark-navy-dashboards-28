
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { EnhancedChatbot } from "./EnhancedChatbot";
import { useAuth } from "@/context/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ChatbotManager() {
  const [showChatbot, setShowChatbot] = useState(false);
  const { isAuthenticated } = useAuth();
  const [hasBeenGreeted, setHasBeenGreeted] = useState(false);
  const [messageCount, setMessageCount] = useLocalStorage('chatbot-message-count', 0);
  
  // Only show the chatbot for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  // Auto-open the chatbot after a delay when on the integration page
  // and user hasn't been greeted yet in this session
  useEffect(() => {
    if (window.location.pathname === '/integration' && !hasBeenGreeted) {
      const timer = setTimeout(() => {
        setShowChatbot(true);
        setHasBeenGreeted(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasBeenGreeted]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {showChatbot && (
        <EnhancedChatbot onClose={() => setShowChatbot(false)} />
      )}
      
      <Button 
        onClick={() => {
          setShowChatbot(true);
          setMessageCount(prev => prev + 1);
        }}
        variant="default"
        size="sm"
        className="shadow-md ml-auto"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        AI Assistant
        {messageCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messageCount > 9 ? '9+' : messageCount}
          </span>
        )}
      </Button>
    </div>
  );
}
