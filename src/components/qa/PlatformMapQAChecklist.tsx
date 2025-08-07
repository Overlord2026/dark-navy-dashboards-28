import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  Users, 
  Navigation, 
  Crown,
  MessageSquare,
  Settings,
  FileText,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

interface QAChecklistItem {
  id: string;
  category: string;
  description: string;
  status: 'pending' | 'passed' | 'failed' | 'warning';
  priority: 'high' | 'medium' | 'low';
  icon: any;
  testSteps?: string[];
}

const qaChecklist: QAChecklistItem[] = [
  {
    id: 'login-dashboard-access',
    category: 'Authentication & Access',
    description: 'Can log in and access correct dashboard modules for this persona',
    status: 'pending',
    priority: 'high',
    icon: Shield,
    testSteps: [
      'Test login for each persona type',
      'Verify dashboard modules match persona permissions',
      'Check role-based access controls'
    ]
  },
  {
    id: 'tab-functionality',
    category: 'Navigation',
    description: 'All available tabs load with expected UI and links',
    status: 'pending',
    priority: 'high',
    icon: Navigation,
    testSteps: [
      'Click each tab in wireframe',
      'Verify UI loads correctly',
      'Test all navigation links'
    ]
  },
  {
    id: 'premium-features',
    category: 'Feature Gating',
    description: 'Premium features correctly show "upgrade" or "locked" status',
    status: 'pending',
    priority: 'medium',
    icon: Crown,
    testSteps: [
      'Check premium feature indicators',
      'Verify upgrade prompts appear',
      'Test locked feature behavior'
    ]
  },
  {
    id: 'communications-tab',
    category: 'Communications',
    description: 'Communications (SMS, voice, email) tab is present and functional',
    status: 'pending',
    priority: 'high',
    icon: MessageSquare,
    testSteps: [
      'Verify Communications module exists',
      'Check SMS/voice/email options',
      'Test Twilio integration display'
    ]
  },
  {
    id: 'third-party-integrations',
    category: 'Integrations',
    description: 'Third-party integrations (Plaid, Twilio, Stripe) clearly listed in module details',
    status: 'pending',
    priority: 'medium',
    icon: Settings,
    testSteps: [
      'Check Plaid integration visibility',
      'Verify Twilio features listed',
      'Confirm Stripe payment options'
    ]
  },
  {
    id: 'compliance-audit',
    category: 'Compliance',
    description: 'Compliance/audit features accessible as appropriate',
    status: 'pending',
    priority: 'high',
    icon: FileText,
    testSteps: [
      'Test compliance module access',
      'Verify audit trail features',
      'Check regulatory reporting tools'
    ]
  },
  {
    id: 'vault-billpay-permissions',
    category: 'Data Access',
    description: 'Vault and Bill Pay show correct permissions and data access',
    status: 'pending',
    priority: 'high',
    icon: Shield,
    testSteps: [
      'Test Vault access by persona',
      'Verify Bill Pay permissions',
      'Check data visibility controls'
    ]
  },
  {
    id: 'module-completeness',
    category: 'Navigation',
    description: 'No modules are missing, misnamed, or dead links',
    status: 'pending',
    priority: 'high',
    icon: Navigation,
    testSteps: [
      'Audit all module names',
      'Test every clickable element',
      'Verify navigation consistency'
    ]
  },
  {
    id: 'export-functionality',
    category: 'Export',
    description: 'Export tested (PDF, PNG) for all wireframe states',
    status: 'pending',
    priority: 'medium',
    icon: Download,
    testSteps: [
      'Test PDF export functionality',
      'Verify PNG export quality',
      'Check all wireframe states export'
    ]
  },
  {
    id: 'branding-consistency',
    category: 'Branding',
    description: 'Branding/logos appear consistently on all screens',
    status: 'pending',
    priority: 'medium',
    icon: Eye,
    testSteps: [
      'Check BFO logo placement',
      'Verify color scheme consistency',
      'Test brand elements visibility'
    ]
  },
  {
    id: 'user-guidance',
    category: 'User Experience',
    description: 'All modules have hover/click explanations for new users',
    status: 'pending',
    priority: 'medium',
    icon: Users,
    testSteps: [
      'Test hover tooltips',
      'Verify click explanations',
      'Check new user guidance'
    ]
  },
  {
    id: 'admin-analytics',
    category: 'Administration',
    description: 'Admin can access analytics and controls for all other personas',
    status: 'pending',
    priority: 'high',
    icon: BarChart3,
    testSteps: [
      'Test admin dashboard access',
      'Verify cross-persona analytics',
      'Check administrative controls'
    ]
  }
];

export const PlatformMapQAChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState(qaChecklist);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const updateItemStatus = (id: string, status: 'passed' | 'failed' | 'warning') => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const categories = ['all', ...Array.from(new Set(checklist.map(item => item.category)))];
  const filteredChecklist = selectedCategory === 'all' 
    ? checklist 
    : checklist.filter(item => item.category === selectedCategory);

  const totalItems = checklist.length;
  const passedItems = checklist.filter(item => item.status === 'passed').length;
  const failedItems = checklist.filter(item => item.status === 'failed').length;
  const warningItems = checklist.filter(item => item.status === 'warning').length;
  const progress = (passedItems / totalItems) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <div className="h-4 w-4 border-2 border-gray-300 rounded" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed': return <Badge variant="default" className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'warning': return <Badge variant="outline" className="border-yellow-400 text-yellow-800">Warning</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            Platform Map QA Testing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedItems}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedItems}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{warningItems}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalItems - passedItems - failedItems - warningItems}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* QA Checklist Items */}
      <div className="space-y-4">
        {filteredChecklist.map(item => {
          const IconComponent = item.icon;
          return (
            <Card key={item.id} className="border-l-4 border-l-gold">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-gold/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-gold" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.description}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <Badge variant="outline" className={
                          item.priority === 'high' ? 'border-red-200 text-red-700' :
                          item.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                          'border-gray-200 text-gray-700'
                        }>
                          {item.priority} priority
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Category: {item.category}
                    </div>

                    {item.testSteps && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gold hover:text-gold/80">
                          Test Steps
                        </summary>
                        <ul className="mt-2 space-y-1 ml-4">
                          {item.testSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemStatus(item.id, 'passed')}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemStatus(item.id, 'warning')}
                        className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Warning
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemStatus(item.id, 'failed')}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Fail
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => window.open('/platform-map', '_blank')}
          className="bg-gold text-navy hover:bg-gold/90"
        >
          <Eye className="h-4 w-4 mr-2" />
          Test Platform Map
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const report = {
              timestamp: new Date().toISOString(),
              totalItems,
              passedItems,
              failedItems,
              warningItems,
              progress: Math.round(progress),
              checklist: checklist.map(item => ({
                description: item.description,
                category: item.category,
                status: item.status,
                priority: item.priority
              }))
            };
            console.log('QA Report:', report);
            // Export functionality can be added here
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};