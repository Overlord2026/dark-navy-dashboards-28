import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Paperclip,
  Crown,
  Scale,
  Calculator,
  Shield
} from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'family' | 'advisor' | 'attorney' | 'accountant' | 'insurance_agent';
  content: string;
  timestamp: string;
  project_context?: {
    project_id: string;
    project_name: string;
    milestone?: string;
  };
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface MultiProfessionalMessagingProps {
  projectId?: string;
  projectName?: string;
  familyMembers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  professionals: Array<{
    id: string;
    name: string;
    type: 'advisor' | 'attorney' | 'accountant' | 'insurance_agent';
  }>;
}

export const MultiProfessionalMessaging: React.FC<MultiProfessionalMessagingProps> = ({
  projectId,
  projectName,
  familyMembers,
  professionals
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock messages for demo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        sender_id: 'family1',
        sender_name: 'John Smith',
        sender_type: 'family',
        content: 'Hi team, I just completed our SWAG™ retirement analysis. The results show we need to increase our savings rate by 15%. Sarah, could you review the investment allocation recommendations?',
        timestamp: '2024-01-15T10:30:00Z',
        project_context: {
          project_id: projectId || '1',
          project_name: projectName || 'Retirement Strategy',
          milestone: 'Analysis Review'
        }
      },
      {
        id: '2',
        sender_id: 'adv1',
        sender_name: 'Sarah Johnson',
        sender_type: 'advisor',
        content: 'Thanks for sharing the analysis, John! I reviewed the SWAG™ results and agree with the savings rate increase. I also noticed potential tax optimization opportunities. Mike, could you review the tax implications of the proposed portfolio changes?',
        timestamp: '2024-01-15T14:15:00Z',
        project_context: {
          project_id: projectId || '1', 
          project_name: projectName || 'Retirement Strategy'
        }
      },
      {
        id: '3',
        sender_id: 'cpa1',
        sender_name: 'Mike Chen',
        sender_type: 'accountant',
        content: 'Great points, Sarah. Based on the SWAG™ analysis, I recommend prioritizing Roth IRA conversions over the next 3 years while you\'re in a lower tax bracket. This aligns perfectly with the retirement timeline. I\'ll draft a tax optimization strategy document.',
        timestamp: '2024-01-15T16:45:00Z'
      }
    ];
    setMessages(mockMessages);
  }, [projectId, projectName]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        sender_id: 'current_user',
        sender_name: 'You',
        sender_type: 'family', // This would be determined based on current user context
        content: newMessage,
        timestamp: new Date().toISOString(),
        project_context: projectId ? {
          project_id: projectId,
          project_name: projectName || 'Project'
        } : undefined
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // In production, this would send to Supabase and trigger notifications
      console.log('Sending message to project team:', newMsg);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSenderIcon = (type: string) => {
    switch (type) {
      case 'advisor':
        return <Crown className="h-3 w-3 text-primary" />;
      case 'attorney':
        return <Scale className="h-3 w-3 text-purple-500" />;
      case 'accountant':
        return <Calculator className="h-3 w-3 text-green-500" />;
      case 'insurance_agent':
        return <Shield className="h-3 w-3 text-orange-500" />;
      default:
        return null;
    }
  };

  const getSenderBadgeColor = (type: string) => {
    switch (type) {
      case 'family':
        return 'bg-blue-100 text-blue-800';
      case 'advisor':
        return 'bg-primary/10 text-primary';
      case 'attorney':
        return 'bg-purple-100 text-purple-800';
      case 'accountant':
        return 'bg-green-100 text-green-800';
      case 'insurance_agent':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Team Communication
        </CardTitle>
        {projectName && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Project: {projectName}
            </Badge>
          </div>
        )}
      </CardHeader>
      
      {/* Messages */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.sender_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{message.sender_name}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getSenderBadgeColor(message.sender_type)}`}
                    >
                      <span className="flex items-center gap-1">
                        {getSenderIcon(message.sender_type)}
                        {message.sender_type.replace('_', ' ')}
                      </span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm bg-muted/30 rounded-lg p-3">
                    {message.content}
                  </div>
                  {message.project_context?.milestone && (
                    <Badge variant="outline" className="text-xs">
                      📍 {message.project_context.milestone}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Message Input */}
        <div className="p-6 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message to the team..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Team Members Preview */}
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              Team: {familyMembers.length} family members, {professionals.length} professionals
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};