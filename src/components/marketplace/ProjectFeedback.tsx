
import React, { useState } from "react";
import { usePayment, Feedback, Project } from "@/context/PaymentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProjectFeedbackProps {
  projectId: string;
}

export function ProjectFeedback({ projectId }: ProjectFeedbackProps) {
  const { getFeedbackForProject, addFeedback, getProjectById, isLoading } = usePayment();
  const { userProfile } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const projectFeedback = getFeedbackForProject(projectId);
  const project = getProjectById(projectId);
  
  const userIsClient = project?.clientId === userProfile.id;
  const userIsProvider = project?.providerId === userProfile.id;
  
  const hasProvidedFeedback = projectFeedback.some(
    fb => fb.clientId === userProfile.id || fb.providerId === userProfile.id
  );
  
  const handleSubmitFeedback = async () => {
    if (rating === 0) return;
    
    const newFeedback: Feedback = {
      id: "",
      projectId,
      providerId: userIsClient ? project!.providerId : userProfile.id,
      clientId: userIsClient ? userProfile.id : project!.clientId,
      rating,
      comments: comment,
      createdAt: "",
      isPublic
    };
    
    await addFeedback(newFeedback);
    setRating(0);
    setComment("");
    setIsPublic(true);
    setIsDialogOpen(false);
  };
  
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const StarRating = ({ value, onChange }: { value: number, onChange?: (value: number) => void }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`rounded-full p-1 ${
              star <= value
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
            disabled={!onChange}
          >
            <StarIcon className="h-5 w-5" />
            <span className="sr-only">{star} stars</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Feedback</span>
          {(userIsClient || userIsProvider) && !hasProvidedFeedback && project?.status === 'completed' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Provide Feedback</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>How would you rate your experience?</Label>
                    <div className="flex justify-center py-2">
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comment">Additional Comments</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Feedback Visibility</Label>
                    <RadioGroup value={isPublic ? "public" : "private"} onValueChange={(v) => setIsPublic(v === "public")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public - Visible to other users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private - Only visible to the provider</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={rating === 0 || isLoading}
                  >
                    Submit Feedback
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="public">Public Only</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderFeedbackList(projectFeedback, getInitials)}
          </TabsContent>
          
          <TabsContent value="public">
            {renderFeedbackList(projectFeedback.filter(fb => fb.isPublic), getInitials)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function renderFeedbackList(feedbackList: Feedback[], getInitials: (name: string) => string) {
  return (
    <div className="space-y-4">
      {feedbackList.length > 0 ? (
        feedbackList.map((feedback) => (
          <div key={feedback.id} className="p-4 rounded-lg border">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{getInitials(feedback.clientId)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Client Feedback</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(feedback.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-4 w-4 ${
                        star <= feedback.rating ? "text-yellow-400" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm">{feedback.comments}</p>
                {!feedback.isPublic && (
                  <span className="text-xs text-muted-foreground mt-2 block">
                    Private feedback
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No feedback has been provided for this project yet.
        </div>
      )}
    </div>
  );
}
