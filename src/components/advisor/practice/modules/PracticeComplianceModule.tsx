import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText,
  Calendar,
  Download,
  Upload,
  Bell,
  Eye,
  Search
} from 'lucide-react';

export function PracticeComplianceModule() {
  const complianceMetrics = {
    overallScore: 85,
    completedChecks: 42,
    totalChecks: 50,
    pendingItems: 8,
    criticalIssues: 2,
    lastAudit: 'Dec 2023'
  };

  const complianceItems = [
    {
      id: '1',
      category: 'ADV Updates',
      item: 'Annual ADV Part 2 Filing',
      dueDate: 'Mar 31, 2024',
      status: 'Completed',
      priority: 'High',
      description: 'Annual update to Form ADV Part 2 disclosure document'
    },
    {
      id: '2',
      category: 'Client Reviews',
      item: 'Quarterly Suitability Reviews',
      dueDate: 'Mar 15, 2024',
      status: 'In Progress',
      priority: 'Medium',
      description: '28 client portfolios pending suitability review'
    },
    {
      id: '3',
      category: 'Documentation',
      item: 'Investment Policy Statements',
      dueDate: 'Mar 20, 2024',
      status: 'Overdue',
      priority: 'High',
      description: '5 clients missing updated IPS documents'
    },
    {
      id: '4',
      category: 'Training',
      item: 'Annual Compliance Training',
      dueDate: 'Apr 1, 2024',
      status: 'Pending',
      priority: 'Medium',
      description: 'Complete 2024 regulatory update training'
    }
  ];

  const auditReadiness = [
    {
      category: 'Client Files',
      completion: 92,
      items: 'Advisory agreements, IPS, meeting notes',
      status: 'Good'
    },
    {
      category: 'Trade Documentation',
      completion: 88,
      items: 'Trade confirmations, allocations, best execution',
      status: 'Good'
    },
    {
      category: 'Marketing Materials',
      completion: 76,
      items: 'Advertising compliance, performance claims',
      status: 'Needs Attention'
    },
    {
      category: 'Regulatory Filings',
      completion: 94,
      items: 'ADV updates, state registrations, fees',
      status: 'Excellent'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': 
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'In Progress': 
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'Pending': 
        return <Badge variant="outline"><Calendar className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'Overdue': 
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-l-red-500';
      case 'Medium': return 'border-l-yellow-500';
      case 'Low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getReadinessColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-green-600 bg-green-50';
      case 'Good': return 'text-blue-600 bg-blue-50';
      case 'Needs Attention': return 'text-yellow-600 bg-yellow-50';
      case 'Critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{complianceMetrics.overallScore}%</div>
            <p className="text-sm text-muted-foreground">Compliance Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-green-600">{complianceMetrics.completedChecks}</div>
            <p className="text-sm text-muted-foreground">Completed Checks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-yellow-600">{complianceMetrics.pendingItems}</div>
            <p className="text-sm text-muted-foreground">Pending Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-red-600">{complianceMetrics.criticalIssues}</div>
            <p className="text-sm text-muted-foreground">Critical Issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{complianceMetrics.totalChecks}</div>
            <p className="text-sm text-muted-foreground">Total Checks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{complianceMetrics.lastAudit}</div>
            <p className="text-sm text-muted-foreground">Last Audit</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.id} className={`p-4 border-l-4 border border-border rounded-lg ${getPriorityColor(item.priority)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{item.item}</div>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Compliance Status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Mock Audit Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditReadiness.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.category}</span>
                    <Badge variant="secondary" className={getReadinessColor(category.status)}>
                      {category.status}
                    </Badge>
                  </div>
                  <Progress value={category.completion} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.items}</span>
                    <span>{category.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Audit Report
              </Button>
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Run Mock Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Vault */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compliance Document Vault
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">ADV Forms</div>
                  <div className="text-xs text-muted-foreground">12 documents</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">View Files</Button>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-medium text-sm">Client Agreements</div>
                  <div className="text-xs text-muted-foreground">127 documents</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">View Files</Button>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="font-medium text-sm">Policies & Procedures</div>
                  <div className="text-xs text-muted-foreground">8 documents</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">View Files</Button>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="font-medium text-sm">Audit Logs</div>
                  <div className="text-xs text-muted-foreground">24 documents</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">View Files</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Regulatory Alerts & Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-sm">SEC Marketing Rule Update</div>
                <div className="text-sm text-muted-foreground mb-2">
                  New requirements for testimonials and endorsements effective May 2024
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">SEC</Badge>
                  <Badge variant="outline" className="text-xs">Marketing</Badge>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
              </div>
              <Button size="sm" variant="outline">View Details</Button>
            </div>

            <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
              <Bell className="h-5 w-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <div className="font-medium text-sm">Form CRS Annual Update</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Annual review and filing of Client Relationship Summary due June 30
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">SEC</Badge>
                  <Badge variant="outline" className="text-xs">Form CRS</Badge>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
              </div>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}