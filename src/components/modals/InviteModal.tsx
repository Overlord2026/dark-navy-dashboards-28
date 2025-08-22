import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, User, UserPlus, X } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'advisor' | 'cpa' | 'attorney' | 'professional';
}

export function InviteModal({ isOpen, onClose, type }: InviteModalProps) {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invite logic here
    console.log('Inviting:', { type, email, name, message });
    
    // Show success feedback
    alert(`Invitation sent to ${name} (${email})`);
    onClose();
  };

  const handleEscapeKey = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, handleEscapeKey]);

  const getTitle = () => {
    switch (type) {
      case 'advisor': return 'Invite Financial Advisor';
      case 'cpa': return 'Invite CPA';
      case 'attorney': return 'Invite Attorney';
      default: return 'Invite Professional';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="invite-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription id="invite-description">
            Send an invitation to collaborate on your family workspace
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="professional-name">
              Professional Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="professional-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter their name"
                className="pl-10 min-h-[44px]"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="professional-email">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="professional-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="their.email@example.com"
                className="pl-10 min-h-[44px]"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invite-message">
              Personal Message (Optional)
            </Label>
            <Textarea
              id="invite-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 min-h-[44px]"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!email || !name}
              className="flex-1 min-h-[44px]"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}