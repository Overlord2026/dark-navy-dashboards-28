import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Calendar, 
  FileText,
  Bell,
  X,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CEReminder } from '@/hooks/useInsuranceAgent';

interface Alert {
  id: string;
  type: 'license_expiry' | 'ce_deadline' | 'low_credits' | 'verification_needed';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  dueDate?: Date;
  actionUrl?: string;
  actionLabel?: string;
}

interface ComplianceAlertsPanelProps {
  reminders: CEReminder[];
  daysUntilExpiry: number | null;
  ceProgress: { percentage: number; status: string };
  unverifiedCourses: number;
  onDismissReminder?: (id: string) => void;
}

export function ComplianceAlertsPanel({ 
  reminders, 
  daysUntilExpiry, 
  ceProgress,
  unverifiedCourses,
  onDismissReminder 
}: ComplianceAlertsPanelProps) {
  // Generate alerts from various sources
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    // License expiry alerts
    if (daysUntilExpiry !== null) {
      if (daysUntilExpiry <= 0) {
        alerts.push({
          id: 'license-expired',
          type: 'license_expiry',
          severity: 'high',
          title: 'License Expired',
          message: 'Your insurance license has expired. Immediate renewal required.',
          actionLabel: 'Renew License',
          actionUrl: '/license-renewal'
        });
      } else if (daysUntilExpiry <= 30) {
        alerts.push({
          id: 'license-expiring-soon',
          type: 'license_expiry',
          severity: 'high',
          title: 'License Expiring Soon',
          message: `Your license expires in ${daysUntilExpiry} days. Start renewal process now.`,
          dueDate: new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000),
          actionLabel: 'Start Renewal',
          actionUrl: '/license-renewal'
        });
      } else if (daysUntilExpiry <= 90) {
        alerts.push({
          id: 'license-renewal-due',
          type: 'license_expiry',
          severity: 'medium',
          title: 'License Renewal Due',
          message: `Your license expires in ${daysUntilExpiry} days. Plan for renewal.`,
          dueDate: new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000),
          actionLabel: 'Plan Renewal',
          actionUrl: '/license-renewal'
        });
      }
    }

    // CE progress alerts
    if (ceProgress.percentage < 50) {
      alerts.push({
        id: 'low-ce-credits',
        type: 'low_credits',
        severity: 'medium',
        title: 'Low CE Credits',
        message: `You've completed ${ceProgress.percentage.toFixed(0)}% of required CE credits. Time to catch up!`,
        actionLabel: 'Find Courses',
        actionUrl: '/ce-courses'
      });
    }

    // Verification alerts
    if (unverifiedCourses > 0) {
      alerts.push({
        id: 'courses-need-verification',
        type: 'verification_needed',
        severity: 'medium',
        title: 'Courses Need Verification',
        message: `${unverifiedCourses} course${unverifiedCourses > 1 ? 's' : ''} pending verification. Credits won't count until verified.`,
        actionLabel: 'Submit for Review',
        actionUrl: '/verification'
      });
    }

    // Add reminders as alerts
    reminders.forEach(reminder => {
      alerts.push({
        id: reminder.id || `reminder-${Date.now()}`,
        type: reminder.reminder_type === 'License Expiry' ? 'license_expiry' : 'ce_deadline',
        severity: reminder.reminder_type === 'License Expiry' ? 'high' : 'medium',
        title: reminder.reminder_type,
        message: reminder.message || 'Compliance reminder',
        dueDate: reminder.trigger_date
      });
    });

    return alerts;
  };

  const alerts = generateAlerts();

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          badgeClass: 'bg-destructive text-destructive-foreground'
        };
      case 'medium':
        return {
          icon: Clock,
          color: 'text-gold',
          bgColor: 'bg-gold/10',
          borderColor: 'border-gold/20',
          badgeClass: 'bg-gold text-gold-foreground'
        };
      case 'low':
        return {
          icon: Bell,
          color: 'text-emerald',
          bgColor: 'bg-emerald/10',
          borderColor: 'border-emerald/20',
          badgeClass: 'bg-emerald text-emerald-foreground'
        };
      default:
        return {
          icon: Bell,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          badgeClass: 'bg-muted text-muted-foreground'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'license_expiry':
        return FileText;
      case 'ce_deadline':
        return Calendar;
      case 'low_credits':
        return Clock;
      case 'verification_needed':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-emerald/20 bg-emerald/5">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 text-emerald mx-auto mb-4" />
            <h3 className="font-medium text-emerald mb-2">All Caught Up!</h3>
            <p className="text-emerald-foreground/80 text-sm">
              No compliance alerts at this time. Keep up the great work!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-navy/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-navy">
          <AlertTriangle className="h-5 w-5 text-gold" aria-hidden="true" />
          Compliance Alerts
          <Badge variant="outline" className="ml-2">
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const severityConfig = getSeverityConfig(alert.severity);
          const TypeIcon = getTypeIcon(alert.type);
          const SeverityIcon = severityConfig.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border",
                severityConfig.bgColor,
                severityConfig.borderColor
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <SeverityIcon 
                      className={cn("h-4 w-4", severityConfig.color)} 
                      aria-hidden="true" 
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{alert.title}</h4>
                      <Badge className={severityConfig.badgeClass}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    
                    {alert.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        Due: {alert.dueDate.toLocaleDateString()}
                      </div>
                    )}
                    
                    {alert.actionLabel && (
                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            alert.severity === 'high' ? "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" :
                            alert.severity === 'medium' ? "border-gold text-gold hover:bg-gold hover:text-gold-foreground" :
                            "border-emerald text-emerald hover:bg-emerald hover:text-emerald-foreground"
                          )}
                          onClick={() => alert.actionUrl && window.open(alert.actionUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                          {alert.actionLabel}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {onDismissReminder && alert.id.startsWith('reminder-') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismissReminder(alert.id)}
                    className="ml-2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Dismiss ${alert.title} alert`}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}