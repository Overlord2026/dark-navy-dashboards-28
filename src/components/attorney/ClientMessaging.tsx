import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock,
  Search,
  PaperclipIcon,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Message {
  id: string;
  attorney_id: string;
  client_id: string;
  sender_type: 'attorney' | 'client';
  sender_id: string;
  message_content: string;
  message_type: string;
  priority: string;
  read_at: string | null;
  created_at: string;
  client_name?: string;
  client_email?: string;
}

interface Client {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
}

export function ClientMessaging() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('attorney_client_links')
        .select(`
          id,
          client_id,
          profiles:client_id(
            email,
            first_name,
            last_name
          )
        `)
        .eq('attorney_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      const transformedClients = data?.map(link => ({
        id: link.id,
        client_id: link.client_id,
        client_name: `${link.profiles?.first_name || ''} ${link.profiles?.last_name || ''}`.trim() || 'Unknown',
        client_email: link.profiles?.email || 'No email'
      })) || [];

      setClients(transformedClients);
      
      // Auto-select first client if none selected
      if (!selectedClientId && transformedClients.length > 0) {
        setSelectedClientId(transformedClients[0].client_id);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error loading clients",
        description: "Could not load client list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedClientId) return;

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('attorney_client_messages')
        .select(`
          *,
          profiles:client_id(
            first_name,
            last_name,
            email
          )
        `)
        .eq('attorney_id', user.id)
        .eq('client_id', selectedClientId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedMessages = data?.map(msg => ({
        ...msg,
        client_name: `${msg.profiles?.first_name || ''} ${msg.profiles?.last_name || ''}`.trim() || 'Unknown',
        client_email: msg.profiles?.email || 'No email'
      })) || [];

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error loading messages",
        description: "Could not load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedClientId) {
      toast({
        title: "Cannot send message",
        description: "Please enter a message and select a client.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('attorney_client_messages')
        .insert({
          attorney_id: user.id,
          client_id: selectedClientId,
          sender_type: 'attorney',
          sender_id: user.id,
          message_content: newMessage.trim(),
          message_type: 'text',
          priority: priority
        });

      if (error) throw error;

      setNewMessage('');
      setPriority('normal');
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });

      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchClients().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchMessages();
    }
  }, [selectedClientId]);

  const filteredMessages = messages.filter(message =>
    message.message_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">High</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading messaging...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Client Selection */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8"
              />
            </div>
            
            <div className="space-y-2">
              {clients.map((client) => (
                <div
                  key={client.client_id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedClientId === client.client_id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedClientId(client.client_id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{client.client_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{client.client_email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {clients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No clients available for messaging.</p>
                <p className="text-sm">Invite clients to start conversations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Thread */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedClientId && clients.find(c => c.client_id === selectedClientId)?.client_name 
                  ? `Messages with ${clients.find(c => c.client_id === selectedClientId)?.client_name}`
                  : 'Select a client to start messaging'
                }
              </CardTitle>
              {selectedClientId && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-48"
                    size="sm"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          
          {selectedClientId ? (
            <>
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet.</p>
                    <p className="text-sm">Start the conversation with your client.</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === 'attorney' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_type === 'attorney'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.sender_type === 'attorney' ? 'You' : message.client_name}
                          </span>
                          {getPriorityBadge(message.priority)}
                          {!message.read_at && message.sender_type === 'attorney' && (
                            <Clock className="h-3 w-3 opacity-60" />
                          )}
                        </div>
                        <p className="text-sm">{message.message_content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {format(new Date(message.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-2 mb-2">
                  <Select value={priority} onValueChange={(value: 'normal' | 'high' | 'urgent') => setPriority(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="icon">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={sendMessage} 
                      disabled={sending || !newMessage.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a client to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}