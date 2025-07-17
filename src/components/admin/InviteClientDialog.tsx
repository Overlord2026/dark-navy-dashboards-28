import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { toast } from 'sonner';

interface InviteClientDialogProps {
  onInviteSuccess?: () => void;
}

const SEGMENT_OPTIONS = [
  'High Net Worth',
  'Ultra High Net Worth',
  'Retirement Planning',
  'Estate Planning',
  'Tax Planning',
  'Investment Management'
];

export function InviteClientDialog({ onInviteSuccess }: InviteClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [segments, setSegments] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const handleAddSegment = (segment: string) => {
    if (!segments.includes(segment)) {
      setSegments([...segments, segment]);
    }
  };

  const handleRemoveSegment = (segmentToRemove: string) => {
    setSegments(segments.filter(segment => segment !== segmentToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentTenant) return;

    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('tenant_invitations')
        .insert({
          tenant_id: currentTenant.id,
          email: email,
          invited_by: user.id,
          role: 'client',
          segments,
          notes
        });

      if (error) throw error;

      toast.success('Client invitation sent successfully');
      setOpen(false);
      setEmail('');
      setSegments([]);
      setNotes('');
      onInviteSuccess?.();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              required
            />
          </div>

          <div>
            <Label>Client Segments</Label>
            <Select onValueChange={handleAddSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Add client segments" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENT_OPTIONS.filter(segment => !segments.includes(segment)).map((segment) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {segments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {segments.map((segment) => (
                  <Badge key={segment} variant="secondary" className="flex items-center gap-1">
                    {segment}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveSegment(segment)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional information about this client..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}