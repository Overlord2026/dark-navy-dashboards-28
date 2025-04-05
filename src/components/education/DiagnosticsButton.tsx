
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Activity } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { runEducationCenterDiagnostic } from '@/services/diagnostics/educationDiagnostics';
import { DiagnosticTestStatus } from '@/services/diagnostics/types';

export function DiagnosticsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await runEducationCenterDiagnostic();
      setResults(results);
      
      // Show toast based on results
      if (results.overall === 'success') {
        toast.success('Education Center is functioning correctly');
      } else if (results.overall === 'warning') {
        toast.warning('Education Center is functioning with warnings');
      } else {
        toast.error('Education Center has diagnostic errors');
      }
    } catch (error) {
      console.error('Diagnostics error:', error);
      toast.error('Failed to run diagnostics');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadge = (status: DiagnosticTestStatus) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 text-white">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2" 
        onClick={() => setIsOpen(true)}
      >
        <Activity className="h-4 w-4" />
        Run Diagnostics
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Education Center Diagnostics</DialogTitle>
            <DialogDescription>
              Run diagnostics to ensure the Education Center is functioning correctly
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {isRunning ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Running diagnostics...</span>
              </div>
            ) : results ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Overall Status</h3>
                  {getStatusBadge(results.overall)}
                </div>
                
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-medium mb-4">Component Results</h4>
                  <div className="space-y-3">
                    {results.components?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between pb-2 border-b">
                        <div>
                          <p className="font-medium">{item.component}</p>
                          <p className="text-sm text-muted-foreground">{item.message}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {results.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-600">{results.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg mb-2">Click the button below to run diagnostics</p>
                <p className="text-sm text-muted-foreground">
                  This will test the Education Center components and API endpoints
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
              {isRunning ? 'Running...' : 'Run Diagnostics'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
