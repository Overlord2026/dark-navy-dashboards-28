import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MessagePage() {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message sent",
      description: "We'll respond within 24 hours to your secure message.",
    });
    
    // Reset form
    setMessage('');
    setSubject('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Send a Message</h1>
            <p className="text-muted-foreground">
              Get help from our team via secure messaging
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Secure Message Center</CardTitle>
              <CardDescription>
                Send your questions or concerns to our professional team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Shield className="h-4 w-4" />
                  Secure & Confidential
                </div>
                <p className="text-xs text-muted-foreground">
                  All messages are encrypted and reviewed by licensed professionals. 
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}