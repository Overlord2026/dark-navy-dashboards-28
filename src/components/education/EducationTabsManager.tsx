
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

interface Tab {
  id: string;
  label: string;
  value: string;
}

interface EducationTabsManagerProps {
  tabs: Tab[];
  onUpdateTabs: (tabs: Tab[]) => void;
}

export function EducationTabsManager({ tabs, onUpdateTabs }: EducationTabsManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [newTabData, setNewTabData] = useState({ label: '', value: '' });

  const handleAddTab = () => {
    const id = `tab-${Date.now()}`;
    const newTab = {
      id,
      label: newTabData.label,
      value: newTabData.value.toLowerCase().replace(/\s+/g, '-'),
    };
    onUpdateTabs([...tabs, newTab]);
    setNewTabData({ label: '', value: '' });
    setIsAddDialogOpen(false);
    toast.success("Tab added successfully");
  };

  const handleEditTab = () => {
    if (selectedTab) {
      const updatedTabs = tabs.map(tab =>
        tab.id === selectedTab.id
          ? { ...tab, label: newTabData.label, value: newTabData.value }
          : tab
      );
      onUpdateTabs(updatedTabs);
      setIsEditDialogOpen(false);
      toast.success("Tab updated successfully");
    }
  };

  const handleDeleteTab = (tabId: string) => {
    if (tabs.length <= 1) {
      toast.error("Cannot delete the last tab");
      return;
    }
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    onUpdateTabs(updatedTabs);
    toast.success("Tab deleted successfully");
  };

  const openEditDialog = (tab: Tab) => {
    setSelectedTab(tab);
    setNewTabData({ label: tab.label, value: tab.value });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Education Tabs</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tab
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tab</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tab-label">Tab Label</Label>
                <Input
                  id="tab-label"
                  value={newTabData.label}
                  onChange={(e) => setNewTabData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Enter tab label"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tab-value">Tab Value</Label>
                <Input
                  id="tab-value"
                  value={newTabData.value}
                  onChange={(e) => setNewTabData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Enter tab value"
                />
              </div>
              <Button onClick={handleAddTab} className="w-full">Add Tab</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {tabs.map(tab => (
          <div key={tab.id} className="flex items-center justify-between p-3 border rounded-lg">
            <span>{tab.label}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(tab)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteTab(tab.id)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tab</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tab-label">Tab Label</Label>
              <Input
                id="edit-tab-label"
                value={newTabData.label}
                onChange={(e) => setNewTabData(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tab-value">Tab Value</Label>
              <Input
                id="edit-tab-value"
                value={newTabData.value}
                onChange={(e) => setNewTabData(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>
            <Button onClick={handleEditTab} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
