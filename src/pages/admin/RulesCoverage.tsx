import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, AlertTriangle } from 'lucide-react';

import { ALL_STATES_DC } from '@/features/estate/states/registry';
import { ESTATE_RULES } from '@/features/estate/states/estateRules';
import { DEED_RULES } from '@/features/estate/deeds/stateDeedRules';
import { HEALTH_RULES } from '@/features/estate/states/healthRules';

function coverageColor(v: boolean) { 
  return v ? 'bg-green-100 text-green-900 border-green-200' : 'bg-yellow-100 text-yellow-900 border-yellow-200'; 
}

export default function RulesCoverage() {
  // Get all 50 states + DC
  const allJurisdictions = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY',
    'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH',
    'OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
  ];

  const rows = allJurisdictions.map(code => {
    const estate = !!ESTATE_RULES[code];
    const deed = !!DEED_RULES[code];
    const health = !!HEALTH_RULES[code];
    
    const flags: string[] = [];
    if (DEED_RULES[code] && DEED_RULES[code].todAvailable === false) flags.push('TOD:verify');
    if (DEED_RULES[code] && DEED_RULES[code].ladyBirdAvailable === true) flags.push('LadyBird:verify');
    if (ESTATE_RULES[code] && ESTATE_RULES[code].todPodAllowed === false) flags.push('Estate-TOD:verify');
    if (ESTATE_RULES[code] && ESTATE_RULES[code].deedPracticeNote?.includes('Placeholder')) flags.push('Deed-Practice:verify');
    
    return { code, estate, deed, health, flags, complete: estate && deed && health };
  });

  const completedCount = rows.filter(r => r.complete).length;
  const totalCount = rows.length;

  function exportCSV() {
    const header = 'code,estate,deed,health,complete,flags';
    const lines = rows.map(r => [
      r.code, 
      r.estate, 
      r.deed, 
      r.health, 
      r.complete,
      r.flags.join('|')
    ].join(','));
    
    const content = header + '\n' + lines.join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules_coverage.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Estate Rules Coverage Dashboard
          </CardTitle>
          <p className="text-muted-foreground">
            All U.S. jurisdictions (50 states + DC) seeded with conservative defaults. 
            Verify state-specific rules and county details with legal counsel before production.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {completedCount}/{totalCount} Complete
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({Math.round((completedCount / totalCount) * 100)}% coverage)
              </span>
            </div>
            <Button onClick={exportCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jurisdiction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">State</th>
                  <th className="text-left py-2 px-3">Estate Rules</th>
                  <th className="text-left py-2 px-3">Deed Rules</th>
                  <th className="text-left py-2 px-3">Health Rules</th>
                  <th className="text-left py-2 px-3">Verification Flags</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.code} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-2">
                        {r.code}
                        {r.complete && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={coverageColor(r.estate)}>
                        {r.estate ? 'Complete' : 'Missing'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={coverageColor(r.deed)}>
                        {r.deed ? 'Complete' : 'Missing'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={coverageColor(r.health)}>
                        {r.health ? 'Complete' : 'Missing'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {r.flags.map((flag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {flag}
                          </Badge>
                        ))}
                        {r.flags.length === 0 && (
                          <span className="text-muted-foreground text-xs">All verified</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {rows.filter(r => r.estate).length}
              </div>
              <div className="text-sm text-muted-foreground">Estate Rules</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {rows.filter(r => r.deed).length}
              </div>
              <div className="text-sm text-muted-foreground">Deed Rules</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {rows.filter(r => r.health).length}
              </div>
              <div className="text-sm text-muted-foreground">Health Rules</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {rows.reduce((acc, r) => acc + r.flags.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Needs Verification</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}