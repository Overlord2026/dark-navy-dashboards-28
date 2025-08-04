import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Clock, Star, Shield, Phone } from 'lucide-react';

interface HealthcareModalsProps {
  activeModal: string | null;
  onClose: () => void;
  onSuccess: (type: string, data: any) => void;
}

export function HealthcareModals({ activeModal, onClose, onSuccess }: HealthcareModalsProps) {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (type: string) => {
    onSuccess(type, formData);
    setFormData({});
    onClose();
  };

  const renderModal = () => {
    switch (activeModal) {
      case 'get-quote':
        return (
          <Dialog open={!!activeModal} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Get Insurance Quote
                </DialogTitle>
                <DialogDescription>
                  Get personalized quotes for Medicare, Long-term Care, or Disability Insurance.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Insurance Type</Label>
                  <Select onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="medicare">Medicare Planning</SelectItem>
                      <SelectItem value="ltc">Long-Term Care</SelectItem>
                      <SelectItem value="disability">Disability Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Your Age</Label>
                  <Input 
                    type="number" 
                    className="touch-target"
                    placeholder="65"
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="font-medium">Annual Income</Label>
                  <Input 
                    type="text" 
                    className="touch-target"
                    placeholder="$150,000"
                    onChange={(e) => setFormData({...formData, income: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSubmit('quote')}
                    className="flex-1 touch-target font-display"
                  >
                    Get Quote
                  </Button>
                  <Button variant="outline" onClick={onClose} className="touch-target">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );

      case 'request-review':
        return (
          <Dialog open={!!activeModal} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Request Program Review
                </DialogTitle>
                <DialogDescription>
                  Get a personalized review of longevity programs that match your health goals.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Program Interest</Label>
                  <Select onValueChange={(value) => setFormData({...formData, program: value})}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select program type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="fountain-life">Fountain Life</SelectItem>
                      <SelectItem value="human-longevity">Human Longevity Inc.</SelectItem>
                      <SelectItem value="attia-healthspan">Attia Healthspan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Health Goals</Label>
                  <Textarea 
                    placeholder="Describe your specific health and longevity goals..."
                    className="touch-target"
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSubmit('review')}
                    className="flex-1 touch-target font-display"
                  >
                    Request Review
                  </Button>
                  <Button variant="outline" onClick={onClose} className="touch-target">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );

      case 'book-appointment':
        return (
          <Dialog open={!!activeModal} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Book Appointment
                </DialogTitle>
                <DialogDescription>
                  Schedule a consultation with one of our healthcare providers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Provider</Label>
                  <Select onValueChange={(value) => setFormData({...formData, provider: value})}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson (Primary Care)</SelectItem>
                      <SelectItem value="dr-chen">Dr. Michael Chen (Cardiologist)</SelectItem>
                      <SelectItem value="new-provider">Find New Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Appointment Type</Label>
                  <Select onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="annual">Annual Checkup</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-medium">Preferred Date</Label>
                  <Input 
                    type="date" 
                    className="touch-target"
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSubmit('appointment')}
                    className="flex-1 touch-target font-display"
                  >
                    Book Appointment
                  </Button>
                  <Button variant="outline" onClick={onClose} className="touch-target">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );

      case 'set-rates':
        return (
          <Dialog open={!!activeModal} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Set Consultation Rates
                </DialogTitle>
                <DialogDescription>
                  Configure your consultation rates and availability for potential clients.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Initial Consultation Rate</Label>
                  <Input 
                    type="number" 
                    placeholder="500"
                    className="touch-target"
                    onChange={(e) => setFormData({...formData, initialRate: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="font-medium">Follow-up Session Rate</Label>
                  <Input 
                    type="number" 
                    placeholder="300"
                    className="touch-target"
                    onChange={(e) => setFormData({...formData, followupRate: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="font-medium">Session Duration</Label>
                  <Select onValueChange={(value) => setFormData({...formData, duration: value})}>
                    <SelectTrigger className="touch-target">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSubmit('rates')}
                    className="flex-1 touch-target font-display"
                  >
                    Save Rates
                  </Button>
                  <Button variant="outline" onClick={onClose} className="touch-target">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );

      default:
        return null;
    }
  };

  return renderModal();
}