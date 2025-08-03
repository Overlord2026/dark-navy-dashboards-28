import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Shield, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ClientInviteDialog({ open, onOpenChange, onSuccess }: ClientInviteDialogProps) {
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [relationshipType, setRelationshipType] = useState<'client' | 'prospect'>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      // Generate invitation token
      const { data: tokenData, error: tokenError } = await supabase
        .rpc('generate_attorney_invitation_token');

      if (tokenError) throw tokenError;

      // Create invitation
      const { error: inviteError } = await supabase
        .from('attorney_client_invitations')
        .insert({
          attorney_id: user.id,
          client_email: clientEmail.toLowerCase(),
          client_name: clientName,
          invitation_token: tokenData,
          metadata: {
            relationship_type: relationshipType,
            custom_message: customMessage,
            invited_by_email: user.email
          }
        });

      if (inviteError) throw inviteError;

      // TODO: Send email invitation via edge function

      toast({
        title: "Invitation sent",
        description: `Successfully sent invitation to ${clientEmail}`,
      });

      // Reset form
      setClientEmail('');
      setClientName('');
      setCustomMessage('');
      setRelationshipType('client');
      
      onSuccess();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Invitation already exists",
          description: "An invitation has already been sent to this email address.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error sending invitation",
          description: "Could not send invitation. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite Client to Portal
          </DialogTitle>
          <DialogDescription>
            Send a secure invitation to connect with your client through the portal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">
                    Client Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="client-name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship-type">Relationship Type</Label>
                <Select value={relationshipType} onValueChange={(value: 'client' | 'prospect') => setRelationshipType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Active Client</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Custom Message */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Invitation Message (Optional)
              </CardTitle>
              <CardDescription>
                Customize the message that will be included in the invitation email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="I'd like to invite you to our secure client portal where we can communicate and share documents safely..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">Secure Invitation Process</p>
                  <p className="text-sm text-muted-foreground">
                    Your client will receive a secure email with a unique invitation link. 
                    They'll need to create an account to access the portal and communicate with you securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}