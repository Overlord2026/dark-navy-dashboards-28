import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, PiggyBank } from 'lucide-react';
import { useRetirementPlans } from '@/hooks/useRetirementPlans';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const RetirementPlansList = () => {
  const { plans, deletePlan, saving } = useRetirementPlans();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (plan: any) => {
    setPlanToDelete({ id: plan.id, name: `${formatPlanType(plan.plan_type)} - ${plan.provider}` });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (planToDelete) {
      await deletePlan(planToDelete.id);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPlanType = (type: string) => {
    switch (type) {
      case '401k':
        return '401(k)';
      case '403b':
        return '403(b)';
      case '457b':
        return '457(b)';
      default:
        return type;
    }
  };

  const formatSource = (source: string) => {
    switch (source) {
      case 'pre_tax':
        return 'Pre-tax';
      case 'roth':
        return 'Roth';
      case 'match':
        return 'Match';
      default:
        return source;
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No retirement plans added yet.</p>
        <p className="text-sm text-muted-foreground">Add your first plan to start tracking.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{formatPlanType(plan.plan_type)}</h4>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{plan.provider}</Badge>
                    <Badge variant="secondary">{formatSource(plan.source)}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(plan.balance)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {plan.contribution_amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contribution:</span>
                    <span>{formatCurrency(plan.contribution_amount)}</span>
                  </div>
                )}
                {plan.vesting_schedule && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vesting:</span>
                    <span>{plan.vesting_schedule}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteClick(plan)}
                  disabled={saving}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{planToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Contribution</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  {formatPlanType(plan.plan_type)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {plan.provider}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {formatSource(plan.source)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {formatCurrency(plan.balance)}
                </TableCell>
                <TableCell className="text-right">
                  {plan.contribution_amount ? formatCurrency(plan.contribution_amount) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(plan)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{planToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};