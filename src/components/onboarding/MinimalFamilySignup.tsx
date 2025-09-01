import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MinimalFamilySignupProps {
  onComplete?: () => void;
}

export default function MinimalFamilySignup({ onComplete }: MinimalFamilySignupProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update profile with form data
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email || user.email,
            phone: formData.phone,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) throw error;
      }

      // Store in localStorage as backup
      localStorage.setItem('family_profile', JSON.stringify(formData));
      
      toast.success('Profile saved! Welcome to your Family Workspace.');
      
      if (onComplete) {
        onComplete();
      } else {
        navigate('/families');
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bfo-card p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Start Your Workspace</h2>
          <p className="text-white/80">Just 4 quick details to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Creating workspace...' : 'Start workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}