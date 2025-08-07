import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

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
  className?: string;
}

export const AppDrawerLayout: React.FC<AppDrawerLayoutProps> = ({
  sections,
  welcomeTitle,
  welcomeDescription,
  quickStats,
  recentlyUsed,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleModuleClick = (module: AppModule) => {
    if (module.status === 'coming-soon') return;
    navigate(module.href);
  };

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{welcomeTitle}</h1>
        {welcomeDescription && (
          <p className="text-muted-foreground">{welcomeDescription}</p>
        )}
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
                      className="absolute -top-2 -right-2 z-10 bg-gold text-gold-foreground"
                    >
                      Premium
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
                      <div className={`p-3 rounded-lg bg-accent/10 ${module.color || 'text-accent'}`}>
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
  );
};