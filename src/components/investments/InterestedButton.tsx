
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTaxPlanning } from "@/hooks/useTaxPlanning";
import { useAuth } from "@/context/AuthContext";
import { emailService } from "@/services/emailService";
import { toast } from "sonner";

interface InterestedButtonProps {
  assetName: string;
  className?: string;
}

export function InterestedButton({ assetName, className = "" }: InterestedButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInterest } = useTaxPlanning();
  const { user, isAuthenticated } = useAuth();

  const handleInterest = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to express interest");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create interest record in database
      await createInterest({
        interest_type: 'tax_planning',
        asset_name: assetName,
        notes: `Expressed interest in ${assetName}`
      });

      // Send email notification
      const emailData = {
        userEmail: user.email || 'Unknown Email',
        userName: user.user_metadata?.display_name || user.user_metadata?.first_name || 'Unknown User',
        assetName: assetName,
        timestamp: new Date().toLocaleString()
      };

      const emailSent = await emailService.sendInterestNotification(emailData);
      
      if (emailSent) {
        toast.success("Your interest has been registered and notification sent!");
      } else {
        toast.success("Your interest has been registered!", {
          description: "Notification email could not be sent, but your request was saved."
        });
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
      toast.error("Failed to register interest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleInterest}
      disabled={isSubmitting}
      className={`w-full flex items-center justify-center ${className}`}
    >
      <Heart className="mr-2 h-4 w-4" />
      {isSubmitting ? "Submitting..." : "I'm Interested"}
    </Button>
  );
}
