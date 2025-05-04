
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const FeedbackPage = () => {
  const { userProfile } = useUser();
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thank you for your feedback!", {
        description: "We appreciate your input and will review it shortly."
      });
      
      setFeedback("");
      setCategory("");
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Share Your Feedback</CardTitle>
          <CardDescription>
            Help us improve our services by sharing your thoughts and suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="ux">User Experience</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">Your Feedback</label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
