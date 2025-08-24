import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pin, Copy } from 'lucide-react';
import type { Scenario } from '../types';

interface ScenarioBarProps {
  scenarios: Scenario[];
  activeScenarioId?: string;
  onScenarioSelect: (scenario: Scenario) => void;
  onNewScenario: () => void;
  onDuplicateScenario: (scenario: Scenario) => void;
}

export function ScenarioBar({
  scenarios,
  activeScenarioId,
  onScenarioSelect,
  onNewScenario,
  onDuplicateScenario,
}: ScenarioBarProps) {
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const togglePin = (id: string) => {
    const newPinned = new Set(pinnedIds);
    if (newPinned.has(id)) {
      newPinned.delete(id);
    } else {
      newPinned.add(id);
    }
    setPinnedIds(newPinned);
  };

  return (
    <div className="w-64 border-r border-border bg-muted/30 p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">Scenarios</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewScenario}
          className="h-8 w-8 p-0"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
              activeScenarioId === scenario.id ? 'bg-accent border-primary' : ''
            }`}
            onClick={() => onScenarioSelect(scenario)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{scenario.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(scenario.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {pinnedIds.has(scenario.id) && (
                  <Badge variant="secondary" className="h-5 px-1">
                    <Pin className="h-3 w-3" />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateScenario(scenario);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}