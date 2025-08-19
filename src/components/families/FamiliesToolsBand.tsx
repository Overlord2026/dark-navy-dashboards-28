import { Card } from '@/components/ui/card';
import { GatedCTA } from '@/components/ui/GatedCTA';
import { useFeatureFlags } from '@/lib/featureFlags';
import { analytics } from '@/lib/analytics';
import { useNavigate } from 'react-router-dom';

export default function FamiliesToolsBand() {
  const flags = useFeatureFlags();
  const navigate = useNavigate();
  if (!flags.families_tools_band) return null;

  const open = (tool: string) => () => { 
    analytics.trackEvent('tools.open', { tool }); 
    if (tool === 'retirement_scorecard') {
      navigate('/tools/retirement-scorecard');
    }
    // TODO: route to other tools
  };
  
  const upgrade = () => { 
    analytics.trackEvent('pricing.upgrade_click', { where:'tools_band' }); 
    // TODO: open pricing
  };

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold">Retirement Confidence Scorecard</h3>
        <p className="text-sm">Quick confidence score with actionable recommendations</p>
        <GatedCTA feature="retirement_scorecard" onRun={open('retirement_scorecard')} onUpgrade={upgrade} />
      </Card>
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