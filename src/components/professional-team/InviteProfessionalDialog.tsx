import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { PROFESSIONAL_RELATIONSHIPS } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";
import { toast } from "sonner";

interface InviteProfessionalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteProfessionalDialog({ isOpen, onOpenChange }: InviteProfessionalDialogProps) {
  const { inviteProfessional, saving } = useProfessionalTeam();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: "",
    relationship: "",
    specialties: [] as string[],
    customMessage: ""
  });
  const [newSpecialty, setNewSpecialty] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.relationship) {
      toast.error("Please fill in all required fields");
      return;
    }

    const inviteData = {
      email: formData.email,
      invited_as: formData.relationship,
      metadata: {
        name: formData.name,
        firm: formData.firm,
        specialties: formData.specialties,
        customMessage: formData.customMessage
      }
    };

    const result = await inviteProfessional(formData.email, formData.relationship);
    
    if (result) {
      toast.success(`Invitation sent to ${formData.name}`);
      setFormData({
        name: "",
        email: "",
        firm: "",
        relationship: "",
        specialties: [],
        customMessage: ""
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Professional to Marketplace</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@firm.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firm">Firm/Company</Label>
              <Input
                id="firm"
                value={formData.firm}
                onChange={(e) => handleChange("firm", e.target.value)}
                placeholder="Smith & Associates"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Role/Relationship *</Label>
              <Select value={formData.relationship} onValueChange={(value) => handleChange("relationship", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROFESSIONAL_RELATIONSHIPS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add specialty"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" variant="outline" onClick={addSpecialty}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">Custom Introduction Message</Label>
            <Textarea
              id="customMessage"
              value={formData.customMessage}
              onChange={(e) => handleChange("customMessage", e.target.value)}
              placeholder="Hi [Name], we would like to invite you to join our professional marketplace..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This message will be included in the invitation email along with the onboarding link.
            </p>
          </div>

          {/* Preview */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Invitation Preview:</h4>
            <div className="text-sm space-y-1">
              <p><strong>To:</strong> {formData.name} ({formData.email})</p>
              <p><strong>Role:</strong> {PROFESSIONAL_RELATIONSHIPS[formData.relationship as keyof typeof PROFESSIONAL_RELATIONSHIPS] || formData.relationship}</p>
              {formData.firm && <p><strong>Firm:</strong> {formData.firm}</p>}
              {formData.specialties.length > 0 && (
                <p><strong>Specialties:</strong> {formData.specialties.join(", ")}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}