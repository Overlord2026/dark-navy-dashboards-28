import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import analytics from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

export default function ConsentModal({openFor}:{openFor:'calculators_advanced'}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    setOpen(true); 
  }, []);

  const accept = async () => {
    try {
      setLoading(true);
      
      // Get user's IP and user agent for audit trail
      const userAgent = navigator.userAgent;
      
      const { data, error } = await supabase.rpc('consent_accept', { 
        p_scope: openFor, 
        p_version: 'v1',
        p_metadata: { 
          timestamp: new Date().toISOString(),
          context: 'educational_calculator_access'
        },
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Consent acceptance failed:', error);
        return;
      }

      analytics.track('consent.accept', { 
        scope: openFor, 
        version: 'v1',
        consent_id: data 
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error accepting consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const decline = () => {
    analytics.track('consent.decline', { 
      scope: openFor, 
      version: 'v1' 
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Educational Use & Disclosures</h3>
          <p className="text-sm text-muted-foreground">
            These calculators are for educational planning purposes only. They do not constitute 
            investment, legal, or tax advice. Example data is shown for demonstration. 
            Results are estimates and should not be relied upon for actual financial decisions.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={decline}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={accept}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'I Understand'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}