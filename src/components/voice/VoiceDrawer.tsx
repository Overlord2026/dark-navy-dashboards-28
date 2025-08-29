import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic } from 'lucide-react';

// Conditional imports with fallbacks
let VoiceMic: React.ComponentType<any> | null = null;
let saveMeetingNote: ((params: any) => void) | null = null;

try {
  VoiceMic = require('./VoiceMic').default;
} catch {
  // VoiceMic not available
}

try {
  saveMeetingNote = require('@/services/voice').saveMeetingNote;
} catch {
  // saveMeetingNote not available
}

interface VoiceDrawerProps {
  triggerLabel?: string;
  persona?: string;
  context_ref?: string;
}

const VoiceDrawer: React.FC<VoiceDrawerProps> = ({ 
  triggerLabel = "Voice Capture", 
  persona = "family",
  context_ref 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');

  const handleTranscript = (transcriptText: string) => {
    setTranscript(transcriptText);
  };

  const handleSummary = (summaryData: any) => {
    setSummary(JSON.stringify(summaryData, null, 2));
  };

  const handleSaveNote = () => {
    if (saveMeetingNote) {
      saveMeetingNote({
        persona: persona || 'family',
        transcript,
        summary,
        saveToVault: true
      });
      setIsOpen(false);
      // Reset form
      setTranscript('');
      setSummary('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mic className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Voice capture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Voice Recording Component */}
          <div className="border rounded-lg p-4">
            {VoiceMic ? (
              <VoiceMic 
                autoSummarize={true}
                onTranscript={handleTranscript}
                onSummary={handleSummary}
              />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">VoiceMic component not available</p>
              </div>
            )}
          </div>

          {/* Transcript Area */}
          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript (editable)</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Voice transcript will appear here..."
              className="min-h-[100px]"
            />
          </div>

          {/* Summary Area */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary (JSON, read-only)</Label>
            <Textarea
              id="summary"
              value={summary}
              readOnly
              placeholder="AI summary will appear here as JSON..."
              className="min-h-[100px] bg-muted font-mono text-sm"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNote} 
              disabled={!transcript || !saveMeetingNote}
            >
              {saveMeetingNote ? 'Save Note' : 'Save function not available'}
            </Button>
          </div>

          {/* Notice for missing dependencies */}
          {(!VoiceMic || !saveMeetingNote) && (
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              Notice: {!VoiceMic && 'VoiceMic component'}{!VoiceMic && !saveMeetingNote && ' and '}{!saveMeetingNote && 'saveMeetingNote function'} not available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceDrawer;