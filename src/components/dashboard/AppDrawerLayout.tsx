import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, MessageCircle, Search, HelpCircle, Crown, Plus, UserPlus, Calendar, Upload, Star, Clock, Briefcase, Calculator, Lock } from 'lucide-react';
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
          description: 'Connect financial accounts',
          icon: Plus,
          action: () => navigate('/accounts/add'),
          variant: 'primary'
        },
        {
          id: 'upload-document',
          title: 'Upload Document',
          description: 'Secure vault storage',
          icon: Upload,
          action: () => navigate('/vault/upload')
        },
        {
          id: 'schedule-meeting',
          title: 'Schedule Meeting',
          description: 'Book advisor time',
          icon: Calendar,
          action: () => navigate('/meetings/schedule')
        },
        {
          id: 'ask-linda',
          title: 'Ask Linda',
          description: 'AI assistance',
          icon: MessageCircle,
          action: () => setShowAIConcierge(true),
          variant: 'secondary'
        }
      ],
      advisor: [
        {
          id: 'invite-client',
          title: 'Invite Client',
          description: 'Send invitation',
          icon: UserPlus,
          action: () => navigate('/advisor/invite'),
          variant: 'primary'
        },
        {
          id: 'generate-report',
          title: 'Create Report',
          description: 'Client reports',
          icon: Upload,
          action: () => navigate('/advisor/reports')
        },
        {
          id: 'schedule-review',
          title: 'Schedule Review',
          description: 'Client meetings',
          icon: Calendar,
          action: () => navigate('/advisor/calendar')
        },
        {
          id: 'ask-linda',
          title: 'Ask Linda',
          description: 'Practice AI assistant',
          icon: MessageCircle,
          action: () => setShowAIConcierge(true),
          variant: 'secondary'
        }
      ],
      accountant: [
        {
          id: 'start-tax-prep',
          title: 'Start Tax Prep',
          description: 'Begin tax preparation',
          icon: Calculator,
          action: () => navigate('/accountant/tax-prep'),
          variant: 'primary'
        },
        {
          id: 'upload-documents',
          title: 'Upload Documents',
          description: 'Client tax documents',
          icon: Upload,
          action: () => navigate('/accountant/documents')
        },
        {
          id: 'schedule-appointment',
          title: 'Schedule Meeting',
          description: 'Client consultation',
          icon: Calendar,
          action: () => navigate('/accountant/calendar')
        },
        {
          id: 'ask-linda',
          title: 'Ask Linda',
          description: 'Tax AI assistant',
          icon: MessageCircle,
          action: () => setShowAIConcierge(true),
          variant: 'secondary'
        }
      ],
      attorney: [
        {
          id: 'create-document',
          title: 'Create Document',
          description: 'Legal documents',
          icon: Plus,
          action: () => navigate('/attorney/documents'),
          variant: 'primary'
        },
        {
          id: 'case-management',
          title: 'Manage Cases',
          description: 'Active cases',
          icon: Briefcase,
          action: () => navigate('/attorney/cases')
        },
        {
          id: 'schedule-consultation',
          title: 'Schedule Meeting',
          description: 'Client consultation',
          icon: Calendar,
          action: () => navigate('/attorney/calendar')
        },
        {
          id: 'ask-linda',
          title: 'Ask Linda',
          description: 'Legal AI assistant',
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
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-accent/5 space-y-6 p-4 md:p-6 ${className}`}>
        {/* Enhanced Personalized Welcome Header */}
        <div className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-gold/10 rounded-2xl p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl backdrop-blur-sm"></div>
          <div className="relative z-10 space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {welcomeTitle}
              {userProfile?.name && (
                <span className="block md:inline text-primary ml-0 md:ml-2 text-xl md:text-3xl">
                  {userProfile.name.split(' ')[0]}! 👋
                </span>
              )}
            </h1>
            {welcomeDescription && (
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                {welcomeDescription}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              All systems operational • Last sync: just now
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions with Smart Recommendations */}
        <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-gold animate-pulse" />
              Quick Actions
              <Badge variant="outline" className="text-xs">Recommended for you</Badge>
            </h3>
            <Button variant="ghost" size="sm" className="text-xs">
              Customize
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayQuickActions.map((action, index) => (
              <Button
                key={action.id}
                variant={action.variant === 'primary' ? 'default' : 'outline'}
                className={`h-auto flex-col gap-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                  action.variant === 'primary' 
                    ? 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' 
                    : 'hover:border-primary/50'
                }`}
                onClick={action.action}
              >
                <action.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  action.variant === 'primary' ? 'text-primary-foreground' : ''
                }`} />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
                {index === 0 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs animate-bounce">
                    Popular
                  </Badge>
                )}
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

        {/* Recently Used with Smart Suggestions */}
        {recentlyUsed && recentlyUsed.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Recently Used
              </h3>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentlyUsed.map((module) => (
                <Button
                  key={module.id}
                  variant="outline"
                  className="h-16 flex-col gap-1 hover:bg-accent/10 transition-all duration-200 hover:scale-105 group"
                  onClick={() => handleModuleClick(module)}
                >
                  <module.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{module.title}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced App Sections with Better Organization */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  {section.title}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {section.modules.length} tools
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Customize
                  </Button>
                </div>
              </div>
            
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {section.modules.map((module) => {
                  const isPremiumLocked = module.status === 'premium' && userProfile?.client_tier !== 'premium';
                  
                  return (
                    <Card
                      key={module.id}
                      className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                        module.status === 'coming-soon' ? 'opacity-50 cursor-not-allowed' : ''
                      } ${isPremiumLocked ? 'opacity-75' : ''}`}
                      onClick={() => handleModuleClick(module)}
                    >
                    {module.status === 'premium' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-accent/10 rounded-lg"></div>
                    )}
                    
                    {module.status === 'premium' && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-gold to-accent text-white border-gold/20 shadow-lg"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {isPremiumLocked ? 'Upgrade' : 'Premium'}
                      </Badge>
                    )}
                    
                    {module.status === 'coming-soon' && (
                      <Badge 
                        variant="outline" 
                        className="absolute -top-2 -right-2 z-10 bg-muted text-muted-foreground animate-pulse"
                      >
                        Coming Soon
                      </Badge>
                    )}
                    
                    {module.badge && (
                      <Badge 
                        variant="outline" 
                        className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground animate-bounce"
                      >
                        {module.badge}
                      </Badge>
                    )}

                    {isPremiumLocked && (
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center z-20">
                        <Lock className="h-6 w-6 text-gold" />
                      </div>
                    )}

                    <CardHeader className="text-center pb-2 relative z-10">
                      <div className="flex justify-center mb-2">
                        <div className={`p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                          isPremiumLocked
                            ? 'bg-muted/50 opacity-60' 
                            : module.status === 'premium'
                            ? 'bg-gradient-to-br from-gold/20 to-accent/20 border border-gold/30'
                            : 'bg-accent/10 hover:bg-accent/20'
                        } ${module.color || 'text-accent'}`}>
                          <module.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                  
                    <CardContent className="pt-0 relative z-10">
                      <CardDescription className="text-xs text-center group-hover:text-foreground/80 transition-colors">
                        {module.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )})}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Floating AI Concierge */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <Button
          onClick={() => setShowAIConcierge(true)}
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 group transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
        
        {/* Floating help badge */}
        <div className="bg-card border rounded-lg px-3 py-1 shadow-lg animate-pulse">
          <span className="text-xs text-muted-foreground">Need help? Ask Linda!</span>
        </div>
      </div>

      {/* Enhanced AI Concierge Modal */}
      {showAIConcierge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md h-96 animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Ask Linda - AI Concierge
                <Badge variant="outline" className="text-xs">Online</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAIConcierge(false)}>
                ×
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 flex-1">
                    <p className="text-sm">
                      Hi {userProfile?.name?.split(' ')[0] || 'there'}! I'm Linda, your AI assistant. How can I help you today?
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Quick suggestions:</p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      💰 How do I add a new account?
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      📊 Help me understand my portfolio
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      📅 Schedule a meeting with my advisor
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      🏆 Show me premium features
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};