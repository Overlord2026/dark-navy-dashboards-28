
import React, { useState, useEffect } from "react";
import { Professional, ProfessionalType } from "@/types/professional";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useToast } from "@/hooks/use-toast";

interface ProfessionalEditFormProps {
  professional: Professional;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfessionalEditForm({ professional, onSave, onCancel }: ProfessionalEditFormProps) {
  const { updateProfessional } = useProfessionals();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Professional>(professional);

  useEffect(() => {
    setFormData(professional);
  }, [professional]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: ProfessionalType) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Name and type are required fields",
        variant: "destructive",
      });
      return;
    }
    
    updateProfessional(formData);
    toast({
      title: "Success",
      description: "Professional updated successfully",
    });
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name"
            name="name"
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
            value={formData.company || ""}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone"
            name="phone"
            value={formData.phone || ""}
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
            value={formData.email || ""}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
