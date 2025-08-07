import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Phone, 
  MessageSquare, 
  Voicemail, 
  PhoneCall, 
  Send, 
  Search,
  Settings,
  Archive,
  Star,
  MoreVertical
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'sms' | 'call' | 'voicemail';
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  status: 'unread' | 'read' | 'archived';
  duration?: number;
  recordingUrl?: string;
}

interface CommunicationsDashboardProps {
  persona: 'advisor' | 'attorney' | 'cpa' | 'client';
}

export function CommunicationsDashboard({ persona }: CommunicationsDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhoneNumber();
    fetchMessages();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data } = await supabase
        .from('twilio_phone_numbers')
        .select('phone_number')
        .eq('advisor_id', user.user.id)
        .eq('status', 'active')
        .single();

      setPhoneNumber(data?.phone_number || null);
    } catch (error) {
      console.error('Error fetching phone number:', error);
    }
  };

  const fetchMessages = async () => {
    // Mock data for now - would fetch from call_logs and message tables
    const mockMessages: Message[] = [
      {
        id: '1',
        type: 'sms',
        from: '+1234567890',
        to: '+1987654321',
        content: 'Hi, I wanted to schedule a consultation about my portfolio.',
        timestamp: new Date(Date.now() - 3600000),
        status: 'unread'
      },
      {
        id: '2',
        type: 'call',
        from: '+1555666777',
        to: '+1987654321',
        content: 'Call completed',
        timestamp: new Date(Date.now() - 7200000),
        status: 'read',
        duration: 1205
      },
      {
        id: '3',
        type: 'voicemail',
        from: '+1444333222',
        to: '+1987654321',
        content: 'Please call me back regarding the estate planning documents.',
        timestamp: new Date(Date.now() - 10800000),
        status: 'unread',
        recordingUrl: '/voicemail-1.mp3'
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase.functions.invoke('twilio-send-sms', {
        body: {
          to: selectedConversation,
          message: newMessage
        }
      });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been delivered successfully."
      });

      setNewMessage('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const makeCall = async (phoneNumber: string) => {
    try {
      const { error } = await supabase.functions.invoke('twilio-click-to-call', {
        body: {
          advisorId: (await supabase.auth.getUser()).data.user?.id,
          clientPhoneNumber: phoneNumber
        }
      });

      if (error) throw error;

      toast({
        title: "Call initiated",
        description: "Your call is being connected."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.from.includes(searchQuery) || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  return (
    <Card className="h-[800px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Communications Hub
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {phoneNumber ? `Business Number: ${phoneNumber}` : 'No phone number configured'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </CardHeader>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex flex-col flex-1">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="sms" className="flex-1">SMS</TabsTrigger>
              <TabsTrigger value="calls" className="flex-1">Calls</TabsTrigger>
              <TabsTrigger value="voicemail" className="flex-1">VM</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="space-y-2 p-4">
                  {filteredMessages.map((message) => (
                    <Card
                      key={message.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedConversation === message.from ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedConversation(message.from)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {message.type === 'sms' && <MessageSquare className="h-4 w-4" />}
                              {message.type === 'call' && <Phone className="h-4 w-4" />}
                              {message.type === 'voicemail' && <Voicemail className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{message.from}</p>
                              <div className="flex items-center gap-2">
                                {message.status === 'unread' && (
                                  <Badge variant="secondary" className="text-xs">New</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Conversation View */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedConversation.slice(-4)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedConversation}</h3>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => makeCall(selectedConversation)}
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {filteredMessages
                    .filter(msg => msg.from === selectedConversation)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === phoneNumber ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.from === phoneNumber
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}