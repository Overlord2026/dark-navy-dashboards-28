import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  Building,
  Star,
  Zap,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  lead_status: string;
  lead_value?: number;
  catchlight_score?: number;
  catchlight_confidence?: number;
  verified_net_worth?: number;
  enrichment_status: string;
  plaid_verification_status: string;
  auto_assigned?: boolean;
  assignment_reason?: string;
  enrichment_data?: any;
  created_at: string;
}

interface EnhancedLeadCardProps {
  lead: Lead;
  onViewDetails?: (lead: Lead) => void;
  onUpdateStatus?: (leadId: string, status: string) => void;
  className?: string;
}

export function EnhancedLeadCard({ lead, onViewDetails, onUpdateStatus, className }: EnhancedLeadCardProps) {
  const getScoreBadgeVariant = (score?: number) => {
    if (!score) return "secondary";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "outline";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'closed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatNetWorth = (amount?: number) => {
    if (!amount) return null;
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const initials = lead.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {lead.name}
                {lead.auto_assigned && (
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Auto-assigned
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {lead.email}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(lead)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus?.(lead.id, 'contacted')}>
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.lead_status)}`} />
            <span className="text-sm capitalize">{lead.lead_status}</span>
          </div>
          {lead.lead_value && (
            <Badge variant="outline">
              <DollarSign className="h-3 w-3 mr-1" />
              ${lead.lead_value.toLocaleString()}
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-sm text-muted-foreground">
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </div>
          )}
          {lead.company && (
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3" />
              {lead.company}
            </div>
          )}
        </div>

        {/* Enrichment Data */}
        {(lead.catchlight_score || lead.verified_net_worth) && (
          <div className="border-t pt-3 space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Lead Intelligence
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {lead.catchlight_score && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">SWAG Score™</div>
                  <Badge variant={getScoreBadgeVariant(lead.catchlight_score)} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {lead.catchlight_score}/100
                  </Badge>
                </div>
              )}
              
              {lead.verified_net_worth && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Verified HNW</div>
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    {formatNetWorth(lead.verified_net_worth)}
                  </Badge>
                </div>
              )}
            </div>

            {lead.assignment_reason && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                <strong>Auto-assignment:</strong> {lead.assignment_reason}
              </div>
            )}
          </div>
        )}

        {/* Enrichment Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Enrichment:</span>
            <Badge 
              variant={lead.enrichment_status === 'completed' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {lead.enrichment_status}
            </Badge>
          </div>
          
          {lead.plaid_verification_status !== 'not_requested' && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Plaid:</span>
              <Badge 
                variant={lead.plaid_verification_status === 'verified' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {lead.plaid_verification_status}
              </Badge>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onViewDetails?.(lead)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
}