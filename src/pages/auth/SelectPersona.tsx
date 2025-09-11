import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Calculator, Scale, Shield, UserCog } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const personas = [
  {
    id: 'client',
    title: 'Family',
    description: 'Personal and family financial management',
    icon: Users,
    route: '/family/home',
    color: 'text-blue-600'
  },
  {
    id: 'advisor',
    title: 'Financial Advisor',
    description: 'Client management and advisory tools',
    icon: Briefcase,
    route: '/pros/advisors',
    color: 'text-green-600'
  },
  {
    id: 'accountant',
    title: 'CPA / Accountant',
    description: 'Tax and accounting services',
    icon: Calculator,
    route: '/cpa/home',
    color: 'text-orange-600'
  },
  {
    id: 'attorney',
    title: 'Attorney',
    description: 'Legal and estate planning services',
    icon: Scale,
    route: '/attorney/home',
    color: 'text-purple-600'
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'System administration and management',
    icon: Shield,
    route: '/admin/hq',
    color: 'text-red-600'
  }
];

export default function SelectPersona() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const handlePersonaSelect = async (personaId: string, route: string) => {
    if (!user) {
      toast.error('Please sign in first');
      navigate('/auth');
      return;
    }

    try {
      // Update user profile with selected persona
      const { error } = await supabase
        .from('profiles')
        .update({ role: personaId })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating persona:', error);
        toast.error('Failed to update persona. Please try again.');
        return;
      }

      // Refresh the user profile to get the updated role
      await refreshProfile();
      
      toast.success('Persona updated successfully!');
      navigate(route);
    } catch (error) {
      console.error('Error selecting persona:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Select Your Role</h1>
          <p className="text-muted-foreground text-lg">
            Choose your primary role to access the most relevant tools and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <Card 
                key={persona.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                onClick={() => handlePersonaSelect(persona.id, persona.route)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Icon className={`w-12 h-12 ${persona.color}`} />
                  </div>
                  <CardTitle className="text-xl">{persona.title}</CardTitle>
                  <CardDescription>{persona.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Select Role
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You can change your role anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
}