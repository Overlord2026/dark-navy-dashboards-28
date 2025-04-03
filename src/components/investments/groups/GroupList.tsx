
import React from "react";
import { GroupListHeader } from "./GroupListHeader";
import { GroupListItem } from "./GroupListItem";

interface Group {
  id: string;
  name: string;
  members: number;
  portfolios: number;
}

interface GroupListProps {
  groups: Group[];
  editingGroup: string | null;
  editName: string;
  setEditName: (name: string) => void;
  onEdit: (groupId: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (groupId: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  editingGroup,
  editName,
  setEditName,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <GroupListHeader />
      
      {groups.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No groups created yet. Add your first group above.
        </div>
      ) : (
        groups.map((group) => (
          <GroupListItem
            key={group.id}
            group={group}
            editingGroup={editingGroup}
            editName={editName}
            setEditName={setEditName}
            onEdit={onEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};
