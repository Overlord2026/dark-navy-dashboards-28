
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface GroupManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groups: string[];
  onSaveGroups: (groups: string[]) => void;
}

const GroupManagementDialog: React.FC<GroupManagementDialogProps> = ({
  isOpen,
  onClose,
  groups = [],
  onSaveGroups,
}) => {
  const [currentGroups, setCurrentGroups] = useState<string[]>(groups);
  const [newGroupName, setNewGroupName] = useState("");

  const handleAddGroup = () => {
    if (newGroupName.trim() !== "" && !currentGroups.includes(newGroupName)) {
      setCurrentGroups([...currentGroups, newGroupName]);
      setNewGroupName("");
    }
  };

  const handleRemoveGroup = (index: number) => {
    const updatedGroups = [...currentGroups];
    updatedGroups.splice(index, 1);
    setCurrentGroups(updatedGroups);
  };

  const handleSave = () => {
    onSaveGroups(currentGroups);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1628] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Manage Groups</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="newGroup" className="text-white mb-2 block">
                Add New Group
              </Label>
              <Input
                id="newGroup"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                className="bg-[#1a283e] border-gray-700 text-white"
              />
            </div>
            <Button
              onClick={handleAddGroup}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Current Groups</Label>
            {currentGroups.length === 0 ? (
              <p className="text-gray-400 text-sm">No groups created yet</p>
            ) : (
              <div className="space-y-2">
                {currentGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#1a283e] p-2 rounded">
                    <span className="text-gray-300">{group}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGroup(index)}
                      className="text-gray-400 hover:text-white hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-white hover:bg-gray-800">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-white hover:bg-primary/90">
            Save Groups
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupManagementDialog;
