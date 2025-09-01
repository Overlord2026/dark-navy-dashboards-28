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
      if (!user) throw new Error('Not signed in');

      await supabase
        .from('profiles')
        .upsert(
          { 
            id: user.id, 
            email: formData.email || user.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone
          },
          { onConflict: 'id' }
        );

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
        <div className="bfo-card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Start Your Workspace</h2>
            <p className="text-white/80">Just 4 quick details to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white">First Name</label>
              <input
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="input-black"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white">Last Name</label>
              <input
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="input-black"
                placeholder="Smith"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-black"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white">Mobile Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="input-black"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className="btn-gold w-full"
              >
                {loading ? 'Creating workspace...' : 'Start workspace'}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}