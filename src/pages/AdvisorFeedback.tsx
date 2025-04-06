
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, SendHorizontal } from "lucide-react";

export default function AdvisorFeedback() {
  const { toast } = useToast();

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback about our platform.",
    });
  };

  return (
    <ThreeColumnLayout activeMainItem="professionals" title="Advisor Feedback">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Advisor Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Help us improve our platform for professional advisors
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Rate your experience</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant="outline"
                    className="w-12 h-12 p-0"
                  >
                    <Star className={rating <= 3 ? "text-muted-foreground" : "text-yellow-400"} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="platform-feedback" className="text-lg font-medium">
                Practice Management Tools
              </label>
              <Textarea
                id="platform-feedback"
                placeholder="Share your thoughts on our document management, client communication, and workflow tools..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="marketing-feedback" className="text-lg font-medium">
                Marketing Features
              </label>
              <Textarea
                id="marketing-feedback"
                placeholder="Tell us about your experience with client acquisition tools, profile visibility, and professional network features..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="suggestions" className="text-lg font-medium">
                Suggestions for Improvement
              </label>
              <Textarea
                id="suggestions"
                placeholder="What features would help you better serve your clients?"
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="flex items-center gap-2">
              <SendHorizontal size={16} />
              Submit Feedback
            </Button>
          </form>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
