import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Plus } from 'lucide-react';
import { useFamilyVault } from '@/hooks/useFamilyVault';

interface CreateVaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateVaultDialog({ open, onOpenChange, onSuccess }: CreateVaultDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vault_name: '',
    description: ''
  });
  
  const { createVault } = useFamilyVault();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vault_name.trim()) return;

    setLoading(true);
    const vault = await createVault({
      vault_name: formData.vault_name,
      description: formData.description || undefined
    });
    
    if (vault) {
      setFormData({ vault_name: '', description: '' });
      onSuccess();
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Create Family Vault
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vault_name">Vault Name *</Label>
            <Input
              id="vault_name"
              placeholder="e.g., The Smith Family Legacy"
              value={formData.vault_name}
              onChange={(e) => setFormData(prev => ({ ...prev, vault_name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell future generations about your family's story..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.vault_name.trim()}
              className="gap-2"
            >
              {loading ? 'Creating...' : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Vault
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}