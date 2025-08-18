import { Card } from '@/components/ui/card';
import { GatedCTA } from '@/components/ui/GatedCTA';
import { useFeatureFlags } from '@/lib/featureFlags';
import { analytics } from '@/lib/analytics';

export default function FamiliesToolsBand() {
  const flags = useFeatureFlags();
  if (!flags.families_tools_band) return null;

  const open = (tool:string) => () => { 
    analytics.trackEvent('tools.open', { tool }); 
    // TODO: route to tool
  };
  
  const upgrade = () => { 
    analytics.trackEvent('pricing.upgrade_click', { where:'tools_band' }); 
    // TODO: open pricing
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold">Quick Calculators</h3>
        <p className="text-sm">SWAG™, Monte Carlo, RMD</p>
        <GatedCTA feature="calculators_advanced" onRun={open('calculators')} onUpgrade={upgrade} />
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Secure Vault</h3>
        <p className="text-sm">Store & share documents with your pros</p>
        <GatedCTA feature="secure_vault" onRun={open('vault')} onUpgrade={upgrade} />
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Custody & Transfers</h3>
        <p className="text-sm">Smart routing to connected custodians</p>
        <GatedCTA feature="custody_router" onRun={open('custody')} onUpgrade={upgrade} />
      </Card>
    </div>
  );
}