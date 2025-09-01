import React from 'react';
import { callEdgeJSON } from '@/services/aiEdge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mic, MicOff, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VOICE_CONFIG, isVoiceEnabledForPersona, VoicePersona } from '@/config/voice';
import { track } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

export interface VoiceDrawerProps {
  /** Optional controlled open state; if omitted, component manages its own */
  open?: boolean;
  /** Optional controlled close handler; used only when `open` is provided */
  onClose?: () => void;
  /** Persona key for policy guardrails (e.g., "family","advisor","cpa","attorney","insurance","nil") */
  persona: VoicePersona;
  /** Edge function endpoint slug; defaults to 'meeting-summary' */
  endpoint?: string;
  /** Optional label for the trigger button; if omitted, render icon button */
  triggerLabel?: string;
}

export function VoiceDrawer({
  open: controlledOpen,
  onClose: controlledOnClose,
  persona,
  endpoint = 'meeting-summary',
  triggerLabel
}: VoiceDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [consent, setConsent] = React.useState(false);
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);
  const { toast } = useToast();

  const open = controlledOpen ?? internalOpen;
  const close = () => (controlledOnClose ? controlledOnClose() : setInternalOpen(false));
  const openSelf = () => setInternalOpen(true);
  
  const isVoiceFeatureEnabled = isVoiceEnabledForPersona(persona);
  const canCapture = consent && isVoiceFeatureEnabled;

  const handleConsentChange = async (checked: boolean) => {
    setConsent(checked);
    
    if (checked) {
      // Log consent event to analytics
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await track('voice_consent_granted', {
            persona,
            userId: user.id,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to log consent event:', error);
      }
    }
  };

  const handleStartVoiceCapture = () => {
    if (!canCapture) return;
    
    setVoiceEnabled(true);
    toast({
      title: "Voice capture started",
      description: "Speak your notes. Remember: this is educational only.",
    });
  };

  const handleStopVoiceCapture = () => {
    setVoiceEnabled(false);
    toast({
      title: "Voice capture stopped",
      description: "You can continue typing or edit your transcript.",
    });
  };

  const handleHumanHandoff = (type: 'schedule' | 'message') => {
    const links = {
      schedule: '/contact/schedule',
      message: '/contact/message'
    };
    
    toast({
      title: "Connecting you to a human",
      description: "Opening contact options...",
    });
    
    window.open(links[type], '_blank');
  };

  async function onSend() {
    if (!notes.trim()) return;
    setBusy(true);
    try {
      const data = await callEdgeJSON(endpoint, { notes, persona });
      setResult(data);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={open ? close : openSelf}>
      <DrawerTrigger asChild>
        {triggerLabel ? (
          <Button variant="outline" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            {triggerLabel}
          </Button>
        ) : (
          <Button variant="outline" size="icon" aria-label="Open voice assistant">
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice capture
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 space-y-4">
          {/* Guardrail Banner */}
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800 font-medium">
              Educational only. Not advice.
            </span>
          </div>

          {/* Persona Badge */}
          <Badge variant="outline" className="text-xs">
            Persona: {persona}
          </Badge>

          {/* Consent Checkbox */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice Consent Required</label>
            <div className="flex items-start gap-3">
              <Checkbox 
                id="voice-consent" 
                checked={consent}
                onCheckedChange={handleConsentChange}
              />
              <label 
                htmlFor="voice-consent" 
                className="text-sm text-muted-foreground leading-relaxed"
              >
                I understand this is educational content only, not financial advice. 
                My voice data may be transcribed and summarized according to platform policies.
              </label>
            </div>
          </div>

          {/* Voice Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Voice Controls</label>
            {!isVoiceFeatureEnabled ? (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  ⚠️ Voice capture is disabled (VOICE_ENABLED=false)
                </p>
                <p className="text-xs text-muted-foreground">
                  This is intentional for the investor demo. Text input works normally.
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={voiceEnabled ? "destructive" : "default"}
                  size="sm"
                  disabled={!canCapture}
                  onClick={voiceEnabled ? handleStopVoiceCapture : handleStartVoiceCapture}
                  className="flex items-center gap-2"
                >
                  {voiceEnabled ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
                {!canCapture && (
                  <span className="text-xs text-muted-foreground self-center">
                    {!consent ? "Consent required" : "Voice disabled"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes & Transcript</label>
            <textarea
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder={persona === 'family' 
                ? "e.g., What are my retirement income options? Should I roll over my 401k?"
                : "e.g., Client wants to compare rollover vs. staying in current plan..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!consent || busy || !notes.trim()}
              onClick={onSend}
              className="flex-1 min-w-[120px]"
            >
              {busy ? 'Processing...' : 'Generate Summary'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHumanHandoff('schedule')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Call
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHumanHandoff('message')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Send Message
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary</label>
              <div className="p-3 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {result.summary ?? JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Quick Contact Links */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Need human help? Try our{' '}
              <button 
                onClick={() => handleHumanHandoff('schedule')}
                className="text-primary underline hover:no-underline"
              >
                scheduling assistant
              </button>
              {' '}or{' '}
              <button 
                onClick={() => handleHumanHandoff('message')}
                className="text-primary underline hover:no-underline"
              >
                message center
              </button>
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default VoiceDrawer;