import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getCurrentUserRole, setMockRole, type Role, getRoleDisplayName } from '@/features/auth/roles';

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = React.useState<Role>(getCurrentUserRole());

  const handleRoleChange = (role: Role) => {
    setMockRole(role);
    setCurrentRole(role);
    window.location.reload(); // Refresh to apply role changes
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
      <Badge variant="outline" className="text-xs">
        {getRoleDisplayName(currentRole)}
      </Badge>
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FAMILY">Family</SelectItem>
          <SelectItem value="ADVISOR">Advisor</SelectItem>
          <SelectItem value="CPA">CPA</SelectItem>
          <SelectItem value="ATTORNEY">Attorney</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}