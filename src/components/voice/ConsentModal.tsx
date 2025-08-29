import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mic, Shield, FileText, Clock } from 'lucide-react';
import { VoicePersona } from '@/config/voice';

interface ConsentModalProps {
  isOpen: boolean;
  onConsent: (consented: boolean) => void;
  persona: VoicePersona;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onConsent,
  persona
}) => {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [understands, setUnderstands] = useState(false);

  const handleConsent = (consented: boolean) => {
    onConsent(consented);
  };

  const canConsent = hasReadTerms && understands;

  return (
    <Dialog open={isOpen} onOpenChange={() => handleConsent(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-primary" />
            <span>Voice Assistant Consent</span>
          </DialogTitle>
          <DialogDescription>
            Enable voice recording for {persona} services
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Persona Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm">
              {persona.charAt(0).toUpperCase() + persona.slice(1)} Assistant
            </Badge>
          </div>

          {/* Warning Notice */}
          <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Audio Recording Notice</p>
              <p>Your voice will be recorded and processed for service delivery.</p>
            </div>
          </div>

          {/* Data Handling Info */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Audio is encrypted and processed securely</span>
            </div>
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Transcripts are stored with content-free hashing</span>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 mt-0.5 text-purple-600" />
              <span>Session limited to 30 minutes maximum</span>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={hasReadTerms}
                onCheckedChange={(checked) => setHasReadTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I have read and agree to voice recording for {persona} services
              </label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="understands"
                checked={understands}
                onCheckedChange={(checked) => setUnderstands(checked === true)}
              />
              <label
                htmlFor="understands"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I understand my voice will be processed by AI systems
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => handleConsent(false)}
          >
            Decline
          </Button>
          <Button
            onClick={() => handleConsent(true)}
            disabled={!canConsent}
          >
            Accept & Start Recording
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentModal;