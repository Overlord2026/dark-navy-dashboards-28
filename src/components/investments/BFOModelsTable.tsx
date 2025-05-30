
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit3, Eye } from "lucide-react";
import { useBFOModels, UserPortfolioAssignment } from "@/hooks/useBFOModels";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BFOModelsTableProps {
  assignments: UserPortfolioAssignment[];
  loading: boolean;
}

export const BFOModelsTable: React.FC<BFOModelsTableProps> = ({ assignments, loading }) => {
  const { removePortfolioAssignment, updatePortfolioAssignment } = useBFOModels();
  const [editingAssignment, setEditingAssignment] = useState<UserPortfolioAssignment | null>(null);
  const [editForm, setEditForm] = useState({ assigned_accounts: 0, trading_groups: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (assignment: UserPortfolioAssignment) => {
    setEditingAssignment(assignment);
    setEditForm({
      assigned_accounts: assignment.assigned_accounts,
      trading_groups: assignment.trading_groups
    });
  };

  const handleUpdate = async () => {
    if (!editingAssignment) return;

    setIsUpdating(true);
    const success = await updatePortfolioAssignment(editingAssignment.id, editForm);
    
    if (success) {
      setEditingAssignment(null);
    }
    setIsUpdating(false);
  };

  const handleRemove = async (assignmentId: string) => {
    if (confirm("Are you sure you want to remove this portfolio assignment?")) {
      await removePortfolioAssignment(assignmentId);
    }
  };

  const getBadgeColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      red: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colorMap[color] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your portfolios...</p>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-300 mb-2">No model portfolios assigned yet.</p>
        <p className="text-sm text-slate-400">Click "Pick a Model Portfolio" to get started.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-800">
            <TableHead className="text-white font-medium">Portfolio Name</TableHead>
            <TableHead className="text-white font-medium">Provider</TableHead>
            <TableHead className="text-white font-medium">Type</TableHead>
            <TableHead className="text-white font-medium">Tax Status</TableHead>
            <TableHead className="text-white font-medium">Accounts</TableHead>
            <TableHead className="text-white font-medium">Trading Groups</TableHead>
            <TableHead className="text-white font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id} className="border-slate-700 hover:bg-slate-800">
              <TableCell className="text-white">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{assignment.model_portfolio.name}</span>
                  <Badge 
                    variant="outline" 
                    className={getBadgeColor(assignment.model_portfolio.badge_color)}
                  >
                    {assignment.model_portfolio.badge_text}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-slate-300">{assignment.model_portfolio.provider}</TableCell>
              <TableCell className="text-slate-300">{assignment.model_portfolio.series_type}</TableCell>
              <TableCell className="text-slate-300">{assignment.model_portfolio.tax_status}</TableCell>
              <TableCell className="text-slate-300">{assignment.assigned_accounts}</TableCell>
              <TableCell className="text-slate-300">{assignment.trading_groups}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(assignment)}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(assignment.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editingAssignment} onOpenChange={() => setEditingAssignment(null)}>
        <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Edit Portfolio Assignment
            </DialogTitle>
          </DialogHeader>
          
          {editingAssignment && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-1">{editingAssignment.model_portfolio.name}</h3>
                <p className="text-sm text-slate-400">{editingAssignment.model_portfolio.provider}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accounts" className="text-white">Assigned Accounts</Label>
                <Input
                  id="accounts"
                  type="number"
                  min="0"
                  value={editForm.assigned_accounts}
                  onChange={(e) => setEditForm(prev => ({ ...prev, assigned_accounts: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groups" className="text-white">Trading Groups Applied</Label>
                <Input
                  id="groups"
                  type="number"
                  min="0"
                  value={editForm.trading_groups}
                  onChange={(e) => setEditForm(prev => ({ ...prev, trading_groups: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => setEditingAssignment(null)}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
