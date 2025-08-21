import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, TrendingUp, Building } from 'lucide-react';
import { usePersonalization } from '../PersonalizationContext';
import { Persona, UserFacts } from '../types';
import { getTierReceipts } from '../utils';
import { useFeatureFlag } from '../featureFlags';

export function PersonalizationControls() {
  const { state, updatePersona, updateFacts } = usePersonalization();
  const showReceipts = useFeatureFlag('showTierReceipts');
  const debugMode = useFeatureFlag('debugPersonalization');

  const handleFactUpdate = (field: keyof UserFacts, value: number | boolean) => {
    updateFacts({ [field]: value });
  };

  if (!debugMode) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personalization Controls
          </CardTitle>
          <CardDescription>
            Debug controls for testing personalization logic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="persona" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="persona">Persona</TabsTrigger>
              <TabsTrigger value="facts">Facts</TabsTrigger>
              <TabsTrigger value="receipts">Receipts</TabsTrigger>
            </TabsList>

            <TabsContent value="persona" className="space-y-4">
              <div className="flex items-center gap-4">
                <Label>Current Persona:</Label>
                <Badge variant={state.persona === 'aspiring' ? 'default' : 'secondary'}>
                  {state.persona}
                </Badge>
                <Badge variant={state.complexityTier === 'advanced' ? 'default' : 'outline'}>
                  {state.complexityTier}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={state.persona === 'aspiring' ? 'default' : 'outline'}
                  onClick={() => updatePersona('aspiring')}
                >
                  Aspiring
                </Button>
                <Button
                  variant={state.persona === 'retiree' ? 'default' : 'outline'}
                  onClick={() => updatePersona('retiree')}
                >
                  Retiree
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="facts" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entities Count</Label>
                  <Input
                    type="number"
                    value={state.facts.entitiesCount}
                    onChange={(e) => handleFactUpdate('entitiesCount', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Properties Count</Label>
                  <Input
                    type="number"
                    value={state.facts.propertiesCount}
                    onChange={(e) => handleFactUpdate('propertiesCount', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>K-1 Count</Label>
                  <Input
                    type="number"
                    value={state.facts.k1Count}
                    onChange={(e) => handleFactUpdate('k1Count', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estimated Assets (USD)</Label>
                  <Input
                    type="number"
                    value={state.facts.estimatedLinkedAssetsUSD}
                    onChange={(e) => handleFactUpdate('estimatedLinkedAssetsUSD', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="alts-private"
                    checked={state.facts.hasAltsOrPrivate}
                    onCheckedChange={(checked) => handleFactUpdate('hasAltsOrPrivate', checked)}
                  />
                  <Label htmlFor="alts-private">Has Alternative/Private Investments</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="equity-comp"
                    checked={state.facts.equityCompPresent}
                    onCheckedChange={(checked) => handleFactUpdate('equityCompPresent', checked)}
                  />
                  <Label htmlFor="equity-comp">Equity Compensation Present</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="estate-instruments"
                    checked={state.facts.estateInstrumentsPresent}
                    onCheckedChange={(checked) => handleFactUpdate('estateInstrumentsPresent', checked)}
                  />
                  <Label htmlFor="estate-instruments">Estate Planning Instruments Present</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="receipts">
              {showReceipts ? (
                <ReceiptsList />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Receipts viewing is disabled
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ReceiptsList() {
  const receipts = getTierReceipts();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        <span className="font-medium">Tier Change Receipts</span>
        <Badge variant="outline">{receipts.length}</Badge>
      </div>

      {receipts.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">
          No tier changes recorded yet
        </div>
      ) : (
        <div className="space-y-2">
          {receipts.map((receipt) => (
            <Card key={receipt.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{receipt.previousTier}</Badge>
                    <span>→</span>
                    <Badge variant="default">{receipt.newTier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {receipt.reason}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {receipt.timestamp.toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}