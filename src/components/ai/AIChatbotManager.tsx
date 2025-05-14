
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { AIChatbot } from "./AIChatbot";
import { useAuth } from "@/context/AuthContext";

export function AIChatbotManager() {
  const [showChatbot, setShowChatbot] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Only show the chatbot for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      )}
      
      <Button 
        onClick={() => setShowChatbot(true)}
        variant="default"
        size="sm"
        className="shadow-md ml-auto"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        AI Assistant
      </Button>
    </div>
  );
}
