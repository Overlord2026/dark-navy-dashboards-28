import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Calendar, 
  MapPin, 
  FileText, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InsuranceAgent } from '@/hooks/useInsuranceAgent';

interface AgentStatusCardProps {
  agent: InsuranceAgent;
  daysUntilExpiry: number | null;
  onEditProfile: () => void;
}

export function AgentStatusCard({ agent, daysUntilExpiry, onEditProfile }: AgentStatusCardProps) {
  const getExpiryStatus = (days: number | null) => {
    if (days === null) return { color: 'text-muted-foreground', label: 'No expiry set', severity: 'none' };
    if (days <= 0) return { color: 'text-destructive', label: 'EXPIRED', severity: 'critical' };
    if (days <= 30) return { color: 'text-destructive', label: 'Expires Soon', severity: 'critical' };
    if (days <= 90) return { color: 'text-gold', label: 'Renewal Due', severity: 'warning' };
    return { color: 'text-emerald', label: 'Current', severity: 'good' };
  };

  const expiryStatus = getExpiryStatus(daysUntilExpiry);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald text-emerald-foreground">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-destructive text-destructive-foreground">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-navy/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-navy">
            <Shield className="h-5 w-5 text-emerald" aria-hidden="true" />
            Agent Profile
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(agent.status)}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEditProfile}
              className="border-navy text-navy hover:bg-navy hover:text-navy-foreground"
              aria-label="Edit agent profile"
            >
              <Edit className="h-4 w-4 mr-1" aria-hidden="true" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agent Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Agent Name
              </label>
              <p className="text-sm font-medium text-foreground">{agent.name}</p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <p className="text-sm text-foreground">{agent.email}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{agent.state}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                License Type
              </label>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{agent.license_type}</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                License Number
              </label>
              <p className="text-sm font-mono text-foreground">{agent.license_number}</p>
            </div>

            {agent.nmls_id && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  NMLS ID
                </label>
                <p className="text-sm font-mono text-foreground">{agent.nmls_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* License Expiry Status */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">License Expiry</span>
            </div>
            <div className="text-right">
              {agent.license_expiry ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {agent.license_expiry.toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1">
                    {expiryStatus.severity === 'critical' && <AlertTriangle className="h-3 w-3" />}
                    {expiryStatus.severity === 'warning' && <Clock className="h-3 w-3" />}
                    {expiryStatus.severity === 'good' && <CheckCircle className="h-3 w-3" />}
                    <span className={cn("text-xs font-medium", expiryStatus.color)}>
                      {daysUntilExpiry !== null && daysUntilExpiry > 0 
                        ? `${daysUntilExpiry} days remaining`
                        : expiryStatus.label
                      }
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Not set</span>
              )}
            </div>
          </div>
        </div>

        {/* CE Period Information */}
        {agent.ce_reporting_period_start && agent.ce_reporting_period_end && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">CE Reporting Period</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {agent.ce_reporting_period_start.toLocaleDateString()} - {agent.ce_reporting_period_end.toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-emerald">
                {agent.ce_credits_completed}
              </div>
              <div className="text-xs text-muted-foreground">Credits Earned</div>
            </div>
            <div>
              <div className="text-lg font-bold text-navy">
                {agent.ce_credits_required}
              </div>
              <div className="text-xs text-muted-foreground">Credits Required</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gold">
                {Math.max(0, agent.ce_credits_required - agent.ce_credits_completed)}
              </div>
              <div className="text-xs text-muted-foreground">Credits Needed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}