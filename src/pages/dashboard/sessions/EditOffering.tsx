import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { OfferingForm } from '@/modules/scheduler/OfferingForm';
import { schedulerApi } from '@/modules/scheduler/schedulerApi';
import { nilAdapter } from '@/modules/scheduler/adapters/nilAdapter';
import { toast } from '@/hooks/use-toast';
import type { OfferingFormData } from '@/modules/scheduler/schedulerApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditOffering() {
  const [offering, setOffering] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [publishEligibility, setPublishEligibility] = React.useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && id) {
      loadData();
    }
  }, [user, id]);

  const loadData = async () => {
    if (!user || !id) return;

    try {
      setIsLoading(true);
      
      // Load offering and publish eligibility
      const [offeringsData, eligibilityData] = await Promise.all([
        schedulerApi.getOfferings(user.id),
        nilAdapter.checkPublishEligibility(user.id)
      ]);

      const offering = offeringsData.find(o => o.id === id);
      if (!offering) {
        toast({
          title: "Error",
          description: "Offering not found",
          variant: "destructive"
        });
        navigate('/dashboard/sessions');
        return;
      }

      setOffering(offering);
      setPublishEligibility(eligibilityData);
    } catch (error) {
      console.error('Error loading offering:', error);
      toast({
        title: "Error",
        description: "Failed to load offering",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: OfferingFormData) => {
    if (!user || !id) return;

    try {
      setIsLoading(true);
      
      // Update NIL offering with compliance checks
      const nilOffering = await nilAdapter.createNILOffering(user.id, data);
      
      // Update the offering
      await schedulerApi.updateOffering(id, nilOffering);
      
      toast({
        title: "Success",
        description: "Session offering updated successfully",
      });
      
      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('Error updating offering:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update offering",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await schedulerApi.deleteOffering(id);
      
      toast({
        title: "Success",
        description: "Session offering deleted successfully",
      });
      
      navigate('/dashboard/sessions');
    } catch (error) {
      console.error('Error deleting offering:', error);
      toast({
        title: "Error",
        description: "Failed to delete offering",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/sessions');
  };

  if (isLoading && !offering) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/sessions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sessions
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Session Offering</h1>
            <p className="text-muted-foreground">
              Update your NIL session details
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session Offering</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this session offering? This action cannot be undone.
                All associated time windows and bookings will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete Offering
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Quick Links */}
      {offering && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/sessions/offerings/${offering.id}/windows`}>
              Manage Time Slots
            </Link>
          </Button>
          {offering.is_published && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/meet/${offering.slug}`} target="_blank">
                View Public Page
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Form */}
      {offering && (
        <OfferingForm
          initialData={offering}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          canPublish={publishEligibility?.canPublish}
          publishBlockReason={publishEligibility?.blockReason}
        />
      )}
    </div>
  );
}