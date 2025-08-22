import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminFixturesPanel() {
  const [nilSnapshot, setNilSnapshot] = useState<string>('');
  const [healthSnapshot, setHealthSnapshot] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isDev = import.meta.env.MODE !== 'production';
  const showFixtures = isDev && (window as any).__DEV_FIXTURES__ === true;

  if (!showFixtures) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Fixtures (Development)
          </CardTitle>
          <CardDescription>Development fixture management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <p className="font-semibold mb-2">Dev Fixtures Not Available</p>
            <p className="text-sm">
              Fixtures are only available in development mode with __DEV_FIXTURES__ enabled.
            </p>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-left">
              <p className="text-sm text-yellow-800">
                <strong>To enable:</strong><br />
                1. Set <code>window.__DEV_FIXTURES__ = true</code> in console<br />
                2. Ensure running in development mode
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock fixture functions (replace with actual implementations)
  const loadNilFixtures = async (profile: 'coach' | 'mom') => {
    setIsLoading(true);
    try {
      // Mock loading fixtures
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would call actual fixture loading
      console.log(`Loading NIL fixtures for ${profile} profile`);
      
      toast.success(`NIL ${profile} fixtures loaded successfully`);
    } catch (error) {
      toast.error('Failed to load NIL fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHealthFixtures = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Loading Health fixtures');
      toast.success('Health fixtures loaded successfully');
    } catch (error) {
      toast.error('Failed to load Health fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const saveNilSnapshot = () => {
    try {
      // Mock dehydration
      const mockSnapshot = {
        timestamp: new Date().toISOString(),
        receipts: [],
        state: {},
        version: '1.0.0'
      };
      
      const jsonString = JSON.stringify(mockSnapshot, null, 2);
      setNilSnapshot(jsonString);
      
      // Also trigger download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nil-snapshot-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('NIL snapshot saved and downloaded');
    } catch (error) {
      toast.error('Failed to save NIL snapshot');
    }
  };

  const saveHealthSnapshot = () => {
    try {
      const mockSnapshot = {
        timestamp: new Date().toISOString(),
        healthRecords: [],
        patientState: {},
        version: '1.0.0'
      };
      
      const jsonString = JSON.stringify(mockSnapshot, null, 2);
      setHealthSnapshot(jsonString);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-snapshot-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Health snapshot saved and downloaded');
    } catch (error) {
      toast.error('Failed to save Health snapshot');
    }
  };

  const restoreNilSnapshot = () => {
    if (!nilSnapshot.trim()) {
      toast.error('No NIL snapshot data to restore');
      return;
    }
    
    try {
      const parsed = JSON.parse(nilSnapshot);
      console.log('Restoring NIL snapshot:', parsed);
      toast.success('NIL snapshot restored successfully');
    } catch (error) {
      toast.error('Invalid JSON in NIL snapshot');
    }
  };

  const restoreHealthSnapshot = () => {
    if (!healthSnapshot.trim()) {
      toast.error('No Health snapshot data to restore');
      return;
    }
    
    try {
      const parsed = JSON.parse(healthSnapshot);
      console.log('Restoring Health snapshot:', parsed);
      toast.success('Health snapshot restored successfully');
    } catch (error) {
      toast.error('Invalid JSON in Health snapshot');
    }
  };

  const clearAll = () => {
    setNilSnapshot('');
    setHealthSnapshot('');
    // In real implementation, clear actual state
    toast.success('All snapshots cleared');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Fixtures (Development)
          <Badge variant="destructive">DEV ONLY</Badge>
        </CardTitle>
        <CardDescription>
          Load, save, and restore fixture snapshots for NIL and Health systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* NIL Fixtures */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">NIL Fixtures</h3>
            <Badge variant="outline">No PHI</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => loadNilFixtures('coach')} 
              disabled={isLoading}
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              Load NIL (Coach)
            </Button>
            <Button 
              onClick={() => loadNilFixtures('mom')} 
              disabled={isLoading}
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              Load NIL (Mom)
            </Button>
            <Button onClick={saveNilSnapshot} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Save NIL JSON
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nil-snapshot">NIL Snapshot JSON</Label>
            <Textarea
              id="nil-snapshot"
              placeholder="NIL snapshot JSON will appear here..."
              value={nilSnapshot}
              onChange={(e) => setNilSnapshot(e.target.value)}
              rows={6}
              className="font-mono text-xs"
            />
            <Button 
              onClick={restoreNilSnapshot} 
              disabled={!nilSnapshot.trim()}
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore NIL JSON
            </Button>
          </div>
        </div>

        <Separator />

        {/* Health Fixtures */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Health Fixtures</h3>
            <Badge variant="outline">No PHI</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={loadHealthFixtures} 
              disabled={isLoading}
              variant="outline"
            >
              <Play className="h-4 w-4 mr-2" />
              Load Health
            </Button>
            <Button onClick={saveHealthSnapshot} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Save Health JSON
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="health-snapshot">Health Snapshot JSON</Label>
            <Textarea
              id="health-snapshot"
              placeholder="Health snapshot JSON will appear here..."
              value={healthSnapshot}
              onChange={(e) => setHealthSnapshot(e.target.value)}
              rows={6}
              className="font-mono text-xs"
            />
            <Button 
              onClick={restoreHealthSnapshot} 
              disabled={!healthSnapshot.trim()}
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore Health JSON
            </Button>
          </div>
        </div>

        <Separator />

        {/* Clear All */}
        <div className="flex justify-center">
          <Button onClick={clearAll} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Snapshots
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground p-3 bg-yellow-50 border border-yellow-200 rounded">
          <strong>Security Note:</strong> This panel is development-only and disabled in production. 
          All fixture data is anonymized and contains no PHI/PII.
        </div>
      </CardContent>
    </Card>
  );
}