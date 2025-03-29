
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalType, Professional } from "@/types/professional";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Phone, Globe, MapPin, Star } from "lucide-react";

interface ProfessionalDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
}

export function ProfessionalDetailsSheet({ 
  isOpen, 
  onOpenChange, 
  professional 
}: ProfessionalDetailsSheetProps) {
  const { updateProfessional, removeProfessional } = useProfessionals();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Professional | null>(null);

  useEffect(() => {
    if (professional) {
      setFormData(professional);
    }
  }, [professional]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleTypeChange = (value: ProfessionalType) => {
    setFormData((prev) => prev ? { ...prev, type: value } : null);
  };

  const handleSave = () => {
    if (!formData || !formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Name and type are required fields",
        variant: "destructive",
      });
      return;
    }

    updateProfessional(formData);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Professional updated successfully",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to remove this professional?")) {
      removeProfessional(formData.id);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Professional removed successfully",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{isEditing ? "Edit Professional" : "Professional Details"}</SheetTitle>
          <SheetDescription>
            {isEditing 
              ? "Make changes to the professional's information." 
              : "View details about this professional."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {!isEditing ? (
            // View mode
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{formData.name}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {formData.type}
                  </Badge>
                </div>
                {formData.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{formData.rating}</span>
                  </div>
                )}
              </div>

              {formData.company && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{formData.company}</p>
                </div>
              )}

              <div className="space-y-3 border-t pt-3">
                {formData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${formData.phone}`} className="hover:underline">
                      {formData.phone}
                    </a>
                  </div>
                )}
                
                {formData.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${formData.email}`} className="hover:underline">
                      {formData.email}
                    </a>
                  </div>
                )}
                
                {formData.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {formData.website}
                    </a>
                  </div>
                )}
                
                {formData.address && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{formData.address}</span>
                  </div>
                )}
              </div>

              {formData.notes && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="whitespace-pre-wrap">{formData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            // Edit mode
            <div className="space-y-4">
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
                    type="email"
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
            </div>
          )}
        </div>

        <SheetFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button 
                variant="destructive" 
                className="sm:mr-auto" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
