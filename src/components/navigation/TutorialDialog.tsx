
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Video, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: React.ReactNode;
}

export function TutorialDialog({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  videoUrl, 
  content 
}: TutorialDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Video className="h-5 w-5 mr-2" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="flex-1 my-4">
          {videoUrl && (
            <div className="aspect-video mb-4">
              <iframe 
                className="w-full h-full rounded-md border"
                src={videoUrl}
                title={`${title} Tutorial Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          
          {content}
        </ScrollArea>
        
        <DialogFooter className="border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {videoUrl && (
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              Download Resources
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
