import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useAppEventTracking } from '@/hooks/useEventTracking';
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Users, 
  Settings,
  BarChart3,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

const adminTiles = [
  {
    id: 'cfo',
    title: 'CFO Command Center',
    description: 'KPIs, revenue, CAC/LTV, cohort analysis, MRR/ARR',
    icon: DollarSign,
    route: '/admin/cfo',
    roles: ['admin', 'cfo']
  },
  {
    id: 'marketing',
    title: 'Marketing Hub',
    description: 'Campaigns, UTMs, funnels, email/SMS management',
    icon: TrendingUp,
    route: '/admin/marketing',
    roles: ['admin', 'marketing', 'cfo']
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Audit logs, RLS checks, security incidents',
    icon: Shield,
    route: '/admin/security',
    roles: ['admin', 'compliance', 'cfo']
  },
  {
    id: 'vetting',
    title: 'Professional Vetting',
    description: 'Review and approve professional applications',
    icon: FileCheck,
    route: '/admin/vetting',
    roles: ['admin', 'compliance']
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Tasks, tickets, bulk invites, seat management',
    icon: Settings,
    route: '/admin/operations',
    roles: ['admin', 'cfo']
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'User behavior, event tracking, performance metrics',
    icon: BarChart3,
    route: '/admin/analytics',
    roles: ['admin', 'marketing', 'cfo']
  }
];

export default function AdminHome() {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const { trackAdminView } = useAppEventTracking();

  useEffect(() => {
    trackAdminView('home');
  }, [trackAdminView]);

  const handleTileClick = (tile: typeof adminTiles[0]) => {
    trackAdminView(tile.id);
    navigate(tile.route);
  };

  // Filter tiles based on user role
  const availableTiles = adminTiles.filter(tile => 
    userProfile?.role && tile.roles.includes(userProfile.role)
  );

  // Sort tiles by user role priority
  const sortedTiles = availableTiles.sort((a, b) => {
    if (userProfile?.role === 'cfo' && a.id === 'cfo') return -1;
    if (userProfile?.role === 'marketing' && a.id === 'marketing') return -1;
    if (userProfile?.role === 'compliance' && a.id === 'security') return -1;
    return 0;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {userProfile?.name || userProfile?.email}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-muted-foreground">Role:</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium capitalize">
            {userProfile?.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTiles.map((tile) => {
          const IconComponent = tile.icon;
          return (
            <Card
              key={tile.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur-sm"
              onClick={() => handleTileClick(tile)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {tile.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tile.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Database</span>
                <span className="ml-auto text-green-700 text-sm">Healthy</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">API Services</span>
                <span className="ml-auto text-green-700 text-sm">Operational</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">Security Scan</span>
                <span className="ml-auto text-yellow-700 text-sm">9 Warnings</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}