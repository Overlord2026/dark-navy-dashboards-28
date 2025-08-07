import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppDrawerLayout } from './AppDrawerLayout';
import { PersonaPracticeManagement } from '../practice/PersonaPracticeManagement';
import { getPersonaAppSections } from '@/data/personaAppModules';
import { useUser } from '@/context/UserContext';
import { 
  LayoutGrid, 
  Briefcase, 
  Users, 
  TrendingUp 
} from 'lucide-react';

interface PersonaDashboardTabsProps {
  className?: string;
}

export const PersonaDashboardTabs: React.FC<PersonaDashboardTabsProps> = ({ className = "" }) => {
  const { userProfile } = useUser();
  const role = userProfile?.role || 'client';
  
  // Get app sections for the current persona
  const appSections = getPersonaAppSections(role);
  
  // Mock quick stats based on persona
  const getQuickStats = () => {
    switch (role) {
      case 'advisor':
        return [
          { label: 'Total AUM', value: '$347.9M', trend: 'up' as const },
          { label: 'Active Clients', value: '42', trend: 'up' as const },
          { label: 'YTD Performance', value: '+12.8%', trend: 'up' as const }
        ];
      case 'accountant':
        return [
          { label: 'Active Clients', value: '67', trend: 'up' as const },
          { label: 'Returns Filed', value: '145', trend: 'up' as const },
          { label: 'Upcoming Deadlines', value: '7', trend: 'neutral' as const }
        ];
      case 'attorney':
        return [
          { label: 'Active Cases', value: '23', trend: 'up' as const },
          { label: 'Billable Hours', value: '156', trend: 'up' as const },
          { label: 'Documents Pending', value: '12', trend: 'neutral' as const }
        ];
      default:
        return [
          { label: 'Net Worth', value: '$2.4M', trend: 'up' as const },
          { label: 'YTD Return', value: '+8.7%', trend: 'up' as const },
          { label: 'Goal Progress', value: '73%', trend: 'up' as const }
        ];
    }
  };

  const quickStats = getQuickStats();
  const isProfessional = ['advisor', 'accountant', 'attorney', 'realtor', 'healthcare'].includes(role);

  return (
    <div className={className}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          
          {isProfessional && (
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Practice Management
            </TabsTrigger>
          )}
          
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {role === 'client' ? 'Family' : 'Clients'}
          </TabsTrigger>
          
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-0">
          <AppDrawerLayout
            sections={appSections}
            welcomeTitle={`Welcome to Your ${role === 'client' ? 'Family Office' : 'Practice'}`}
            welcomeDescription={`Your ${role === 'client' ? 'family office' : 'practice management'} dashboard`}
            quickStats={quickStats}
          />
        </TabsContent>

        {isProfessional && (
          <TabsContent value="practice" className="space-y-0">
            <div className="p-6">
              <PersonaPracticeManagement persona={role} />
            </div>
          </TabsContent>
        )}

        <TabsContent value="clients" className="space-y-0">
          <div className="p-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {role === 'client' ? 'Family Management' : 'Client Management'}
              </h3>
              <p className="text-muted-foreground">
                {role === 'client' 
                  ? 'Manage your family members and their access to the platform'
                  : 'Comprehensive client relationship management tools'
                }
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-0">
          <div className="p-6">
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {role === 'client' ? 'Performance Analytics' : 'Practice Analytics'}
              </h3>
              <p className="text-muted-foreground">
                {role === 'client' 
                  ? 'Track your financial performance and goal progress'
                  : 'Business intelligence and practice performance insights'
                }
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};