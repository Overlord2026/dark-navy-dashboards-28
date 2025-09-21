import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FamilyCollaborationDashboard } from '@/components/professional-collaboration/FamilyCollaborationDashboard';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Calendar,
  Crown,
  Scale,
  Calculator,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  MessageSquare
} from 'lucide-react';

interface FamilyProject {
  id: string;
  name: string;
  type: 'retirement_planning' | 'estate_planning' | 'tax_optimization' | 'insurance_review';
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  professionals: Array<{
    id: string;
    name: string;
    type: 'advisor' | 'attorney' | 'accountant' | 'insurance_agent';
    status: 'assigned' | 'working' | 'review' | 'completed';
  }>;
  lastUpdate: string;
  nextMilestone?: string;
  documents: number;
}

export const FamilyProjectDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data - in production this would come from the projects table
  const familyProjects: FamilyProject[] = [
    {
      id: '1',
      name: 'Comprehensive Retirement Strategy',
      type: 'retirement_planning',
      status: 'active',
      progress: 75,
      professionals: [
        { id: 'adv1', name: 'Sarah Johnson', type: 'advisor', status: 'working' },
        { id: 'cpa1', name: 'Mike Chen', type: 'accountant', status: 'review' }
      ],
      lastUpdate: '2024-01-15',
      nextMilestone: 'Advisor review meeting',
      documents: 8
    },
    {
      id: '2', 
      name: 'Estate Plan & Trust Structure',
      type: 'estate_planning',
      status: 'active',
      progress: 45,
      professionals: [
        { id: 'att1', name: 'Robert Smith', type: 'attorney', status: 'working' },
        { id: 'adv1', name: 'Sarah Johnson', type: 'advisor', status: 'assigned' }
      ],
      lastUpdate: '2024-01-12',
      nextMilestone: 'Document drafting',
      documents: 5
    },
    {
      id: '3',
      name: 'Tax Optimization Review',
      type: 'tax_optimization',
      status: 'completed',
      progress: 100,
      professionals: [
        { id: 'cpa1', name: 'Mike Chen', type: 'accountant', status: 'completed' }
      ],
      lastUpdate: '2024-01-08',
      documents: 12
    }
  ];

  const activeProjects = familyProjects.filter(p => p.status === 'active');
  const completedProjects = familyProjects.filter(p => p.status === 'completed');

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'retirement_planning':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'estate_planning':
        return <Scale className="h-5 w-5 text-purple-500" />;
      case 'tax_optimization':
        return <Calculator className="h-5 w-5 text-green-500" />;
      case 'insurance_review':
        return <Shield className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getProfessionalIcon = (type: string) => {
    switch (type) {
      case 'advisor':
        return '💼';
      case 'attorney':
        return '⚖️';
      case 'accountant':
        return '📊';
      case 'insurance_agent':
        return '🛡️';
      default:
        return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'on_hold':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderProjectCard = (project: FamilyProject) => (
    <Card key={project.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getProjectIcon(project.type)}
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                <span className="capitalize">{project.status.replace('_', ' ')}</span>
                <span>•</span>
                <span>Updated {project.lastUpdate}</span>
              </CardDescription>
            </div>
          </div>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.progress}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Project Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Professional Team */}
          <div>
            <h4 className="text-sm font-medium mb-2">Professional Team</h4>
            <div className="flex gap-2 flex-wrap">
              {project.professionals.map((pro) => (
                <div key={pro.id} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                  <span>{getProfessionalIcon(pro.type)}</span>
                  <span>{pro.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {pro.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone */}
          {project.nextMilestone && (
            <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">Next: {project.nextMilestone}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {project.documents} documents
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.professionals.length} professionals
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Family Project Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Coordinate all your financial planning projects and professional team
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{activeProjects.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {familyProjects.filter(p => p.progress < 100).length} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Professional Team</p>
                <p className="text-2xl font-bold">
                  {Array.from(new Set(familyProjects.flatMap(p => p.professionals.map(pro => pro.id)))).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Array.from(new Set(familyProjects.flatMap(p => p.professionals.map(pro => pro.type)))).length} specialties
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedProjects.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">
                  {familyProjects.reduce((sum, p) => sum + p.documents, 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total managed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="active">Active Projects ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="collaboration">Professional Collaboration</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tax optimization completed</p>
                      <p className="text-xs text-muted-foreground">Mike Chen • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Estate documents updated</p>
                      <p className="text-xs text-muted-foreground">Robert Smith • 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-orange-100">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Review meeting scheduled</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson • 2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Upcoming Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Advisor Review Meeting</p>
                      <p className="text-xs text-muted-foreground">Retirement Strategy</p>
                    </div>
                    <Badge variant="outline">Jan 18</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Trust Document Drafting</p>
                      <p className="text-xs text-muted-foreground">Estate Planning</p>
                    </div>
                    <Badge variant="outline">Jan 22</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Insurance Policy Review</p>
                      <p className="text-xs text-muted-foreground">Risk Assessment</p>
                    </div>
                    <Badge variant="outline">Jan 25</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeProjects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new financial planning project to coordinate with your professional team
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeProjects.map(renderProjectCard)
          )}
        </TabsContent>

        <TabsContent value="collaboration">
          <FamilyCollaborationDashboard />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>
                Chronological view of all project activities and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>Timeline view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};