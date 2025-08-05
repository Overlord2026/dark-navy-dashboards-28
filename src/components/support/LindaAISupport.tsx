import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Minimize2, 
  X, 
  Bot, 
  User, 
  AlertCircle, 
  Clock,
  CheckCircle,
  Headphones
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "linda" | "escalation";
  content: string;
  timestamp: Date;
  urgent?: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "escalated";
  assignee?: string;
}

export function LindaAISupport() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "linda",
      content: "Hi! I'm Linda, your AI assistant. I'm here 24/7 to help with any questions about the Family Office Platform™. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [needsEscalation, setNeedsEscalation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supportStats = {
    responseTime: "< 30 seconds",
    resolutionRate: "94%",
    satisfaction: "4.8/5",
    availability: "24/7"
  };

  const commonTopics = [
    "Account Setup",
    "Legacy Vault Access",
    "SWAG Score Questions", 
    "Payment Issues",
    "Technical Support",
    "Feature Requests"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate Linda's response
    setTimeout(() => {
      const isUrgent = inputValue.toLowerCase().includes('urgent') || 
                     inputValue.toLowerCase().includes('emergency') ||
                     inputValue.toLowerCase().includes('down') ||
                     inputValue.toLowerCase().includes('broken');

      let response = "";
      
      if (inputValue.toLowerCase().includes('legacy vault')) {
        response = "I can help you with Legacy Vault questions! The Family Legacy Vault™ is our secure, multi-generational document storage system. Are you looking to set up your vault, add family members, or create an AI Avatar?";
      } else if (inputValue.toLowerCase().includes('swag score')) {
        response = "Great question about the SWAG Score™! This is our Strategic Wealth Alpha GPS system that scores leads from 0-100 based on engagement, budget, timeline, and fit. Would you like me to explain how it works or help you interpret a specific score?";
      } else if (inputValue.toLowerCase().includes('payment') || inputValue.toLowerCase().includes('billing')) {
        response = "I can help with billing questions! For payment issues, I can check your account status and recent transactions. However, for sensitive financial matters, I may need to connect you with our billing specialist. What specific payment issue are you experiencing?";
      } else if (isUrgent) {
        response = "I understand this is urgent. Let me escalate this to our live support team immediately. In the meantime, can you provide more details about the issue so our specialists can assist you faster?";
        setNeedsEscalation(true);
      } else {
        response = "Thanks for your question! I'm analyzing your request and checking our knowledge base. Can you provide a bit more detail about what you're trying to accomplish?";
      }

      const lindaMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: isUrgent ? "escalation" : "linda",
        content: response,
        timestamp: new Date(),
        urgent: isUrgent
      };

      setMessages(prev => [...prev, lindaMessage]);
      setIsTyping(false);

      if (isUrgent) {
        toast({
          title: "Escalated to Human Support",
          description: "A specialist will join the conversation shortly.",
          variant: "default"
        });
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTopicClick = (topic: string) => {
    setInputValue(`I need help with ${topic}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        <Badge className="absolute -top-2 -left-2 bg-green-500 text-white text-xs">
          Linda AI
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">Linda AI Support</CardTitle>
              <div className="flex items-center gap-1 text-xs text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Online • Avg response: 30s
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {needsEscalation && (
              <div className="p-3 bg-orange-50 border-b border-orange-200">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Escalated to human support</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  A specialist will join this conversation within 2 minutes
                </p>
              </div>
            )}

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type !== 'user' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                        message.type === 'escalation' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {message.type === 'escalation' ? (
                          <Headphones className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.urgent
                          ? 'bg-orange-50 text-orange-900 border border-orange-200'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {messages.length === 1 && (
              <div className="p-4 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground mb-3">Quick topics:</p>
                <div className="grid grid-cols-2 gap-2">
                  {commonTopics.map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTopicClick(topic)}
                      className="text-xs h-8 justify-start"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}