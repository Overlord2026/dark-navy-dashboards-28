import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

export const ComplianceRiskScoring: React.FC = () => {
  const overallRiskScore = 15; // Lower is better (0-100 scale)
  const riskTrend = -3; // Improving

  const riskCategories = [
    {
      category: 'Regulatory Filings',
      score: 5,
      status: 'low',
      trend: 'improving',
      lastUpdate: '2024-01-20',
      items: ['ADV current', 'All filings up to date', 'No outstanding requirements']
    },
    {
      category: 'Client Communications',
      score: 25,
      status: 'medium',
      trend: 'stable',
      lastUpdate: '2024-01-19',
      items: ['2 disclosure updates needed', 'Privacy notices pending', 'Standard compliance']
    },
    {
      category: 'Training & Certification',
      score: 10,
      status: 'low',
      trend: 'improving',
      lastUpdate: '2024-01-18',
      items: ['All staff current', 'CE requirements met', 'AML training complete']
    },
    {
      category: 'Document Retention',
      score: 20,
      status: 'medium',
      trend: 'declining',
      lastUpdate: '2024-01-17',
      items: ['Storage audit needed', '3 documents overdue review', 'Backup systems OK']
    }
  ];

  const getScoreColor = (score: number) => {
    if (score <= 15) return 'text-success';
    if (score <= 35) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (score: number) => {
    if (score <= 15) return <Badge variant="outline" className="text-success border-success">Low Risk</Badge>;
    if (score <= 35) return <Badge variant="outline" className="text-warning border-warning">Medium Risk</Badge>;
    return <Badge variant="outline" className="text-destructive border-destructive">High Risk</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="h-4 w-4 text-success" />;
      case 'declining':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Risk Scoring Dashboard</h2>
      </div>

      {/* Overall Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="premium-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Overall Compliance Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(overallRiskScore)}`}>
                  {overallRiskScore}
                </div>
                <p className="text-sm text-muted-foreground">out of 100 (lower is better)</p>
              </div>
              <div className="text-right">
                {getScoreBadge(overallRiskScore)}
                <div className="flex items-center gap-1 mt-2">
                  {getTrendIcon(riskTrend < 0 ? 'improving' : 'declining')}
                  <span className={`text-sm ${riskTrend < 0 ? 'text-success' : 'text-destructive'}`}>
                    {Math.abs(riskTrend)} points this month
                  </span>
                </div>
              </div>
            </div>
            <Progress 
              value={100 - overallRiskScore} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Score is calculated from regulatory filings, training compliance, documentation, and audit findings
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-sm">Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm">2 High Priority Items</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-warning/10 rounded">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm">5 Due This Week</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-success/10 rounded">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">12 Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {riskCategories.map((category, index) => (
          <Card key={index} className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{category.category}</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(category.trend)}
                  {getScoreBadge(category.score)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{category.score}</span>
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date(category.lastUpdate).toLocaleDateString()}
                  </span>
                </div>
                
                <Progress 
                  value={100 - category.score} 
                  className="h-1"
                />
                
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Monitoring */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Entity Risk Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">8</div>
              <p className="text-sm text-muted-foreground">Low Risk Entities</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">3</div>
              <p className="text-sm text-muted-foreground">Medium Risk Entities</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">1</div>
              <p className="text-sm text-muted-foreground">High Risk Entities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Alerts */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Automated Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <span className="text-sm font-medium">Document Retention Alert</span>
                  <p className="text-xs text-muted-foreground">3 client files exceed retention schedule</p>
                </div>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-warning" />
                <div>
                  <span className="text-sm font-medium">Training Expiration</span>
                  <p className="text-xs text-muted-foreground">2 staff members have certifications expiring in 30 days</p>
                </div>
              </div>
              <Badge variant="outline" className="text-warning border-warning">Warning</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <span className="text-sm font-medium">Policy Update Available</span>
                  <p className="text-xs text-muted-foreground">New SEC guidance requires policy template updates</p>
                </div>
              </div>
              <Badge variant="outline">Info</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};