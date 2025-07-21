import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Gift,
  AlertTriangle,
  CheckCircle,
  Brain,
  ArrowRight
} from "lucide-react";

interface Alert {
  id: string;
  type: 'action' | 'opportunity' | 'reminder' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionText: string;
  icon: React.ReactNode;
  dueDate?: Date;
}

export const AlertsInsights: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'reminder',
      priority: 'high',
      title: 'RMD Due Next Month',
      description: 'Your Required Minimum Distribution of $8,450 is due by December 31st.',
      actionText: 'Schedule Distribution',
      icon: <Calendar className="h-5 w-5 text-amber-600" />,
      dueDate: new Date('2024-12-31')
    },
    {
      id: '2',
      type: 'opportunity',
      priority: 'medium',
      title: 'Charitable Giving Tax Benefit',
      description: 'You\'re eligible for a $3,200 additional tax deduction through qualified charitable distributions.',
      actionText: 'Explore Options',
      icon: <Gift className="h-5 w-5 text-green-600" />
    },
    {
      id: '3',
      type: 'action',
      priority: 'medium',
      title: 'Retirement Goal Review',
      description: 'Your retirement savings may need 8% more funding to maintain your current lifestyle.',
      actionText: 'Review Strategy',
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />
    },
    {
      id: '4',
      type: 'opportunity',
      priority: 'low',
      title: 'Life Insurance Optimization',
      description: 'Consider using life insurance or trusts to fund your legacy goals more efficiently.',
      actionText: 'Learn More',
      icon: <Shield className="h-5 w-5 text-purple-600" />
    },
    {
      id: '5',
      type: 'achievement',
      priority: 'low',
      title: 'Emergency Fund Complete!',
      description: 'Congratulations! You\'ve successfully funded your 6-month emergency fund goal.',
      actionText: 'Celebrate',
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />
    }
  ];

  const getAlertBorderColor = (type: Alert['type'], priority: Alert['priority']) => {
    if (type === 'achievement') return 'border-emerald-200 bg-emerald-50';
    if (priority === 'high') return 'border-red-200 bg-red-50';
    if (priority === 'medium') return 'border-amber-200 bg-amber-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getPriorityBadge = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low Priority</Badge>;
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'action':
        return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity':
        return <Lightbulb className="h-4 w-4" />;
      case 'reminder':
        return <Calendar className="h-4 w-4" />;
      case 'achievement':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const highPriorityAlerts = alerts.filter(alert => alert.priority === 'high');
  const otherAlerts = alerts.filter(alert => alert.priority !== 'high');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">AI Insights & Alerts</h2>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Lightbulb className="h-3 w-3" />
          <span>{alerts.length} insights</span>
        </Badge>
      </div>

      {/* High Priority Alerts */}
      {highPriorityAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-red-700">Urgent Actions</h3>
          {highPriorityAlerts.map((alert) => (
            <Card key={alert.id} className={`${getAlertBorderColor(alert.type, alert.priority)} hover-scale`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {alert.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        {getPriorityBadge(alert.priority)}
                        <Badge variant="outline" className="text-xs flex items-center space-x-1">
                          {getTypeIcon(alert.type)}
                          <span className="capitalize">{alert.type}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      {alert.dueDate && (
                        <div className="text-xs text-red-600 font-medium mb-2">
                          Due: {alert.dueDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="flex items-center space-x-1">
                    <span>{alert.actionText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Other Insights */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Smart Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherAlerts.map((alert) => (
            <Card key={alert.id} className={`${getAlertBorderColor(alert.type, alert.priority)} hover-scale`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {alert.icon}
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                    </div>
                    <div className="flex space-x-1">
                      {getPriorityBadge(alert.priority)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                    <span>{alert.actionText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">AI Financial Health Summary</h3>
              <p className="text-sm text-purple-700 mb-4">
                Your financial position is strong with an 85% retirement readiness score. 
                Focus on the urgent RMD deadline and consider the charitable giving opportunity 
                to optimize your tax strategy. Your Greece trip funding is on track - well done!
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  Get Detailed Analysis
                </Button>
                <Button variant="outline" size="sm">
                  Schedule AI Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
