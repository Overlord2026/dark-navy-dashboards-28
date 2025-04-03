
import { useState } from "react";
import { Group } from "./types";
import { toast } from "sonner";

export const useGroupManagement = () => {
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
  
  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditName("");
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

  return {
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
  };
};
