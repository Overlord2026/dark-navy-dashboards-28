
import React, { useState } from "react";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfessionalDialog({ isOpen, onOpenChange }: AddProfessionalDialogProps) {
  const { addProfessional } = useProfessionals();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    // Create new professional with a random ID
    const newProfessional = {
      id: `pro-${Math.random().toString(36).substring(2, 9)}`,
      name: formData.name,
      type: "Other" as const,
      email: formData.email,
    };

    addProfessional(newProfessional);
    
    toast.success("Professional added successfully");
    
    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Professional</DialogTitle>
          <DialogDescription>
            Add a new professional to your directory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
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
