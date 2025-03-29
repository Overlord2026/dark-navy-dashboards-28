
import React, { useState } from "react";
import { useProfessionals } from "@/hooks/useProfessionals";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfessionalType } from "@/types/professional";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfessionalDialog({ isOpen, onOpenChange }: AddProfessionalDialogProps) {
  const { addProfessional } = useProfessionals();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    type: "" as ProfessionalType,
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: ProfessionalType) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.type) {
      toast({
        title: "Error",
        description: "Professional type is required",
        variant: "destructive",
      });
      return;
    }

    // Create new professional with a random ID
    const newProfessional = {
      id: `pro-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.name,
      type: formData.type,
      company: formData.company,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      address: formData.address,
      notes: formData.notes,
    };

    addProfessional(newProfessional);
    
    toast({
      title: "Success",
      description: "Professional added successfully",
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      type: "" as ProfessionalType,
      company: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      notes: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Professional</DialogTitle>
          <DialogDescription>
            Add a new professional to your directory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleTypeChange(value as ProfessionalType)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accountant/CPA">Accountant/CPA</SelectItem>
                  <SelectItem value="Financial Advisor">Financial Advisor</SelectItem>
                  <SelectItem value="Attorney">Attorney</SelectItem>
                  <SelectItem value="Realtor">Realtor</SelectItem>
                  <SelectItem value="Dentist">Dentist</SelectItem>
                  <SelectItem value="Physician">Physician</SelectItem>
                  <SelectItem value="Banker">Banker</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Service Professional">Service Professional</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address"
              name="address"
              placeholder="123 Main St, City, State, Zip"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              name="notes"
              placeholder="Add any helpful notes about this professional..."
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Professional</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
