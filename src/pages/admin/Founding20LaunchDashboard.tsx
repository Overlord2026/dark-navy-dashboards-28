import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveLaunchChecklist } from '@/components/founding20/InteractiveLaunchChecklist';
import { LaunchProgressDashboard } from '@/components/founding20/LaunchProgressDashboard';
import { LaunchChecklistPDFGenerator } from '@/components/founding20/LaunchChecklistPDFGenerator';
import { CheckSquare, BarChart3, FileText, Settings } from 'lucide-react';

const Founding20LaunchDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Founding 20 Launch Management
          </h1>
          <p className="text-muted-foreground">
            8-week execution roadmap across Sports, Longevity, and RIA segments
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-black border border-gold/30">
            <TabsTrigger value="checklist" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <CheckSquare className="h-4 w-4 mr-2" />
              Interactive Checklist
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress Dashboard
            </TabsTrigger>
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <FileText className="h-4 w-4 mr-2" />
              PDF Generation
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <Card className="bg-black border-gold/30">
              <CardContent className="p-6">
                <InteractiveLaunchChecklist />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Launch Progress Analytics</CardTitle>
                <CardDescription className="text-white/70">
                  Real-time progress tracking across segments and tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LaunchProgressDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdfs">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Checklist PDF Generation</CardTitle>
                <CardDescription className="text-white/70">
                  Generate print and digital versions of the launch checklist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LaunchChecklistPDFGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Automation Settings</CardTitle>
                <CardDescription className="text-white/70">
                  Configure weekly digests and ops board integration
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Settings className="h-16 w-16 text-gold mx-auto mb-4" />
                <p className="text-white/60">
                  Automation settings panel - configure digest frequency, recipients, and board sync
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Founding20LaunchDashboard;