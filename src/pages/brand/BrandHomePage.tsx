import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Shield,
  Play,
  Pause,
  Eye,
  Clock,
  DollarSign,
  Target,
  Send,
  Download,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';

const BrandHomePage = () => {
  const [businessData, setBusinessData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Grand Opening Blast',
      status: 'live',
      type: 'grand_opening',
      budget: 500,
      spent: 245,
      impressions: 12500,
      clicks: 487,
      reach: 8900,
      startDate: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Local Awareness Drive',
      status: 'scheduled',
      type: 'local_awareness',
      budget: 300,
      spent: 0,
      impressions: 0,
      clicks: 0,
      reach: 0,
      startDate: '2024-01-22'
    }
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem('brand_business_data');
    if (savedData) {
      setBusinessData(JSON.parse(savedData));
    }
    analytics.track('brand.workspace.viewed');
  }, []);

  const handleQuickAction = (action: string) => {
    analytics.track('brand.quick_action', { action });
    
    const receipt = {
      id: `action-${Date.now()}`,
      type: 'Decision-RDS' as const,
      timestamp: new Date().toISOString(),
      payload: {
        action: action,
        business: businessData?.name || 'Unknown Business',
        workspace: 'brand'
      },
      inputs_hash: `brand-${action}-${Date.now()}`,
      policy_version: '2024.1'
    };
    
    recordReceipt(receipt);
    
    switch(action) {
      case 'create_campaign':
        toast.success('Opening campaign builder...');
        break;
      case 'view_analytics':
        toast.success('Loading analytics dashboard...');
        break;
      case 'export_proof':
        toast.success('Generating compliance proof pack...');
        break;
      default:
        toast.success(`Action completed: ${action}`);
    }
  };

  const handleCampaignAction = (campaignId: string, action: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    analytics.track('brand.campaign.action', { campaignId, action, campaignName: campaign.name });
    
    const receipt = {
      id: `campaign-${campaignId}-${action}-${Date.now()}`,
      type: 'Comms-RDS' as const,
      timestamp: new Date().toISOString(),
      payload: {
        action: action,
        campaignId: campaignId,
        campaignName: campaign.name,
        campaignType: campaign.type,
        ftc_compliant: true,
        auto_disclosure: true
      },
      inputs_hash: `campaign-${campaignId}-${action}`,
      policy_version: '2024.1'
    };
    
    recordReceipt(receipt);

    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, status: action === 'pause' ? 'paused' : action === 'play' ? 'live' : c.status }
        : c
    ));
    
    toast.success(`Campaign ${action === 'pause' ? 'paused' : action === 'play' ? 'resumed' : 'updated'}`);
  };

  const generateVaultKit = () => {
    analytics.track('brand.vault_kit.generated');
    
    const receipt = {
      id: `vault-kit-${Date.now()}`,
      type: 'Vault-RDS' as const,
      timestamp: new Date().toISOString(),
      payload: {
        action: 'vault_kit_generated',
        business: businessData?.name || 'Unknown Business',
        contents: ['brand_assets', 'campaign_templates', 'compliance_docs', 'ftc_guidelines'],
        file_count: 12
      },
      inputs_hash: `vault-kit-${businessData?.name || 'unknown'}`,
      policy_version: '2024.1'
    };
    
    recordReceipt(receipt);
    toast.success('Brand vault kit generated! Check downloads.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Building2 className="text-sm font-bold text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-semibold">
                  {businessData?.name || 'Brand Workspace'}
                </span>
                {businessData?.location && (
                  <p className="text-sm text-muted-foreground">{businessData.location}</p>
                )}
              </div>
            </div>
            <Badge variant="secondary">FTC Compliant</Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="vault">Vault Kit</TabsTrigger>
            <TabsTrigger value="proof">Proof</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleQuickAction('create_campaign')}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">New Campaign</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleQuickAction('view_analytics')}
                  >
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={generateVaultKit}
                  >
                    <Download className="w-6 h-6" />
                    <span className="text-sm">Vault Kit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleQuickAction('export_proof')}
                  >
                    <Shield className="w-6 h-6" />
                    <span className="text-sm">Export Proof</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${campaign.spent} / ${campaign.budget} • {campaign.impressions.toLocaleString()} impressions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            campaign.status === 'live' ? 'default' : 
                            campaign.status === 'scheduled' ? 'secondary' : 'outline'
                          }
                        >
                          {campaign.status}
                        </Badge>
                        {campaign.status === 'live' && (
                          <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'pause')}>
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'play')}>
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'view')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <Badge>{campaign.status}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">${campaign.spent}</div>
                            <div className="text-sm text-muted-foreground">Spent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{campaign.impressions.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Impressions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{campaign.clicks}</div>
                            <div className="text-sm text-muted-foreground">Clicks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{campaign.reach.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Reach</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget Progress</span>
                            <span>${campaign.spent} / ${campaign.budget}</span>
                          </div>
                          <Progress value={(campaign.spent / campaign.budget) * 100} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">8,900</div>
                  <p className="text-sm text-muted-foreground">Local audience reached</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">3.9%</div>
                  <p className="text-sm text-muted-foreground">Above industry average</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">247%</div>
                  <p className="text-sm text-muted-foreground">Return on ad spend</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vault" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Vault Kit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your complete brand asset library with compliance documentation and templates.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-semibold">Brand Assets</h4>
                          <p className="text-sm text-muted-foreground">Logos, images, templates</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-semibold">Compliance Docs</h4>
                          <p className="text-sm text-muted-foreground">FTC guidelines, disclosures</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button onClick={generateVaultKit} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Complete Vault Kit
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proof" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Proof</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">FTC Compliance</h4>
                          <p className="text-sm text-muted-foreground">All campaigns auto-compliant</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Audit Trail</h4>
                          <p className="text-sm text-muted-foreground">Complete campaign history</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button onClick={() => handleQuickAction('export_proof')} className="w-full">
                  Export Complete Compliance Package
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BrandHomePage;