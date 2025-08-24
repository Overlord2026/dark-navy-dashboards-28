import React from 'react';
import { recordDecisionRDS } from '@/lib/rds';
import { Eye, Smile, CheckCircle, Camera } from 'lucide-react';

interface LivenessCheckMockProps {
  sessionId: string;
  onPass: () => void;
}

export default function LivenessCheckMock({ sessionId, onPass }: LivenessCheckMockProps) {
  const [checking, setChecking] = React.useState(false);
  const [challenges, setChallenges] = React.useState<{
    blink: boolean;
    smile: boolean;
    turnHead: boolean;
  }>({
    blink: false,
    smile: false,
    turnHead: false
  });

  function performChallenge(type: 'blink' | 'smile' | 'turnHead') {
    setChecking(true);
    
    setTimeout(() => {
      setChallenges(prev => ({ ...prev, [type]: true }));
      setChecking(false);
      
      // Auto-proceed when all challenges complete
      const updated = { ...challenges, [type]: true };
      if (updated.blink && updated.smile && updated.turnHead) {
        setTimeout(() => pass(), 500);
      }
    }, 1500);
  }

  function pass() {
    // Record successful liveness check
    recordDecisionRDS({
      action: 'notary.liveness.pass',
      sessionId,
      state: 'DEMO',
      mode: 'RON',
      reasons: ['liveness_pass', 'demo_mode', 'face_verified'],
      result: 'approve',
      metadata: { 
        confidence: 0.92,
        challengesCompleted: 3,
        demo: true,
        method: 'mock_challenges'
      }
    });

    // Analytics tracking
    console.log('[Analytics]', 'notary.liveness.pass', { 
      mock: true, 
      confidence: 0.92, 
      challenges: ['blink', 'smile', 'turnHead'] 
    });
    
    onPass();
  }

  const allComplete = challenges.blink && challenges.smile && challenges.turnHead;

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Face Liveness Verification
        </h3>
        <p className="text-sm text-muted-foreground">
          Demo mode: Complete simple challenges to verify you are a live person.
        </p>
      </div>

      {/* Mock Camera View */}
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
        <div className="text-center">
          <Camera className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Camera feed simulation
          </p>
          <p className="text-xs text-muted-foreground/70">
            Position your face in the center
          </p>
        </div>
      </div>

      {/* Liveness Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Blink Challenge */}
        <div className="border rounded-lg p-4 text-center space-y-3">
          <div className="flex flex-col items-center">
            {challenges.blink ? (
              <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
            ) : (
              <Eye className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <h4 className="font-medium">Blink Challenge</h4>
            <p className="text-xs text-muted-foreground">
              Blink your eyes naturally
            </p>
          </div>
          
          {challenges.blink ? (
            <div className="text-sm text-green-600 font-medium">
              ✓ Completed
            </div>
          ) : (
            <button 
              className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              onClick={() => performChallenge('blink')}
              disabled={checking}
            >
              {checking ? 'Detecting...' : 'Blink Now'}
            </button>
          )}
        </div>

        {/* Smile Challenge */}
        <div className="border rounded-lg p-4 text-center space-y-3">
          <div className="flex flex-col items-center">
            {challenges.smile ? (
              <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
            ) : (
              <Smile className="h-10 w-10 text-muted-foreground mb-2" />
            )}
            <h4 className="font-medium">Smile Challenge</h4>
            <p className="text-xs text-muted-foreground">
              Show a natural smile
            </p>
          </div>
          
          {challenges.smile ? (
            <div className="text-sm text-green-600 font-medium">
              ✓ Completed
            </div>
          ) : (
            <button 
              className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              onClick={() => performChallenge('smile')}
              disabled={checking || !challenges.blink}
            >
              {checking ? 'Detecting...' : 'Smile Now'}
            </button>
          )}
        </div>

        {/* Head Turn Challenge */}
        <div className="border rounded-lg p-4 text-center space-y-3">
          <div className="flex flex-col items-center">
            {challenges.turnHead ? (
              <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
            ) : (
              <div className="h-10 w-10 rounded-full border-2 border-muted-foreground mb-2 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
              </div>
            )}
            <h4 className="font-medium">Head Turn</h4>
            <p className="text-xs text-muted-foreground">
              Turn head left then right
            </p>
          </div>
          
          {challenges.turnHead ? (
            <div className="text-sm text-green-600 font-medium">
              ✓ Completed
            </div>
          ) : (
            <button 
              className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              onClick={() => performChallenge('turnHead')}
              disabled={checking || !challenges.smile}
            >
              {checking ? 'Detecting...' : 'Turn Head'}
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Liveness Progress</span>
          <span>{Object.values(challenges).filter(Boolean).length}/3</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${(Object.values(challenges).filter(Boolean).length / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Completion */}
      {allComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">Liveness Verified</h4>
              <p className="text-sm text-green-600">
                Face verification passed with 92% confidence
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          onClick={pass}
          disabled={!allComplete}
        >
          Continue to RON Session
        </button>
        <button 
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={pass}
        >
          Skip (Pass Anyway)
        </button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        ✓ PII-free demo • ✓ No facial recognition • ✓ Mock biometric challenges
      </div>
    </div>
  );
}