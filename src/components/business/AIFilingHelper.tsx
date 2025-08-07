import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  ExternalLink,
  Lightbulb,
  Star,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    entityName?: string;
    actionRequired?: boolean;
    deadline?: string;
    urgency?: 'low' | 'medium' | 'high';
    suggestedActions?: string[];
    relatedLinks?: Array<{ label: string; url: string }>;
  };
}

const sampleResponses = {
  'texas franchise tax': {
    content: "Your Texas Franchise Tax for Family Investment Holdings LLC is due **May 15, 2024**. Here's what you need to know:\n\n**Amount Due:** Approximately $300 (based on revenue)\n**Filing Method:** Online through Texas Comptroller\n**Late Penalty:** 5% per month\n\n**Next Steps:**\n1. Gather your 2023 revenue information\n2. Log into Texas Comptroller portal\n3. Complete Form 05-163 (No Tax Due Report) or pay tax\n\n**Would you like me to:**\n- Set a reminder for May 10th?\n- Generate a draft reminder email?\n- Connect you with your CPA Sarah Johnson?",
    metadata: {
      entityName: 'Family Investment Holdings LLC',
      actionRequired: true,
      deadline: '2024-05-15',
      urgency: 'medium' as const,
      suggestedActions: [
        'Set reminder for May 10th',
        'Contact CPA Sarah Johnson',
        'Access Texas Comptroller portal'
      ],
      relatedLinks: [
        { label: 'Texas Comptroller Portal', url: 'https://comptroller.texas.gov' },
        { label: 'Form 05-163', url: '#' }
      ]
    }
  },
  'florida llc renewal': {
    content: "Florida LLC Annual Reports are due by **May 1st each year**. For Smith Family Trust LLC:\n\n**Filing Fee:** $138.75\n**Method:** Online through Florida Division of Corporations\n**Grace Period:** None - late fees apply immediately\n\n**Required Information:**\n- Current registered agent\n- Principal address\n- Manager/member information\n\n**Status:** ⚠️ Due in 45 days\n\nI'll automatically set a reminder for April 15th. Would you like me to pre-fill the form with your current information?",
    metadata: {
      entityName: 'Smith Family Trust LLC',
      actionRequired: true,
      deadline: '2024-05-01',
      urgency: 'high' as const,
      suggestedActions: [
        'Pre-fill annual report form',
        'Set April 15th reminder',
        'Update registered agent if needed'
      ]
    }
  },
  'operating agreement': {
    content: "I can help you create or update operating agreements! Here's what I recommend:\n\n**For Family Investment Holdings LLC:**\n- Multi-member LLC requires comprehensive agreement\n- Include buy-sell provisions\n- Define management structure\n- Tax elections and distributions\n\n**Key Sections to Include:**\n1. Capital contributions\n2. Profit/loss allocation\n3. Management duties\n4. Transfer restrictions\n5. Dissolution procedures\n\n**Template Available:** I can generate a custom template based on Delaware law. Would you like to start the Operating Agreement wizard?",
    metadata: {
      suggestedActions: [
        'Start Operating Agreement wizard',
        'Review existing agreement',
        'Schedule attorney consultation'
      ]
    }
  },
  'compliance calendar': {
    content: "Here's your upcoming compliance calendar:\n\n**Next 90 Days:**\n\n🔴 **High Priority:**\n- Family Investment Holdings LLC - Texas Franchise Tax (Due: May 15)\n- Property Management Corp - Annual Report (Due: April 30)\n\n🟡 **Medium Priority:**\n- Smith Family Trust - Quarterly distribution review (Due: June 30)\n- All entities - Q1 tax preparation (Due: April 15)\n\n✅ **Recently Completed:**\n- Delaware Annual Report filed (March 1)\n- EIN confirmation letters received (February 15)\n\n**Recommendations:**\n- Enable SMS alerts for deadlines\n- Sync with your calendar app\n- Assign tasks to advisors",
    metadata: {
      suggestedActions: [
        'Enable SMS alerts',
        'Sync with calendar',
        'Review all deadlines',
        'Assign advisor tasks'
      ]
    }
  }
};

const commonQuestions = [
  "When is my Texas franchise tax due?",
  "How do I renew my Florida LLC?",
  "What's required for annual reports?",
  "Help me update my operating agreement",
  "Show my compliance calendar",
  "Who is my registered agent?",
  "How do I change entity address?",
  "What are my filing deadlines?"
];

export const AIFilingHelper: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: "Hi! I'm your AI Filing Assistant. I can help you with compliance questions, deadlines, and filing requirements for all your entities. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (question: string): { content: string; metadata?: any } => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('texas') && lowerQuestion.includes('franchise')) {
      return sampleResponses['texas franchise tax'];
    } else if (lowerQuestion.includes('florida') && lowerQuestion.includes('llc')) {
      return sampleResponses['florida llc renewal'];
    } else if (lowerQuestion.includes('operating agreement')) {
      return sampleResponses['operating agreement'];
    } else if (lowerQuestion.includes('calendar') || lowerQuestion.includes('deadline')) {
      return sampleResponses['compliance calendar'];
    } else {
      return {
        content: `I understand you're asking about "${question}". Let me help you with that!\n\nBased on your entities, here are some relevant points:\n\n• **Family Investment Holdings LLC** - Delaware entity, next filing due March 2025\n• **Smith Family Trust** - Nevada trust, tax filing due April 15\n• **Property Management Corp** - Texas corporation, franchise tax due May 15\n\nFor specific guidance, I'd recommend:\n1. Checking your compliance calendar\n2. Consulting with your assigned advisors\n3. Reviewing your entity documents\n\nWould you like me to dive deeper into any of these areas?`,
        metadata: {
          suggestedActions: [
            'View compliance calendar',
            'Contact assigned advisor',
            'Review entity documents',
            'Schedule consultation'
          ]
        }
      };
    }
  };

  const sendMessage = async () => {
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

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: response.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Filing Helper
          <Badge variant="secondary" className="ml-auto">Beta</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about deadlines, filings, and compliance requirements
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Questions */}
        <div className="px-6 pb-4">
          <p className="text-sm font-medium mb-2">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {commonQuestions.slice(0, 4).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setInputValue(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {message.type === 'system' ? (
                        <Lightbulb className="h-4 w-4 text-primary" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <div 
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                      />
                      
                      {message.metadata && (
                        <div className="mt-3 space-y-2">
                          {message.metadata.urgency && (
                            <Badge className={getUrgencyColor(message.metadata.urgency)} variant="secondary">
                              {message.metadata.urgency === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              {message.metadata.urgency === 'medium' && <Clock className="h-3 w-3 mr-1" />}
                              {message.metadata.urgency === 'low' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {message.metadata.urgency.toUpperCase()} PRIORITY
                            </Badge>
                          )}
                          
                          {message.metadata.suggestedActions && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Suggested Actions:</p>
                              {message.metadata.suggestedActions.map((action: string, index: number) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs mr-2 mb-1"
                                  onClick={() => toast.success(`Action: ${action}`)}
                                >
                                  {action}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          {message.metadata.relatedLinks && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Related Links:</p>
                              {message.metadata.relatedLinks.map((link: any, index: number) => (
                                <a
                                  key={index}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3"
                                >
                                  {link.label}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type !== 'user' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about deadlines, filings, or compliance..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pro tip: Be specific about entity names and states for best results
          </p>
        </div>
      </CardContent>
    </Card>
  );
};