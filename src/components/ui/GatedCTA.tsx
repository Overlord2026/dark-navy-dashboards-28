import { Button } from '@/components/ui/button';
import { useGate } from '@/hooks/useGate';

export function GatedCTA({ feature, onRun, onUpgrade }:{
  feature: 'calculators_advanced'|'secure_vault'|'custody_router'|'retirement_scorecard';
  onRun: () => void;
  onUpgrade: () => void;
}) {
  const { allowed, plan } = useGate(feature);
  if (allowed) return <Button variant="gold" onClick={onRun}>Open</Button>;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Requires {feature==='calculators_advanced' || feature==='retirement_scorecard'?'Premium':'Elite'} plan</span>
      <Button variant="gold" onClick={onUpgrade}>Upgrade</Button>
    </div>
  );
}