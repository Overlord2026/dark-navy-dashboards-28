
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
import { X, MessageSquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";

interface AIChatbotProps {
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function AIChatbot({ onClose }: AIChatbotProps) {
  const { userProfile } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Boutique Family Office assistant. How can I help you today?",
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
      const botResponses: Record<string, string> = {
        'investment': "Our investment services include portfolio management, asset allocation strategies, alternative investments, and ESG investing options. Would you like to learn more about any specific investment area?",
        'estate': "Our estate planning services help protect your family's wealth for future generations. We offer trust creation, will preparation, succession planning, and legacy preservation strategies.",
        'tax': "Our tax planning services include tax-efficient investment strategies, year-round tax planning, and coordination with your CPA. We help minimize tax burdens while ensuring compliance.",
        'vault': "The Secure Family Vault is our digital document storage system. It provides encrypted storage for all your important documents like wills, trusts, healthcare directives, and insurance policies.",
        'education': "Our education center offers courses, guides, whitepapers, books, and planning examples to help you understand wealth management concepts and make informed decisions.",
        'advisor': "We can connect you with a dedicated advisor who will help create a personalized financial strategy. Would you like to schedule a consultation?",
        'integration': "Our Family Office Marketplace integrates with various financial systems and platforms. You can connect your existing tools through our Integration Hub.",
        'account': "You can manage your accounts in the Accounts section. This includes viewing balances, transactions, and setting up funding or transfers.",
        'subscription': "We offer various subscription tiers to meet different wealth management needs. Each tier provides access to different features and services.",
        'help': "I'm here to help! You can ask me about our services, platform features, or how to perform specific tasks within the Boutique Family Office platform."
      };
      
      // Generic responses for common questions
      const fallbackResponses = [
        "The Boutique Family Office platform provides comprehensive wealth management services including investment management, estate planning, tax optimization, and secure document storage.",
        "Our platform is designed to give you a complete view of your financial picture while providing the tools and expertise needed to grow and protect your wealth.",
        "I can help answer questions about our platform features, services offered, and how to navigate the interface. What specific area are you interested in?",
        "The Family Office Marketplace allows you to integrate various financial services and tools into one cohesive ecosystem for managing your wealth."
      ];
      
      let botResponse = "";
      
      // Check if any keywords match
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (input.toLowerCase().includes(keyword)) {
          botResponse = response;
          break;
        }
      }
      
      // If no specific keywords matched, use a fallback response
      if (!botResponse) {
        botResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
          Family Office Assistant
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
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
