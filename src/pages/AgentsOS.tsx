import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Target, 
  Handshake, 
  PlusCircle,
  Search,
  Send,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';
import { useFeatureFlag } from '@/lib/featureFlags';
import { runtimeFlags } from '@/config/runtimeFlags';

interface Athlete {
  id: string;
  name: string;
  sport: string;
  status: 'active' | 'prospect' | 'inactive';
}

interface Agreement {
  id: string;
  athleteName: string;
  type: string;
  status: 'draft' | 'sent' | 'signed' | 'declined' | 'expired';
  sentDate?: string;
}

interface Campaign {
  id: string;
  title: string;
  budget: number;
  status: 'open' | 'paused' | 'closed';
}

export const AgentsOS: React.FC = () => {
  const { toast } = useToast();
  const agentsEnabled = useFeatureFlag('agents');
  const [athletes] = useState<Athlete[]>([
    { id: '1', name: 'Jordan Smith', sport: 'Basketball', status: 'active' },
    { id: '2', name: 'Alex Johnson', sport: 'Football', status: 'prospect' },
  ]);
  const [agreements, setAgreements] = useState<Agreement[]>([
    { id: '1', athleteName: 'Jordan Smith', type: 'Representation', status: 'signed', sentDate: '2024-01-15' },
    { id: '2', athleteName: 'Alex Johnson', type: 'Marketing', status: 'sent', sentDate: '2024-01-20' },
  ]);
  const [campaigns] = useState<Campaign[]>([
    { id: '1', title: 'Nike Partnership', budget: 50000, status: 'open' },
    { id: '2', title: 'Local Brand Deals', budget: 25000, status: 'paused' },
  ]);

  if (!agentsEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Feature Not Available</CardTitle>
            <CardDescription>
              Sports Agents OS is currently in development
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSendAgreement = (agreementId: string) => {
    if (!runtimeFlags.emailEnabled) {
      setAgreements(prev => prev.map(agreement => 
        agreement.id === agreementId 
          ? { ...agreement, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
          : agreement
      ));
      toast.success('Agreement marked as sent. Email delivery will activate once admin enables it.');
      trackEvent('agent.rep.sent', { noSecrets: true });
    } else {
      toast.success('Agreement sent successfully via email');
      trackEvent('agent.rep.sent', { method: 'email' });
    }
  };

  const handleCreateAgreement = () => {
    const newAgreement: Agreement = {
      id: Date.now().toString(),
      athleteName: 'New Athlete',
      type: 'Representation',
      status: 'draft'
    };
    setAgreements(prev => [...prev, newAgreement]);
    toast.success('New agreement created');
    trackEvent('agent.agreement.created');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'default';
      case 'sent': return 'secondary';
      case 'draft': return 'outline';
      case 'declined': return 'destructive';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sports Agents OS</h1>
          <p className="text-xl text-muted-foreground">
            Complete platform for managing athlete representation
          </p>
        </div>

        <Tabs defaultValue="roster" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="agreements">Rep Agreements</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>

          {/* Roster Tab */}
          <TabsContent value="roster" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Athlete Roster</h2>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Invite Athlete
              </Button>
            </div>

            <div className="grid gap-4">
              {athletes.map((athlete) => (
                <Card key={athlete.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold">{athlete.name}</h3>
                      <p className="text-sm text-muted-foreground">{athlete.sport}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={athlete.status === 'active' ? 'default' : 'secondary'}>
                        {athlete.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send Agreement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Agreements Tab */}
          <TabsContent value="agreements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Rep Agreements</h2>
              <Button onClick={handleCreateAgreement}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Agreement
              </Button>
            </div>

            <div className="grid gap-4">
              {agreements.map((agreement) => (
                <Card key={agreement.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold">{agreement.athleteName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agreement.type} • {agreement.sentDate && `Sent ${agreement.sentDate}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(agreement.status)}>
                        {agreement.status}
                      </Badge>
                      {agreement.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSendAgreement(agreement.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Budget: ${campaign.budget.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={campaign.status === 'open' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Partnership Pipeline</h2>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Prospect
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {['Prospect', 'Intro', 'Legal', 'Pilot', 'Signed', 'Lost'].map((stage) => (
                <Card key={stage}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{stage}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {stage === 'Prospect' && (
                      <div className="p-2 bg-accent rounded text-xs">
                        Nike Partnership
                      </div>
                    )}
                    {stage === 'Legal' && (
                      <div className="p-2 bg-accent rounded text-xs">
                        Adidas Deal
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentsOS;