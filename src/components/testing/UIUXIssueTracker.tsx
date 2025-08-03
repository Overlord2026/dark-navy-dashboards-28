import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Monitor, 
  Smartphone, 
  Palette, 
  MousePointer, 
  Layout,
  Play,
  Camera,
  Calendar
} from "lucide-react";

interface UIIssue {
  id: string;
  section: 'Color Contrast' | 'Modal/Dialog Overflow' | 'Touch Targets' | 'Animations/Theme Switcher' | 'Mobile Navigation';
  route: string;
  description: string;
  status: 'blocking' | 'high' | 'medium' | 'low' | 'fixed';
  screenshot?: string;
  dateFound: string;
  dateFixed?: string;
  notes?: string;
}

export function UIUXIssueTracker() {
  const [issues, setIssues] = useState<UIIssue[]>([
    // Pre-populated with known issues from the user's report
    {
      id: '1',
      section: 'Color Contrast',
      route: '/client-dashboard',
      description: 'White text on gold background, button labels unreadable',
      status: 'fixed',
      dateFound: new Date().toISOString().split('T')[0],
      dateFixed: new Date().toISOString().split('T')[0],
      notes: 'Fixed by updating button variants to use navy/emerald instead of gold backgrounds'
    },
    {
      id: '2',
      section: 'Color Contrast', 
      route: '/advisor/portfolio',
      description: 'Light gray text on white in KPI widgets, fails contrast check',
      status: 'fixed',
      dateFound: new Date().toISOString().split('T')[0],
      dateFixed: new Date().toISOString().split('T')[0],
      notes: 'Updated CSS variables and KPI widget styling for better contrast'
    },
    {
      id: '3',
      section: 'Modal/Dialog Overflow',
      route: '/goals/add-goal',
      description: 'Modal cuts off Save button on iPhone SE in portrait mode',
      status: 'fixed',
      dateFound: new Date().toISOString().split('T')[0],
      dateFixed: new Date().toISOString().split('T')[0],
      notes: 'Added mobile-fixes.css with responsive modal handling and sticky button positioning'
    },
    {
      id: '4',
      section: 'Touch Targets',
      route: '/client-education',
      description: 'Book card icons are only 32x32px, too small for mobile users',
      status: 'fixed',
      dateFound: new Date().toISOString().split('T')[0],
      dateFixed: new Date().toISOString().split('T')[0],
      notes: 'Updated touch-target utilities to ensure 44px minimum size for all interactive elements'
    },
    {
      id: '5',
      section: 'Animations/Theme Switcher',
      route: 'Global',
      description: 'Theme switcher does not update sidebar icon colors on dark mode',
      status: 'fixed',
      dateFound: new Date().toISOString().split('T')[0],
      dateFixed: new Date().toISOString().split('T')[0],
      notes: 'Added dark mode specific CSS rules for sidebar icons and theme switcher states'
    },
    {
      id: '6',
      section: 'Mobile Navigation',
      route: 'Hamburger menu',
      description: 'Invite Family link hidden behind scroll, cannot tap on small screens',
      status: 'fixed',
      dateFound: new Date().toISOString().split('T')[0],
      dateFixed: new Date().toISOString().split('T')[0],
      notes: 'Added bottom padding to nav containers and improved scroll behavior'
    }
  ]);

  const [newIssue, setNewIssue] = useState({
    section: 'Color Contrast' as UIIssue['section'],
    route: '',
    description: '',
    status: 'high' as UIIssue['status'],
    notes: ''
  });

  const addIssue = () => {
    if (!newIssue.route || !newIssue.description) return;
    
    const issue: UIIssue = {
      id: Date.now().toString(),
      ...newIssue,
      dateFound: new Date().toISOString().split('T')[0]
    };
    
    setIssues(prev => [...prev, issue]);
    setNewIssue({
      section: 'Color Contrast',
      route: '',
      description: '',
      status: 'high',
      notes: ''
    });
  };

  const updateIssueStatus = (issueId: string, status: UIIssue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            status, 
            dateFixed: status === 'fixed' ? new Date().toISOString().split('T')[0] : undefined 
          }
        : issue
    ));
  };

  const getStatusIcon = (status: UIIssue['status']) => {
    switch (status) {
      case 'fixed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'blocking':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: UIIssue['status']) => {
    const variants = {
      fixed: 'default',
      blocking: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getSectionIcon = (section: UIIssue['section']) => {
    switch (section) {
      case 'Color Contrast':
        return <Palette className="h-4 w-4" />;
      case 'Modal/Dialog Overflow':
        return <Layout className="h-4 w-4" />;
      case 'Touch Targets':
        return <MousePointer className="h-4 w-4" />;
      case 'Animations/Theme Switcher':
        return <Play className="h-4 w-4" />;
      case 'Mobile Navigation':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const summary = {
    total: issues.length,
    fixed: issues.filter(i => i.status === 'fixed').length,
    blocking: issues.filter(i => i.status === 'blocking').length,
    high: issues.filter(i => i.status === 'high').length,
    medium: issues.filter(i => i.status === 'medium').length,
    low: issues.filter(i => i.status === 'low').length
  };

  const fixRate = summary.total > 0 ? Math.round((summary.fixed / summary.total) * 100) : 0;
  const remainingIssues = summary.total - summary.fixed;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6" />
            UI/UX Issue Tracker
          </h2>
          <p className="text-muted-foreground">
            Final Visual Pass - Quality Assurance Issues (Date: {new Date().toLocaleDateString()})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={fixRate === 100 ? "default" : remainingIssues > 0 ? "destructive" : "secondary"}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {fixRate}% Fixed
          </Badge>
          <Badge variant="outline">
            <Camera className="h-3 w-3 mr-1" />
            {summary.total} Issues
          </Badge>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Issue Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{summary.fixed}</div>
              <div className="text-sm text-muted-foreground">Fixed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{summary.blocking}</div>
              <div className="text-sm text-muted-foreground">Blocking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{summary.high}</div>
              <div className="text-sm text-muted-foreground">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{summary.medium}</div>
              <div className="text-sm text-muted-foreground">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{summary.low}</div>
              <div className="text-sm text-muted-foreground">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {remainingIssues > 0 ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Action Required:</strong> {remainingIssues} UI/UX issues remain unresolved. 
            {summary.blocking > 0 && ` ${summary.blocking} are blocking production launch.`}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>All Clear!</strong> All UI/UX issues have been resolved. Ready for production launch.
          </AlertDescription>
        </Alert>
      )}

      {/* Issues by Section */}
      {['Color Contrast', 'Modal/Dialog Overflow', 'Touch Targets', 'Animations/Theme Switcher', 'Mobile Navigation'].map(section => {
        const sectionIssues = issues.filter(issue => issue.section === section);
        if (sectionIssues.length === 0) return null;

        return (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSectionIcon(section as UIIssue['section'])}
                Section: {section} ({sectionIssues.length} issues)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectionIssues.map(issue => (
                <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(issue.status)}
                        <span className="font-medium">{issue.route}</span>
                        {getStatusBadge(issue.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {issue.description}
                      </p>
                      {issue.notes && (
                        <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded">
                          <strong>Notes:</strong> {issue.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Found: {issue.dateFound}</span>
                    {issue.dateFixed && <span>Fixed: {issue.dateFixed}</span>}
                    <div className="flex gap-2">
                      {issue.status !== 'fixed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateIssueStatus(issue.id, 'fixed')}
                        >
                          Mark Fixed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Go/No-Go Decision */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Production Launch Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 border rounded-lg">
              {remainingIssues === 0 ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-success mx-auto" />
                  <h3 className="text-xl font-bold text-success">GO for Launch</h3>
                  <p className="text-muted-foreground">
                    All UI/UX issues resolved. Ready for production deployment.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <XCircle className="h-12 w-12 text-destructive mx-auto" />
                  <h3 className="text-xl font-bold text-destructive">NO-GO for Launch</h3>
                  <p className="text-muted-foreground">
                    {remainingIssues} UI/UX issues must be resolved before production launch.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}