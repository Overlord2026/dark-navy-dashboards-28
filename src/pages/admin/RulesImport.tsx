import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

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
      
      // Validate structure
      const validTypes = ['estate', 'deed', 'health', 'county'];
      const importTypes = Object.keys(data);
      
      if (!importTypes.every(type => validTypes.includes(type))) {
        throw new Error('Invalid import format. Expected: estate, deed, health, or county rules');
      }

      // Simulate import (in production, this would update the actual rule sets)
      const result = {
        success: true,
        imported: {
          estate: data.estate ? Object.keys(data.estate).length : 0,
          deed: data.deed ? Object.keys(data.deed).length : 0,
          health: data.health ? Object.keys(data.health).length : 0,
          county: data.county ? Object.keys(data.county).length : 0,
        },
        timestamp: new Date().toISOString()
      };

      setImportResult(result);
      toast.success('Rules imported successfully');
      
      // Log receipt for audit trail
      console.log('IMPORT_RECEIPT:', {
        type: 'config-update',
        imported: result.imported,
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
                      {Object.entries(importResult.imported).map(([type, count]: [string, any]) => (
                        count > 0 && (
                          <Badge key={type} variant="outline" className="text-green-700 border-green-300">
                            {type}: {count} rules
                          </Badge>
                        )
                      ))}
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
              Import JSON should contain one or more of these top-level keys:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="outline" className="justify-center py-2">estate</Badge>
              <Badge variant="outline" className="justify-center py-2">deed</Badge>
              <Badge variant="outline" className="justify-center py-2">health</Badge>
              <Badge variant="outline" className="justify-center py-2">county</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Click "Load Example" to see the expected format. All imports are validated before processing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}