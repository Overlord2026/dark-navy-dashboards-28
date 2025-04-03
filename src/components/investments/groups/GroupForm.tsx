
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface GroupFormProps {
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  onAddGroup: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  newGroupName,
  setNewGroupName,
  onAddGroup
}) => {
  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    onAddGroup();
  };

  return (
    <div className="flex gap-2">
      <Input 
        placeholder="New group name"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
      />
      <Button onClick={handleAddGroup}>
        <Plus className="mr-1 h-4 w-4" /> Add Group
      </Button>
    </div>
  );
};
