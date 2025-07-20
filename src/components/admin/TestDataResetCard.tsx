import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestDataResetModal } from './TestDataResetModal';
import { useEdgeFunction } from '@/hooks/useEdgeFunction';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Database, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function TestDataResetCard() {
  const [showModal, setShowModal] = useState(false);
  const [lastResetAt, setLastResetAt] = useState<string | null>(null);
  const { trackTestDataReset, trackFeatureUsage } = useAnalytics();
  
  const {
    data: resetResult,
    loading: isResetting,
    error: resetError,
    invoke: triggerReset,
    reset: clearResult
  } = useEdgeFunction('reset-test-data');

  const handleResetConfirm = async () => {
    try {
      // Track test data reset start
      trackFeatureUsage('test_data_reset_started');
      
      const result = await triggerReset({
        confirmReset: true,
        backupBeforeReset: true
      });

      if (result?.success) {
        setLastResetAt(new Date().toISOString());
        toast.success('Test data reset completed successfully');
        
        // Track successful reset
        trackTestDataReset(true, 'full_reset');
      } else {
        toast.error('Test data reset failed');
        
        // Track failed reset
        trackTestDataReset(false, 'full_reset');
      }
    } catch (error) {
      toast.error('Failed to reset test data');
      
      // Track error
      trackTestDataReset(false, 'full_reset');
    } finally {
      setShowModal(false);
    }
  };

  const handleResetClick = () => {
    clearResult();
    setShowModal(true);
    
    // Track modal open
    trackFeatureUsage('test_data_reset_modal_opened');
  };

  const formatLastReset = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800">Test Data Reset</CardTitle>
          </div>
          <CardDescription className="text-yellow-700">
            Reset all test data to initial seed state for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Warning Section */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-100 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-800">Important Warning</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• This will permanently delete all current test data</li>
                <li>• All user accounts, documents, and relationships will be reset</li>
                <li>• A backup will be created automatically before reset</li>
                <li>• This operation cannot be undone once confirmed</li>
              </ul>
            </div>
          </div>

          {/* Status Section */}
          {resetResult && (
            <div className="p-4 rounded-lg border">
              {resetResult.success ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Reset Completed Successfully</p>
                    <p className="text-sm text-muted-foreground">
                      {resetResult.restoredUsers} test users restored
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Reset Failed</p>
                    <p className="text-sm text-muted-foreground">
                      {resetError || 'An error occurred during reset'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Last Reset Info */}
          {lastResetAt && (
            <div className="text-sm text-muted-foreground">
              Last reset: {formatLastReset(lastResetAt)}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={handleResetClick}
              disabled={isResetting}
              className="min-w-[140px]"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Resetting...
                </>
              ) : (
                'Reset Test Data'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <TestDataResetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleResetConfirm}
        isLoading={isResetting}
      />
    </>
  );
}
