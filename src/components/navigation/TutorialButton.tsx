
import React from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorials } from "@/hooks/useTutorials";
import { TutorialDialog } from "./TutorialDialog";
import { cn } from "@/lib/utils";

interface TutorialButtonProps {
  tabId: string;
  className?: string;
  variant?: "default" | "link" | "ghost";
  size?: "default" | "sm" | "icon";
}

export function TutorialButton({ 
  tabId, 
  className,
  variant = "ghost",
  size = "icon" 
}: TutorialButtonProps) {
  const { activeTutorial, openTutorial, closeTutorial } = useTutorials();
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn("relative", className)}
        onClick={() => openTutorial(tabId)}
        title="View Tutorial"
      >
        <Video className="h-4 w-4" />
        {size !== "icon" && <span className="ml-2">Tutorial</span>}
      </Button>
      
      {activeTutorial && (
        <TutorialDialog
          isOpen={!!activeTutorial}
          onClose={closeTutorial}
          title={activeTutorial.title}
          description={activeTutorial.description}
          videoUrl={activeTutorial.videoUrl}
          content={activeTutorial.content}
        />
      )}
    </>
  );
}
