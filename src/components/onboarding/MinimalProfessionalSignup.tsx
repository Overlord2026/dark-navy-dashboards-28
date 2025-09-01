import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MinimalProfessionalSignupProps {
  role: 'advisor' | 'accountant' | 'attorney';
  onComplete?: () => void;
}

export default function MinimalProfessionalSignup({ role, onComplete }: MinimalProfessionalSignupProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firm_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  const getRoleDisplayName = () => {
    return {
      advisor: 'Advisor',
      accountant: 'CPA',
      attorney: 'Attorney'
    }[role];
  };

  const getDashboardRoute = () => {
    return {
      advisor: '/advisor-dashboard',
      accountant: '/accountant-dashboard', 
      attorney: '/attorney-dashboard'
    }[role];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');

      // Update profile with basic info
      await supabase
        .from('profiles')
        .upsert(
          { 
            id: user.id, 
            email: formData.email || user.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            role: role
          },
          { onConflict: 'id' }
        );

      // Store firm data (pros table doesn't have firm fields yet, so use localStorage)
      const firmData = {
        id: user.id,
        firm_name: formData.firm_name,
        contact_first_name: formData.first_name,
        contact_last_name: formData.last_name,
        email: formData.email || user.email,
        phone: formData.phone
      };
      localStorage.setItem(`${role}_firm_data`, JSON.stringify(firmData));

      // Store in localStorage as backup
      localStorage.setItem(`${role}_profile`, JSON.stringify(formData));
      
      toast.success(`Welcome! Your ${getRoleDisplayName()} workspace is ready.`);
      
      if (onComplete) {
        onComplete();
      } else {
        navigate(getDashboardRoute());
      }
      
    } catch (error) {
      console.error('Error saving professional profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bfo-card p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Start Your {getRoleDisplayName()} Workspace</h2>
          <p className="text-white/80">Practice basics to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firm_name" className="text-white">Firm Name</Label>
            <Input
              id="firm_name"
              value={formData.firm_name}
              onChange={(e) => handleInputChange('firm_name', e.target.value)}
              className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              placeholder="ABC Financial Services"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-white">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              placeholder="John"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-white">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              placeholder="Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Mobile Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-white/10 border-bfo-gold/30 text-white placeholder:text-white/50"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full bfo-cta h-12"
            >
              {loading ? 'Setting up workspace...' : 'Start workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}