import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  CheckCircle,
  X,
  Loader2,
  FileText,
  Clock
} from 'lucide-react';
import { AIAssistantMessage, OnboardingStepData } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  stepTitle: string;
  onboardingData: OnboardingStepData;
  whiteLabelConfig?: any;
  referralInfo?: any;
}

const STEP_CONTEXTS = {
  1: "Welcome and getting started",
  2: "Personal and household information",
  3: "Custodian and account selection", 
  4: "Document upload and verification",
  5: "Digital applications and e-signatures",
  6: "Task management and progress tracking",
  7: "Compliance and regulatory checks",
  8: "Completion and next steps"
};

const SAMPLE_RESPONSES = {
  greeting: "Hi! I'm Linda, your AI onboarding assistant. I'm here to help you through every step of your wealth management onboarding. What can I help you with today?",
  
  step2: "For the personal information step, I'll need details about you and any household members. This includes names, dates of birth, Social Security numbers, and contact information. All data is encrypted and secure.",
  
  step3: "When choosing a custodian, consider factors like fees, available investments, and technology platforms. Schwab and Fidelity are popular choices with robust digital platforms.",
  
  step4: "For document upload, you'll typically need recent investment statements, government-issued ID, and possibly tax returns. Our OCR technology will automatically extract key information to save you time.",
  
  step5: "Digital applications are pre-filled with your information. You'll use DocuSign or similar e-signature tools to complete the process securely.",
  
  stuck: "I notice you've been on this step for a while. Would you like me to connect you with a human advisor for personalized assistance?",
  
  compliance: "Our compliance checks include KYC (Know Your Customer), AML (Anti-Money Laundering), and OFAC screening. These are standard regulatory requirements to protect both you and our firm."
};

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  currentStep,
  stepTitle,
  onboardingData,
  whiteLabelConfig,
  referralInfo
}) => {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: SAMPLE_RESPONSES.greeting,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Proactive assistance based on step changes
  useEffect(() => {
    if (currentStep > 1) {
      const contextMessage = getStepContextMessage(currentStep);
      if (contextMessage) {
        addAssistantMessage(contextMessage);
      }
    }
  }, [currentStep]);

  const getStepContextMessage = (step: number): string | null => {
    const stepContext = STEP_CONTEXTS[step as keyof typeof STEP_CONTEXTS];
    
    switch (step) {
      case 2:
        return `Now you're on the ${stepContext} step. ${SAMPLE_RESPONSES.step2}`;
      case 3:
        return `Welcome to the ${stepContext} step! ${SAMPLE_RESPONSES.step3}`;
      case 4:
        return `Time for ${stepContext}! ${SAMPLE_RESPONSES.step4}`;
      case 5:
        return `Great progress! For ${stepContext}, here's what to expect: ${SAMPLE_RESPONSES.step5}`;
      case 7:
        return `We're now at the ${stepContext} stage. ${SAMPLE_RESPONSES.compliance}`;
      default:
        return null;
    }
  };

  const addAssistantMessage = (content: string, metadata?: any) => {
    const newMessage: AIAssistantMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      metadata: {
        stepContext: currentStep,
        ...metadata
      }
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: AIAssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
      metadata: {
        stepContext: currentStep
      }
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword matching for demo purposes
    if (lowerMessage.includes('stuck') || lowerMessage.includes('help') || lowerMessage.includes('confused')) {
      return SAMPLE_RESPONSES.stuck;
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
      return SAMPLE_RESPONSES.step4;
    }
    
    if (lowerMessage.includes('custodian') || lowerMessage.includes('schwab') || lowerMessage.includes('fidelity')) {
      return SAMPLE_RESPONSES.step3;
    }
    
    if (lowerMessage.includes('signature') || lowerMessage.includes('docusign') || lowerMessage.includes('sign')) {
      return SAMPLE_RESPONSES.step5;
    }
    
    if (lowerMessage.includes('compliance') || lowerMessage.includes('kyc') || lowerMessage.includes('aml')) {
      return SAMPLE_RESPONSES.compliance;
    }
    
    // Default helpful response
    return `I understand you're asking about "${userMessage}". Based on your current step (${STEP_CONTEXTS[currentStep as keyof typeof STEP_CONTEXTS]}), I can help guide you through the process. Would you like specific information about this step, or do you have a particular question?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(userMessage);
      addAssistantMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIndicators = () => {
    const indicators = [];
    
    // Step progress indicator
    indicators.push({
      icon: Clock,
      label: `Step ${currentStep} of 8`,
      variant: 'secondary' as const
    });
    
    // Document status
    if (onboardingData.documents?.uploaded?.length) {
      indicators.push({
        icon: FileText,
        label: `${onboardingData.documents.uploaded.length} docs uploaded`,
        variant: 'secondary' as const
      });
    }
    
    // Completion status
    if (currentStep === 8) {
      indicators.push({
        icon: CheckCircle,
        label: 'Nearly complete!',
        variant: 'default' as const
      });
    }
    
    return indicators;
  };

  return (
    <Card className="premium-card h-full max-h-[80vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Linda - AI Assistant</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {/* Status Indicators */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {getStatusIndicators().map((indicator, index) => (
            <Badge key={index} variant={indicator.variant} className="text-xs">
              <indicator.icon className="h-3 w-3 mr-1" />
              {indicator.label}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Messages */}
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald to-emerald/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="bg-muted text-foreground p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">Linda is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="mt-4 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Linda anything about your onboarding..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputValue("I'm stuck on this step, can you help?");
              setTimeout(handleSendMessage, 100);
            }}
            className="text-xs h-6 px-2"
          >
            I'm stuck
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputValue("What documents do I need?");
              setTimeout(handleSendMessage, 100);
            }}
            className="text-xs h-6 px-2"
          >
            Documents needed?
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputValue("Connect me with an advisor");
              setTimeout(handleSendMessage, 100);
            }}
            className="text-xs h-6 px-2"
          >
            Human help
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};