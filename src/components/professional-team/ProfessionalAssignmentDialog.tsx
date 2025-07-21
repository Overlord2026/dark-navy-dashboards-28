import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, FileText, Users } from "lucide-react";
import { EnhancedProfessional, PROFESSIONAL_RELATIONSHIPS, ProfessionalRelationship } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";

interface ProfessionalAssignmentDialogProps {
  professional: EnhancedProfessional | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProfessionalAssignmentDialog({ 
  professional, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: ProfessionalAssignmentDialogProps) {
  const { assignProfessional, saving } = useProfessionalTeam();
  const [selectedRelationship, setSelectedRelationship] = useState<ProfessionalRelationship | "">("");
  const [notes, setNotes] = useState("");
  const [projectType, setProjectType] = useState<string>("general");

  const handleAssign = async () => {
    if (!professional || !selectedRelationship) return;

    const success = await assignProfessional(
      professional.id, 
      selectedRelationship,
      notes || undefined
    );

    if (success) {
      setSelectedRelationship("");
      setNotes("");
      setProjectType("general");
      onOpenChange(false);
      onSuccess?.();
    }
  };

  if (!professional) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Professional to Your Team</DialogTitle>
          <DialogDescription>
            Configure the professional's role and responsibilities for your family office team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={professional.photo_url} />
              <AvatarFallback>
                {professional.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{professional.name}</h3>
                {professional.verified && (
                  <Badge variant="secondary">Verified</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{professional.firm || professional.company}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <Badge variant="outline">{professional.type}</Badge>
                {professional.location && (
                  <span className="text-muted-foreground">{professional.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Assignment Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Relationship/Role */}
            <div className="space-y-2">
              <Label htmlFor="relationship">Role & Relationship</Label>
              <Select value={selectedRelationship} onValueChange={(value) => setSelectedRelationship(value as ProfessionalRelationship)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROFESSIONAL_RELATIONSHIPS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="project-type">Assignment Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Team Member</SelectItem>
                  <SelectItem value="project">Specific Project</SelectItem>
                  <SelectItem value="ongoing">Ongoing Relationship</SelectItem>
                  <SelectItem value="consultation">One-time Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Access & Permissions Preview */}
          {selectedRelationship && (
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Access & Permissions
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>View relevant documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Schedule meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Track project milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Collaborate with team</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Instructions (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific instructions, project details, or expectations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedRelationship || saving}
          >
            {saving ? "Assigning..." : "Assign to Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}