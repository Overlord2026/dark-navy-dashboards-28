import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Database, FileText, Users, MessageCircle, TestTube } from 'lucide-react';
import { ProPersona } from '@/features/pro/types';
import { loadCPAFixtures } from '@/fixtures/pro/cpa';
import { loadAttorneyFixtures } from '@/fixtures/pro/attorney';
import { loadInsuranceFixtures } from '@/fixtures/pro/insurance';
import { loadHealthcareFixtures } from '@/fixtures/pro/healthcare';
import { loadRealtorFixtures } from '@/fixtures/pro/realtor';
import { toast } from 'sonner';

const fixtureLoaders: Record<Exclude<ProPersona, 'advisor'>, () => Promise<any>> = {
  cpa: loadCPAFixtures,
  attorney: loadAttorneyFixtures,
  insurance: loadInsuranceFixtures,
  healthcare: loadHealthcareFixtures,
  realtor: loadRealtorFixtures,
  medicare: () => Promise.resolve({ lead: null, meeting: null, campaign: null, receipts: [] })
};

const personaLabels: Record<Exclude<ProPersona, 'advisor'>, string> = {
  cpa: 'CPA',
  attorney: 'Attorney',
  insurance: 'Insurance',
  healthcare: 'Healthcare',
  realtor: 'Realtor',
  medicare: 'Medicare'
};

interface ProDevPanelProps {
  className?: string;
}

export const ProDevPanel: React.FC<ProDevPanelProps> = ({ className = '' }) => {
  const handleLoadFixtures = async (persona: ProPersona) => {
    try {
      const fixtures = await fixtureLoaders[persona]();
      toast.success(`${personaLabels[persona]} demo data loaded`, {
        description: `Lead, meeting, campaign, and ${fixtures.receipts.length} receipts created`
      });
      console.log(`✅ ${persona} fixtures loaded:`, fixtures);
    } catch (error) {
      toast.error(`Failed to load ${persona} fixtures`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error(`❌ Failed to load ${persona} fixtures:`, error);
    }
  };

  const handleLoadAllFixtures = async () => {
    const personas: ProPersona[] = ['cpa', 'attorney', 'insurance', 'healthcare', 'realtor', 'medicare'];
    let loaded = 0;
    
    for (const persona of personas) {
      try {
        await fixtureLoaders[persona]();
        loaded++;
      } catch (error) {
        console.error(`Failed to load ${persona}:`, error);
      }
    }

    toast.success(`Loaded fixtures for ${loaded}/${personas.length} personas`, {
      description: 'Demo data ready for all professional workflows'
    });
  };

  const handleClearFixtures = () => {
    // Clear localStorage data
    localStorage.removeItem('family_receipts');
    localStorage.removeItem('decision_receipts');
    localStorage.removeItem('pro_leads');
    localStorage.removeItem('pro_meetings');
    localStorage.removeItem('pro_campaigns');
    
    toast.success('All Pro fixtures cleared', {
      description: 'Ready for fresh demo data'
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Pro Development Panel
        </CardTitle>
        <CardDescription>
          Load demo data for professional personas and test workflows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Individual Persona Loaders */}
        <div>
          <h4 className="text-sm font-medium mb-3">Load Individual Personas</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(personaLabels).map(([persona, label]) => (
              <Button
                key={persona}
                variant="outline"
                size="sm"
                onClick={() => handleLoadFixtures(persona as ProPersona)}
                className="flex items-center gap-2"
              >
                <Database className="w-3 h-3" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bulk Actions */}
        <div>
          <h4 className="text-sm font-medium mb-3">Bulk Actions</h4>
          <div className="flex gap-2">
            <Button
              onClick={handleLoadAllFixtures}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Load All Personas
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearFixtures}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Clear All Data
            </Button>
          </div>
        </div>

        <Separator />

        {/* Status Info */}
        <div>
          <h4 className="text-sm font-medium mb-3">What Gets Loaded</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-3 h-3 rounded-full p-0" />
              Sample lead with persona-specific consent
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-3 h-3 rounded-full p-0" />
              Meeting import with compliance tracking
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-3 h-3 rounded-full p-0" />
              Scheduled campaign with approved template
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-3 h-3 rounded-full p-0" />
              All compliance receipts (Consent/Decision/Comms RDS)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};