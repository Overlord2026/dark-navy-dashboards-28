import React from 'react';
import { Badge } from '@/components/ui/badge';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getWorkspaceTools } from '@/lib/workspaceTools';
import { ToolCard } from '@/components/tools/ToolCard';
import { Shield, Users, FileText, Calculator, Activity, Lock, TrendingUp, Receipt } from 'lucide-react';
import familyToolsConfig from '@/config/familyTools.json';

export default function FamilyHome() {
  const workspace = getWorkspaceTools();
  const segment = workspace.segment || 'aspiring';
  
  // Get segment configuration
  const segmentConfig = (familyToolsConfig as any)[segment];
  
  const getSegmentBadge = () => {
    const badges = {
      aspiring: { label: 'Aspiring Families', color: 'bg-blue-100 text-blue-800' },
      retiree: { label: 'Retirees', color: 'bg-green-100 text-green-800' }
    };
    return badges[segment as keyof typeof badges] || badges.aspiring;
  };

  const getQuickActionIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      shield: Shield,
      users: Users,
      'file-text': FileText,
      calculator: Calculator,
      activity: Activity,
      lock: Lock,
      'trending-up': TrendingUp
    };
    return icons[iconName] || FileText;
  };

  const handleQuickAction = (action: any) => {
    if (action.route) {
      window.location.href = action.route;
    }
  };

  const badge = getSegmentBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <VoiceDrawer 
              triggerLabel="🎙️ Voice Assistant" 
              persona="family" 
              endpoint="meeting-summary"
            />
          </div>
          <Badge className={`mb-4 ${badge.color}`}>
            {badge.label}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Your Family Financial Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to secure your family's financial future, organized and simplified.
          </p>
        </div>

        {/* Quick Actions */}
        {segmentConfig?.quickActions && (
          <div className="bfo-card mb-8 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-bfo-gold" />
                Quick Actions
              </h3>
              <p className="text-gray-300">
                Get started with the most important tasks for your financial stage
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {segmentConfig.quickActions.map((action: any, index: number) => {
                const IconComponent = getQuickActionIcon(action.icon);
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-white/10 border-bfo-gold/30 text-white hover:bg-bfo-gold/20"
                    onClick={() => handleQuickAction(action)}
                  >
                    <IconComponent className="h-6 w-6 text-bfo-gold" />
                    <span className="text-sm font-medium text-center">
                      {action.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabbed Tool Categories */}
        {segmentConfig?.tabs && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Tools</CardTitle>
              <CardDescription>
                Access all your financial planning tools organized by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={segmentConfig.tabs[0]?.key} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {segmentConfig.tabs.map((tab: any) => (
                    <TabsTrigger key={tab.key} value={tab.key}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {segmentConfig.tabs.map((tab: any) => (
                  <TabsContent key={tab.key} value={tab.key}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tab.cards?.map((card: any, index: number) => (
                        <ToolCard
                          key={card.toolKey || index}
                          toolKey={card.toolKey}
                          showInstallOption={true}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Receipts Strip */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest transactions and document uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <div className="text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Start using tools to see your activity here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Explainer Footer */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Bank-Level Security & Trust
              </h3>
              <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
                Your financial data is protected with enterprise-grade encryption, smart checks for accuracy, 
                and proof slips for every important decision. We never see your account passwords or have 
                access to move your money.
              </p>
              <div className="flex justify-center items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span>🔒 256-bit Encryption</span>
                <span>✓ Smart Checks</span>
                <span>📄 Proof Slips</span>
                <span>🕐 Time-Stamped</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}