
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import { GroupManagementDialogProps } from "@/components/investments/groups/types";
import { mockGroups } from "@/data/mock/groups";

export const GroupManagementDialog: React.FC<GroupManagementDialogProps> = ({
  open,
  onOpenChange
}) => {
  const groups = mockGroups;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Manage Groups</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Create and manage groups for organizing portfolios and clients
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Create Group
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Portfolios</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
              {groups.map((group) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="font-medium">{group.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {group.members} members
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {group.portfolios} portfolios
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
