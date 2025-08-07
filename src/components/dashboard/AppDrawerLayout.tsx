import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, MessageCircle, Search, HelpCircle, Crown, Plus, UserPlus, Calendar, Upload, Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface AppModule {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status?: 'active' | 'premium' | 'coming-soon';
  badge?: string;
  color?: string;
}

interface AppSection {
  id: string;
  title: string;
  modules: AppModule[];
}

interface AppDrawerLayoutProps {
  sections: AppSection[];
  welcomeTitle: string;
  welcomeDescription?: string;
  quickStats?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  recentlyUsed?: AppModule[];
  quickActions?: QuickAction[];
  className?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

export const AppDrawerLayout: React.FC<AppDrawerLayoutProps> = ({
  sections,
  welcomeTitle,
  welcomeDescription,
  quickStats,
  recentlyUsed,
  quickActions,
  className = ""
}) => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [showAIConcierge, setShowAIConcierge] = useState(false);
  
  const handleModuleClick = (module: AppModule) => {
    if (module.status === 'coming-soon') return;
    if (module.status === 'premium' && userProfile?.client_tier !== 'premium') {
      // Handle premium upgrade modal
      return;
    }
    navigate(module.href);
  };

  const getDefaultQuickActions = (): QuickAction[] => {
    const role = userProfile?.role || 'client';
    
    const actionsByRole: Record<string, QuickAction[]> = {
      client: [
        {
          id: 'add-account',
          title: 'Add Account',
          description: 'Connect a new financial account',
          icon: Plus,
          action: () => navigate('/accounts/add'),
          variant: 'primary'
        },
        {
          id: 'upload-document',
          title: 'Upload Document',
          description: 'Secure document storage',
          icon: Upload,
          action: () => navigate('/vault/upload')
        },
        {
          id: 'schedule-meeting',
          title: 'Schedule Meeting',
          description: 'Book time with your advisor',
          icon: Calendar,
          action: () => navigate('/meetings/schedule')
        },
        {
          id: 'ask-linda',
          title: 'Ask Linda',
          description: 'AI concierge assistance',
          icon: MessageCircle,
          action: () => setShowAIConcierge(true),
          variant: 'secondary'
        }
      ],
      advisor: [
        {
          id: 'invite-client',
          title: 'Invite Client',
          description: 'Send client invitation',
          icon: UserPlus,
          action: () => navigate('/advisor/invite'),
          variant: 'primary'
        },
        {
          id: 'generate-report',
          title: 'Generate Report',
          description: 'Create client reports',
          icon: Upload,
          action: () => navigate('/advisor/reports')
        },
        {
          id: 'schedule-review',
          title: 'Schedule Review',
          description: 'Book client meetings',
          icon: Calendar,
          action: () => navigate('/advisor/calendar')
        },
        {
          id: 'ask-linda',
          title: 'Ask Linda',
          description: 'AI practice assistant',
          icon: MessageCircle,
          action: () => setShowAIConcierge(true),
          variant: 'secondary'
        }
      ]
    };

    return actionsByRole[role] || actionsByRole.client;
  };

  const displayQuickActions = quickActions || getDefaultQuickActions();

  return (
    <>
      <div className={`space-y-6 p-6 ${className}`}>
        {/* Personalized Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {welcomeTitle}
            {userProfile?.name && (
              <span className="text-primary ml-2">{userProfile.name.split(' ')[0]}</span>
            )}
          </h1>
          {welcomeDescription && (
            <p className="text-muted-foreground">{welcomeDescription}</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayQuickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant === 'primary' ? 'default' : 'outline'}
                className="h-auto flex-col gap-2 p-4 hover:scale-105 transition-all duration-200"
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

      {/* Quick Stats */}
      {quickStats && quickStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recently Used */}
      {recentlyUsed && recentlyUsed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Recently Used</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentlyUsed.map((module) => (
              <Button
                key={module.id}
                variant="outline"
                className="h-16 flex-col gap-1 hover:bg-accent/10"
                onClick={() => handleModuleClick(module)}
              >
                <module.icon className="h-5 w-5" />
                <span className="text-xs">{module.title}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* App Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              {section.title}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {section.modules.map((module) => (
                <Card
                  key={module.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    module.status === 'coming-soon' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleModuleClick(module)}
                >
                  {module.status === 'premium' && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-gold/20 to-accent/20 text-gold border-gold/20"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  
                  {module.status === 'coming-soon' && (
                    <Badge 
                      variant="outline" 
                      className="absolute -top-2 -right-2 z-10 bg-muted text-muted-foreground"
                    >
                      Coming Soon
                    </Badge>
                  )}
                  
                  {module.badge && (
                    <Badge 
                      variant="outline" 
                      className="absolute -top-2 -right-2 z-10"
                    >
                      {module.badge}
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <div className={`p-3 rounded-lg transition-all duration-200 ${
                        module.status === 'premium' && userProfile?.client_tier !== 'premium' 
                          ? 'bg-muted/50 opacity-60' 
                          : 'bg-accent/10 hover:bg-accent/20'
                      } ${module.color || 'text-accent'}`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs text-center">
                      {module.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Floating AI Concierge Button */}
      <Button
        onClick={() => setShowAIConcierge(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* AI Concierge Modal/Chat */}
      {showAIConcierge && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md h-96">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Ask Linda - AI Concierge
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAIConcierge(false)}>
                ×
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Hi! I'm Linda, your AI assistant. How can I help you today?
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    How do I add a new account?
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    Help me understand my portfolio
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    Schedule a meeting with my advisor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};