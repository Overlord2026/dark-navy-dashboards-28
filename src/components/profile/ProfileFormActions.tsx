
import React from "react";
import { Button } from "@/components/ui/button";

interface ProfileFormActionsProps {
  isSubmitting: boolean;
}

export const ProfileFormActions = ({ isSubmitting }: ProfileFormActionsProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};
