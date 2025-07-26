import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  User,
  MessageSquare,
  Search, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  MoreVertical,
  Circle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatPanelProps {
  onUnreadCountChange: (count: number) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderType: 'client' | 'professional';
  message: string;
  timestamp: string;
  read: boolean;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    type: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export function ChatPanel({ onUnreadCountChange }: ChatPanelProps) {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participant: {
        name: 'John Smith',
        type: 'CPA',
        avatar: '',
        status: 'online'
      },
      lastMessage: 'I have reviewed your tax documents and have some questions.',
      timestamp: '2024-01-26T10:30:00Z',
      unreadCount: 2,
      messages: [
        {
          id: '1',
          sender: 'John Smith',
          senderType: 'professional',
          message: 'Hi! I have reviewed your tax documents and have some questions.',
          timestamp: '2024-01-26T10:30:00Z',
          read: false
        },
        {
          id: '2',
          sender: 'John Smith',
          senderType: 'professional',
          message: 'Could you provide more details about the home office expenses?',
          timestamp: '2024-01-26T10:32:00Z',
          read: false
        }
      ]
    },
    {
      id: '2',
      participant: {
        name: 'Sarah Johnson',
        type: 'Attorney',
        avatar: '',
        status: 'away'
      },
      lastMessage: 'The estate planning documents are ready for your review.',
      timestamp: '2024-01-25T15:45:00Z',
      unreadCount: 0,
      messages: [
        {
          id: '3',
          sender: 'Sarah Johnson',
          senderType: 'professional',
          message: 'The estate planning documents are ready for your review.',
          timestamp: '2024-01-25T15:45:00Z',
          read: true
        }
      ]
    },
    {
      id: '3',
      participant: {
        name: 'Michael Chen',
        type: 'Financial Advisor',
        avatar: '',
        status: 'offline'
      },
      lastMessage: 'Your portfolio rebalancing is complete.',
      timestamp: '2024-01-24T09:15:00Z',
      unreadCount: 1,
      messages: [
        {
          id: '4',
          sender: 'Michael Chen',
          senderType: 'professional',
          message: 'Your portfolio rebalancing is complete. Please review the changes.',
          timestamp: '2024-01-24T09:15:00Z',
          read: false
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversations[0]?.id);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  useEffect(() => {
    onUnreadCountChange(totalUnreadCount);
  }, [totalUnreadCount, onUnreadCountChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Here you would send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversations</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback>
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Circle 
                        className={`absolute -bottom-1 -right-1 h-3 w-3 fill-current ${getStatusColor(conversation.participant.status)}`} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {conversation.participant.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {conversation.participant.type}
                          </Badge>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={currentConversation.participant.avatar} />
                      <AvatarFallback>
                        {currentConversation.participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Circle 
                      className={`absolute -bottom-1 -right-1 h-3 w-3 fill-current ${getStatusColor(currentConversation.participant.status)}`} 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{currentConversation.participant.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentConversation.participant.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-[350px] p-4">
                <div className="space-y-4">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === 'client' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderType === 'client'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}