
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share, Plus, Users, Folder, X, Edit2, Trash2, CheckIcon } from "lucide-react";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  members: number;
  portfolios: number;
}

interface GroupManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GroupManagementDialog: React.FC<GroupManagementDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "Conservative Clients", members: 8, portfolios: 3 },
    { id: "2", name: "High Net Worth Individuals", members: 12, portfolios: 5 },
    { id: "3", name: "Retirement Focused", members: 15, portfolios: 4 }
  ]);
  
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      members: 0,
      portfolios: 0
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    toast.success(`Group "${newGroupName}" created successfully`);
  };
  
  const handleEditGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setEditingGroup(groupId);
      setEditName(group.name);
    }
  };
  
  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }
    
    setGroups(groups.map(group => 
      group.id === editingGroup 
        ? { ...group, name: editName }
        : group
    ));
    
    setEditingGroup(null);
    setEditName("");
    toast.success("Group renamed successfully");
  };
  
  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    toast.success("Group deleted successfully");
  };
  
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
          
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium">
              <div className="col-span-5">GROUP NAME</div>
              <div className="col-span-3 text-center">MEMBERS</div>
              <div className="col-span-2 text-center">PORTFOLIOS</div>
              <div className="col-span-2 text-right">ACTIONS</div>
            </div>
            
            {groups.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No groups created yet. Add your first group above.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="grid grid-cols-12 gap-2 p-3 items-center border-t">
                  <div className="col-span-5 flex items-center gap-2">
                    {editingGroup === group.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <Folder className="h-4 w-4 text-blue-500" />
                        {group.name}
                      </>
                    )}
                  </div>
                  <div className="col-span-3 text-center flex items-center justify-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    {group.members}
                  </div>
                  <div className="col-span-2 text-center">
                    {group.portfolios}
                  </div>
                  <div className="col-span-2 flex justify-end gap-1">
                    {editingGroup === group.id ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => setEditingGroup(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-green-500"
                          onClick={handleSaveEdit}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditGroup(group.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
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
