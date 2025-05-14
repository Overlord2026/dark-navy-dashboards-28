
import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ChatMessage,
  useChatContext,
  generateResponse,
  generateId
} from "@/services/chatbotService";

interface EnhancedChatbotProps {
  onClose: () => void;
}

export const EnhancedChatbot: React.FC<EnhancedChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContext = useChatContext();
  
  // Set initial welcome message based on context
  useEffect(() => {
    try {
      const welcomeMessage = getWelcomeMessage(chatContext.currentSection);
      setMessages([{
        id: generateId(),
        content: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error setting welcome message:", error);
      setMessages([{
        id: generateId(),
        content: "Hello! I'm your Family Office assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [chatContext.currentSection]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isMinimized]);

  const getWelcomeMessage = (section?: string): string => {
    if (section === 'Integration Hub') {
      return "Welcome to the Integration Hub! I can help you connect external systems, manage API integrations, and set up plugins. What would you like to know about integrations?";
    }
    return "Hello! I'm your Family Office assistant. How can I help you today?";
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Get AI response with typing delay simulation
      setTimeout(async () => {
        try {
          const response = await generateResponse(input, chatContext, messages);
          
          const botMessage: ChatMessage = {
            id: generateId(),
            content: response,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
        } catch (error) {
          console.error("Error generating response:", error);
          toast({
            description: "Sorry, I had trouble responding. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsTyping(false);
        }
      }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
    } catch (error) {
      setIsTyping(false);
      console.error("Error in send message flow:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Quick reply suggestions based on context
  const quickReplies = useMemo(() => {
    try {
      if (chatContext.currentSection === 'Integration Hub') {
        return [
          "How do I connect a new project?",
          "What APIs are available?",
          "How do plugins work?"
        ];
      }
      return [
        "Tell me about Family Office",
        "What features are available?",
        "How do I get started?"
      ];
    } catch (error) {
      console.error("Error generating quick replies:", error);
      return [
        "Tell me about Family Office",
        "What features are available?",
        "How do I get started?"
      ];
    }
  }, [chatContext.currentSection]);

  return (
    <Card 
      className={`shadow-lg flex flex-col transition-all duration-300 ${
        isMinimized 
          ? "w-[300px] h-[50px]" 
          : "w-[380px] h-[500px]"
      }`}
    >
      <CardHeader 
        className="px-4 py-2 flex flex-row justify-between items-center cursor-pointer border-b"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/lovable-uploads/c99b3253-fc75-4097-ad44-9ef520280206.png" alt="Boutique Family Office" />
            <AvatarFallback>BFO</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-sm flex items-center">
              AI Assistant
              {chatContext.currentSection && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {chatContext.currentSection}
                </Badge>
              )}
            </CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isMinimized ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] px-3 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-3 py-2 rounded-lg bg-muted">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Quick replies */}
          {messages.length <= 2 && quickReplies.length > 0 && (
            <div className="px-4 py-2 flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setInput(reply);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full gap-2">
              <Input 
                placeholder="Type your message..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
