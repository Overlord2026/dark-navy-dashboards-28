import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Clock
} from 'lucide-react';
import { AdvisorClient } from '@/hooks/useAdvisorClients';

interface ClientProfileCardProps {
  client: AdvisorClient;
  onViewDetails?: (clientId: string) => void;
  onScheduleMeeting?: (clientId: string) => void;
  onSendMessage?: (clientId: string) => void;
}

export function ClientProfileCard({ 
  client, 
  onViewDetails, 
  onScheduleMeeting, 
  onSendMessage 
}: ClientProfileCardProps) {
  const getStatusColor = (status: AdvisorClient['status']) => {
    switch (status) {
      case 'action-needed': return 'destructive';
      case 'pending-review': return 'default';
      case 'up-to-date': return 'secondary';
      case 'onboarding': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: AdvisorClient['status']) => {
    switch (status) {
      case 'action-needed': return <AlertTriangle className="h-4 w-4" />;
      case 'pending-review': return <Clock className="h-4 w-4" />;
      case 'up-to-date': return <CheckCircle className="h-4 w-4" />;
      case 'onboarding': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AdvisorClient['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  const completionRate = client.status === 'up-to-date' ? 100 : 
                        client.status === 'pending-review' ? 75 :
                        client.status === 'onboarding' ? 25 : 50;

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className={`absolute top-0 left-0 w-full h-1 ${
        client.priority === 'high' ? 'bg-red-500' :
        client.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
      }`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusColor(client.status)} className="text-xs">
                  {getStatusIcon(client.status)}
                  <span className="ml-1 capitalize">{client.status.replace('-', ' ')}</span>
                </Badge>
                <span className={`text-xs font-medium ${getPriorityColor(client.priority)}`}>
                  {client.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
          </div>
          
          {client.totalAssets && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Assets</div>
              <div className="font-semibold text-lg">
                ${(client.totalAssets / 1000000).toFixed(1)}M
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          {client.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{client.phone}</span>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{client.documentsRequired}</span> docs pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>
              <span className="font-medium text-green-600">
                ${client.taxSavingsEstimate.toLocaleString()}
              </span> savings
            </span>
          </div>
        </div>

        {/* AI Opportunities */}
        {client.aiOpportunities > 0 && (
          <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {client.aiOpportunities} AI optimization opportunities
            </span>
          </div>
        )}

        {/* RMD Alert */}
        {client.rmdRequired && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              RMD Required by Dec 31
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Client Progress</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(client.id)}
          >
            View Details
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onScheduleMeeting?.(client.id)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-muted-foreground border-t pt-2">
          <div className="flex items-center justify-between">
            <span>Last activity: {client.lastActivity}</span>
            {client.nextMeeting && (
              <span className="font-medium">
                Next: {new Date(client.nextMeeting).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}