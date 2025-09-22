import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Megaphone, 
  TrendingUp, 
  Wrench,
  Home,
  Bell,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const advisorTabs = [
  {
    key: 'home',
    label: 'Home',
    icon: Home,
    path: '/advisors/home',
    description: 'Dashboard and quick actions'
  },
  {
    key: 'leads',
    label: 'Leads',
    icon: Users,
    path: '/advisors/leads',
    description: 'Prospect management and tracking'
  },
  {
    key: 'meetings',
    label: 'Meetings',
    icon: Calendar,
    path: '/advisors/meetings',
    description: 'Schedule and manage client meetings'
  },
  {
    key: 'campaigns',
    label: 'Campaigns',
    icon: Megaphone,
    path: '/advisors/campaigns',
    description: 'Marketing and outreach campaigns'
  },
  {
    key: 'pipeline',
    label: 'Pipeline',
    icon: TrendingUp,
    path: '/advisors/pipeline',
    description: 'Sales pipeline and forecasting'
  },
  {
    key: 'tools',
    label: 'Tools',
    icon: Wrench,
    path: '/advisors/tools',
    description: 'Retirement analyzer, estate planning & calculators'
  }
];

export function AdvisorsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract current tab from path
  const currentPath = location.pathname;
  const activeTab = currentPath.split('/')[2] || 'home';
  
  const handleTabChange = (tabKey: string) => {
    const tab = advisorTabs.find(t => t.key === tabKey);
    if (tab) {
      navigate(tab.path);
    }
  };

  const activeTabData = advisorTabs.find(tab => tab.key === activeTab);

  return (
    <>
      <Helmet>
        <title>Advisor Workspace | Professional Tools & Client Management</title>
        <meta name="description" content="Complete advisor workspace for managing leads, meetings, campaigns, and client relationships" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bfo-header sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bfo-icon-container">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-bfo-gold">ADVISOR PLATFORM</h1>
                    {activeTabData && (
                      <p className="text-sm text-white/70">{activeTabData.description}</p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2 bg-bfo-gold text-bfo-navy">
                  Professional
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:text-bfo-gold min-h-[44px] min-w-[44px]">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-bfo-gold min-h-[44px] min-w-[44px]">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bfo-subheader" aria-label="Advisor workspace navigation">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-6 w-full h-auto p-1 bg-transparent">
                {advisorTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className={cn(
                      "flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-all",
                      "data-[state=active]:bg-bfo-gold data-[state=active]:text-bfo-navy",
                      "text-bfo-gold hover:text-white"
                    )}
                    aria-label={`${tab.label} - ${tab.description}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </nav>

        {/* Main Content */}
        <main className="bg-bfo-navy-dark min-h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
}