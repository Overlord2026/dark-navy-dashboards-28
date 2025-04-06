
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function AdvisorFeedbackPrompt() {
  const navigate = useNavigate();

  const handleNavigateToFeedback = () => {
    navigate("/advisor-feedback");
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <h2 className="text-lg font-medium mb-2">Already a Professional on our Platform?</h2>
      <p className="text-muted-foreground mb-4">
        Share your experience with our practice management tools, marketing features, and marketplace visibility.
      </p>
      <Button 
        variant="outline" 
        onClick={handleNavigateToFeedback}
        className="flex items-center gap-2"
      >
        <MessageSquare size={16} />
        Provide Advisor Feedback
      </Button>
    </div>
  );
}
