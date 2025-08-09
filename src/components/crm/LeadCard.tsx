import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  CheckSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { format } from 'date-fns';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  lead_source: string;
  lead_value: number;
  lead_status: string;
  lead_score: number;
  timeline_to_purchase: string;
  notes?: string;
  created_at: string;
  last_contact_date?: string;
  next_follow_up_due?: string;
}

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onStatusChange: (leadId: string, newStatus: string) => void;
  isMobile: boolean;
  persona?: string;
}

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  leadName: string;
  leadId: string;
}

function QuickActionModal({ isOpen, onClose, action, leadName, leadId }: QuickActionModalProps) {
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    // Track quick action
    analytics.track('lead_quick_action_clicked', {
      action,
      leadId,
      timestamp: Date.now()
    });

    toast({
      title: `${action} Action Completed`,
      description: `${action} completed for ${leadName}`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick {action} - {leadName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note">Notes (Optional)</Label>
            <Textarea
              id="note"
              placeholder={`Add notes about this ${action.toLowerCase()}...`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Complete {action}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LeadCard({ lead, onEdit, onDelete, onStatusChange, isMobile, persona = 'basic' }: LeadCardProps) {
  const [showQuickAction, setShowQuickAction] = useState<{ action: string; show: boolean }>({ action: '', show: false });
  const { toast } = useToast();

  const getSWAGScoreBand = (score: number) => {
    if (score >= 85) return { band: 'Gold', color: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' };
    if (score >= 70) return { band: 'Silver', color: 'bg-gray-400/20 text-gray-700 border-gray-400/30' };
    if (score >= 50) return { band: 'Bronze', color: 'bg-amber-600/20 text-amber-700 border-amber-600/30' };
    return { band: 'Unscored', color: 'bg-muted text-muted-foreground border-border' };
  };

  const getValueColor = (value: number) => {
    if (value >= 200000) return 'text-emerald-600';
    if (value >= 100000) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  const getSWAGBadge = () => {
    const { band, color } = getSWAGScoreBand(lead.lead_score);
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${color} font-semibold`}>
          {band} SWAG™
        </Badge>
        <span className="text-xs text-yellow-600 font-medium">Got SWAG?</span>
      </div>
    );
  };

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const handleQuickAction = (action: string) => {
    setShowQuickAction({ action, show: true });
  };

  // Check persona permissions for quick actions
  const hasProFeatures = persona === 'advisorPro' || persona === 'advisorPremium';
  const hasPremiumFeatures = persona === 'advisorPremium';

  const quickActions = [
    { id: 'call', label: 'Call', icon: Phone, available: true },
    { id: 'sms', label: 'SMS', icon: MessageSquare, available: hasProFeatures },
    { id: 'email', label: 'Email', icon: Mail, available: true },
    { id: 'book', label: 'Book', icon: Calendar, available: hasProFeatures },
    { id: 'note', label: 'Note', icon: FileText, available: true },
    { id: 'task', label: 'Task', icon: CheckSquare, available: hasPremiumFeatures }
  ];

  return (
    <>
      <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border animate-fade-in ${isMobile ? 'max-w-sm' : ''}`}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {lead.first_name} {lead.last_name}
            </h3>
            <div className="text-right">
              <div className="text-sm font-bold text-primary">SWAG Score™: {lead.lead_score}</div>
              {getSWAGBadge()}
            </div>
          </div>
          
          {lead.company && (
            <p className="text-sm text-muted-foreground">{lead.company}</p>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${getValueColor(lead.lead_value)}`}>
              ${lead.lead_value.toLocaleString()}
            </span>
            <Badge variant="outline" className="text-xs">
              {lead.lead_source}
            </Badge>
          </div>
          
          {lead.next_follow_up_due && (
            <div className={`text-xs flex items-center gap-1 ${
              isOverdue(lead.next_follow_up_due) ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Clock className="h-3 w-3" />
              Follow-up: {format(new Date(lead.next_follow_up_due), 'MMM d')}
            </div>
          )}

          {/* Compact Quick Actions Bar */}
          <div className={`flex gap-1 pt-2 ${isMobile ? 'sticky bottom-0 bg-card p-2 border-t border-border' : ''}`}>
            {quickActions.filter(action => action.available).map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className={`text-xs h-8 w-8 p-0 ${isMobile ? 'min-h-[44px] min-w-[44px]' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAction(action.label);
                }}
                title={action.label}
              >
                <action.icon className="h-3 w-3" />
              </Button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lead);
              }}
              className={`${isMobile ? 'min-h-[44px]' : ''}`}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(lead.id);
              }}
              className={`${isMobile ? 'min-h-[44px]' : ''}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <QuickActionModal
        isOpen={showQuickAction.show}
        onClose={() => setShowQuickAction({ action: '', show: false })}
        action={showQuickAction.action}
        leadName={`${lead.first_name} ${lead.last_name}`}
        leadId={lead.id}
      />
    </>
  );
}