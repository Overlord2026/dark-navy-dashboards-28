import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Star, 
  Calendar, 
  Video, 
  Mail, 
  FileText, 
  Users,
  AlertTriangle
} from 'lucide-react';

interface PlatformStatus {
  name: string;
  category: 'core' | 'optional' | 'migrating' | 'deprecated';
  status: 'active' | 'migrating' | 'sunset' | 'deprecated';
  progress: number;
  description: string;
  replacement?: string;
  timeline?: string;
}

export function PlatformMinimizationStatus() {
  const platforms: PlatformStatus[] = [
    // Core BFO Platform
    {
      name: 'Google Workspace',
      category: 'core',
      status: 'active',
      progress: 100,
      description: 'Default platform for meetings, calendar, docs, and email'
    },
    {
      name: 'BFO Scheduling Engine',
      category: 'core',
      status: 'active',
      progress: 85,
      description: 'Integrated scheduling replacing external platforms'
    },
    {
      name: 'BFO Practice Management',
      category: 'core',
      status: 'migrating',
      progress: 45,
      description: 'Consolidating CRM workflows into unified platform'
    },
    
    // Essential Integrations (Maintained)
    {
      name: 'Stripe',
      category: 'core',
      status: 'active',
      progress: 100,
      description: 'Payment processing and billing infrastructure'
    },
    {
      name: 'Plaid',
      category: 'core',
      status: 'active',
      progress: 100,
      description: 'Bank account aggregation and financial data'
    },
    {
      name: 'Resend',
      category: 'core',
      status: 'active',
      progress: 100,
      description: 'Email delivery infrastructure (invisible utility)'
    },
    {
      name: 'PostHog',
      category: 'core',
      status: 'active',
      progress: 100,
      description: 'Analytics and event tracking (invisible utility)'
    },
    
    // Optional Platforms
    {
      name: 'Zoom',
      category: 'optional',
      status: 'sunset',
      progress: 30,
      description: 'Optional video platform - Google Meet is default',
      replacement: 'Google Meet (Default)'
    },
    {
      name: 'Microsoft Teams',
      category: 'optional',
      status: 'active',
      progress: 100,
      description: 'Optional video platform for enterprise clients'
    },
    
    // Migrating/Deprecating
    {
      name: 'Calendly',
      category: 'deprecated',
      status: 'migrating',
      progress: 75,
      description: 'Being replaced by BFO Scheduling Engine',
      replacement: 'BFO Scheduling Engine',
      timeline: 'Q2 2024'
    },
    {
      name: 'Advyzon CRM',
      category: 'deprecated',
      status: 'migrating',
      progress: 25,
      description: 'Legacy CRM being migrated to BFO Practice Management',
      replacement: 'BFO Practice Management',
      timeline: 'Q3 2024'
    },
    {
      name: 'GoHighLevel',
      category: 'deprecated',
      status: 'migrating',
      progress: 15,
      description: 'Marketing workflows migrating to BFO platform',
      replacement: 'BFO Marketing Suite',
      timeline: 'Q4 2024'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'migrating':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sunset':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'deprecated':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (name: string) => {
    if (name.includes('Google') || name.includes('BFO')) return <Star className="h-4 w-4" />;
    if (name.includes('Calendar') || name.includes('Scheduling')) return <Calendar className="h-4 w-4" />;
    if (name.includes('Zoom') || name.includes('Teams') || name.includes('Meet')) return <Video className="h-4 w-4" />;
    if (name.includes('Resend') || name.includes('Email')) return <Mail className="h-4 w-4" />;
    if (name.includes('CRM') || name.includes('Practice')) return <Users className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'optional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'migrating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deprecated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const coreCount = platforms.filter(p => p.category === 'core').length;
  const migratingCount = platforms.filter(p => p.status === 'migrating').length;
  const averageProgress = Math.round(platforms.reduce((sum, p) => sum + p.progress, 0) / platforms.length);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            BFO Platform Minimization Progress
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Consolidating external platforms into the unified BFO ecosystem
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{coreCount}</div>
              <div className="text-sm text-muted-foreground">Core Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{migratingCount}</div>
              <div className="text-sm text-muted-foreground">In Migration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{averageProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
          </div>
          
          <Progress value={averageProgress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {platforms.map((platform, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getCategoryIcon(platform.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{platform.name}</h3>
                      {getStatusIcon(platform.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                  </div>
                </div>
                <Badge className={getCategoryColor(platform.category)}>
                  {platform.category}
                </Badge>
              </div>
              
              {platform.replacement && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Migrating to:</span>
                  <span className="font-medium">{platform.replacement}</span>
                  {platform.timeline && (
                    <Badge variant="outline" className="text-xs">
                      {platform.timeline}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{platform.progress}%</span>
                </div>
                <Progress value={platform.progress} className="h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}