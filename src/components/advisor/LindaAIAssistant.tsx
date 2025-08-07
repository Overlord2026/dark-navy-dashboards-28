import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Minimize2, 
  Maximize2, 
  X, 
  Bot,
  User,
  Sparkles,
  Phone,
  Users,
  Target,
  Shield,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  category?: 'onboarding' | 'compliance' | 'technical' | 'best-practices';
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
  action: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Setup Communications',
    icon: Phone,
    description: 'Configure SMS & VoIP with Twilio',
    category: 'onboarding',
    action: 'setup_communications'
  },
  {
    label: 'Invite First Client',
    icon: Users,
    description: 'Send branded client invitation',
    category: 'onboarding',
    action: 'invite_client'
  },
  {
    label: 'Create Lead Campaign',
    icon: Target,
    description: 'Setup SWAG lead scoring',
    category: 'onboarding',
    action: 'create_campaign'
  },
  {
    label: 'Compliance Setup',
    icon: Shield,
    description: 'Configure compliance settings',
    category: 'compliance',
    action: 'compliance_setup'
  },
  {
    label: 'Customize Branding',
    icon: Settings,
    description: 'Setup your white-label branding',
    category: 'onboarding',
    action: 'customize_branding'
  }
];

const defaultMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: "Hello! I'm Linda, your AI assistant for the Boutique Family Office™ platform. I'm here to help you with onboarding, tutorials, compliance questions, and troubleshooting. How can I assist you today?",
    timestamp: new Date(),
    category: 'onboarding',
    actions: [
      { label: 'Start Onboarding Tour', action: 'onboarding_tour' },
      { label: 'View Quick Actions', action: 'quick_actions' }
    ]
  }
];

interface LindaAIAssistantProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
  className?: string;
}

export const LindaAIAssistant: React.FC<LindaAIAssistantProps> = ({
  isMinimized = false,
  onToggleMinimize,
  onClose,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantResponse = generateResponse(inputValue);
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    
    let response = "I understand you're asking about that. Let me help you with the specific steps and best practices.";
    let category: Message['category'] = 'technical';
    let actions: Message['actions'] = [];

    if (lowerInput.includes('communication') || lowerInput.includes('sms') || lowerInput.includes('phone')) {
      response = "To set up your communications system:\n\n1. Click 'Activate Communications' in your dashboard\n2. Choose to port your existing number or select a new one\n3. Complete the Twilio verification process\n4. Test your SMS and VoIP functionality\n\nAll communications will be automatically archived for compliance. Would you like me to guide you through this process?";
      category = 'onboarding';
      actions = [
        { label: 'Start Communication Setup', action: 'setup_communications' },
        { label: 'View Compliance Guide', action: 'compliance_guide' }
      ];
    } else if (lowerInput.includes('client') || lowerInput.includes('invite') || lowerInput.includes('onboard')) {
      response = "For client onboarding:\n\n1. Go to 'Client Management' > 'Invite New Client'\n2. Enter their email and customize the invitation\n3. Choose your branding template\n4. Send the magic link invitation\n5. Track progress in your dashboard\n\nClients will be automatically linked to your advisor profile. Want me to show you the invitation customization options?";
      category = 'onboarding';
      actions = [
        { label: 'Create Client Invitation', action: 'invite_client' },
        { label: 'Customize Templates', action: 'customize_templates' }
      ];
    } else if (lowerInput.includes('lead') || lowerInput.includes('swag') || lowerInput.includes('campaign')) {
      response = "The SWAG Lead Score™ system helps you prioritize prospects:\n\n1. Set up your lead scoring criteria\n2. Import or manually add prospects\n3. Create automated nurture campaigns\n4. Track engagement and conversion\n\nThe system scores leads based on AUM potential, engagement level, and referral source quality. Ready to set up your first campaign?";
      category = 'onboarding';
      actions = [
        { label: 'Setup Lead Scoring', action: 'setup_lead_scoring' },
        { label: 'Create Campaign', action: 'create_campaign' }
      ];
    } else if (lowerInput.includes('compliance') || lowerInput.includes('record') || lowerInput.includes('audit')) {
      response = "Compliance features include:\n\n• Automatic call and SMS recording\n• Encrypted storage with audit trails\n• Role-based access controls\n• Regulatory reporting tools\n• Data retention policies\n\nAll communications are archived according to SEC/FINRA requirements. Would you like to review your compliance settings?";
      category = 'compliance';
      actions = [
        { label: 'Review Compliance Settings', action: 'compliance_settings' },
        { label: 'View Audit Logs', action: 'audit_logs' }
      ];
    } else if (lowerInput.includes('document') || lowerInput.includes('vault') || lowerInput.includes('storage')) {
      response = "Your secure document vault provides:\n\n• Bank-level 256-bit encryption\n• Automated document categorization\n• eSignature workflows\n• Client sharing portals\n• Version control and audit trails\n\nYou can upload documents via drag-and-drop or integrate with existing systems. Need help organizing your document categories?";
      category = 'onboarding';
      actions = [
        { label: 'Setup Document Categories', action: 'setup_documents' },
        { label: 'Configure eSignature', action: 'setup_esignature' }
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      category,
      actions
    };
  };

  const handleQuickAction = (action: string) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Help me with: ${quickActions.find(qa => qa.action === action)?.label}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    setShowQuickActions(false);

    // Generate response for the action
    setTimeout(() => {
      const response = generateResponse(actionMessage.content);
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <Button
          onClick={onToggleMinimize}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed bottom-4 right-4 w-96 h-[600px] z-50 ${className}`}
    >
      <Card className="h-full flex flex-col shadow-xl border-2">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/20">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Linda AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Your BFO™ Helper</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowQuickActions(!showQuickActions)}>
                <Sparkles className="h-4 w-4" />
              </Button>
              {onToggleMinimize && (
                <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Actions */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b bg-muted/30 p-3"
              >
                <p className="text-xs font-medium mb-2">Quick Actions:</p>
                <div className="grid grid-cols-1 gap-1">
                  {quickActions.slice(0, 3).map((action) => (
                    <Button
                      key={action.action}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="justify-start h-auto p-2"
                    >
                      <action.icon className="h-3 w-3 mr-2" />
                      <div className="text-left">
                        <div className="text-xs font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-primary/20' 
                        : 'bg-accent/20'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {message.type === 'user' ? 'You' : 'Linda'}
                    </span>
                    {message.category && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 text-sm whitespace-pre-line ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleQuickAction(action.action)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted rounded-lg p-3 flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Linda is typing...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t p-3">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Linda anything..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};