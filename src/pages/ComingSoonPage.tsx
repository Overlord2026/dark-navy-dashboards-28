import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Star } from 'lucide-react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

interface ComingSoonPageProps {
  featureName?: string;
  expectedDate?: string;
  description?: string;
}

export function ComingSoonPage({ 
  featureName = "This Feature", 
  expectedDate = "Soon",
  description = "We're working hard to bring you this feature. Stay tuned for updates!"
}: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader 
          heading="Coming Soon" 
          text="This feature is under development"
        />
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-lg border">
          <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">{featureName}</h2>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            <span>Expected: {expectedDate}</span>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Want to be notified?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'll keep you updated on the progress of this feature.
          </p>
          <Button disabled className="w-full">
            Notify Me When Available
          </Button>
        </div>
      </div>
    </div>
  );
}