import React from 'react';
import { recordDecisionRDS } from '@/lib/rds';
import { Camera, Upload, CheckCircle } from 'lucide-react';

interface IDScanMockProps {
  sessionId: string;
  onPass: () => void;
}

export default function IDScanMock({ sessionId, onPass }: IDScanMockProps) {
  const [scanning, setScanning] = React.useState(false);
  const [scanned, setScanned] = React.useState<'front' | 'back' | 'both' | null>(null);

  function scanDocument(side: 'front' | 'back') {
    setScanning(true);
    
    setTimeout(() => {
      setScanning(false);
      const newScanned = scanned === 'front' && side === 'back' ? 'both' : side;
      setScanned(newScanned);
      
      if (newScanned === 'both') {
        // Auto-proceed when both sides scanned
        accept();
      }
    }, 1500);
  }

  function accept() {
    // Record successful ID scan
    recordDecisionRDS({
      action: 'notary.idscan.pass',
      sessionId,
      state: 'DEMO',
      mode: 'RON',
      reasons: ['idscan_pass', 'demo_mode', 'document_authenticated'],
      result: 'approve',
      metadata: { 
        documentType: 'drivers_license',
        confidence: 0.95,
        demo: true,
        scanMethod: 'mock'
      }
    });

    // Analytics tracking
    console.log('[Analytics]', 'notary.idscan.pass', { mock: true, confidence: 0.95 });
    
    onPass();
  }

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Document Authentication
        </h3>
        <p className="text-sm text-muted-foreground">
          Demo mode: Simulate scanning front and back of a government ID document.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Front Scan */}
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center space-y-3">
          <div className="flex flex-col items-center">
            {scanned === 'front' || scanned === 'both' ? (
              <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground mb-2" />
            )}
            <h4 className="font-medium">Front of ID</h4>
            <p className="text-xs text-muted-foreground">
              Driver's license, passport, state ID
            </p>
          </div>
          
          {scanned === 'front' || scanned === 'both' ? (
            <div className="text-sm text-green-600 font-medium">
              ✓ Scanned successfully
            </div>
          ) : (
            <button 
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              onClick={() => scanDocument('front')}
              disabled={scanning}
            >
              {scanning ? 'Scanning...' : 'Scan Front'}
            </button>
          )}
        </div>

        {/* Back Scan */}
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center space-y-3">
          <div className="flex flex-col items-center">
            {scanned === 'back' || scanned === 'both' ? (
              <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground mb-2" />
            )}
            <h4 className="font-medium">Back of ID</h4>
            <p className="text-xs text-muted-foreground">
              Magnetic stripe, barcode, signature
            </p>
          </div>
          
          {scanned === 'back' || scanned === 'both' ? (
            <div className="text-sm text-green-600 font-medium">
              ✓ Scanned successfully
            </div>
          ) : (
            <button 
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              onClick={() => scanDocument('back')}
              disabled={scanning || !scanned}
            >
              {scanning ? 'Scanning...' : 'Scan Back'}
            </button>
          )}
        </div>
      </div>

      {scanned === 'both' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">Document Verified</h4>
              <p className="text-sm text-green-600">
                ID authentication passed with 95% confidence
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          onClick={accept}
          disabled={scanned !== 'both'}
        >
          Continue to Next Step
        </button>
        <button 
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={accept}
        >
          Skip (Accept Anyway)
        </button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        ✓ PII-free demo • ✓ No real image processing • ✓ Mock confidence scores
      </div>
    </div>
  );
}