import React, { useState } from 'react';
import { ProSegment } from '@/lib/persona';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface ProChecklistProps {
  segment: ProSegment;
}

const BASE_CHECKLIST = [
  { id: 'invite', title: 'Accept invite / Create shared household', description: 'Set up collaborative workspace' },
  { id: 'profile', title: 'Complete professional profile', description: 'Add credentials and expertise' },
  { id: 'report', title: 'Generate first report', description: 'Create initial client deliverable' },
  { id: 'esign', title: 'Set up e-signature', description: 'Configure electronic document signing' },
  { id: 'compliance', title: 'Enable compliance logging', description: 'Activate audit trail tracking' },
  { id: 'integration', title: 'Connect practice tools', description: 'Integrate existing software' },
  { id: 'client', title: 'Invite first client', description: 'Add client to your network' }
];

const SEGMENT_SPECIFIC = {
  'insurance-medicare': [
    { id: 'medicare-guide', title: 'Review Medicare compliance guide', description: 'Learn recording compliance requirements' }
  ]
};

export function ProChecklist({ segment }: ProChecklistProps) {
  const specificItems = SEGMENT_SPECIFIC[segment] || [];
  const allItems = [...BASE_CHECKLIST, ...specificItems];
  
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);

    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', newCompleted.has(id) ? 'step_completed' : 'step_unchecked', {
        step_id: id,
        segment: segment
      });
    }
  };

  const progress = (completed.size / allItems.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Onboarding</CardTitle>
        <CardDescription>
          Complete these steps to get the most out of your professional tools
        </CardDescription>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {completed.size} of {allItems.length} steps completed
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {allItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
            <Checkbox
              id={item.id}
              checked={completed.has(item.id)}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <label 
                htmlFor={item.id}
                className={`font-medium cursor-pointer ${completed.has(item.id) ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.title}
              </label>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}