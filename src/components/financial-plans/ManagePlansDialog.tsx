
import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Edit2, 
  Trash2, 
  Copy, 
  Star,
  Info,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface Plan {
  id: string;
  name: string;
  createdAt: Date;
  isFavorite: boolean;
  isActive?: boolean;
  successRate?: number;
  status: 'Active' | 'Draft';
}

interface ManagePlansDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  onEditPlan: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onDuplicatePlan: (planId: string) => void;
  onToggleFavorite: (planId: string) => void;
  onSelectPlan: (planId: string) => void;
}

export function ManagePlansDialog({ 
  isOpen, 
  onClose, 
  plans, 
  onEditPlan, 
  onDeletePlan, 
  onDuplicatePlan, 
  onToggleFavorite,
  onSelectPlan
}: ManagePlansDialogProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const handleDelete = (planId: string) => {
    setConfirmDeleteId(planId);
  };
  
  const confirmDelete = () => {
    if (confirmDeleteId) {
      onDeletePlan(confirmDeleteId);
      setConfirmDeleteId(null);
      toast.success("Plan deleted successfully");
    }
  };
  
  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-[#0D1426] border border-border/30">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Financial Plans</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View, edit, and manage all your financial plans in one place.
          </DialogDescription>
        </DialogHeader>

        {confirmDeleteId ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">Delete Plan?</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete this plan? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No plans found. Create your first plan!
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan.id} className="group hover:bg-[#182339] transition-colors">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => onToggleFavorite(plan.id)}
                        >
                          <Star 
                            className={`h-4 w-4 ${plan.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        </Button>
                      </TableCell>
                      <TableCell 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => onSelectPlan(plan.id)}
                      >
                        {plan.name}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plan.status === 'Active' 
                            ? 'bg-green-100/10 text-green-500' 
                            : 'bg-blue-100/10 text-blue-500'
                        }`}>
                          {plan.status}
                        </span>
                      </TableCell>
                      <TableCell>{format(plan.createdAt, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        {plan.successRate ? `${plan.successRate}%` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#0F1C2E] border-white/10 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => onEditPlan(plan.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span>Edit Plan</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => onDuplicatePlan(plan.id)}
                            >
                              <Copy className="h-4 w-4" />
                              <span>Duplicate Plan</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer text-destructive hover:text-destructive focus:text-destructive"
                              onClick={() => handleDelete(plan.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Plan</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
