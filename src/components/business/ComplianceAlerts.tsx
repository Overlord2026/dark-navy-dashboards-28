import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, X, Eye } from 'lucide-react';
import { ComplianceAlert, useEntityManagement } from '@/hooks/useEntityManagement';

interface ComplianceAlertsProps {
  alerts: ComplianceAlert[];
}

export const ComplianceAlerts = ({ alerts }: ComplianceAlertsProps) => {
  const { acknowledgeAlert, resolveAlert } = useEntityManagement();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Clock;
      case 'low':
        return Eye;
      default:
        return Clock;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'filing_deadline':
        return 'Filing Deadline';
      case 'credential_expiry':
        return 'Credential Expiry';
      case 'document_required':
        return 'Document Required';
      case 'compliance_review':
        return 'Compliance Review';
      default:
        return type.replace('_', ' ');
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h3 className="mt-2 text-sm font-semibold">All caught up!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No active compliance alerts at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const highAlerts = alerts.filter(a => a.severity === 'high');
  const otherAlerts = alerts.filter(a => !['critical', 'high'].includes(a.severity));

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Critical Alerts ({criticalAlerts.length})
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
            ))}
          </div>
        </div>
      )}

      {/* High Priority Alerts */}
      {highAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            High Priority ({highAlerts.length})
          </h3>
          <div className="space-y-3">
            {highAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
            ))}
          </div>
        </div>
      )}

      {/* Other Alerts */}
      {otherAlerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Other Alerts ({otherAlerts.length})</h3>
          <div className="space-y-3">
            {otherAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface AlertCardProps {
  alert: ComplianceAlert;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

const AlertCard = ({ alert, onAcknowledge, onResolve }: AlertCardProps) => {
  const SeverityIcon = getSeverityIcon(alert.severity);
  
  return (
    <Card className={`border-l-4 ${
      alert.severity === 'critical' ? 'border-l-red-500' :
      alert.severity === 'high' ? 'border-l-orange-500' :
      alert.severity === 'medium' ? 'border-l-yellow-500' :
      'border-l-blue-500'
    }`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <SeverityIcon className={`h-5 w-5 mt-0.5 ${
              alert.severity === 'critical' ? 'text-red-500' :
              alert.severity === 'high' ? 'text-orange-500' :
              alert.severity === 'medium' ? 'text-yellow-500' :
              'text-blue-500'
            }`} />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold">{alert.title}</h4>
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
                <Badge variant="outline">
                  {getAlertTypeLabel(alert.alert_type)}
                </Badge>
              </div>
              {alert.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {alert.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {alert.due_date && (
                  <span>Due: {new Date(alert.due_date).toLocaleDateString()}</span>
                )}
                <span>Created: {new Date(alert.created_at).toLocaleDateString()}</span>
                {alert.escalation_level > 0 && (
                  <span className="text-orange-600">Escalation Level: {alert.escalation_level}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {alert.status === 'active' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  Acknowledge
                </Button>
                <Button
                  size="sm"
                  onClick={() => onResolve(alert.id)}
                >
                  Resolve
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const getSeverityColor = (severity: string): "destructive" | "secondary" | "outline" | "default" => {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return AlertTriangle;
    case 'medium':
      return Clock;
    case 'low':
      return Eye;
    default:
      return Clock;
  }
};

const getAlertTypeLabel = (type: string) => {
  switch (type) {
    case 'filing_deadline':
      return 'Filing Deadline';
    case 'credential_expiry':
      return 'Credential Expiry';
    case 'document_required':
      return 'Document Required';
    case 'compliance_review':
      return 'Compliance Review';
    default:
      return type.replace('_', ' ');
  }
};
