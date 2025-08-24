import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Link, Upload, Target, TrendingUp, UserPlus, Calendar,
  Building, FileText, Calculator, ShoppingBag, Award
} from 'lucide-react';
import analytics from '@/lib/analytics';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  columns?: number;
  className?: string;
}

const iconMap = {
  link: Link,
  upload: Upload,
  target: Target,
  trending: TrendingUp,
  user: UserPlus,
  calendar: Calendar,
  building: Building,
  file: FileText,
  calculator: Calculator,
  shop: ShoppingBag,
  award: Award
};

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = 'Quick Actions',
  columns = 3,
  className = ''
}) => {
  const handleActionClick = (action: QuickAction) => {
    analytics.trackEvent('quick_action.clicked', {
      action_id: action.id,
      action_label: action.label
    });
    
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-${columns} gap-3`}>
          {actions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                className="h-auto p-4 flex flex-col gap-2 text-center"
                disabled={action.disabled}
                onClick={() => handleActionClick(action)}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};