import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Link as LinkIcon,
  Shield,
  CreditCard,
  Navigation,
  Settings,
  Monitor,
  Code,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface QAIssue {
  id: string;
  category: 'route' | 'permission' | 'button' | 'gating' | 'ui' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  persona: string;
  component?: string;
  route?: string;
  fix: string;
  status: 'open' | 'in-progress' | 'resolved' | 'testing';
  assignee?: string;
  estimatedHours?: number;
}

export function QAIssueTracker() {
  const [issues, setIssues] = useState<QAIssue[]>([
    {
      id: 'ISS-001',
      category: 'route',
      priority: 'high',
      title: 'Missing PersonaTest route navigation',
      description: 'PersonaTestPage component exists but route /qa/persona-test is missing from main navigation',
      persona: 'All personas',
      route: '/qa/persona-test',
      fix: 'Add route to main navigation configuration in HierarchicalNavigationConfig.tsx',
      status: 'open',
      assignee: 'Dev Team',
      estimatedHours: 2
    },
    {
      id: 'ISS-002',
      category: 'gating',
      priority: 'medium',
      title: 'Client Premium tier detection inconsistency',
      description: 'Client premium users sometimes show as basic tier in feature gating checks',
      persona: 'Client Premium',
      component: 'useFeatureAccess hook',
      fix: 'Update tier detection logic in RoleContext to properly handle client_premium vs client+premium tier combination',
      status: 'in-progress',
      assignee: 'Backend Team',
      estimatedHours: 4
    },
    {
      id: 'ISS-003',
      category: 'button',
      priority: 'medium',
      title: 'Coming Soon buttons still clickable',
      description: 'Several "Coming Soon" buttons throughout the app are clickable but lead nowhere',
      persona: 'All personas',
      component: 'ComingSoonPage, various cards',
      fix: 'Replace alert() calls with proper disabled state and toast notifications',
      status: 'open',
      assignee: 'Frontend Team',
      estimatedHours: 3
    },
    {
      id: 'ISS-004',
      category: 'permission',
      priority: 'critical',
      title: 'Admin wildcard routes exposure',
      description: 'Admin/* routes showing ComingSoonPage instead of proper role-based restrictions',
      persona: 'Non-admin personas',
      route: '/admin/*',
      fix: 'Implement proper role-based route guards instead of ComingSoonPage fallbacks',
      status: 'open',
      assignee: 'Security Team',
      estimatedHours: 6
    },
    {
      id: 'ISS-005',
      category: 'ui',
      priority: 'low',
      title: 'Mobile responsiveness gaps in QA checklists',
      description: 'QA checklist pages have minor responsive design issues on mobile devices',
      persona: 'All personas',
      component: 'QA Checklist components',
      fix: 'Add responsive classes and test on multiple viewport sizes',
      status: 'open',
      assignee: 'UI/UX Team',
      estimatedHours: 4
    },
    {
      id: 'ISS-006',
      category: 'gating',
      priority: 'high',
      title: 'Lending access inconsistent for Consultants',
      description: 'Consultant persona shows lending_access: true but some lending features are gated',
      persona: 'Consultant',
      component: 'Feature gating logic',
      fix: 'Review and standardize lending feature access matrix for consultant role',
      status: 'open',
      assignee: 'Product Team',
      estimatedHours: 3
    },
    {
      id: 'ISS-007',
      category: 'performance',
      priority: 'medium',
      title: 'PersonaQA Analytics PDF export performance',
      description: 'PDF generation takes too long and blocks UI for large datasets',
      persona: 'QA Team',
      component: 'PersonaQAAnalytics export function',
      fix: 'Implement async PDF generation with loading state and progress indicator',
      status: 'testing',
      assignee: 'Performance Team',
      estimatedHours: 5
    },
    {
      id: 'ISS-008',
      category: 'route',
      priority: 'medium',
      title: 'Broken QA checklist link mapping',
      description: 'Analytics dashboard links to /qa/advisor but route is /qa/advisor-checklist',
      persona: 'QA Team',
      route: '/qa/*-checklist',
      fix: 'Update analytics dashboard to use correct checklist route patterns',
      status: 'resolved',
      assignee: 'Frontend Team',
      estimatedHours: 1
    }
  ]);

  const [filter, setFilter] = useState<{
    status: string;
    priority: string;
    category: string;
  }>({
    status: 'all',
    priority: 'all',
    category: 'all'
  });

  const toggleIssueStatus = (issueId: string, newStatus: QAIssue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
    toast.success(`Issue ${issueId} marked as ${newStatus}`);
  };

  const filteredIssues = issues.filter(issue => {
    if (filter.status !== 'all' && issue.status !== filter.status) return false;
    if (filter.priority !== 'all' && issue.priority !== filter.priority) return false;
    if (filter.category !== 'all' && issue.category !== filter.category) return false;
    return true;
  });

  const getStatusIcon = (status: QAIssue['status']) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Settings className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'testing': return <Monitor className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: QAIssue['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: QAIssue['category']) => {
    switch (category) {
      case 'route': return <Navigation className="h-4 w-4" />;
      case 'permission': return <Shield className="h-4 w-4" />;
      case 'button': return <LinkIcon className="h-4 w-4" />;
      case 'gating': return <CreditCard className="h-4 w-4" />;
      case 'ui': return <Monitor className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getCompletionStats = () => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const inProgress = issues.filter(i => i.status === 'in-progress').length;
    const testing = issues.filter(i => i.status === 'testing').length;
    const remaining = total - resolved;
    
    return { total, resolved, inProgress, testing, remaining, completionRate: Math.round((resolved / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">QA Issue Tracker</h1>
            <p className="text-muted-foreground">
              Track and resolve the remaining 5% issues from persona testing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {stats.completionRate}% Complete
            </Badge>
            <Badge variant="secondary">
              {stats.remaining} Remaining
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Testing</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.testing}</p>
              </div>
              <Monitor className="h-8 w-8 text-yellow-500" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList>
            <TabsTrigger value="issues">All Issues</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="quick-fixes">Quick Fixes</TabsTrigger>
          </TabsList>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Issue Management</CardTitle>
                <div className="flex gap-4 flex-wrap">
                  <select
                    value={filter.status}
                    onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <select
                    value={filter.priority}
                    onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="all">All Priority</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  
                  <select
                    value={filter.category}
                    onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="all">All Categories</option>
                    <option value="route">Missing Routes</option>
                    <option value="permission">Permission/Role Bugs</option>
                    <option value="button">Broken Buttons/Links</option>
                    <option value="gating">Subscription Gating</option>
                    <option value="ui">UI/UX Issues</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <Card key={issue.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(issue.status)}
                              {getCategoryIcon(issue.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{issue.id}</span>
                                <Badge className={getPriorityColor(issue.priority)}>
                                  {issue.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {issue.category}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-sm mb-2">{issue.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                              <div className="text-xs text-muted-foreground">
                                <strong>Persona:</strong> {issue.persona}
                                {issue.component && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <strong>Component:</strong> {issue.component}
                                  </>
                                )}
                                {issue.route && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <strong>Route:</strong> {issue.route}
                                  </>
                                )}
                              </div>
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                                <strong>Fix:</strong> {issue.fix}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="text-right text-xs text-muted-foreground">
                              {issue.assignee && <div><strong>Assignee:</strong> {issue.assignee}</div>}
                              {issue.estimatedHours && <div><strong>Est:</strong> {issue.estimatedHours}h</div>}
                            </div>
                            <div className="flex gap-1">
                              {issue.status !== 'resolved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleIssueStatus(issue.id, issue.status === 'open' ? 'in-progress' : 'resolved')}
                                >
                                  {issue.status === 'open' ? 'Start' : 'Resolve'}
                                </Button>
                              )}
                              {issue.route && (
                                <Link to={issue.route}>
                                  <Button size="sm" variant="ghost">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Critical Issues Requiring Immediate Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.filter(i => i.priority === 'critical').map((issue) => (
                    <div key={issue.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-bold text-red-800">{issue.id}: {issue.title}</span>
                      </div>
                      <p className="text-sm text-red-700 mb-3">{issue.description}</p>
                      <div className="bg-white p-3 border border-red-200 rounded text-sm">
                        <strong>Required Fix:</strong> {issue.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quick-fixes">
            <Card>
              <CardHeader>
                <CardTitle>Quick Fixes (≤ 3 hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {issues.filter(i => (i.estimatedHours || 0) <= 3 && i.status !== 'resolved').map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={issue.status === 'resolved'}
                          onCheckedChange={() => toggleIssueStatus(issue.id, 'resolved')}
                        />
                        <div>
                          <span className="font-medium">{issue.title}</span>
                          <div className="text-sm text-muted-foreground">Est: {issue.estimatedHours}h</div>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/qa/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <Monitor className="h-4 w-4 mr-2" />
                  Return to Analytics
                </Button>
              </Link>
              <Button 
                onClick={() => {
                  const unresolvedCount = issues.filter(i => i.status !== 'resolved').length;
                  if (unresolvedCount === 0) {
                    toast.success('🎉 All issues resolved! Ready for production launch.');
                  } else {
                    toast.info(`${unresolvedCount} issues remaining before 100% completion.`);
                  }
                }}
                className="w-full justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate Completion
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Export Issue List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}