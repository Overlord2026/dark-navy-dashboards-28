import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StressScenario } from '@/lib/retirement/engine';

interface ScenarioBarProps {
  scenarios: StressScenario[];
  activeScenario: string;
  onScenarioChange: (scenarioId: string) => void;
  results?: Record<string, { swagScore: number }>;
}

export function ScenarioBar({ 
  scenarios, 
  activeScenario, 
  onScenarioChange,
  results 
}: ScenarioBarProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          {scenarios.map((scenario) => {
            const isActive = activeScenario === scenario.id;
            const score = results?.[scenario.id]?.swagScore;
            
            return (
              <Button
                key={scenario.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onScenarioChange(scenario.id)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-start gap-1 h-auto py-2 px-4 min-w-[140px]',
                  isActive && 'shadow-md'
                )}
              >
                <span className="font-semibold text-sm">{scenario.name}</span>
                {score !== undefined && (
                  <span className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}>
                    Score: {score.toFixed(0)}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
