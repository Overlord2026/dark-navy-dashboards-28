import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { GroupForm } from "../groups/GroupForm";
import { GroupList } from "../groups/GroupList";
import { useGroupManagement } from "../groups/useGroupManagement";
import { GroupManagementDialogProps } from "../groups/types";

export const GroupManagementDialog: React.FC<GroupManagementDialogProps> = ({
  open,
  onOpenChange
}) => {
  const {
    groups,
    newGroupName,
    setNewGroupName,
    editingGroup,
    editName,
    setEditName,
    handleAddGroup,
    handleEditGroup,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteGroup
  } = useGroupManagement();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Manage Groups
          </DialogTitle>
          <DialogDescription>
            Create and manage groups to organize clients and portfolio models.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <GroupForm 
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            onAddGroup={handleAddGroup}
          />
          
          <GroupList 
            groups={groups}
            editingGroup={editingGroup}
            editName={editName}
            setEditName={setEditName}
            onEdit={handleEditGroup}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDelete={handleDeleteGroup}
          />
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
