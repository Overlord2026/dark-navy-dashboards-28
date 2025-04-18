
import React, { useState } from "react";
import { useProfessionals } from "@/hooks/useProfessionals";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProfessionalType } from "@/types/professional";
import { DialogHeader } from "./add-dialog/DialogHeader";
import { PersonalInfoFields } from "./add-dialog/PersonalInfoFields";
import { ProfessionalTypeSelect } from "./add-dialog/ProfessionalTypeSelect";
import { NotesField } from "./add-dialog/NotesField";

interface AddProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProfessionalDialog({ isOpen, onOpenChange }: AddProfessionalDialogProps) {
  const { addProfessional } = useProfessionals();
  const [formData, setFormData] = useState({
    name: "",
    type: "" as ProfessionalType,
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    notes: "",
    specialties: [] as string[],
    certifications: [] as string[],
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
    
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.type) {
      toast.error("Professional type is required");
      return;
    }

    const newProfessional = {
      id: `pro-${Math.random().toString(36).substring(2, 9)}`,
      ...formData
    };

    addProfessional(newProfessional);
    toast.success("Professional added successfully");
    
    setFormData({
      name: "",
      type: "" as ProfessionalType,
      company: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      notes: "",
      specialties: [],
      certifications: [],
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader />
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <PersonalInfoFields formData={formData} handleChange={handleChange} />
            <ProfessionalTypeSelect value={formData.type} onValueChange={handleTypeChange} />
          </div>
          
          <NotesField value={formData.notes} onChange={handleChange} />
          
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
