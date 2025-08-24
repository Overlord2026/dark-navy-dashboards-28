import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import { COUNTY_META, getCountyKey, type CountyMeta } from '@/features/estate/deeds/countyMeta';

export default function CountyQuickAdd() {
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const generateCountyJson = () => {
    if (!state || !county) {
      toast.error('Please enter both state and county');
      return;
    }

    const newCountyMeta: CountyMeta = {
      state: state.toUpperCase(),
      county,
      pageSize: 'Letter',
      topMarginIn: 3.0,
      leftMarginIn: 1.0,
      rightMarginIn: 1.0,
      bottomMarginIn: 1.0,
      firstPageStamp: { xIn: 6.0, yIn: 0.5, wIn: 2.5, hIn: 3.0 },
      requiresReturnAddress: true,
      requiresPreparer: true,
      requiresGranteeAddress: false,
      requiresAPN: true,
      minFontPt: 10,
      eRecording: true,
      providers: ['simplifile'],
      notes: 'Generated via Quick Add - verify with county recorder'
    };

    const key = getCountyKey(state.toUpperCase(), county);
    const jsonOutput = JSON.stringify({
      [`county:${key}`]: newCountyMeta
    }, null, 2);

    setGeneratedJson(jsonOutput);
    setIsAdded(false);
  };

  const addToMemory = () => {
    if (!generatedJson) return;

    try {
      const data = JSON.parse(generatedJson);
      const key = Object.keys(data)[0].slice(7); // Remove 'county:' prefix
      
      (COUNTY_META as any)[key] = Object.values(data)[0];
      setIsAdded(true);
      toast.success(`Added ${key} to county metadata`);
      
      // Log receipt
      console.log('COUNTY_ADD_RECEIPT:', {
        type: 'Decision-RDS',
        action: 'config.county.add',
        reasons: [key],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      toast.error('Failed to add county');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson);
    toast.success('JSON copied to clipboard');
  };

  const quickTemplates = [
    { state: 'CO', county: 'Denver', desc: 'Colorado major county' },
    { state: 'OR', county: 'Multnomah', desc: 'Oregon (Portland)' },
    { state: 'CT', county: 'Fairfield', desc: 'Connecticut major county' },
    { state: 'NV', county: 'Clark', desc: 'Nevada (Las Vegas)' },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-6 w-6" />
            Quick Add County
          </CardTitle>
          <p className="text-muted-foreground">
            Generate county metadata JSON for immediate use or bulk import later.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State Code</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="CO"
                className="uppercase"
                maxLength={2}
              />
            </div>
            <div>
              <Label htmlFor="county">County Name</Label>
              <Input
                id="county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="Denver"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={generateCountyJson} className="gap-2">
              <Plus className="h-4 w-4" />
              Generate JSON
            </Button>
            {generatedJson && (
              <>
                <Button onClick={addToMemory} variant="outline" className="gap-2">
                  {isAdded ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {isAdded ? 'Added' : 'Add to Memory'}
                </Button>
                <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy JSON
                </Button>
              </>
            )}
          </div>

          {generatedJson && (
            <div>
              <Label>Generated JSON (for Rules Import)</Label>
              <Textarea
                value={generatedJson}
                readOnly
                className="font-mono text-sm min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Copy this JSON and paste into Admin → Rules Import, or click "Add to Memory" for immediate use.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickTemplates.map((template) => (
              <Button
                key={`${template.state}-${template.county}`}
                variant="outline"
                className="flex flex-col h-auto py-3"
                onClick={() => {
                  setState(template.state);
                  setCounty(template.county);
                }}
              >
                <span className="font-medium">{template.state}/{template.county}</span>
                <span className="text-xs text-muted-foreground">{template.desc}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Click a template to auto-fill state and county, then generate JSON with standard defaults.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}