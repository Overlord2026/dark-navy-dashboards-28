import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolGate } from '@/components/tools/ToolGate';
import {
  Building2,
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Plus,
  BarChart3,
  Calculator,
  Settings,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  Share,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface KPIData {
  newLeads: number;
  activeListings: number;
  avgDom: number;
  showingsScheduled: number;
  ownerInvitations: number;
  capRateWatchlist: number;
  pendingClosings: number;
}

interface QuickAction {
  title: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
}

const RealtorDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPIData>({
    newLeads: 12,
    activeListings: 8,
    avgDom: 28,
    showingsScheduled: 5,
    ownerInvitations: 3,
    capRateWatchlist: 15,
    pendingClosings: 2
  });

  const [timeframe, setTimeframe] = useState('7-day');

  useEffect(() => {
    // Track dashboard view
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('realtor_dashboard_viewed', {
        timeframe
      });
    }
  }, [timeframe]);

  const quickActions: QuickAction[] = [
    {
      title: 'Add Listing',
      icon: Building2,
      color: 'text-brand-primary',
      action: () => {
        toast.info('Opening listing form...');
        // Navigate to listing form
      }
    },
    {
      title: 'Invite Owner to Portal',
      icon: Users,
      color: 'text-brand-accent',
      action: () => {
        toast.info('Opening owner invite...');
        // Open owner invitation modal
      }
    },
    {
      title: 'Generate Cap-Rate Report PDF',
      icon: Calculator,
      color: 'text-emerald-400',
      action: () => {
        toast.info('Generating PDF report...');
        // Generate cap rate PDF
      }
    },
    {
      title: 'Share Property Pack (Vault)',
      icon: Share,
      color: 'text-amber-400',
      action: () => {
        toast.info('Opening property pack sharing...');
        // Open property pack sharing
      }
    }
  ];

  const todaysTasks = [
    { time: '9:00 AM', task: 'Property showing - 123 Main St', type: 'showing' },
    { time: '11:30 AM', task: 'Owner call - Investment portfolio review', type: 'call' },
    { time: '2:00 PM', task: 'Send market update to 15 investors', type: 'email' },
    { time: '4:00 PM', task: 'Cap-rate analysis for new listing', type: 'analysis' }
  ];

  const messageThreads = [
    { from: 'John Smith (Owner)', preview: 'Looking at the property analysis...', time: '10 min ago', unread: true },
    { from: 'Sarah Johnson', preview: 'When can we schedule the showing?', time: '1 hour ago', unread: false },
    { from: 'Mike Wilson (Investor)', preview: 'Cap rate looks good, let\'s discuss...', time: '2 hours ago', unread: true }
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-dark border-b border-brand-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-brand-primary" />
              <div>
                <h1 className="text-2xl font-bold text-brand-text">Command Center</h1>
                <p className="text-brand-text/60">Your real estate business dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-brand-bg border border-brand-primary/20 text-brand-text rounded-md px-3 py-1"
              >
                <option value="7-day">7-Day View</option>
                <option value="30-day">30-Day View</option>
                <option value="90-day">90-Day View</option>
              </select>
              <Link to="/realtor/settings">
                <Button variant="outline" size="sm" className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* KPI Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand-primary">{kpis.newLeads}</div>
                  <div className="text-xs text-brand-text/60">New Leads</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand-accent">{kpis.activeListings}</div>
                  <div className="text-xs text-brand-text/60">Active Listings</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{kpis.avgDom}</div>
                  <div className="text-xs text-brand-text/60">Avg DOM</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">{kpis.showingsScheduled}</div>
                  <div className="text-xs text-brand-text/60">Showings</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{kpis.ownerInvitations}</div>
                  <div className="text-xs text-brand-text/60">Owner Invites</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400">{kpis.capRateWatchlist}</div>
                  <div className="text-xs text-brand-text/60">Cap-Rate Watch</div>
                </CardContent>
              </Card>
              
              <Card className="bg-brand-dark border-brand-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{kpis.pendingClosings}</div>
                  <div className="text-xs text-brand-text/60">Pending</div>
                </CardContent>
              </Card>
            </div>

            {/* Persona Cards - Two Rows */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Row 1 */}
              <Link to="/realtor/listings">
                <Card className="bg-brand-dark border-brand-primary/20 hover:border-brand-primary/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Building2 className="h-8 w-8 text-brand-primary" />
                      <Badge variant="outline" className="text-brand-primary border-brand-primary">
                        {kpis.activeListings}
                      </Badge>
                    </div>
                    <CardTitle className="text-brand-text">Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text/60 text-sm">Manage listings, sync MLS, calculate cap-rates</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/realtor/owners">
                <Card className="bg-brand-dark border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Users className="h-8 w-8 text-brand-accent" />
                      <Badge variant="outline" className="text-brand-accent border-brand-accent">
                        CRM
                      </Badge>
                    </div>
                    <CardTitle className="text-brand-text">Owners & Investors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text/60 text-sm">Investor CRM, portal invites, pipeline management</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/realtor/insights">
                <Card className="bg-brand-dark border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-8 w-8 text-emerald-400" />
                      <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                        Analytics
                      </Badge>
                    </div>
                    <CardTitle className="text-brand-text">Market Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text/60 text-sm">Cap-rates, comps, market trends, alerts</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Row 2 */}
              <ToolGate toolKey="wealth-vault" fallbackRoute="/tools/wealth-vault">
                <Card className="bg-brand-dark border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer" data-tool-card="wealth-vault">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <FileText className="h-8 w-8 text-amber-400" />
                      <Badge variant="outline" className="text-amber-400 border-amber-400">
                        Secure
                      </Badge>
                    </div>
                    <CardTitle className="text-brand-text">Client Portals & Vault</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text/60 text-sm">Share deeds, settlements, property packs</p>
                  </CardContent>
                </Card>
              </ToolGate>

              <ToolGate toolKey="retirement-roadmap" fallbackRoute="/tools/retirement-roadmap">
                <Card className="bg-brand-dark border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer" data-tool-card="retirement-roadmap">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Calculator className="h-8 w-8 text-purple-400" />
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        Roadmap
                      </Badge>
                    </div>
                    <CardTitle className="text-brand-text">Retirement Roadmap Linker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text/60 text-sm">Map property cashflows to Income phases</p>
                  </CardContent>
                </Card>
              </ToolGate>

              <ToolGate toolKey="entity-trust-map" fallbackRoute="/tools/entity-trust-map">
                <Card className="bg-brand-dark border-pink-400/20 hover:border-pink-400/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer" data-tool-card="entity-trust-map">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <BarChart3 className="h-8 w-8 text-pink-400" />
                      <Badge variant="outline" className="text-pink-400 border-pink-400">
                        Entities
                      </Badge>
                    </div>
                    <CardTitle className="text-brand-text">Entity Manager</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-text/60 text-sm">Map properties to LLCs, compliance reminders</p>
                  </CardContent>
                </Card>
              </ToolGate>
            </div>
          </div>

          {/* Right Rail - 1 column */}
          <div className="space-y-6">
            
            {/* Today's Schedule */}
            <Card className="bg-brand-dark border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-text flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-primary" />
                  Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaysTasks.map((task, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-brand-bg">
                    <div className="text-xs text-brand-text/60 font-mono w-16">{task.time}</div>
                    <div className="flex-1">
                      <p className="text-sm text-brand-text">{task.task}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {task.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-brand-dark border-brand-primary/20">
              <CardHeader>
                <CardTitle className="text-brand-text">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ToolGate toolKey="realtor-listings" fallbackRoute="/tools/realtor-listings">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-brand-primary/20 text-brand-text hover:bg-brand-bg"
                    data-tool-card="realtor-listings"
                  >
                    <Building2 className="h-4 w-4 text-brand-primary" />
                    Add Listing
                  </Button>
                </ToolGate>
                <ToolGate toolKey="owner-portal" fallbackRoute="/tools/owner-portal">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-brand-primary/20 text-brand-text hover:bg-brand-bg"
                    data-tool-card="owner-portal"
                  >
                    <Users className="h-4 w-4 text-brand-accent" />
                    Invite Owner to Portal
                  </Button>
                </ToolGate>
                <ToolGate toolKey="cap-rate-report" fallbackRoute="/tools/cap-rate-report">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-brand-primary/20 text-brand-text hover:bg-brand-bg"
                    data-tool-card="cap-rate-report"
                  >
                    <Calculator className="h-4 w-4 text-emerald-400" />
                    Generate Cap-Rate Report PDF
                  </Button>
                </ToolGate>
                <ToolGate toolKey="property-vault" fallbackRoute="/tools/property-vault">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-brand-primary/20 text-brand-text hover:bg-brand-bg"
                    data-tool-card="property-vault"
                  >
                    <Share className="h-4 w-4 text-amber-400" />
                    Share Property Pack (Vault)
                  </Button>
                </ToolGate>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="bg-brand-dark border-brand-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-brand-text flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-brand-accent" />
                    Messages
                  </CardTitle>
                  <Link to="/realtor/communications">
                    <Button variant="ghost" size="sm" className="text-brand-accent hover:bg-brand-accent/10">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {messageThreads.map((message, index) => (
                  <div key={index} className="p-3 rounded-lg bg-brand-bg border border-brand-primary/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-brand-text">{message.from}</span>
                      <span className="text-xs text-brand-text/60">{message.time}</span>
                    </div>
                    <p className="text-sm text-brand-text/80">{message.preview}</p>
                    {message.unread && (
                      <div className="w-2 h-2 bg-brand-primary rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtorDashboard;