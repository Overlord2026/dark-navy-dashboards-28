import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { usePersonaContext } from '@/context/persona-context';
import analytics from '@/lib/analytics';

interface PersonaSwitcherProps {
  orientation?: 'horizontal' | 'vertical';
  showBadges?: boolean;
  className?: string;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  orientation = 'horizontal',
  showBadges = true,
  className = ''
}) => {
  const { familySegment, setFamilySegment } = usePersonaContext();

  const segments = [
    { key: 'aspiring', label: 'Aspiring', description: 'Building wealth' },
    { key: 'retirees', label: 'Retirees', description: 'Preserving wealth' },
    { key: 'hnw', label: 'HNW', description: 'High net worth families' },
    { key: 'uhnw', label: 'UHNW', description: 'Ultra high net worth' }
  ];

  const handleSegmentChange = (value: string) => {
    setFamilySegment(value as any);
    analytics.trackEvent('nav.persona_selected', { 
      segment: value,
      previous_segment: familySegment 
    });
  };

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-2 ${className}`}>
        {segments.map((segment) => (
          <Card 
            key={segment.key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              familySegment === segment.key ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSegmentChange(segment.key)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{segment.label}</h3>
                  <p className="text-sm text-muted-foreground">{segment.description}</p>
                </div>
                {showBadges && familySegment === segment.key && (
                  <Badge>Current</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs 
      value={familySegment || 'aspiring'} 
      onValueChange={handleSegmentChange}
      className={className}
    >
      <TabsList className="grid w-full grid-cols-4">
        {segments.map((segment) => (
          <TabsTrigger key={segment.key} value={segment.key} className="text-sm">
            {segment.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};