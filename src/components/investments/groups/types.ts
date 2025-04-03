
export interface Group {
  id: string;
  name: string;
  members: number;
  portfolios: number;
}

export interface GroupManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
