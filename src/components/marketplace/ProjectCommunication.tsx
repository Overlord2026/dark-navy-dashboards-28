
import React, { useState } from "react";
import { usePayment, Communication } from "@/context/PaymentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaperclipIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";

interface ProjectCommunicationProps {
  projectId: string;
}

export function ProjectCommunication({ projectId }: ProjectCommunicationProps) {
  const { communications, addCommunication } = usePayment();
  const { userProfile } = useUser();
  const [message, setMessage] = useState("");
  
  const projectCommunications = communications
    .filter(comm => comm.projectId === projectId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    addCommunication({
      id: "", // Will be generated in context
      projectId,
      senderId: userProfile.id,
      senderName: userProfile.displayName || "User",
      message: message.trim(),
      timestamp: "", // Will be set in context
      readStatus: false
    });
    
    setMessage("");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Project Communication</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4 max-h-[400px]">
          {projectCommunications.length > 0 ? (
            <div className="space-y-4">
              {projectCommunications.map((comm, index) => (
                <div key={comm.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(comm.senderName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{comm.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comm.timestamp), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{comm.message}</p>
                      {comm.attachments && comm.attachments.length > 0 && (
                        <div className="mt-2">
                          {comm.attachments.map((attachment, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-blue-500">
                              <PaperclipIcon className="h-3 w-3" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          )}
        </ScrollArea>
        
        <div className="mt-auto">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
