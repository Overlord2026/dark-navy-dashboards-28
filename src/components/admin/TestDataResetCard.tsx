
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export function TestDataResetCard() {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetTestData = async () => {
    setIsResetting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Test data has been reset successfully");
    } catch (error) {
      toast.error("Failed to reset test data");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20">
              <Database className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-foreground">Test Data Management</CardTitle>
              <CardDescription className="text-muted-foreground">
                Reset test environment data and restore default settings
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            DEV ONLY
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-2">Destructive Action Warning</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This action will permanently delete all test data and restore the database to its initial state. 
                This cannot be undone and should only be used in development environments.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Trash2 className="h-3 w-3 text-destructive" />
                  <span className="text-muted-foreground">Removes all test user accounts</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Trash2 className="h-3 w-3 text-destructive" />
                  <span className="text-muted-foreground">Clears all prospect invitations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <RefreshCw className="h-3 w-3 text-success" />
                  <span className="text-muted-foreground">Restores default admin users</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">Last Reset</span>
            </div>
            <span className="text-sm text-muted-foreground">2 days ago</span>
          </div>
          
          <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center space-x-3">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Test Records</span>
            </div>
            <span className="text-sm text-muted-foreground">1,247 entries</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <Button 
            onClick={handleResetTestData}
            disabled={isResetting}
            variant="destructive"
            className="w-full"
          >
            {isResetting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Resetting Test Data...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Test Data
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
