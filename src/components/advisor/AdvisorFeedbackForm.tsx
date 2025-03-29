
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

interface FeedbackCategory {
  id: string;
  title: string;
  description: string;
}

export function AdvisorFeedbackForm() {
  const [ratings, setRatings] = useState<Record<string, number>>({
    practiceTools: 0,
    marketing: 0,
    marketplace: 0
  });
  const [comments, setComments] = useState<Record<string, string>>({
    practiceTools: "",
    marketing: "",
    marketplace: "",
    general: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackCategories: FeedbackCategory[] = [
    {
      id: "practiceTools",
      title: "Practice Management Tools",
      description: "White-labeled Advizon platform, client management, document sharing, etc."
    },
    {
      id: "marketing",
      title: "Marketing & Lead Generation",
      description: "Quality and quantity of leads, marketing funnels, promotional tools"
    },
    {
      id: "marketplace",
      title: "Marketplace Visibility & Client Engagement",
      description: "Search ranking, client discovery, engagement metrics"
    }
  ];

  const handleRatingChange = (category: string, value: string) => {
    setRatings(prev => ({
      ...prev,
      [category]: parseInt(value)
    }));
  };

  const handleCommentChange = (category: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would be an API call in a real application
      console.log("Submitting advisor feedback:", {
        ratings,
        comments
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thank you for your feedback! Your input helps us improve our advisor services.");
      
      // Reset form
      setRatings({
        practiceTools: 0,
        marketing: 0,
        marketplace: 0
      });
      setComments({
        practiceTools: "",
        marketing: "",
        marketplace: "",
        general: ""
      });
    } catch (error) {
      toast.error("There was an error submitting your feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category }: { category: string }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <RadioGroupItem
            key={`${category}-star-${star}`}
            value={star.toString()}
            id={`${category}-star-${star}`}
            className="sr-only"
          />
        ))}
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={`${category}-label-${star}`}
            htmlFor={`${category}-star-${star}`}
            className={`cursor-pointer rounded-full p-1 ${
              ratings[category] >= star
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
            onClick={() => handleRatingChange(category, star.toString())}
          >
            <StarIcon className="h-6 w-6" />
            <span className="sr-only">{star} stars</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Advisor Experience Feedback</CardTitle>
        <CardDescription>
          We value your input on our platform. Your feedback helps us improve our offerings for advisors like you.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {feedbackCategories.map((category) => (
            <div key={category.id} className="p-4 rounded-lg border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <RadioGroup
                    value={ratings[category.id]?.toString() || ""}
                    className="flex-shrink-0"
                  >
                    <StarRating category={category.id} />
                  </RadioGroup>
                </div>
              </div>
              
              <div className="mt-2">
                <Label htmlFor={`${category.id}-comment`} className="text-sm">
                  Additional comments:
                </Label>
                <Textarea
                  id={`${category.id}-comment`}
                  placeholder="Share your specific experience..."
                  value={comments[category.id]}
                  onChange={(e) => handleCommentChange(category.id, e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          
          <div className="p-4 rounded-lg border">
            <Label htmlFor="general-feedback" className="text-md font-medium">
              General Feedback & Suggestions
            </Label>
            <p className="text-muted-foreground text-sm mb-2">
              Any other thoughts on how we can improve your experience?
            </p>
            <Textarea
              id="general-feedback"
              placeholder="Share any additional feedback or suggestions..."
              value={comments.general}
              onChange={(e) => handleCommentChange("general", e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <SendIcon className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
