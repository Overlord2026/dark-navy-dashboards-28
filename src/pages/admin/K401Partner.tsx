import React from 'react';
import { setPartner, getPartner } from '@/features/k401/partners';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function K401Partner() {
  const [p, setP] = React.useState(getPartner());

  const handleSave = () => {
    setPartner(p as any);
    alert('Partner preference saved');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SMB Plan Creation Partner</h1>
        <p className="text-muted-foreground">
          Configure which white-label partner to use for small business 401(k) plan creation
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Partner Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="partner-select">White-label Partner</Label>
            <select
              id="partner-select"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={p}
              onChange={e => setP(e.target.value as any)}
            >
              <option value="Vestwell">Vestwell</option>
              <option value="Guideline">Guideline</option>
              <option value="Betterment">Betterment</option>
              <option value="None">None</option>
            </select>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Save Partner Preference
          </Button>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>This setting determines which partner platform will be used for:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>New plan setup and onboarding</li>
          <li>Plan administration workflows</li>
          <li>Integration APIs and data flows</li>
          <li>White-label branding preferences</li>
        </ul>
      </div>
    </div>
  );
}