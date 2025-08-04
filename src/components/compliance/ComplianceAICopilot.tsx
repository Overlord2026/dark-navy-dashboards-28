import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  FileText, 
  Search, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ComplianceAICopilot: React.FC = () => {
  const [query, setQuery] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState<File | null>(null);

  const aiSuggestions = [
    {
      id: 1,
      type: 'policy_update',
      title: 'Privacy Policy Update Recommended',
      description: 'New CCPA regulations require disclosure updates by March 1, 2024',
      priority: 'high',
      action: 'Review and update privacy disclosures',
      dueDate: '2024-03-01'
    },
    {
      id: 2,
      type: 'training',
      title: 'Compliance Training Gaps Detected',
      description: '3 staff members need updated AML certification',
      priority: 'medium',
      action: 'Schedule training sessions',
      dueDate: '2024-02-15'
    },
    {
      id: 3,
      type: 'documentation',
      title: 'Client File Documentation Review',
      description: 'Automated review found 5 incomplete client files',
      priority: 'medium',
      action: 'Complete missing documentation',
      dueDate: '2024-02-10'
    }
  ];

  const recentAnalyses = [
    {
      id: 1,
      document: 'Investment Advisory Agreement Template',
      analysis: 'Document complies with current SEC requirements. Suggested minor updates to fee disclosure language.',
      status: 'reviewed',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      document: 'Form ADV Part 2A Draft',
      analysis: 'Found 2 potential compliance issues: missing disciplinary disclosure and outdated business address.',
      status: 'issues_found',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      document: 'Client Communication Policy',
      analysis: 'Policy aligns with marketing rule requirements. No changes needed.',
      status: 'approved',
      timestamp: '2 days ago'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-warning border-warning">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'issues_found':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Compliance Copilot
        </h2>
        <Badge variant="outline" className="text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      {/* AI Query Interface */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ask Your Compliance Copilot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Ask about compliance requirements, policy updates, or regulatory changes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button className="btn-primary-gold">
                <Search className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-3">
              <div>
                <p className="font-medium text-sm">SEC Marketing Rule</p>
                <p className="text-xs text-muted-foreground">Get latest guidance</p>
              </div>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-3">
              <div>
                <p className="font-medium text-sm">Privacy Compliance</p>
                <p className="text-xs text-muted-foreground">CCPA & GDPR updates</p>
              </div>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-left h-auto p-3">
              <div>
                <p className="font-medium text-sm">Document Review</p>
                <p className="text-xs text-muted-foreground">Upload for AI analysis</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Generated Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                    <p className="text-sm"><strong>Recommended Action:</strong> {suggestion.action}</p>
                  </div>
                  {getPriorityBadge(suggestion.priority)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Due: {new Date(suggestion.dueDate).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm" className="btn-primary-gold">Take Action</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Analysis History */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent AI Document Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-start gap-4 p-4 border rounded-lg">
                {getStatusIcon(analysis.status)}
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{analysis.document}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{analysis.analysis}</p>
                  <span className="text-xs text-muted-foreground">{analysis.timestamp}</span>
                </div>
                <Button variant="ghost" size="sm">
                  View Full Analysis
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>AI Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Document Review</h4>
              <p className="text-xs text-muted-foreground">Automated compliance checking</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Search className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Regulatory Research</h4>
              <p className="text-xs text-muted-foreground">Latest rule interpretations</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Policy Suggestions</h4>
              <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Compliance Monitoring</h4>
              <p className="text-xs text-muted-foreground">Continuous oversight</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};