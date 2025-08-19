import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Building2, 
  UserPlus, 
  FileText, 
  PenTool,
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

const quickActions = [
  {
    id: 'accept_invite',
    title: 'Accept Invite',
    description: 'Join a client team or family office network',
    icon: Mail,
    action: () => '/invite',
    variant: 'default' as const
  },
  {
    id: 'create_org',
    title: 'Create Organization',
    description: 'Set up your practice or firm profile',
    icon: Building2,
    action: () => '/organization/setup',
    variant: 'outline' as const
  },
  {
    id: 'add_household',
    title: 'Add Household',
    description: 'Onboard a new client household',
    icon: UserPlus,
    action: () => '/clients/add',
    variant: 'outline' as const
  },
  {
    id: 'generate_report',
    title: 'Generate First Report',
    description: 'Create your first client financial report',
    icon: FileText,
    action: () => '/reports/create',
    variant: 'outline' as const
  },
  {
    id: 'connect_esign',
    title: 'Connect E-Sign',
    description: 'Link DocuSign or PandaDoc integration',
    icon: PenTool,
    action: () => '/integrations/esign',
    variant: 'outline' as const
  }
];

export function ProfessionalQuickActions() {
  const navigate = useNavigate();

  const handleActionClick = (actionId: string, actionFn: () => string) => {
    analytics.track('pros.quick_action.click', { 
      action: actionId,
      source: 'quick_actions'
    });
    navigate(actionFn());
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Quick Actions
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get started quickly with the most common professional tasks and setup processes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card 
              key={action.id} 
              className="text-center hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleActionClick(action.id, action.action)}
            >
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-4">
                  {action.description}
                </CardDescription>
                
                <Button 
                  variant={action.variant}
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}