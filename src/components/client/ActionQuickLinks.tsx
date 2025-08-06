import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Upload, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { abTesting } from '@/lib/abTesting';

export const ActionQuickLinks = () => {
  const { user } = useAuth();
  
  // A/B Test for button style
  const buttonVariant = abTesting.getVariant('action_button_style', user?.id || 'anonymous');
  const showLabels = buttonVariant?.config.showLabels ?? true;

  const actions = [
    {
      title: 'Add Account',
      description: 'Connect with Plaid or add manually',
      icon: Plus,
      onClick: () => {
        console.log('Add account');
        abTesting.trackConversion('action_button_style', buttonVariant?.id || 'unknown', user?.id || 'anonymous', 'add_account_click');
      },
      variant: 'default' as const
    },
    {
      title: 'Invite Family/Professional',
      description: 'Grant access to family or advisors',
      icon: Users,
      onClick: () => {
        console.log('Invite family');
        abTesting.trackConversion('action_button_style', buttonVariant?.id || 'unknown', user?.id || 'anonymous', 'invite_family_click');
      },
      variant: 'outline' as const
    },
    {
      title: 'Upload Document',
      description: 'Add to your Family Vault',
      icon: Upload,
      onClick: () => {
        console.log('Upload document');
        abTesting.trackConversion('action_button_style', buttonVariant?.id || 'unknown', user?.id || 'anonymous', 'upload_document_click');
      },
      variant: 'outline' as const
    },
    {
      title: 'Schedule a Call',
      description: 'Meet with your advisor team',
      icon: Calendar,
      onClick: () => {
        console.log('Schedule call');
        abTesting.trackConversion('action_button_style', buttonVariant?.id || 'unknown', user?.id || 'anonymous', 'schedule_call_click');
      },
      variant: 'secondary' as const
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`h-auto p-4 flex flex-col items-center gap-2 text-center ${!showLabels ? 'w-16 h-16 p-2' : ''}`}
              onClick={action.onClick}
              title={!showLabels ? action.title : undefined}
            >
              <action.icon className="h-6 w-6" />
              {showLabels && (
                <div>
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};