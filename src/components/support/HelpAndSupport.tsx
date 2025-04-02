
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { HelpAndTutorialsDialog } from "./HelpAndTutorialsDialog";
import { SupportChatbot } from "./SupportChatbot";

export function HelpAndSupport() {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {showChatbot && (
        <SupportChatbot onClose={() => setShowChatbot(false)} />
      )}
      
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowHelpDialog(true)}
          variant="outline"
          size="sm"
          className="shadow-md bg-white hover:bg-gray-100"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Tutorials
        </Button>
        
        <Button 
          onClick={() => setShowChatbot(true)}
          variant="primary"
          size="sm"
          className="shadow-md"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat Support
        </Button>
      </div>

      <HelpAndTutorialsDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        onChatWithSupport={() => {
          setShowHelpDialog(false);
          setShowChatbot(true);
        }}
      />
    </div>
  );
}
