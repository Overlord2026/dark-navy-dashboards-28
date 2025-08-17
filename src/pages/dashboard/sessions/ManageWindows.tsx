import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { WindowEditor } from '@/modules/scheduler/WindowEditor';
import { schedulerApi } from '@/modules/scheduler/schedulerApi';
import { toast } from '@/hooks/use-toast';
import type { WindowFormData } from '@/modules/scheduler/schedulerApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Calendar, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function ManageWindows() {
  const [offering, setOffering] = React.useState<any>(null);
  const [windows, setWindows] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingWindow, setEditingWindow] = React.useState<any>(null);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
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
      
      // Load offering and windows
      const [offeringsData, windowsData] = await Promise.all([
        schedulerApi.getOfferings(user.id),
        schedulerApi.getWindows(id)
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
      setWindows(windowsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWindow = async (data: WindowFormData) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await schedulerApi.createWindow(id, data);
      
      toast({
        title: "Success",
        description: "Time window created successfully",
      });
      
      setShowAddDialog(false);
      await loadData();
    } catch (error) {
      console.error('Error creating window:', error);
      toast({
        title: "Error",
        description: "Failed to create time window",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWindow = async (data: WindowFormData) => {
    if (!editingWindow) return;

    try {
      setIsSubmitting(true);
      await schedulerApi.updateWindow(editingWindow.id, data);
      
      toast({
        title: "Success",
        description: "Time window updated successfully",
      });
      
      setEditingWindow(null);
      await loadData();
    } catch (error) {
      console.error('Error updating window:', error);
      toast({
        title: "Error",
        description: "Failed to update time window",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWindow = async (windowId: string) => {
    try {
      await schedulerApi.deleteWindow(windowId);
      
      toast({
        title: "Success",
        description: "Time window deleted successfully",
      });
      
      await loadData();
    } catch (error) {
      console.error('Error deleting window:', error);
      toast({
        title: "Error",
        description: "Failed to delete time window",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
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
            <h1 className="text-3xl font-bold tracking-tight">Manage Time Slots</h1>
            {offering && (
              <p className="text-muted-foreground">
                For: {offering.title}
              </p>
            )}
          </div>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Time Slot</DialogTitle>
            </DialogHeader>
            <WindowEditor
              onSubmit={handleCreateWindow}
              onCancel={() => setShowAddDialog(false)}
              isLoading={isSubmitting}
              offeringTitle={offering?.title}
              offeringCapacity={offering?.capacity}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Windows List */}
      {windows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No time slots yet</h3>
            <p className="text-muted-foreground mb-4">
              Add time slots when you're available for sessions
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Time Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {windows.map((window) => {
            const startDate = new Date(window.start_time);
            const endDate = new Date(window.end_time);
            const isUpcoming = startDate > new Date();
            
            return (
              <Card key={window.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(startDate, 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                          </span>
                        </div>
                        
                        <Badge variant="outline">
                          {window.timezone}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {window.max_bookings && window.max_bookings > 1 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Max {window.max_bookings} bookings
                          </div>
                        )}
                        
                        <Badge 
                          variant={window.is_available ? 'default' : 'secondary'}
                        >
                          {window.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                        
                        <Badge 
                          variant={isUpcoming ? 'outline' : 'secondary'}
                        >
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingWindow(window)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Time Slot</DialogTitle>
                          </DialogHeader>
                          {editingWindow && (
                            <WindowEditor
                              initialData={{
                                start_time: format(new Date(editingWindow.start_time), "yyyy-MM-dd'T'HH:mm"),
                                end_time: format(new Date(editingWindow.end_time), "yyyy-MM-dd'T'HH:mm"),
                                timezone: editingWindow.timezone,
                                max_bookings: editingWindow.max_bookings,
                                is_available: editingWindow.is_available
                              }}
                              onSubmit={handleUpdateWindow}
                              onCancel={() => setEditingWindow(null)}
                              isLoading={isSubmitting}
                              offeringTitle={offering?.title}
                              offeringCapacity={offering?.capacity}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this time slot? Any existing bookings will be cancelled.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteWindow(window.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}