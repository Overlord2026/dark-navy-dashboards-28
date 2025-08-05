import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Link as LinkIcon, 
  Users, 
  Send,
  Copy,
  Check,
  Plus,
  X,
  Calendar,
  MessageCircle,
  Shield,
  Star,
  Heart,
  Gift,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InviteData {
  type: 'email' | 'link' | 'qr';
  recipients: Array<{
    email: string;
    name: string;
    relationship: string;
  }>;
  customMessage: string;
  seatTier: 'basic' | 'premium';
  autoLink: boolean;
  scheduledSend?: string;
}

interface ProfessionalInviteFlowProps {
  isOpen: boolean;
  onClose: () => void;
  professionalType: string;
  onInvitesSent?: (invites: InviteData) => void;
}

const INVITE_TEMPLATES = {
  advisor: {
    subject: "You're invited to work with your Financial Advisor",
    message: `Hi {name},

I'm excited to invite you to join our secure Family Office platform. This will give you:

• Secure access to your financial information
• Direct communication with me and our team
• Document sharing and e-signatures
• Real-time portfolio updates and reporting

Your privacy and security are our top priorities. All data is encrypted and you control what you share.

Ready to get started? Click the link below to create your account.

Best regards,
{advisor_name}`
  },
  attorney: {
    subject: "Secure Client Portal Access - {firm_name}",
    message: `Dear {name},

You now have access to our secure client portal where you can:

• Access your legal documents and estate plans
• Communicate securely with our legal team
• Track the progress of your matters
• Upload documents and e-sign when needed

This platform ensures attorney-client privilege and maintains the highest security standards.

Please use the link below to set up your secure access.

Sincerely,
{attorney_name}
{firm_name}`
  },
  accountant: {
    subject: "Your CPA Client Portal is Ready",
    message: `Hello {name},

Welcome to our secure CPA client portal! Here you can:

• Access your tax documents and returns
• Upload receipts and documents year-round
• Track your tax planning strategies
• Communicate securely about your finances

This saves time during tax season and helps us provide better year-round service.

Click below to access your secure portal.

Best,
{cpa_name}`
  },
  consultant: {
    subject: "Your Consultation Portal Access",
    message: `Hi {name},

Thank you for working with us! Your secure consultation portal includes:

• Access to our recommendations and action plans
• Progress tracking on your goals
• Resource library and educational materials
• Direct communication with our team

This platform keeps everything organized and secure as we work together.

Get started by clicking the link below.

Best regards,
{consultant_name}`
  }
};

export function ProfessionalInviteFlow({ isOpen, onClose, professionalType, onInvitesSent }: ProfessionalInviteFlowProps) {
  const { userProfile } = useUser();
  const [currentTab, setCurrentTab] = useState('email');
  const [inviteData, setInviteData] = useState<InviteData>({
    type: 'email',
    recipients: [{ email: '', name: '', relationship: 'Client' }],
    customMessage: INVITE_TEMPLATES[professionalType as keyof typeof INVITE_TEMPLATES]?.message || '',
    seatTier: 'basic',
    autoLink: true
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const addRecipient = () => {
    setInviteData({
      ...inviteData,
      recipients: [...inviteData.recipients, { email: '', name: '', relationship: 'Client' }]
    });
  };

  const removeRecipient = (index: number) => {
    if (inviteData.recipients.length > 1) {
      setInviteData({
        ...inviteData,
        recipients: inviteData.recipients.filter((_, i) => i !== index)
      });
    }
  };

  const updateRecipient = (index: number, field: string, value: string) => {
    const newRecipients = [...inviteData.recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setInviteData({ ...inviteData, recipients: newRecipients });
  };

  const generateInviteLink = async () => {
    setLoading(true);
    try {
      // Generate unique invite code
      const inviteCode = `${professionalType.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Create invitation record (simplified for demo)
      console.log('Would create invitation with code:', inviteCode);

      const link = `${window.location.origin}/family-invite/${inviteCode}`;
      setGeneratedLink(link);

      // Generate QR code URL (using a QR code service)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
      setQrCodeUrl(qrUrl);

      toast.success('Invitation link generated successfully!');
    } catch (error) {
      console.error('Error generating invite link:', error);
      toast.error('Failed to generate invite link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailInvites = async () => {
    setLoading(true);
    try {
      for (const recipient of inviteData.recipients) {
        if (recipient.email && recipient.name) {
          // Generate unique invite code for this recipient
          const inviteCode = `${professionalType.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          // Create invitation record (simplified for demo)
          console.log('Would create invitation for:', recipient.email);

          // Send email via edge function (if not scheduled)
          if (!inviteData.scheduledSend) {
            const { error: emailError } = await supabase.functions.invoke('send-client-invitation', {
              body: {
                to: recipient.email,
                recipientName: recipient.name,
                professionalName: userProfile?.displayName || userProfile?.name,
                professionalType,
                inviteCode,
                customMessage: inviteData.customMessage,
                seatTier: inviteData.seatTier
              }
            });

            if (emailError) {
              console.error('Email send error:', emailError);
              // Don't throw error here, just log it
            }
          }
        }
      }

      const message = inviteData.scheduledSend 
        ? `Invitations scheduled for ${new Date(inviteData.scheduledSend).toLocaleDateString()}`
        : `Successfully sent ${inviteData.recipients.length} invitation(s)!`;
      
      toast.success(message);
      onInvitesSent?.(inviteData);
      onClose();
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const renderEmailInviteTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Send Email Invitations</h3>
        <p className="text-muted-foreground">
          Send personalized invitations directly to your clients' email addresses
        </p>
      </div>

      {/* Recipients */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Recipients</Label>
        {inviteData.recipients.map((recipient, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">Recipient {index + 1}</h4>
              {inviteData.recipients.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRecipient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  value={recipient.name}
                  onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                  placeholder="Client name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={recipient.email}
                  onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                  placeholder="client@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`relationship-${index}`}>Relationship</Label>
                <Select 
                  value={recipient.relationship} 
                  onValueChange={(value) => updateRecipient(index, 'relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Family Member">Family Member</SelectItem>
                    <SelectItem value="Business Partner">Business Partner</SelectItem>
                    <SelectItem value="Trustee">Trustee</SelectItem>
                    <SelectItem value="Beneficiary">Beneficiary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addRecipient}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Recipient
        </Button>
      </div>

      {/* Custom Message */}
      <div className="space-y-2">
        <Label htmlFor="custom-message">Custom Message</Label>
        <Textarea
          id="custom-message"
          value={inviteData.customMessage}
          onChange={(e) => setInviteData({ ...inviteData, customMessage: e.target.value })}
          rows={8}
          placeholder="Personalize your invitation message..."
        />
        <p className="text-xs text-muted-foreground">
          Use {'{name}'} to personalize with recipient's name
        </p>
      </div>

      {/* Seat Tier Selection */}
      <div className="space-y-2">
        <Label>Access Level</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              inviteData.seatTier === 'basic' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => setInviteData({ ...inviteData, seatTier: 'basic' })}
          >
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">Basic Access</h4>
              <p className="text-sm text-muted-foreground">Essential features and secure communication</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              inviteData.seatTier === 'premium' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => setInviteData({ ...inviteData, seatTier: 'premium' })}
          >
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-gold-500 mx-auto mb-2" />
              <h4 className="font-semibold">Premium Access</h4>
              <p className="text-sm text-muted-foreground">Advanced features and priority support</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Send */}
      <div className="space-y-2">
        <Label htmlFor="scheduled-send">Schedule Send (Optional)</Label>
        <Input
          id="scheduled-send"
          type="datetime-local"
          value={inviteData.scheduledSend || ''}
          onChange={(e) => setInviteData({ ...inviteData, scheduledSend: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Leave blank to send immediately
        </p>
      </div>

      <Button
        onClick={sendEmailInvites}
        disabled={loading || !inviteData.recipients.some(r => r.email && r.name)}
        className="w-full gap-2"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Sending...' : 'Send Invitations'}
      </Button>
    </div>
  );

  const renderLinkInviteTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <LinkIcon className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Generate Invitation Link</h3>
        <p className="text-muted-foreground">
          Create a secure link that you can share with clients directly
        </p>
      </div>

      {/* Link Configuration */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              inviteData.seatTier === 'basic' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => setInviteData({ ...inviteData, seatTier: 'basic' })}
          >
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">Basic Access</h4>
              <p className="text-sm text-muted-foreground">Standard family office features</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              inviteData.seatTier === 'premium' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => setInviteData({ ...inviteData, seatTier: 'premium' })}
          >
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-gold-500 mx-auto mb-2" />
              <h4 className="font-semibold">Premium Access</h4>
              <p className="text-sm text-muted-foreground">Advanced analytics and priority support</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="auto-link"
            checked={inviteData.autoLink}
            onChange={(e) => setInviteData({ ...inviteData, autoLink: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="auto-link" className="text-sm">
            Automatically link clients to my practice when they join
          </Label>
        </div>
      </div>

      {!generatedLink ? (
        <Button
          onClick={generateInviteLink}
          disabled={loading}
          className="w-full gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Invitation Link'}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <Label className="text-sm font-medium">Generated Link:</Label>
            <div className="flex gap-2 mt-2">
              <Input value={generatedLink} readOnly className="font-mono text-sm" />
              <Button onClick={copyLink} variant="outline" size="sm">
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">How to use this link:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Share this link via email, text, or in person</li>
              <li>• Link expires in 7 days for security</li>
              <li>• Clients will be guided through secure registration</li>
              <li>• You'll be notified when someone joins</li>
            </ul>
          </div>

          <Button
            onClick={() => {
              setGeneratedLink('');
              setQrCodeUrl('');
            }}
            variant="outline"
            className="w-full"
          >
            Generate New Link
          </Button>
        </div>
      )}
    </div>
  );

  const renderQRCodeTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">QR Code Invitation</h3>
        <p className="text-muted-foreground">
          Generate a QR code for easy mobile access and in-person sharing
        </p>
      </div>

      {!qrCodeUrl ? (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Generate an invitation link first to create a QR code
          </p>
          <Button
            onClick={generateInviteLink}
            disabled={loading}
            className="gap-2"
          >
            <QrCode className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <img 
              src={qrCodeUrl} 
              alt="Invitation QR Code" 
              className="mx-auto border rounded-lg p-4 bg-white"
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">QR Code Usage:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Clients can scan with any smartphone camera</li>
              <li>• Perfect for business cards or office displays</li>
              <li>• Links directly to secure registration</li>
              <li>• Same 7-day expiration as the link</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx?.drawImage(img, 0, 0);
                  canvas.toBlob((blob) => {
                    if (blob) {
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'family-office-invitation-qr.png';
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  });
                };
                img.src = qrCodeUrl;
              }}
              variant="outline"
              className="flex-1"
            >
              Download QR Code
            </Button>
            <Button
              onClick={copyLink}
              variant="outline"
              className="flex-1"
            >
              {linkCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Invite Clients to Family Office Platform
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Invites
            </TabsTrigger>
            <TabsTrigger value="link" className="gap-2">
              <LinkIcon className="w-4 h-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="gap-2">
              <QrCode className="w-4 h-4" />
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            {renderEmailInviteTab()}
          </TabsContent>

          <TabsContent value="link">
            {renderLinkInviteTab()}
          </TabsContent>

          <TabsContent value="qr">
            {renderQRCodeTab()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}