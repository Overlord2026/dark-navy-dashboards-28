
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  FileText, 
  ClipboardEdit, 
  Trash2, 
  Star, 
  StarHalf 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProfessionals } from "@/hooks/useProfessionals";
import { ProfessionalEditForm } from "./ProfessionalEditForm";
import { toast } from "sonner";

interface ProfessionalDetailsSheetProps {
  professionalId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfessionalDetailsSheet = ({ 
  professionalId, 
  isOpen, 
  onOpenChange 
}: ProfessionalDetailsSheetProps) => {
  const { professionals, removeProfessional } = useProfessionals();
  const [isEditing, setIsEditing] = useState(false);
  
  const professional = professionals.find(p => p.id === professionalId);
  
  if (!professional) {
    return null;
  }
  
  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove ${professional.name} from your professionals?`)) {
      removeProfessional(professionalId);
      toast.success(`${professional.name} has been removed from your professionals`);
      onOpenChange(false);
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Professional Details</SheetTitle>
        </SheetHeader>
        
        {isEditing ? (
          <ProfessionalEditForm 
            professional={professional} 
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
          />
        ) : (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{professional.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {professional.type}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditing(true)}
                >
                  <ClipboardEdit size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                >
                  <Trash2 size={18} className="text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center mt-3">
              {professional.rating !== undefined && (
                <div className="flex">
                  {Array.from({length: Math.floor(professional.rating)}).map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-500" />
                  ))}
                  {professional.rating % 1 !== 0 && (
                    <StarHalf size={18} className="text-yellow-500" />
                  )}
                </div>
              )}
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {professional.company && (
                  <div className="flex items-center text-sm">
                    <Building size={16} className="mr-3 text-muted-foreground" />
                    <span>{professional.company}</span>
                  </div>
                )}
                
                {professional.phone && (
                  <div className="flex items-center text-sm">
                    <Phone size={16} className="mr-3 text-muted-foreground" />
                    <span>{professional.phone}</span>
                  </div>
                )}
                
                {professional.email && (
                  <div className="flex items-center text-sm">
                    <Mail size={16} className="mr-3 text-muted-foreground" />
                    <span>{professional.email}</span>
                  </div>
                )}
                
                {professional.address && (
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-3 text-muted-foreground" />
                    <span>{professional.address}</span>
                  </div>
                )}
                
                {professional.website && (
                  <div className="flex items-center text-sm">
                    <ExternalLink size={16} className="mr-3 text-muted-foreground" />
                    <a 
                      href={professional.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {professional.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {professional.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm whitespace-pre-wrap">{professional.notes}</p>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Schedule Appointment</span>
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>View Documents</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
