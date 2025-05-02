
import React, { useState, useRef, useEffect } from "react";
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
import { X, SendIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SupportChatbotProps {
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function SupportChatbot({ onClose }: SupportChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses: {[key: string]: string} = {
        'bill': "You can manage your bills in the Bill Pay section. Would you like a tutorial on setting up bill payments?",
        'payment': "To make a payment, navigate to the Bill Pay section and click \"New Payment\". You can also set up automatic payments for recurring bills.",
        'help': "I'm here to help! You can ask me about bill payments, account management, or any other features of our platform.",
        'contact': "You can contact our support team at service@awmfl.com or call us at (555) 123-4567 during business hours.",
        'security': "We take security seriously. All your data is encrypted and we use industry-standard security measures to protect your information.",
        'provider': "You can connect bill payment providers in the Advanced Bill Paying Providers section. We support BILL.com, Melio, Vic.ai, and Glean.ai."
      };
      
      let botResponse = "I'm not sure I understand. Could you rephrase your question or choose from common topics like bill payments, account security, or connecting payment providers?";
      
      // Check if any keywords match
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (input.toLowerCase().includes(keyword)) {
          botResponse = response;
          break;
        }
      }
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-[350px] h-[450px] shadow-lg flex flex-col">
      <CardHeader className="px-4 py-3 flex flex-row justify-between items-center">
        <CardTitle className="text-md flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src="/lovable-uploads/c99b3253-fc75-4097-ad44-9ef520280206.png" alt="Boutique Family Office" />
            <AvatarFallback>BFO</AvatarFallback>
          </Avatar>
          Support Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
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
      
      <CardFooter className="p-3 border-t">
        <div className="flex w-full gap-2">
          <Input 
            placeholder="Type your message..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
