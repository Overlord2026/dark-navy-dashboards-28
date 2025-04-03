
import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorials } from "@/hooks/useTutorials";
import { TutorialDialog } from "./TutorialDialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TutorialButtonProps {
  tabId: string;
  className?: string;
  variant?: "default" | "link" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
  showNewBadge?: boolean;
}

export function TutorialButton({ 
  tabId, 
  className,
  variant = "ghost",
  size = "icon",
  showNewBadge = false
}: TutorialButtonProps) {
  const { activeTutorial, openTutorial, closeTutorial, isTutorialViewed } = useTutorials();
  const [isNew, setIsNew] = useState(showNewBadge || !isTutorialViewed(tabId));
  
  // Reset new status after it's been viewed
  useEffect(() => {
    if (activeTutorial?.tabId === tabId) {
      setIsNew(false);
    }
  }, [activeTutorial, tabId]);

  return (
    <>
      <Button
        variant={isNew ? "default" : variant}
        size={size}
        className={cn(
          "relative transition-all flex overflow-hidden", 
          isNew ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : "",
          className
        )}
        onClick={() => openTutorial(tabId)}
        title="View Tutorial"
      >
        {isNew && (
          <span className="absolute -top-1 -right-1">
            <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-[#6E59A5]">
              <Sparkles className="h-3 w-3" />
            </Badge>
          </span>
        )}
        
        {/* Image of a woman that fills the left side */}
        <div className={cn(
          "flex items-center justify-center overflow-hidden", 
          size === "icon" ? "h-full w-full" : "h-full mr-2",
          isNew ? "bg-[#9b87f5]" : "bg-[#9b87f5]"
        )}>
          <img 
            src="/placeholder.svg" 
            alt="Tutorial guide" 
            className={cn(
              "object-cover",
              size === "icon" ? "h-full w-full" : "h-full aspect-square"
            )} 
          />
        </div>
        
        {size !== "icon" && (
          <span className={cn("flex-grow text-center", isNew && "text-white")}>
            {isNew ? "New Tutorial" : "Tutorial"}
          </span>
        )}
      </Button>
      
      {activeTutorial && activeTutorial.tabId === tabId && (
        <TutorialDialog
          isOpen={!!activeTutorial}
          onClose={closeTutorial}
          title={activeTutorial.title}
          description={activeTutorial.description}
          videoUrl={activeTutorial.videoUrl}
          content={activeTutorial.content}
          resources={activeTutorial.resources}
          tabId={activeTutorial.tabId}
        />
      )}
    </>
  );
}
