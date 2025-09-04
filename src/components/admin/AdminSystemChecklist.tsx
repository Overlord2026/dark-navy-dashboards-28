import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Shield, Heart, Building, Users, FileText, BarChart3, CheckCircle, AlertTriangle, Clock, Target, Star } from 'lucide-react';

export const AdminSystemChecklist: React.FC = () => {
  const personaStats = {
    advisors: { total: 2847, activated: 412, pending: 1205, priority: 89 },
    attorneys: { total: 1563, activated: 298, pending: 845, priority: 67 },
    cpas: { total: 1923, activated: 356, pending: 1001, priority: 78 },
    healthcare: { total: 892, activated: 187, pending: 456, priority: 45 },
    insurance: { total: 3421, activated: 623, pending: 1834, priority: 134 },
    realestate: { total: 1677, activated: 289, pending: 892, priority: 56 },
    familyoffice: { total: 234, activated: 89, pending: 98, priority: 47 }
  };

  const dataSourceChecklist = [
    {
      category: "Insurance & Annuities",
      sources: [
        { name: "NAIFA (National Association of Insurance & Financial Advisors)", status: "complete", priority: "high" },
        { name: "State Insurance Commissioner Directories", status: "in-progress", priority: "high" },
        { name: "NAIC (National Association of Insurance Commissioners)", status: "pending", priority: "medium" },
        { name: "LIMRA/LOMA Member Directories", status: "complete", priority: "medium" },
        { name: "Top IMO/FMO Agent Lists", status: "in-progress", priority: "high" }
      ]
    },
    {
      category: "Healthcare & Longevity",
      sources: [
        { name: "Fountain Life Provider Network", status: "complete", priority: "high" },
        { name: "Sinclair Lab Research Partners", status: "complete", priority: "high" },
        { name: "A4M (American Academy of Anti-Aging Medicine)", status: "in-progress", priority: "medium" },
        { name: "IHMA (International Hormone & Metabolism Association)", status: "pending", priority: "medium" },
        { name: "Precision Medicine Clinic Directories", status: "in-progress", priority: "high" }
      ]
    },
    {
      category: "Financial Advisors",
      sources: [
        { name: "CFP Board Directory", status: "complete", priority: "high" },
        { name: "NAPFA (National Association of Personal Financial Advisors)", status: "complete", priority: "high" },
        { name: "FPA (Financial Planning Association)", status: "in-progress", priority: "medium" },
        { name: "State RIA Registrations", status: "in-progress", priority: "high" },
        { name: "Top RIA Firm Directories", status: "pending", priority: "medium" }
      ]
    },
    {
      category: "Legal Professionals",
      sources: [
        { name: "ABA (American Bar Association)", status: "complete", priority: "medium" },
        { name: "Estate Planning Council Directories", status: "in-progress", priority: "high" },
        { name: "State Bar Association Member Lists", status: "in-progress", priority: "medium" },
        { name: "Trusts & Estates Attorney Networks", status: "pending", priority: "high" },
        { name: "Business Law Firm Directories", status: "pending", priority: "medium" }
      ]
    },
    {
      category: "CPAs & Tax Professionals",
      sources: [
        { name: "AICPA (American Institute of CPAs)", status: "complete", priority: "high" },
        { name: "State CPA Society Member Lists", status: "in-progress", priority: "high" },
        { name: "Tax Attorney Directories", status: "pending", priority: "medium" },
        { name: "High Net Worth Tax Specialist Networks", status: "in-progress", priority: "high" },
        { name: "Family Office CPA Networks", status: "pending", priority: "medium" }
      ]
    },
    {
      category: "Family Offices",
      sources: [
        { name: "Campden Wealth Family Office Directory", status: "complete", priority: "high" },
        { name: "Family Office Exchange (FOX) Member Lists", status: "in-progress", priority: "high" },
        { name: "Single Family Office Networks", status: "pending", priority: "high" },
        { name: "Family Office Directories", status: "in-progress", priority: "medium" },
        { name: "Ultra High Net Worth Family Lists", status: "pending", priority: "high" }
      ]
    }
  ];

  const adminTasks = [
    {
      task: "Daily VIP Activation Monitoring",
      description: "Track new VIP sign-ups and activation rates by persona",
      frequency: "Daily",
      status: "automated",
      priority: "high"
    },
    {
      task: "Weekly Outreach Campaign Management",
      description: "Review email/LinkedIn/SMS campaign performance and adjust targeting",
      frequency: "Weekly",
      status: "manual",
      priority: "high"
    },
    {
      task: "Monthly Founder Badge Assignment",
      description: "Review and assign founding member badges to top 100 per persona",
      frequency: "Monthly",
      status: "manual",
      priority: "medium"
    },
    {
      task: "Quarterly Data Source Updates",
      description: "Refresh contact lists from trade associations and directories",
      frequency: "Quarterly",
      status: "manual",
      priority: "medium"
    },
    {
      task: "Onboarding Experience Optimization",
      description: "A/B test slides, help center content, and conversion flows",
      frequency: "Ongoing",
      status: "manual",
      priority: "high"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'automated': return 'bg-green-100 text-green-800';
      case 'manual': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
      case 'automated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
      case 'manual':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">Admin System Checklist</h1>
          <p className="text-muted-foreground">
            Comprehensive VIP management dashboard for all professional personas
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="admin-tasks">Admin Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(personaStats).reduce((sum, stat) => sum + stat.total, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Contacts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(personaStats).reduce((sum, stat) => sum + stat.activated, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">VIP Activated</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(personaStats).reduce((sum, stat) => sum + stat.pending, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Pending Invites</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(personaStats).reduce((sum, stat) => sum + stat.priority, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Priority Targets</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(personaStats).map(([persona, stats]) => (
              <Card key={persona} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {persona === 'advisors' && <Users className="w-5 h-5 text-primary" />}
                    {persona === 'attorneys' && <FileText className="w-5 h-5 text-primary" />}
                    {persona === 'cpas' && <BarChart3 className="w-5 h-5 text-primary" />}
                    {persona === 'healthcare' && <Heart className="w-5 h-5 text-primary" />}
                    {persona === 'insurance' && <Shield className="w-5 h-5 text-primary" />}
                    {persona === 'realestate' && <Building className="w-5 h-5 text-primary" />}
                    {persona === 'familyoffice' && <Crown className="w-5 h-5 text-primary" />}
                  </div>
                  <h3 className="font-semibold text-lg capitalize">{persona.replace(/([A-Z])/g, ' $1').trim()}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold">{stats.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Activated</span>
                    <span className="font-semibold text-green-600">{stats.activated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-semibold text-yellow-600">{stats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <span className="font-semibold text-purple-600">{stats.priority}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground mb-1">Activation Rate</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(stats.activated / stats.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {((stats.activated / stats.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data-sources">
          <div className="space-y-6">
            {dataSourceChecklist.map((category, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.sources.map((source, sourceIndex) => (
                    <div key={sourceIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(source.status)}
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(source.priority)}>
                          {source.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(source.status)}>
                          {source.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admin-tasks">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Daily Admin Operations
            </h2>
            <div className="space-y-4">
              {adminTasks.map((task, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{task.task}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Frequency: {task.frequency}</span>
                    {getStatusIcon(task.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-gold" />
                Top 100 Early Adopters
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Advisors (Top 100)</span>
                  <span className="font-semibold">89/100 Tagged</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Insurance (Top 100)</span>
                  <span className="font-semibold">134/100 Tagged</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Healthcare (Top 100)</span>
                  <span className="font-semibold">45/100 Tagged</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Family Offices (Top 50)</span>
                  <span className="font-semibold">47/50 Tagged</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Campaign Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Open Rate</span>
                  <span className="font-semibold">91.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">LinkedIn Response Rate</span>
                  <span className="font-semibold">23.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">VIP Activation Rate</span>
                  <span className="font-semibold">18.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Referral Generation</span>
                  <span className="font-semibold">3.2x Average</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};