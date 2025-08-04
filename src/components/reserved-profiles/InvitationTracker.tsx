import React, { useState } from 'react';
import { Copy, Send, ExternalLink, MessageSquare, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ReservedProfile, INVITATION_TEMPLATES } from '@/types/reservedProfiles';
import { PERSONA_SEGMENT_CONFIGS, detectPersonaSegment } from '@/types/personaSegments';

interface InvitationTrackerProps {
  profile: ReservedProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendInvitation: (profileId: string, method: 'email' | 'sms' | 'linkedin' | 'heygen') => void;
}

export const InvitationTracker: React.FC<InvitationTrackerProps> = ({
  profile,
  open,
  onOpenChange,
  onSendInvitation,
}) => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms' | 'linkedin' | 'heygen'>('email');
  
  const claimUrl = `${window.location.origin}/claim/${profile.invitation_token}`;
  
  // Get segment-specific configuration
  const segment = detectPersonaSegment(
    profile.persona_type as any,
    profile.referral_source,
    { practice_area: profile.notes }
  );
  const segmentConfig = PERSONA_SEGMENT_CONFIGS[segment];

  const generateMessage = (method: 'email' | 'sms' | 'linkedin' | 'heygen') => {
    const template = INVITATION_TEMPLATES[method];
    if (!template) return '';
    
    const content = 'body' in template ? template.body : template.body;
    const personalizedContent = content
      .replace(/\{\{name\}\}/g, profile.name)
      .replace(/\{\{role_title\}\}/g, profile.role_title || 'Professional')
      .replace(/\{\{organization\}\}/g, profile.organization || '')
      .replace(/\{\{segment\}\}/g, segment)
      .replace(/\{\{claim_link\}\}/g, claimUrl);
    
    // Add segment-specific welcome message
    return `${personalizedContent}\n\n${segmentConfig.welcomeMessage}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    });
  };

  const handleSendInvitation = (method: 'email' | 'sms' | 'linkedin' | 'heygen') => {
    onSendInvitation(profile.id, method);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invitation Tracker - {profile.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Organization:</strong> {profile.organization}</p>
                </div>
                <div>
                  <p><strong>Role:</strong> {profile.role_title}</p>
                  <p><strong>Persona:</strong> {profile.persona_type}</p>
                  <p><strong>Priority:</strong> <Badge variant={profile.priority_level === 'high' ? 'destructive' : 'default'}>{profile.priority_level}</Badge></p>
                </div>
              </div>
              
              <div className="mt-4">
                <p><strong>Claim URL:</strong></p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-sm">{claimUrl}</code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(claimUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(claimUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invitation Methods */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`cursor-pointer border-2 ${selectedMethod === 'email' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setSelectedMethod('email')}>
              <CardContent className="p-4 text-center">
                <Send className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">Professional email</p>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer border-2 ${selectedMethod === 'sms' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setSelectedMethod('sms')}>
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">SMS</p>
                <p className="text-sm text-muted-foreground">Text message</p>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer border-2 ${selectedMethod === 'linkedin' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setSelectedMethod('linkedin')}>
              <CardContent className="p-4 text-center">
                <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm text-muted-foreground">Professional network</p>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer border-2 ${selectedMethod === 'heygen' ? 'border-primary' : 'border-border'}`}
                  onClick={() => setSelectedMethod('heygen')}>
              <CardContent className="p-4 text-center">
                <Video className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">HeyGen Video</p>
                <p className="text-sm text-muted-foreground">Personal video</p>
              </CardContent>
            </Card>
          </div>

          {/* Message Template */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Invitation Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMethod === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject:</label>
                    <p className="p-2 bg-muted rounded">{INVITATION_TEMPLATES.email.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Body:</label>
                    <Textarea
                      value={generateMessage('email')}
                      rows={10}
                      readOnly
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              
              {selectedMethod !== 'email' && (
                <Textarea
                  value={generateMessage(selectedMethod)}
                  rows={selectedMethod === 'sms' ? 3 : 8}
                  readOnly
                  className="mt-1"
                />
              )}
              
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => copyToClipboard(generateMessage(selectedMethod))}
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </Button>
                <Button 
                  onClick={() => handleSendInvitation(selectedMethod)}
                  className="bg-gradient-gold hover:bg-gradient-gold/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Invitation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          {profile.invitation_sent_at && (
            <Card>
              <CardHeader>
                <CardTitle>Invitation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Last Sent:</strong> {new Date(profile.invitation_sent_at).toLocaleString()}</p>
                  <p><strong>Method:</strong> {profile.invitation_method?.toUpperCase()}</p>
                  <p><strong>Status:</strong> 
                    <Badge className="ml-2">
                      {profile.claimed_at ? 'Claimed' : 'Pending'}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};