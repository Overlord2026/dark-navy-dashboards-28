import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { OfferingForm } from '@/modules/scheduler/OfferingForm';
import { schedulerApi } from '@/modules/scheduler/schedulerApi';
import { nilAdapter } from '@/modules/scheduler/adapters/nilAdapter';
import { toast } from '@/hooks/use-toast';
import type { OfferingFormData } from '@/modules/scheduler/schedulerApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CreateOffering() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [publishEligibility, setPublishEligibility] = React.useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      loadPublishEligibility();
    }
  }, [user]);

  const loadPublishEligibility = async () => {
    if (!user) return;
    
    try {
      const eligibility = await nilAdapter.checkPublishEligibility(user.id);
      setPublishEligibility(eligibility);
    } catch (error) {
      console.error('Error checking publish eligibility:', error);
    }
  };

  const handleSubmit = async (data: OfferingFormData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Create NIL offering with compliance checks
      const nilOffering = await nilAdapter.createNILOffering(user.id, data);
      
      // Create the offering
      const offering = await schedulerApi.createOffering(user.id, nilOffering);
      
      toast({
        title: "Success",
        description: "Session offering created successfully",
      });
      
      // Navigate to the offering edit page
      navigate(`/dashboard/sessions/offerings/${offering.id}`);
    } catch (error: any) {
      console.error('Error creating offering:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create offering",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/sessions');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/sessions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Session Offering</h1>
          <p className="text-muted-foreground">
            Set up a new NIL session for fans to book
          </p>
        </div>
      </div>

      {/* Form */}
      <OfferingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        canPublish={publishEligibility?.canPublish}
        publishBlockReason={publishEligibility?.blockReason}
      />
    </div>
  );
}