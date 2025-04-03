
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, Users, X, Edit2, Trash2, CheckIcon } from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: number;
  portfolios: number;
}

interface GroupListItemProps {
  group: Group;
  editingGroup: string | null;
  editName: string;
  setEditName: (name: string) => void;
  onEdit: (groupId: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (groupId: string) => void;
}

export const GroupListItem: React.FC<GroupListItemProps> = ({
  group,
  editingGroup,
  editName,
  setEditName,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => {
  const isEditing = editingGroup === group.id;

  return (
    <div key={group.id} className="grid grid-cols-12 gap-2 p-3 items-center border-t">
      <div className="col-span-5 flex items-center gap-2">
        {isEditing ? (
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
        {isEditing ? (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={onCancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-green-500"
              onClick={onSaveEdit}
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
              onClick={() => onEdit(group.id)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-red-500"
              onClick={() => onDelete(group.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
