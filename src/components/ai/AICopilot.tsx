import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Mic,
  MicOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePersona } from '@/context/PersonaContext';
import { useEventTracking } from '@/hooks/useEventTracking';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AICopilotProps {
  context?: 'onboarding' | 'dashboard' | 'leads' | 'pipeline' | 'general';
  isOpen: boolean;
  onToggle: () => void;
}

export const AICopilot: React.FC<AICopilotProps> = ({
  context = 'general',
  isOpen,
  onToggle
}) => {
  const { currentPersona } = usePersona();
  const { trackFeatureUsed } = useEventTracking();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen, context, currentPersona]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = () => {
    const welcomeMessage = getWelcomeMessage();
    const initialMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: welcomeMessage.content,
      timestamp: new Date(),
      suggestions: welcomeMessage.suggestions
    };
    setMessages([initialMessage]);
  };

  const getWelcomeMessage = () => {
    const contextMessages = {
      onboarding: {
        content: `Hi! I'm your AI Copilot. I'm here to help you get the most out of your onboarding experience. What would you like to know?`,
        suggestions: ['How do I complete my profile?', 'What is SWAG Lead Score™?', 'How do I connect LinkedIn?']
      },
      dashboard: {
        content: `Welcome to your dashboard! I can help you navigate features, understand your metrics, or suggest next best actions. What can I help with?`,
        suggestions: ['Show me my top leads', 'How to improve my SWAG score?', 'What should I do next?']
      },
      leads: {
        content: `I can help you understand your leads, improve their scores, and suggest the best actions to convert them. What would you like to know?`,
        suggestions: ['How do I improve lead scores?', 'Which leads should I contact first?', 'How does SWAG scoring work?']
      },
      pipeline: {
        content: `Let me help you optimize your pipeline! I can suggest actions, identify bottlenecks, and recommend improvements. What's your focus?`,
        suggestions: ['Analyze my conversion rates', 'What leads need attention?', 'How to move deals forward?']
      },
      general: {
        content: `Hi! I'm your AI assistant for the Family Office Marketplace™. I can help with features, best practices, and growing your business. How can I help?`,
        suggestions: ['Platform tour', 'Best practices for my role', 'How to get more referrals?']
      }
    };

    const personaContext = {
      advisor: 'As an advisor, I can help with client acquisition, portfolio insights, and compliance best practices.',
      attorney: 'As an attorney, I can assist with document management, client collaboration, and secure workflows.',
      accountant: 'As a CPA, I can help with tax workflows, RIA integrations, and client partnerships.',
      coach: 'As a coach, I can help with workshop creation, impact tracking, and building your brand.',
      consultant: 'As a consultant, I can assist with showcasing expertise and expanding your network.',
      compliance: 'As a compliance professional, I can help with audit trails, firm-wide tracking, and regulatory updates.',
      client: 'I can help you find the right advisors, understand your options, and make informed decisions.'
    };

    const baseMessage = contextMessages[context];
    const roleContext = personaContext[currentPersona] || personaContext.client;
    
    return {
      content: `${baseMessage.content}\n\n${roleContext}`,
      suggestions: baseMessage.suggestions
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    trackFeatureUsed('ai_copilot_message', { context, persona: currentPersona });

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const response = generateAIResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string): { content: string; suggestions: string[] } => {
    const input = userInput.toLowerCase();
    
    // SWAG-related responses
    if (input.includes('swag') || input.includes('score')) {
      return {
        content: `SWAG Lead Score™ is our AI-powered 0-100 scoring system that helps you identify your highest-value prospects. It considers profile completeness, verified accounts, engagement history, and source quality. Higher scores (80+) indicate leads most likely to convert!`,
        suggestions: ['How to improve lead scores?', 'What makes a Gold tier lead?', 'Connect Plaid for verification']
      };
    }
    
    // Profile/LinkedIn responses
    if (input.includes('profile') || input.includes('linkedin')) {
      return {
        content: `Connecting your LinkedIn profile auto-fills your professional information and increases your credibility with prospects. It also unlocks premium features like verified badges and priority matching. Would you like help setting this up?`,
        suggestions: ['Connect LinkedIn now', 'Manual profile setup', 'Why verification matters?']
      };
    }
    
    // Next steps/actions
    if (input.includes('next') || input.includes('what should') || input.includes('action')) {
      const actions = {
        advisor: 'Focus on completing your profile, reviewing your SWAG leads, and setting up your availability calendar.',
        attorney: 'Set up your document vault, review client referrals, and configure your secure collaboration settings.',
        accountant: 'Configure your tax workflows, connect with RIA partners, and review prospect pipeline.',
        coach: 'Create your first workshop, build your branded profile, and explore networking opportunities.',
        consultant: 'Showcase your expertise, browse partnership opportunities, and optimize your profile visibility.',
        compliance: 'Set up your compliance dashboard, run a mock audit, and configure firm-wide tracking.',
        client: 'Complete your wealth questionnaire, review matched advisors, and schedule consultations.'
      };
      
      return {
        content: actions[currentPersona] || actions.client,
        suggestions: ['Show me my dashboard', 'Help with setup', 'Schedule a tour']
      };
    }
    
    // Default helpful response
    return {
      content: `I'd be happy to help! As your AI Copilot, I can assist with platform features, best practices for ${currentPersona}s, lead management, and growth strategies. What specific area would you like to explore?`,
      suggestions: ['Platform overview', 'Best practices', 'Feature walkthrough', 'Contact support']
    };
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      // Stop voice recognition
    } else {
      setIsListening(true);
      // Start voice recognition
      // This would integrate with Web Speech API
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          AI Copilot
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-80 h-96"
    >
      <Card className="h-full flex flex-col shadow-xl border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">AI Copilot</div>
              <div className="text-xs opacity-90">Always here to help</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full text-left text-xs px-2 py-1 bg-muted/50 hover:bg-muted rounded border border-border/50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={toggleVoiceInput}
              variant="outline"
              size="sm"
              className={`p-2 ${isListening ? 'bg-red-500 text-white' : ''}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};