import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, Mail, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Professional {
  id: string;
  profile_name?: string;
  name?: string;
  email: string;
  professional_type?: string;
  type?: string;
  status: string;
}

interface ShareDocumentDialogProps {
  documentId: string;
  professionals: Professional[];
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDocumentDialog({ 
  documentId, 
  professionals, 
  isOpen, 
  onClose 
}: ShareDocumentDialogProps) {
  const { toast } = useToast();
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [accessLevel, setAccessLevel] = useState<'view' | 'download' | 'edit'>('view');
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [message, setMessage] = useState('');
  const [requirePasswordAccess, setRequirePasswordAccess] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  const handleProfessionalToggle = (professionalId: string) => {
    setSelectedProfessionals(prev => 
      prev.includes(professionalId)
        ? prev.filter(id => id !== professionalId)
        : [...prev, professionalId]
    );
  };

  const handleShare = async () => {
    if (selectedProfessionals.length === 0) {
      toast({
        title: "No professionals selected",
        description: "Please select at least one professional to share with",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would call your share document API
      // await shareDocument(documentId, selectedProfessionals, accessLevel, expiryDate, message);
      
      toast({
        title: "Document shared successfully",
        description: `Document shared with ${selectedProfessionals.length} professional(s)`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to share document",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const activeProfessionals = professionals.filter(p => p.status === 'active');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Share Document
          </DialogTitle>
          <DialogDescription>
            Share this document securely with your assigned professionals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Selection */}
          <div>
            <Label className="text-base font-medium">Select Professionals</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {activeProfessionals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active professionals found</p>
              ) : (
                activeProfessionals.map((professional) => (
                  <div key={professional.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={professional.id}
                      checked={selectedProfessionals.includes(professional.id)}
                      onCheckedChange={() => handleProfessionalToggle(professional.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{professional.profile_name || professional.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {professional.professional_type || professional.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {professional.email}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Access Level */}
          <div>
            <Label htmlFor="access-level">Access Level</Label>
            <Select value={accessLevel} onValueChange={(value: any) => setAccessLevel(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="download">View & Download</SelectItem>
                <SelectItem value="edit">View, Download & Comment</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {accessLevel === 'view' && 'Can only view the document online'}
              {accessLevel === 'download' && 'Can view and download the document'}
              {accessLevel === 'edit' && 'Can view, download, and add comments'}
            </p>
          </div>

          {/* Expiry Date */}
          <div>
            <Label>Access Expiry (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "No expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Security Options */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Security Options</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="password-access"
                checked={requirePasswordAccess}
                onCheckedChange={(checked) => setRequirePasswordAccess(checked as boolean)}
              />
              <Label htmlFor="password-access" className="text-sm">
                Require password for access
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow-comments"
                checked={allowComments}
                onCheckedChange={(checked) => setAllowComments(checked as boolean)}
              />
              <Label htmlFor="allow-comments" className="text-sm">
                Allow comments and annotations
              </Label>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message for the professionals..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={selectedProfessionals.length === 0}>
            Share Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}