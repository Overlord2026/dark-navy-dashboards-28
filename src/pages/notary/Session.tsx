/**
 * RON Session Room - Signer interface with identity verification flow
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock, 
  User,
  Camera,
  AlertCircle
} from 'lucide-react';
import KBAQuiz from '@/features/notary/idp/KBAQuiz';
import IDScanMock from '@/features/notary/idp/IDScanMock';
import LivenessCheckMock from '@/features/notary/idp/LivenessCheckMock';
import { recordDecisionRDS } from '@/lib/rds';
import { useToast } from '@/hooks/use-toast';

type SessionStep = 'consent' | 'kba' | 'id' | 'liveness' | 'ready' | 'session' | 'completed';

// Mock session data - in production, fetch from API
const mockSession = {
  id: 'notary_1734567890_abc123',
  docName: 'Power of Attorney Document',
  signerName: 'John Doe',
  signerEmail: 'john@example.com',
  state: 'FL',
  mode: 'RON' as const,
  notaryName: 'Sarah Johnson',
  witnessCount: 1,
  ronRule: {
    kbaLevel: 'kb5' as const,
    idScanRequired: true,
    livenessRequired: true,
    eJournalRequired: true
  }
};

export default function NotarySession() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [step, setStep] = useState<SessionStep>('consent');
  const [consentGiven, setConsentGiven] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const sessionId = id || mockSession.id;

  const handleConsent = () => {
    setConsentGiven(true);
    recordDecisionRDS({
      action: 'notary.consent',
      sessionId,
      state: mockSession.state,
      mode: mockSession.mode,
      reasons: ['recording_consent', 'av_consent', 'terms_accepted'],
      result: 'approve',
      metadata: { consentType: 'av_recording', step: 'consent' }
    });
    setStep('kba');
  };

  const handleKBAPass = () => {
    setStep('id');
    toast({
      title: "Identity Step 1 Complete",
      description: "Knowledge-based authentication passed successfully."
    });
  };

  const handleKBAFail = () => {
    toast({
      title: "KBA Failed",
      description: "Please try again with different answers.",
      variant: "destructive"
    });
  };

  const handleIDPass = () => {
    setStep('liveness');
    toast({
      title: "Identity Step 2 Complete", 
      description: "Document authentication successful."
    });
  };

  const handleLivenessPass = () => {
    setStep('ready');
    toast({
      title: "Identity Verification Complete",
      description: "All identity checks passed. Ready for notarization."
    });
  };

  const handleJoinSession = () => {
    setSessionStarted(true);
    setStep('session');
    recordDecisionRDS({
      action: 'notary.session.join',
      sessionId,
      state: mockSession.state,
      mode: mockSession.mode,
      reasons: ['signer_joined', 'identity_verified', 'session_start'],
      result: 'approve',
      metadata: { joinedAt: new Date().toISOString() }
    });
  };

  const getStepProgress = () => {
    const steps = ['consent', 'kba', 'id', 'liveness', 'ready', 'session'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Remote Notarization Session</h1>
              <p className="text-muted-foreground">
                Session ID: {sessionId}
              </p>
            </div>
            <Badge variant={step === 'completed' ? 'default' : 'secondary'}>
              {step.toUpperCase()}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Session Progress</span>
              <span>{Math.round(getStepProgress())}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </div>

        {/* Session Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Document:</span>
                <p className="font-medium">{mockSession.docName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Signer:</span>
                <p className="font-medium">{mockSession.signerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Notary:</span>
                <p className="font-medium">{mockSession.notaryName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Consent Step */}
          {step === 'consent' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Recording Consent
                </CardTitle>
                <CardDescription>
                  Required by law for remote online notarization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Audio/Video Recording Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        This remote notarization session will be recorded as required by {mockSession.state} law. 
                        The recording will be securely stored and may be used for legal compliance purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">By proceeding, you agree to:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Audio and video recording of this session
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Identity verification procedures
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Electronic signature and notarization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Secure storage of session records
                    </li>
                  </ul>
                </div>

                <Button onClick={handleConsent} className="w-full">
                  I Consent to Recording and Proceed
                </Button>
              </CardContent>
            </Card>
          )}

          {/* KBA Step */}
          {step === 'kba' && (
            <KBAQuiz 
              level={mockSession.ronRule.kbaLevel}
              sessionId={sessionId}
              onPass={handleKBAPass}
              onFail={handleKBAFail}
            />
          )}

          {/* ID Scan Step */}
          {step === 'id' && (
            <IDScanMock 
              sessionId={sessionId}
              onPass={handleIDPass}
            />
          )}

          {/* Liveness Step */}
          {step === 'liveness' && (
            <LivenessCheckMock 
              sessionId={sessionId}
              onPass={handleLivenessPass}
            />
          )}

          {/* Ready Step */}
          {step === 'ready' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Identity Verification Complete
                </CardTitle>
                <CardDescription>
                  All security checks passed. Ready to join notarization session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Verification Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>KBA Passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>ID Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Liveness Confirmed</span>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Waiting for notary {mockSession.notaryName} to start the session...
                  </p>
                  <Button onClick={handleJoinSession} size="lg">
                    <Video className="h-4 w-4 mr-2" />
                    Join Notarization Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Session Step */}
          {step === 'session' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Live Notarization Session
                </CardTitle>
                <CardDescription>
                  Session recording is active
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Area */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium">Live Video Session</p>
                    <p className="text-sm text-muted-foreground">
                      Connected with {mockSession.notaryName}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-600">REC</span>
                    </div>
                  </div>
                </div>

                {/* Session Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Session Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Document Review</span>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Signature Required</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Notary Seal</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow the notary's instructions to complete the document signing process.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('completed')}
                  >
                    Complete Session (Demo)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Step */}
          {step === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Notarization Complete
                </CardTitle>
                <CardDescription>
                  Your document has been successfully notarized
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
                  <h4 className="font-medium text-green-800 mb-2">Success!</h4>
                  <p className="text-sm text-green-700">
                    {mockSession.docName} has been notarized and sealed. 
                    A copy will be sent to your email address.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Session Summary</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Session ID:</strong> {sessionId}</p>
                    <p><strong>Notary:</strong> {mockSession.notaryName}</p>
                    <p><strong>Completed:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>Jurisdiction:</strong> {mockSession.state}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}