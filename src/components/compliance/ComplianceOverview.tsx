import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';

export const ComplianceOverview: React.FC = () => {
  const complianceScore = 87;
  const overdueItems = 3;
  const upcomingDeadlines = 7;
  const documentsToReview = 12;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Compliance Score */}
      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          <Shield className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{complianceScore}%</div>
          <Progress value={complianceScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Above industry average
          </p>
        </CardContent>
      </Card>

      {/* Overdue Items */}
      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{overdueItems}</div>
          <Badge variant="destructive" className="mt-2">High Priority</Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Requires immediate attention
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <Calendar className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Next 30 days
          </p>
          <Badge variant="outline" className="mt-2">
            <Clock className="h-3 w-3 mr-1" />
            Plan ahead
          </Badge>
        </CardContent>
      </Card>

      {/* Documents to Review */}
      <Card className="premium-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{documentsToReview}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Documents awaiting review
          </p>
          <Badge variant="outline" className="mt-2">Active</Badge>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card className="premium-card md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Compliance Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">ADV Annual Amendment filed successfully</span>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm">Privacy Policy update required for CCPA compliance</span>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">5 staff members completed Q4 compliance training</span>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};