// @ts-nocheck
import { useState } from 'react';
import { Headphones, Camera, MapPin, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePersonaAuth } from '@/hooks/usePersonaAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface XREvent {
  venue: string;
  timestamp: string;
  device: string;
  presence: 'physical' | 'virtual' | 'mixed';
  likeness: {
    captured: boolean;
    consent_given: boolean;
    biometric_data: boolean;
  };
  metadata?: any;
}

interface XRAttestationModalProps {
  consentId?: string;
  trigger?: React.ReactNode;
}

export default function XRAttestationModal({ consentId, trigger }: XRAttestationModalProps) {
  const { currentPersona, createReasonReceipt } = usePersonaAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [event, setEvent] = useState<Partial<XREvent>>({
    venue: '',
    device: '',
    presence: 'virtual',
    likeness: {
      captured: false,
      consent_given: false,
      biometric_data: false
    }
  });

  // Feature flag check (in production, this would come from environment/config)
  const XR_FEATURE_ENABLED = process.env.NODE_ENV === 'development' || 
    window.location.search.includes('xr=true');

  if (!XR_FEATURE_ENABLED) {
    return null;
  }

  const handleSubmit = async () => {
    if (!currentPersona || !event.venue || !event.device) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create XR attestation event
      const xrEvent: XREvent = {
        venue: event.venue!,
        timestamp: new Date().toISOString(),
        device: event.device!,
        presence: event.presence!,
        likeness: event.likeness!,
        metadata: {
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      // Create reason receipt first
      const receipt = await createReasonReceipt(
        currentPersona.id,
        'xr_attestation',
        'XR_ATTESTATION_CREATED',
        `XR attestation for ${event.venue} using ${event.device}`
      );

      if (!receipt) {
        throw new Error('Failed to create reason receipt');
      }

      // Store XR attestation
      const { error } = await supabase
        .from('xr_attestations')
        .insert({
          consent_id: consentId,
          event: xrEvent,
          receipt_id: receipt.id
        });

      if (error) throw error;

      toast.success('XR Attestation created successfully', {
        description: `Receipt ID: ${receipt.id.slice(0, 8)}...`,
        action: {
          label: 'View Receipt',
          onClick: () => console.log('Receipt:', receipt)
        }
      });

      setIsOpen(false);
      setEvent({
        venue: '',
        device: '',
        presence: 'virtual',
        likeness: {
          captured: false,
          consent_given: false,
          biometric_data: false
        }
      });

    } catch (error) {
      console.error('XR attestation error:', error);
      toast.error('Failed to create XR attestation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Headphones className="w-4 h-4 mr-2" />
            XR Attestation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5" />
            <span>XR/Metaverse Attestation</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Venue/Location *</span>
            </Label>
            <Input
              id="venue"
              placeholder="e.g., Virtual Conference Room, Metaverse Gallery"
              value={event.venue || ''}
              onChange={(e) => setEvent(prev => ({ ...prev, venue: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Device/Platform *</span>
            </Label>
            <Input
              id="device"
              placeholder="e.g., Oculus Quest 3, HoloLens, WebXR Browser"
              value={event.device || ''}
              onChange={(e) => setEvent(prev => ({ ...prev, device: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Presence Type</span>
            </Label>
            <div className="flex space-x-2">
              {(['virtual', 'physical', 'mixed'] as const).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={event.presence === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEvent(prev => ({ ...prev, presence: type }))}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Likeness & Biometric Consent</Label>
            <div className="space-y-2">
              {Object.entries({
                captured: 'Likeness captured',
                consent_given: 'Consent provided',
                biometric_data: 'Biometric data collected'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={event.likeness?.[key as keyof typeof event.likeness] || false}
                    onChange={(e) => setEvent(prev => ({
                      ...prev,
                      likeness: {
                        ...prev.likeness!,
                        [key]: e.target.checked
                      }
                    }))}
                    className="rounded"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !event.venue || !event.device}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Attestation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}