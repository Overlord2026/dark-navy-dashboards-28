import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedClientInvitation } from '@/hooks/useUnifiedClientInvitation';
import { UserPlus, Mail, Loader2 } from 'lucide-react';

interface UnifiedClientInvitationModalProps {
  professionalType: 'advisor' | 'cpa' | 'attorney';
  trigger?: React.ReactNode;
  serviceOptions?: string[];
}

export const UnifiedClientInvitationModal: React.FC<UnifiedClientInvitationModalProps> = ({
  professionalType,
  trigger,
  serviceOptions = []
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service_type: '',
    message: ''
  });

  const { loading, sendInvitation } = useUnifiedClientInvitation();

  const defaultServiceOptions = {
    advisor: ['Wealth Management', 'Retirement Planning', 'Tax Optimization', 'Estate Coordination', 'Insurance Review'],
    cpa: ['Tax Preparation', 'Business Accounting', 'Tax Planning', 'Payroll Services', 'Audit Support'],
    attorney: ['Estate Planning', 'Trust Administration', 'Business Formation', 'Real Estate Law', 'Family Law']
  };

  const services = serviceOptions.length > 0 ? serviceOptions : defaultServiceOptions[professionalType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days from now

    const result = await sendInvitation({
      name: formData.name,
      email: formData.email,
      professional_type: professionalType,
      service_type: formData.service_type,
      message: formData.message || `I'd like to invite you to collaborate on ${formData.service_type} services.`,
      expires_at: expirationDate.toISOString()
    });

    if (result) {
      setFormData({
        name: '',
        email: '',
        service_type: '',
        message: ''
      });
      setOpen(false);
    }
  };

  const professionalLabels = {
    advisor: 'Financial Advisor',
    cpa: 'CPA',
    attorney: 'Attorney'
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Client
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Client Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter client's full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="client@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="service">Service Type</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder={`Hi ${formData.name}, I'd like to invite you to work with me as your ${professionalLabels[professionalType]}...`}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};