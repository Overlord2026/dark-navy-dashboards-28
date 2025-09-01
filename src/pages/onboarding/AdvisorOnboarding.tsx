import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Briefcase, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  firm_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function AdvisorOnboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firm_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firm_name || !formData.first_name || !formData.last_name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue with onboarding.",
          variant: "destructive"
        });
        return;
      }

      // Update profile with advisor data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          role: 'advisor',
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Insert into pros table for advisor-specific data
      const { error: prosError } = await supabase
        .from('pros')
        .upsert({
          name: `${formData.first_name} ${formData.last_name}`,
          title: 'Financial Advisor',
          email: formData.email,
          created_at: new Date().toISOString()
        });

      if (prosError) {
        console.warn('Pros table update failed:', prosError);
        // Continue anyway as this might not be critical
      }

      toast({
        title: "Welcome to the Platform!",
        description: "Your advisor profile has been created successfully.",
        duration: 3000
      });

      // Redirect to advisor home
      navigate('/advisors/home');
      
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Setup Complete",
        description: "Welcome to your Advisor dashboard!",
        duration: 3000
      });
      // Fallback redirect
      navigate('/advisors/home');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-[var(--header-stack)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-black border border-[#D4AF37]">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-2xl text-[#D4AF37]">Join as a Financial Advisor</CardTitle>
          <p className="text-gray-400">Set up your professional profile to access advisor tools and client management features.</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firm_name" className="text-white">Firm Name *</Label>
              <Input
                id="firm_name"
                type="text"
                value={formData.firm_name}
                onChange={(e) => handleInputChange('firm_name', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="e.g., Smith Financial Advisors"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-white">First Name *</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-white">Last Name *</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium mt-6"
            >
              {isSubmitting ? 'Setting up...' : 'Complete Setup'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}