import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import { ESTATE_RULES } from '@/features/estate/states/estateRules';
import { DEED_RULES } from '@/features/estate/deeds/stateDeedRules';
import { HEALTH_RULES } from '@/features/estate/states/healthRules';
import { COUNTY_META } from '@/features/estate/deeds/countyMeta';

export default function RulesImport() {
  const [jsonInput, setJsonInput] = useState('');
  const [importResult, setImportResult] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      toast.error('Please enter JSON data to import');
      return;
    }

    setIsImporting(true);
    try {
      const data = JSON.parse(jsonInput);
      
      // Process different types of imports
      let applied = 0;
      let countyApplied = 0;
      
      // Handle direct format (estate, deed, health, county top-level keys)
      if (data.estate || data.deed || data.health || data.county) {
        if (data.estate) {
          Object.assign(ESTATE_RULES as any, data.estate);
          applied += Object.keys(data.estate).length;
        }
        if (data.deed) {
          Object.assign(DEED_RULES as any, data.deed);
          applied += Object.keys(data.deed).length;
        }
        if (data.health) {
          Object.assign(HEALTH_RULES as any, data.health);
          applied += Object.keys(data.health).length;
        }
        if (data.county) {
          Object.assign(COUNTY_META as any, data.county);
          countyApplied += Object.keys(data.county).length;
        }
      } else {
        // Handle prefixed key format (estate:STATE, deed:STATE, county:STATE/COUNTY)
        for (const [k, v] of Object.entries(data)) {
          if (k.startsWith('estate:')) {
            (ESTATE_RULES as any)[k.slice(7)] = v;
            applied++;
          } else if (k.startsWith('deed:')) {
            (DEED_RULES as any)[k.slice(5)] = v;
            applied++;
          } else if (k.startsWith('health:')) {
            (HEALTH_RULES as any)[k.slice(7)] = v;
            applied++;
          } else if (k.startsWith('county:')) {
            (COUNTY_META as any)[k.slice(7)] = v;
            countyApplied++;
          }
        }
      }

      const result = {
        success: true,
        imported: {
          stateRules: applied,
          countyRules: countyApplied,
          total: applied + countyApplied
        },
        timestamp: new Date().toISOString()
      };

      setImportResult(result);
      toast.success(`Applied ${applied} state-rule entries and ${countyApplied} county entries`);
      
      // Log receipt for audit trail
      console.log('IMPORT_RECEIPT:', {
        type: 'Decision-RDS',
        action: 'config.rules.import',
        reasons: [`states:${applied}`, `counties:${countyApplied}`],
        timestamp: result.timestamp
      });

    } catch (error) {
      toast.error('Import failed: ' + (error as Error).message);
      setImportResult({
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsImporting(false);
    }
  };

  const exampleJson = `{
  "estate": {
    "CO": {
      "code": "CO",
      "will": { "witnesses": 2, "notary": false, "selfProving": true },
      "rlt": { "notary": true },
      "pourOver": { "witnesses": 2, "notary": false },
      "probateNotes": "Updated rules for Colorado",
      "communityProperty": false,
      "todPodAllowed": true
    }
  },
  "deed": {
    "CO": {
      "code": "CO",
      "allowed": ["Warranty", "Quitclaim", "TODD"],
      "witnesses": 0,
      "notary": true,
      "todAvailable": true,
      "eRecordingLikely": true
    }
  },
  "county": {
    "CO/Denver": {
      "state": "CO",
      "county": "Denver",
      "pageSize": "Letter",
      "topMarginIn": 3,
      "leftMarginIn": 1,
      "rightMarginIn": 1,
      "bottomMarginIn": 1,
      "firstPageStamp": { "xIn": 6.0, "yIn": 0.5, "wIn": 2.5, "hIn": 3.0 },
      "requiresReturnAddress": true,
      "requiresPreparer": true,
      "requiresAPN": true,
      "eRecording": true,
      "providers": ["simplifile"]
    }
  }
}`;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Rules Import Tool
          </CardTitle>
          <p className="text-muted-foreground">
            Import or update estate, deed, health, and county rules via JSON. 
            All changes are logged for audit compliance.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">JSON Rules Data</label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON rules data here..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleImport}
              disabled={isImporting || !jsonInput.trim()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Importing...' : 'Import Rules'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setJsonInput(exampleJson)}
            >
              Load Example
            </Button>
          </div>

          {importResult && (
            <Card className={importResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </span>
                </div>

                {importResult.success ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">Rules updated successfully:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        State Rules: {importResult.imported.stateRules}
                      </Badge>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        County Rules: {importResult.imported.countyRules}
                      </Badge>
                      <Badge variant="outline" className="text-purple-700 border-purple-300">
                        Total: {importResult.imported.total}
                      </Badge>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      Imported at: {new Date(importResult.timestamp).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-700">
                    Error: {importResult.error}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import JSON with state rules, deed rules, healthcare rules, and county metadata.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Badge variant="outline" className="justify-center py-2">estate</Badge>
              <Badge variant="outline" className="justify-center py-2">deed</Badge>
              <Badge variant="outline" className="justify-center py-2">health</Badge>
              <Badge variant="outline" className="justify-center py-2">county</Badge>
              <Badge variant="outline" className="justify-center py-2">prefixed keys</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Standard format:</strong> {"{ \"estate\": {...}, \"county\": {...} }"}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Prefixed format:</strong> {"{ \"county:CA/Los Angeles\": {...} }"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}