
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddPhysicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPhysician: (physician: PhysicianData) => void;
  initialData?: PhysicianData;
  isEdit?: boolean;
}

interface PhysicianData {
  name: string;
  facility: string;
  phone: string;
  email: string;
  lastVisit: string;
}

export const AddPhysicianDialog: React.FC<AddPhysicianDialogProps> = ({
  open,
  onOpenChange,
  onAddPhysician,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<PhysicianData>({
    name: '',
    facility: '',
    phone: '',
    email: '',
    lastVisit: ''
  });

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData(initialData);
    } else {
      resetForm();
    }
  }, [initialData, isEdit, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      facility: '',
      phone: '',
      email: '',
      lastVisit: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Physician name is required');
      return;
    }

    onAddPhysician(formData);
    if (!isEdit) {
      toast.success('Physician added successfully');
      resetForm();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (!isEdit) {
      resetForm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Physician' : 'Add New Physician'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update physician information.' : 'Add a new physician to your healthcare contacts.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="physician-name">Physician name *</Label>
            <Input
              id="physician-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter physician's name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="facility">Facility</Label>
            <Input
              id="facility"
              value={formData.facility}
              onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
              placeholder="Hospital, clinic, or practice name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="last-visit">Last visit</Label>
            <Input
              id="last-visit"
              type="date"
              value={formData.lastVisit}
              onChange={(e) => setFormData({ ...formData, lastVisit: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
          >
            {isEdit ? 'Update Physician' : 'Add Physician'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
