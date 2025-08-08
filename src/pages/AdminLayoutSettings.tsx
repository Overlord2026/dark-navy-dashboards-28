import React from 'react';
import { LayoutSettingsPanel } from '@/components/admin/LayoutSettingsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Layout, Monitor } from 'lucide-react';

const AdminLayoutSettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Admin Layout Settings</h1>
              <p className="text-muted-foreground">Configure the landing page layout and appearance</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <LayoutSettingsPanel />
          </div>

          {/* Quick Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Layout Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Full Tree Hero</h4>
                  <p className="text-xs text-muted-foreground">
                    Tree animation fills 70-80% of viewport with centered headlines. Great for desktop impact.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Split Layout</h4>
                  <p className="text-xs text-muted-foreground">
                    Tree on left, persona grid on right. Better for quick persona selection.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  onClick={() => window.open('/', '_blank')}
                  className="w-full p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-left transition-colors"
                >
                  <div className="font-medium text-sm">Preview Landing Page</div>
                  <div className="text-xs text-muted-foreground">View current layout in new tab</div>
                </button>
                <button 
                  onClick={() => window.open('/onboarding/financial-advisor', '_blank')}
                  className="w-full p-3 bg-emerald/10 hover:bg-emerald/20 rounded-lg text-left transition-colors"
                >
                  <div className="font-medium text-sm">Test Onboarding Flow</div>
                  <div className="text-xs text-muted-foreground">Preview advisor onboarding</div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutSettings;