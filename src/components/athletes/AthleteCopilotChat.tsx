import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, User, Bot, Shield, Heart, Phone } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AthleteCopilotChatProps {
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hi! I\'m your Athlete Wellbeing Copilot. I\'m here to support you with questions about mental health, career transition, and life after sports. Everything we discuss is confidential. How can I help you today?',
    timestamp: new Date()
  }
];

const quickPrompts = [
  'I\'m worried about retirement',
  'How do I handle family pressure?',
  'Feeling lost about my identity',
  'Need help with career transition',
  'Mental health resources',
  'Connect with a counselor'
];

const crisisResources = [
  {
    name: 'National Suicide Prevention Lifeline',
    contact: '988',
    available: '24/7'
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    available: '24/7'
  },
  {
    name: 'NFL Player Care Foundation',
    contact: '1-800-372-2000',
    available: '24/7'
  }
];

export function AthleteCopilotChat({ onClose }: AthleteCopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('retirement') || input.includes('ending') || input.includes('career over')) {
      setShowCrisisResources(true);
      return "Career transitions can feel overwhelming, and it's completely normal to feel uncertain. Many athletes experience identity shifts when leaving sports. Would you like me to connect you with a counselor who specializes in athlete transitions? In the meantime, remember that your value extends far beyond your athletic achievements.";
    }
    
    if (input.includes('depression') || input.includes('sad') || input.includes('hopeless')) {
      setShowCrisisResources(true);
      return "I'm concerned about how you're feeling. Depression is common among athletes, especially during transitions. You're not alone in this. Would you like me to connect you with professional mental health support? There are counselors who specialize in working with athletes and understand your unique challenges.";
    }
    
    if (input.includes('family') || input.includes('pressure') || input.includes('expectations')) {
      return "Family dynamics can be challenging when you're in the spotlight. It's important to set healthy boundaries while maintaining relationships. Many athletes find it helpful to have honest conversations about expectations and to work with a counselor on communication strategies. Would you like resources on setting boundaries with family?";
    }
    
    if (input.includes('identity') || input.includes('who am i') || input.includes('lost')) {
      return "Identity beyond athletics is something many professional athletes struggle with. You are so much more than your sport - you have unique skills, experiences, and qualities that extend far beyond the field. Exploring your interests, values, and passions outside of sports can help. Would you like to discuss some exercises for self-discovery?";
    }
    
    if (input.includes('counselor') || input.includes('therapist') || input.includes('help')) {
      return "I'd be happy to connect you with professional support. We work with counselors and therapists who specialize in athlete mental health and understand the unique challenges you face. Would you like me to arrange a confidential consultation? I can also provide you with crisis resources if you need immediate support.";
    }
    
    return "Thank you for sharing that with me. Your wellbeing is important, and I'm here to support you. Can you tell me more about what's on your mind? I can provide resources, coping strategies, or connect you with professional support if needed.";
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Athlete Wellbeing Copilot
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Confidential support for your mental health and wellbeing
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Crisis Resources Alert */}
          {showCrisisResources && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-800">Crisis Resources Available 24/7</h4>
                    <div className="space-y-1 text-sm">
                      {crisisResources.map((resource, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{resource.name}</span>
                          <Badge variant="outline" className="text-xs">{resource.contact}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Quick topics:</div>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage(newMessage)}
              disabled={!newMessage.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center">
            This copilot provides support and resources but is not a replacement for professional mental health care.
            If you're in crisis, please contact emergency services or the resources above.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}