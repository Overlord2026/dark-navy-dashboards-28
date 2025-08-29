import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Save, Loader2 } from 'lucide-react';
import VoiceMic from './VoiceMic';
import { useToast } from '@/hooks/use-toast';
import { VOICE_CONFIG, type VoicePersona } from '@/config/voice';
import { saveMeetingNote } from '@/services/voice';
import { analytics } from '@/lib/analytics';

interface VoiceDrawerProps {
  triggerLabel?: string;
  persona?: 'family' | 'advisor' | 'cpa' | 'attorney' | 'insurance' | 'nil' | 'other';
  context_ref?: string;
}

export default function VoiceDrawer({ 
  triggerLabel = 'Record', 
  persona = 'family',
  context_ref 
}: VoiceDrawerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [saveToVault, setSaveToVault] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Map personas to VoicePersona types
  const getVoicePersona = (p: string): VoicePersona => {
    if (p === 'cpa') return 'accountant';
    if (p === 'nil' || p === 'other') return 'family';
    return p as VoicePersona;
  };
  
  const voicePersona = getVoicePersona(persona);
  
  // Only show if voice is enabled for this persona
  if (!VOICE_CONFIG.VOICE_ENABLED || !VOICE_CONFIG.VOICE_PER_PERSONA[voicePersona]) {
    return null;
  }

  const handleOpen = () => {
    setIsOpen(true);
    analytics.trackEvent?.('assistant.open', { persona, context_ref });
  };

  const handleClose = () => {
    setIsOpen(false);
    setTranscript('');
    setSummary(null);
    setSaveToVault(true);
  };

  const handleSave = async () => {
    if (!transcript.trim()) {
      toast({
        title: 'No transcript to save',
        description: 'Please record some audio first.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveMeetingNote({
        persona,
        context_ref,
        transcript: transcript.trim(),
        summary,
        saveToVault
      });

      toast({
        title: 'Meeting note saved',
        description: saveToVault ? 'Saved to notes and vault' : 'Saved to meeting notes'
      });

      analytics.trackEvent?.('assistant.session_end', { 
        persona, 
        context_ref, 
        saved: true, 
        vault: saveToVault 
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: 'Failed to save note',
        description: error?.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpen}>
          <Mic className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Voice Assistant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Voice Recording */}
          <div className="flex justify-center">
            <VoiceMic
              label="Record"
              persona={persona}
              autoSummarize
              onTranscript={setTranscript}
              onSummary={setSummary}
              size="lg"
            />
          </div>

          {/* Transcript */}
          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript (editable)</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your recorded transcript will appear here..."
              className="min-h-[120px]"
            />
          </div>

          {/* Summary */}
          {summary && (
            <div className="space-y-2">
              <Label htmlFor="summary">Summary (readonly)</Label>
              <Textarea
                id="summary"
                value={JSON.stringify(summary, null, 2)}
                readOnly
                className="min-h-[100px] bg-muted"
              />
            </div>
          )}

          {/* Save Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="save-to-vault"
                checked={saveToVault}
                onCheckedChange={setSaveToVault}
              />
              <Label htmlFor="save-to-vault">Save to Vault</Label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!transcript.trim() || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}