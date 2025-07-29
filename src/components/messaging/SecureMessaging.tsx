import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Shield, ExternalLink, Users, Plus, Send } from 'lucide-react';
import { MessageThread, SecureMessage } from '@/types/messaging';
import { SecureMessagingService } from '@/services/messaging/SecureMessagingService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function SecureMessaging() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      loadMessages(selectedThread.id);
    }
  }, [selectedThread]);

  const loadThreads = async () => {
    try {
      const userThreads = await SecureMessagingService.getUserThreads();
      setThreads(userThreads);
    } catch (error) {
      console.error('Error loading threads:', error);
      toast.error('Failed to load message threads');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      const threadMessages = await SecureMessagingService.getThreadMessages(threadId);
      setMessages(threadMessages);
      await SecureMessagingService.markThreadAsRead(threadId);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!selectedThread || !newMessage.trim()) return;

    try {
      const message = await SecureMessagingService.sendMessage({
        thread_id: selectedThread.id,
        content: newMessage.trim()
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getThreadDisplayName = (thread: MessageThread) => {
    if (thread.thread_name) return thread.thread_name;
    
    const otherParticipants = thread.participants?.filter(p => p.user_id !== user?.id);
    if (otherParticipants && otherParticipants.length > 0) {
      return otherParticipants.map(p => p.user_profile?.display_name || 'Unknown').join(', ');
    }
    
    return 'Untitled Thread';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading secure messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Threads List */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Secure Messages
          </CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={showPrivacyInfo} onOpenChange={setShowPrivacyInfo}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Shield className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                  </DialogTitle>
                  <DialogDescription>
                    Your secure messaging platform with comprehensive compliance features
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">🔐 End-to-End Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All messages are encrypted using AES-256 encryption before storage. 
                      Only participants can decrypt and read messages.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">📋 Compliance & Audit</h4>
                    <p className="text-sm text-muted-foreground">
                      All messaging activity is logged for compliance purposes. 
                      Audit trails are accessible to participants and system administrators.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">📱 External Messaging</h4>
                    <p className="text-sm text-muted-foreground">
                      For urgent matters, you can use external platforms. Please note that 
                      external communications may not have the same compliance controls.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {threads.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No message threads yet</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedThread?.id === thread.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedThread(thread)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {thread.thread_type === 'professional' ? '🏢' : '👤'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {getThreadDisplayName(thread)}
                        </p>
                        <p className="text-sm opacity-70 truncate">
                          {thread.last_message?.decrypted_content || 'No messages yet'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={thread.thread_type === 'professional' ? 'default' : 'secondary'}>
                          {thread.thread_type}
                        </Badge>
                        {thread.unread_count && thread.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {thread.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages View */}
      <Card className="lg:col-span-2">
        {selectedThread ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  {getThreadDisplayName(selectedThread)}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Badge variant="outline">Encrypted</Badge>
                  <span>
                    {selectedThread.participants?.length || 0} participants
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Signal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>No messages in this thread yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-medium">
                              {message.sender_profile?.display_name || 'Unknown'}
                            </p>
                            <Shield className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-sm">
                            {message.decrypted_content || '[Encrypted message]'}
                          </p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your secure message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <p className="text-xs text-muted-foreground">
                    Messages are end-to-end encrypted and logged for compliance
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p>Choose a thread from the left to start secure messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}