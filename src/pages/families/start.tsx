import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function FamiliesStart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    persona: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.persona) {
      toast({
        title: "Please select your situation",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('families_intake')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Welcome to BFO!",
        description: "Let's get started with your financial journey."
      });

      // Route based on persona selection
      if (formData.persona === 'retiree') {
        navigate('/families/retirees');
      } else {
        navigate('/families/aspiring');
      }
    } catch (error) {
      toast({
        title: "Failed to create account",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bfo-card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
              <p className="text-white/70">Join thousands of families securing their financial future</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                    className="input-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                    className="input-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="input-black"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  Phone (Cell)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-black"
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-2">
                  Which best describes you?
                </label>
                <Select value={formData.persona} onValueChange={(value) => setFormData(prev => ({ ...prev, persona: value }))}>
                  <SelectTrigger className="input-black">
                    <SelectValue placeholder="Select your situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retiree">Retiree - Planning for retirement years</SelectItem>
                    <SelectItem value="aspiring">Aspiring Family - Building wealth for the future</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full"
              >
                {submitting ? 'Creating Account...' : 'Get Started'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}