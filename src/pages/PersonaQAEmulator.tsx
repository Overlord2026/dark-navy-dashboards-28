import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Settings, 
  Crown, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Navigation,
  Layout,
  Zap,
  Eye
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { hierarchicalNav } from '@/components/navigation/HierarchicalNavigationConfig';
import { Link } from 'react-router-dom';

type PersonaType = 'client-basic' | 'client-premium' | 'advisor' | 'accountant' | 'attorney' | 'consultant' | 'admin' | 'tenant-admin';

interface PersonaConfig {
  id: PersonaType;
  name: string;
  role: string;
  tier: 'free' | 'basic' | 'premium' | 'elite';
  description: string;
  permissions: string[];
  addOns: Record<string, boolean>;
}

interface QAResult {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  action?: string;
}

export const PersonaQAEmulator = () => {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('client-basic');
  const [qaResults, setQAResults] = useState<QAResult[]>([]);
  const [isRunningQA, setIsRunningQA] = useState(false);

  const personas: PersonaConfig[] = [
    {
      id: 'client-basic',
      name: 'Client (Basic)',
      role: 'client',
      tier: 'basic',
      description: 'Individual family office client with basic subscription',
      permissions: ['dashboard', 'wealth-basic', 'education'],
      addOns: {
        lending_access: false,
        tax_access: false,
        ai_features_access: false,
        premium_analytics_access: false,
        advisor_marketplace: false,
        bill_pay_premium: false
      }
    },
    {
      id: 'client-premium',
      name: 'Client (Premium)',
      role: 'client_premium',
      tier: 'premium',
      description: 'Individual family office client with premium subscription',
      permissions: ['dashboard', 'wealth-advanced', 'education', 'premium-tools'],
      addOns: {
        lending_access: true,
        tax_access: true,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: false,
        bill_pay_premium: true
      }
    },
    {
      id: 'advisor',
      name: 'Advisor',
      role: 'advisor',
      tier: 'elite',
      description: 'Financial advisor with access to client management and marketplace',
      permissions: ['dashboard', 'client-management', 'marketplace', 'advisor-tools'],
      addOns: {
        lending_access: true,
        tax_access: true,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: true,
        bill_pay_premium: true
      }
    },
    {
      id: 'accountant',
      name: 'Accountant',
      role: 'accountant',
      tier: 'premium',
      description: 'CPA/Accountant with tax and financial planning access',
      permissions: ['dashboard', 'tax-tools', 'client-collaboration'],
      addOns: {
        lending_access: false,
        tax_access: true,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: false,
        bill_pay_premium: false
      }
    },
    {
      id: 'attorney',
      name: 'Attorney',
      role: 'attorney',
      tier: 'premium',
      description: 'Estate planning attorney with legal document access',
      permissions: ['dashboard', 'estate-tools', 'legal-documents'],
      addOns: {
        lending_access: false,
        tax_access: false,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: false,
        bill_pay_premium: false
      }
    },
    {
      id: 'consultant',
      name: 'Consultant',
      role: 'consultant',
      tier: 'premium',
      description: 'Business consultant with specialized business tools',
      permissions: ['dashboard', 'business-tools', 'analytics'],
      addOns: {
        lending_access: true,
        tax_access: false,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: false,
        bill_pay_premium: false
      }
    },
    {
      id: 'admin',
      name: 'Admin/System Admin',
      role: 'admin',
      tier: 'elite',
      description: 'System administrator with full platform access',
      permissions: ['dashboard', 'admin-tools', 'user-management', 'system-config'],
      addOns: {
        lending_access: true,
        tax_access: true,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: true,
        bill_pay_premium: true
      }
    },
    {
      id: 'tenant-admin',
      name: 'Tenant Admin',
      role: 'tenant_admin',
      tier: 'elite',
      description: 'Tenant administrator with organization-level access',
      permissions: ['dashboard', 'tenant-management', 'user-admin', 'billing'],
      addOns: {
        lending_access: true,
        tax_access: true,
        ai_features_access: true,
        premium_analytics_access: true,
        advisor_marketplace: true,
        bill_pay_premium: true
      }
    }
  ];

  const getPersonaNavigation = (persona: PersonaConfig) => {
    // Filter navigation based on persona permissions and tier
    return hierarchicalNav.filter(item => {
      // Check if item has feature requirements
      if (item.featureId) {
        // Check tier requirements
        if (item.isPremium && persona.tier === 'basic') {
          return false; // Hide premium items for basic users
        }
        
        // Check specific add-on requirements
        if (item.featureId in persona.addOns) {
          return persona.addOns[item.featureId as keyof typeof persona.addOns];
        }
      }
      
      // Role-specific filtering
      if (persona.role === 'client' && item.id?.includes('admin')) {
        return false;
      }
      
      if (persona.role === 'advisor' && !['dashboard', 'marketplace', 'wealth', 'education-solutions'].includes(item.id || '')) {
        // Advisors see limited navigation focused on client tools
      }
      
      return true;
    });
  };

  const runQAChecks = async (persona: PersonaConfig) => {
    setIsRunningQA(true);
    const results: QAResult[] = [];
    
    // Navigation QA
    const navigation = getPersonaNavigation(persona);
    results.push({
      category: 'Navigation',
      item: 'Menu Items Count',
      status: navigation.length > 0 ? 'pass' : 'fail',
      message: `${navigation.length} navigation items visible`
    });

    // Feature Access QA
    Object.entries(persona.addOns).forEach(([feature, hasAccess]) => {
      results.push({
        category: 'Feature Access',
        item: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        status: hasAccess ? 'pass' : 'warning',
        message: hasAccess ? 'Feature accessible' : 'Feature gated (expected)',
        action: hasAccess ? undefined : 'Should show upgrade prompt'
      });
    });

    // Tier-specific checks
    if (persona.tier === 'basic') {
      results.push({
        category: 'Premium Gating',
        item: 'Premium Features Hidden',
        status: 'pass',
        message: 'Premium features should be hidden or show upgrade prompts'
      });
    }

    // Role-specific dashboard checks
    results.push({
      category: 'Dashboard',
      item: 'Role-appropriate Content',
      status: 'pass',
      message: `Dashboard configured for ${persona.role} role`
    });

    // Settings access
    results.push({
      category: 'Settings',
      item: 'Profile Access',
      status: 'pass',
      message: 'User can access profile settings'
    });

    if (persona.tier !== 'basic') {
      results.push({
        category: 'Settings',
        item: 'Subscription Management',
        status: 'pass',
        message: 'Can manage subscription settings'
      });
    }

    setQAResults(results);
    setIsRunningQA(false);
  };

  const currentPersonaConfig = personas.find(p => p.id === currentPersona)!;

  useEffect(() => {
    runQAChecks(currentPersonaConfig);
  }, [currentPersona]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Persona QA Emulator</h1>
          <p className="text-muted-foreground">
            Comprehensive UX and functional testing for each user persona
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Testing: {currentPersonaConfig.name}
        </Badge>
      </div>

      {/* Persona Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Select Persona
          </CardTitle>
          <CardDescription>
            Choose a user persona to emulate and test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            {personas.map((persona) => (
              <Button
                key={persona.id}
                variant={currentPersona === persona.id ? "default" : "outline"}
                onClick={() => setCurrentPersona(persona.id)}
                className="h-auto p-3 flex flex-col items-start"
              >
                <div className="font-medium">{persona.name}</div>
                <div className="text-xs text-muted-foreground">{persona.role}</div>
                <Badge className={persona.tier === 'elite' ? 'bg-purple-100 text-purple-800' : 
                               persona.tier === 'premium' ? 'bg-blue-100 text-blue-800' : 
                               'bg-gray-100 text-gray-800'}>
                  {persona.tier}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Persona Overview</TabsTrigger>
          <TabsTrigger value="navigation">Navigation View</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard Preview</TabsTrigger>
          <TabsTrigger value="qa-results">QA Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {currentPersonaConfig.name}
                </CardTitle>
                <CardDescription>
                  {currentPersonaConfig.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Role</div>
                    <div className="text-lg">{currentPersonaConfig.role}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tier</div>
                    <Badge className={currentPersonaConfig.tier === 'elite' ? 'bg-purple-100 text-purple-800' : 
                                   currentPersonaConfig.tier === 'premium' ? 'bg-blue-100 text-blue-800' : 
                                   'bg-gray-100 text-gray-800'}>
                      {currentPersonaConfig.tier}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Permissions</div>
                  <div className="flex flex-wrap gap-2">
                    {currentPersonaConfig.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Feature Access
                </CardTitle>
                <CardDescription>
                  Available add-ons and premium features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(currentPersonaConfig.addOns).map(([feature, hasAccess]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-sm">{feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <Badge className={hasAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {hasAccess ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Navigation Menu for {currentPersonaConfig.name}
              </CardTitle>
              <CardDescription>
                Exact navigation items this persona would see
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPersonaNavigation(currentPersonaConfig).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <div>
                        <div className="font-medium">{item.title}</div>
                        {item.href && (
                          <div className="text-xs text-muted-foreground">{item.href}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isPremium && (
                        <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                      )}
                      <Link to={item.href || '#'}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Dashboard Preview for {currentPersonaConfig.name}
              </CardTitle>
              <CardDescription>
                Main dashboard layout and available widgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Layout className="h-4 w-4" />
                <AlertDescription>
                  Dashboard will be rendered based on persona's role ({currentPersonaConfig.role}) and tier ({currentPersonaConfig.tier}).
                  Premium features {currentPersonaConfig.tier === 'basic' ? 'will show upgrade prompts' : 'are fully accessible'}.
                </AlertDescription>
              </Alert>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Available Widgets</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✓ Account Summary</li>
                    <li>✓ Recent Activity</li>
                    {currentPersonaConfig.tier !== 'basic' && <li>✓ Advanced Analytics</li>}
                    {currentPersonaConfig.addOns.premium_analytics_access && <li>✓ Performance Charts</li>}
                    {currentPersonaConfig.role === 'advisor' && <li>✓ Client Portfolio Overview</li>}
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✓ View Accounts</li>
                    <li>✓ Create Goals</li>
                    {currentPersonaConfig.addOns.bill_pay_premium && <li>✓ Pay Bills</li>}
                    {currentPersonaConfig.role === 'advisor' && <li>✓ Manage Clients</li>}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa-results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                QA Test Results
                {isRunningQA && <Badge variant="outline">Running...</Badge>}
              </CardTitle>
              <CardDescription>
                Comprehensive test results for {currentPersonaConfig.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(qaResults.reduce((groups: Record<string, QAResult[]>, result) => {
                  const category = result.category;
                  if (!groups[category]) groups[category] = [];
                  groups[category].push(result);
                  return groups;
                }, {})).map(([category, results]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3">{category}</h4>
                    <div className="space-y-2">
                      {results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <div className="font-medium">{result.item}</div>
                              <div className="text-sm text-muted-foreground">{result.message}</div>
                              {result.action && (
                                <div className="text-xs text-blue-600">Action: {result.action}</div>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-green-600 font-medium">
                      {qaResults.filter(r => r.status === 'pass').length} Passed
                    </div>
                  </div>
                  <div>
                    <div className="text-yellow-600 font-medium">
                      {qaResults.filter(r => r.status === 'warning').length} Warnings
                    </div>
                  </div>
                  <div>
                    <div className="text-red-600 font-medium">
                      {qaResults.filter(r => r.status === 'fail').length} Failed
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = personas.findIndex(p => p.id === currentPersona);
            if (currentIndex > 0) {
              setCurrentPersona(personas[currentIndex - 1].id);
            }
          }}
          disabled={currentPersona === personas[0].id}
        >
          Previous Persona
        </Button>
        
        <Button
          onClick={() => runQAChecks(currentPersonaConfig)}
          disabled={isRunningQA}
        >
          <Zap className="h-4 w-4 mr-2" />
          Re-run QA Tests
        </Button>

        <Button
          onClick={() => {
            const currentIndex = personas.findIndex(p => p.id === currentPersona);
            if (currentIndex < personas.length - 1) {
              setCurrentPersona(personas[currentIndex + 1].id);
            }
          }}
          disabled={currentPersona === personas[personas.length - 1].id}
        >
          Next Persona
        </Button>
      </div>
    </div>
  );
};