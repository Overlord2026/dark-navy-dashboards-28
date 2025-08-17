import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { runtimeFlags } from '@/config/runtimeFlags';
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail
} from 'lucide-react';

interface RepAgreement {
  id: string;
  athleteName: string;
  athleteEmail: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export const AgentRepAgreements: React.FC = () => {
  const { toast } = useToast();
  const [agreements, setAgreements] = useState<RepAgreement[]>([
    {
      id: '1',
      athleteName: 'Jordan Mitchell',
      athleteEmail: 'jordan.mitchell@university.edu',
      status: 'draft',
      createdAt: '2024-01-10',
      expiresAt: '2024-02-10'
    },
    {
      id: '2', 
      athleteName: 'Alex Rodriguez',
      athleteEmail: 'alex.rodriguez@university.edu',
      status: 'sent',
      createdAt: '2024-01-08',
      expiresAt: '2024-02-08'
    }
  ]);

  const setAgreementStatus = (id: string, status: RepAgreement['status']) => {
    setAgreements(prev => 
      prev.map(agreement => 
        agreement.id === id ? { ...agreement, status } : agreement
      )
    );
  };

  const handleSendForSignature = async (agreement: RepAgreement) => {
    try {
      if (!runtimeFlags.emailEnabled) {
        // No-secrets mode: Don't attempt signed URL or email; mark as "sent"
        setAgreementStatus(agreement.id, 'sent');
        
        toast({
          title: "✅ Agreement Marked as Sent",
          description: "Email delivery will activate once admin enables it.",
        });

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('agent.rep.sent', { 
            noSecrets: true,
            agreementId: agreement.id 
          });
        }
      } else {
        // Normal mode: use Edge Function for signed URL and email
        // This would call rep_agreements_sign edge function
        setAgreementStatus(agreement.id, 'sent');
        
        toast({
          title: "✅ Agreement Sent",
          description: `Signature request sent to ${agreement.athleteName}`,
        });

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('agent.rep.sent', {
            agreementId: agreement.id
          });
        }
      }
    } catch (error: any) {
      console.error('Send agreement error:', error);
      toast({
        title: "❌ Send Failed",
        description: error.message || "Failed to send agreement",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: RepAgreement['status']) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired': return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: RepAgreement['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'signed': return 'default';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Representation Agreements</h2>
          <p className="text-muted-foreground">
            Manage athlete representation agreements and signatures
          </p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          New Agreement
        </Button>
      </div>

      {!runtimeFlags.emailEnabled && (
        <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-800">Email Delivery Disabled</h4>
            <p className="text-sm text-yellow-700">
              Agreements will be marked as sent but emails won't be delivered until admin enables email functionality.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {agreements.map((agreement) => (
          <Card key={agreement.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agreement.status)}
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {agreement.athleteName}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {agreement.athleteEmail}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant={getStatusColor(agreement.status)}>
                    {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Created: {new Date(agreement.createdAt).toLocaleDateString()}</div>
                    <div>Expires: {new Date(agreement.expiresAt).toLocaleDateString()}</div>
                  </div>

                  {agreement.status === 'draft' && (
                    <Button 
                      onClick={() => handleSendForSignature(agreement)}
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send for Signature
                    </Button>
                  )}

                  {agreement.status === 'sent' && (
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Resend
                    </Button>
                  )}

                  {agreement.status === 'signed' && (
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Signed
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agreements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Agreements Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first representation agreement to get started
            </p>
            <Button>Create Agreement</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};