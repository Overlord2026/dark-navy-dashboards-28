
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { BookOpen, Download, Check, Sparkles, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useTutorials } from "@/hooks/useTutorials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Resource {
  name: string;
  url: string;
}

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: React.ReactNode;
  resources?: Resource[];
  tabId: string;
}

export function TutorialDialog({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  videoUrl, 
  content,
  resources,
  tabId
}: TutorialDialogProps) {
  const { markTutorialViewed, getTutorialProgress } = useTutorials();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  
  // Track video progress
  const handleIframeLoad = (iframe: HTMLIFrameElement | null) => {
    if (!iframe || !iframe.contentWindow) return;
    
    // This will only work if the video source allows iframe communication
    // For YouTube, we'd need to use their Player API
    try {
      setIsVideoPlaying(true);
      markTutorialViewed(tabId);
    } catch (e) {
      console.error("Could not access iframe content:", e);
    }
  };
  
  // Get completion progress
  const progress = getTutorialProgress(tabId);
  
  // Handle dialog close
  const handleClose = () => {
    markTutorialViewed(tabId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader className="relative">
          <div className="absolute -left-2 -top-2 bg-[#9b87f5] p-1 rounded-full">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <DialogTitle className="text-xl flex items-center text-[#6E59A5]">
            <Avatar className="h-6 w-6 mr-2 border border-[#9b87f5]">
              <AvatarFallback className="bg-[#9b87f5] text-white text-xs">😊</AvatarFallback>
            </Avatar>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
          {progress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Tutorial progress</span>
                <span>{Math.round(progress)}% completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </DialogHeader>
        
        <ScrollArea className="flex-1 my-4">
          {videoUrl && (
            <div className="aspect-video mb-4 rounded-md overflow-hidden border border-[#E5DEFF]">
              <iframe 
                className="w-full h-full"
                src={videoUrl}
                title={`${title} Tutorial Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ref={handleIframeLoad}
                onLoad={(e) => handleIframeLoad(e.target as HTMLIFrameElement)}
              />
            </div>
          )}
          
          {content && (
            <div className="prose max-w-none dark:prose-invert">
              {content}
            </div>
          )}
          
          {resources && resources.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center text-[#6E59A5]">
                <BookOpen className="h-5 w-5 mr-2" />
                Related Resources
              </h3>
              <ul className="space-y-2">
                {resources.map((resource, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <List className="h-4 w-4 text-[#9b87f5]" />
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#6E59A5] hover:text-[#9b87f5] underline transition-colors"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="border-t pt-4 mt-4">
          <Button variant="outline" onClick={handleClose} className="gap-2">
            <Check className="h-4 w-4" />
            Mark as Completed
          </Button>
          {resources && resources.length > 0 && (
            <Button className="gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]">
              <Download className="h-4 w-4" />
              Download All Resources
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
