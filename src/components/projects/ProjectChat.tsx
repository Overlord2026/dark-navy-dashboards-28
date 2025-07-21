import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Pin, 
  Reply,
  MessageCircle,
  Clock,
  Users,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectCommunications, ProjectCommunication } from "@/hooks/useProjects";

interface ProjectChatProps {
  projectId: string;
  projectName: string;
  teamMembers?: any[];
}

export function ProjectChat({ projectId, projectName, teamMembers = [] }: ProjectChatProps) {
  const { communications, loading, saving, createCommunication } = useProjectCommunications(projectId);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<ProjectCommunication | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [communications]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await createCommunication({
      type: 'message',
      content: newMessage,
      parent_id: replyingTo?.id,
      participants: teamMembers.map(m => m.id),
    });

    setNewMessage("");
    setReplyingTo(null);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const groupMessagesByDate = (messages: ProjectCommunication[]) => {
    const groups: { [key: string]: ProjectCommunication[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const renderDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let displayText;
    if (date.toDateString() === today.toDateString()) {
      displayText = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      displayText = 'Yesterday';
    } else {
      displayText = date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    return (
      <div className="flex items-center gap-4 my-4">
        <Separator className="flex-1" />
        <Badge variant="outline" className="text-xs">
          {displayText}
        </Badge>
        <Separator className="flex-1" />
      </div>
    );
  };

  const MessageBubble = ({ message }: { message: ProjectCommunication }) => {
    const isCurrentUser = true; // TODO: Implement actual user check
    const isReply = message.parent_id;
    
    return (
      <div className={cn(
        "flex gap-3 group hover:bg-muted/20 p-2 rounded-lg transition-colors",
        isReply && "ml-8 border-l-2 border-muted pl-4"
      )}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">
            {/* TODO: Get actual user initials */}
            YU
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">You</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </span>
            {message.is_pinned && (
              <Pin className="h-3 w-3 text-primary" />
            )}
          </div>
          
          {message.subject && (
            <div className="text-sm font-medium text-primary">
              {message.subject}
            </div>
          )}
          
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
          
          {message.type !== 'message' && (
            <Badge variant="outline" className="text-xs">
              {message.type}
            </Badge>
          )}
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => setReplyingTo(message)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Pin className="h-3 w-3 mr-1" />
              Pin
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const groupedMessages = groupMessagesByDate(communications);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <CardTitle>Project Chat</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{projectName} Chat</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''}
                {communications.length > 0 && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    {communications.length} message{communications.length !== 1 ? 's' : ''}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Send your first message to get this project chat started. 
                Team members will be notified about new messages.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(groupedMessages)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([dateStr, messages]) => (
                  <div key={dateStr}>
                    {renderDateSeparator(dateStr)}
                    {messages
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map(message => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>

        {/* Reply Indicator */}
        {replyingTo && (
          <div className="px-6">
            <div className="bg-muted p-3 rounded-lg border-l-4 border-primary">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Replying to:</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0"
                  onClick={() => setReplyingTo(null)}
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {replyingTo.content}
              </p>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-2">
            <div className="flex-1 min-w-0">
              <Textarea
                ref={inputRef}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[40px] max-h-32 resize-none"
                rows={1}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="px-3">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || saving}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </CardContent>
    </Card>
  );
}