import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  MoreHorizontal,
  Trophy,
  Sparkles,
  Share2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Celebration } from '@/components/ConfettiAnimation';
import { useCelebration } from '@/hooks/useCelebration';
import { analytics } from '@/lib/analytics';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  lead_status: string;
  lead_value?: number;
  swag_score?: number;
  swag_confidence?: number;
  verified_net_worth?: number;
  enrichment_status: string;
  plaid_verification_status: string;
  auto_assigned?: boolean;
  assignment_reason?: string;
  enrichment_data?: any;
  created_at: string;
  source?: string;
  persona?: string;
}

interface SWAGLeadScoreCardProps {
  lead: Lead;
  onViewDetails?: (lead: Lead) => void;
  onUpdateStatus?: (leadId: string, status: string) => void;
  onShare?: (lead: Lead) => void;
  className?: string;
  showConfetti?: boolean;
}

export function SWAGLeadScoreCard({ 
  lead, 
  onViewDetails, 
  onUpdateStatus, 
  onShare,
  className,
  showConfetti = true 
}: SWAGLeadScoreCardProps) {
  const [showScore, setShowScore] = useState(false);
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  useEffect(() => {
    if (lead.swag_score && lead.swag_score >= 85 && showConfetti) {
      setTimeout(() => {
        triggerCelebration('milestone', `${lead.name} achieved a high SWAG Score™!`);
        analytics.track('swag_high_score_celebration', {
          leadId: lead.id,
          score: lead.swag_score,
          leadName: lead.name
        });
      }, 500);
    }
  }, [lead.swag_score, showConfetti, triggerCelebration, lead.id, lead.name]);

  const getSWAGBand = (score?: number) => {
    if (!score) return { band: 'Unscored', color: 'text-gray-500', bgColor: 'bg-gray-100', icon: '⭐' };
    if (score >= 85) return { band: 'Gold SWAG™', color: 'text-yellow-600', bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600', icon: '🥇' };
    if (score >= 70) return { band: 'Silver SWAG™', color: 'text-gray-600', bgColor: 'bg-gradient-to-r from-gray-300 to-gray-500', icon: '🥈' };
    if (score >= 55) return { band: 'Bronze SWAG™', color: 'text-amber-600', bgColor: 'bg-gradient-to-r from-amber-400 to-amber-600', icon: '🥉' };
    return { band: 'Building SWAG™', color: 'text-blue-500', bgColor: 'bg-blue-100', icon: '🌟' };
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

  const getPersonaIcon = (persona?: string) => {
    switch (persona) {
      case 'advisor': return '👔';
      case 'cpa': return '📊';
      case 'attorney': return '⚖️';
      case 'coach': return '🎯';
      default: return '💼';
    }
  };

  const initials = lead.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const swagBand = getSWAGBand(lead.swag_score);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
          lead.swag_score && lead.swag_score >= 85 
            ? 'border-l-yellow-500 shadow-yellow-100' 
            : 'border-l-gray-200'
        } ${className}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="ring-2 ring-offset-2 ring-gold/20">
                    <AvatarFallback className="bg-gradient-to-br from-deep-blue to-navy text-gold font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {lead.persona && (
                    <div className="absolute -top-1 -right-1 text-xs bg-white rounded-full p-1 shadow-sm">
                      {getPersonaIcon(lead.persona)}
                    </div>
                  )}
                  {lead.swag_score && lead.swag_score >= 85 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <div className="bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow-lg">
                        Got SWAG?
                      </div>
                    </motion.div>
                  )}
                </div>
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
                  <DropdownMenuItem onClick={() => onShare?.(lead)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share SWAG Score™
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus?.(lead.id, 'contacted')}>
                    Update Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* SWAG Score Display */}
            <div className="bg-gradient-to-br from-gold/10 to-emerald/10 rounded-lg p-4 border border-gold/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold" />
                  <span className="font-semibold text-deep-blue">SWAG Lead Score™</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Sparkles className="h-4 w-4 text-gold cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Got SWAG? This is your AI-powered prospect score for conversion fit and value.
                        Based on profile completeness, verification, engagement, and industry signals.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-deep-blue">
                    {lead.swag_score || '--'}/100
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {swagBand.icon} {swagBand.band}
                  </div>
                </div>
              </div>
              
              {lead.swag_score && (
                <div className="space-y-2">
                  <Progress 
                    value={lead.swag_score} 
                    className="h-2"
                    style={{ 
                      background: `linear-gradient(to right, hsl(var(--gold)) 0%, hsl(var(--emerald)) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Building</span>
                    <span>Bronze</span>
                    <span>Silver</span>
                    <span>Gold</span>
                  </div>
                </div>
              )}

              {lead.plaid_verification_status === 'verified' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-2"
                >
                  <Badge className="bg-emerald text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified SWAG Lead Score™
                  </Badge>
                </motion.div>
              )}
            </div>

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
              {lead.source && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Source: {lead.source}
                </div>
              )}
            </div>

            {/* Verified Net Worth */}
            {lead.verified_net_worth && (
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verified Net Worth</span>
                  <Badge className="bg-emerald text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    {formatNetWorth(lead.verified_net_worth)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Assignment Reason */}
            {lead.assignment_reason && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                <strong>Auto-assignment:</strong> {lead.assignment_reason}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onViewDetails?.(lead)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              {onShare && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onShare(lead)}
                  className="bg-gradient-to-r from-gold/10 to-emerald/10 border-gold/20 hover:from-gold/20 hover:to-emerald/20"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share SWAG
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {CelebrationComponent}
    </TooltipProvider>
  );
}