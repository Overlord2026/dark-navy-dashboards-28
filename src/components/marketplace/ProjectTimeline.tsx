
import React from "react";
import { usePayment, Milestone } from "@/context/PaymentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { format, isPast, differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ProjectTimelineProps {
  projectId: string;
  isProvider?: boolean;
}

export function ProjectTimeline({ projectId, isProvider = false }: ProjectTimelineProps) {
  const { 
    milestones, 
    completeMilestone, 
    releaseEscrow, 
    requestReleaseApproval, 
    isLoading 
  } = usePayment();
  
  const projectMilestones = milestones.filter(m => m.projectId === projectId);
  
  // Sort milestones by due date
  const sortedMilestones = [...projectMilestones].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  // Calculate overall project progress
  const completedCount = projectMilestones.filter(m => 
    m.status === 'completed' || m.status === 'approved'
  ).length;
  
  const progressPercentage = projectMilestones.length > 0 
    ? Math.round((completedCount / projectMilestones.length) * 100) 
    : 0;

  const handleComplete = async (milestone: Milestone) => {
    try {
      await completeMilestone(milestone.id);
      
      // If provider is completing, also request release approval
      if (isProvider) {
        await requestReleaseApproval(milestone.id);
      }
    } catch (error) {
      console.error("Error completing milestone:", error);
      toast.error("Failed to update milestone status");
    }
  };

  const handleRelease = async (milestone: Milestone) => {
    try {
      await releaseEscrow(milestone.id);
    } catch (error) {
      console.error("Error releasing payment:", error);
      toast.error("Failed to release payment");
    }
  };

  const getMilestoneStatus = (milestone: Milestone) => {
    const dueDate = new Date(milestone.dueDate);
    const isPastDue = isPast(dueDate) && milestone.status !== 'completed' && milestone.status !== 'approved';
    const isUpcoming = !isPast(dueDate) && differenceInDays(dueDate, new Date()) <= 7;
    
    if (milestone.status === 'approved') {
      return { variant: "success", text: "Completed & Approved" };
    } else if (milestone.status === 'completed') {
      return { variant: "warning", text: "Completed (Awaiting Approval)" };
    } else if (isPastDue) {
      return { variant: "destructive", text: "Past Due" };
    } else if (milestone.status === 'in-progress') {
      return { variant: "default", text: "In Progress" };
    } else if (isUpcoming) {
      return { variant: "outline", text: "Upcoming Soon" };
    } else {
      return { variant: "secondary", text: "Scheduled" };
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Project Timeline</div>
          <Badge variant="outline" className="ml-2">
            {progressPercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-6">
          {sortedMilestones.length > 0 ? (
            sortedMilestones.map((milestone, index) => {
              const status = getMilestoneStatus(milestone);
              return (
                <div key={milestone.id} className="relative">
                  {index < sortedMilestones.length - 1 && (
                    <div className="absolute left-6 top-10 h-full w-0.5 bg-border"></div>
                  )}
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                      {milestone.status === 'approved' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : milestone.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-yellow-500" />
                      ) : isPast(new Date(milestone.dueDate)) && 
                          !(milestone.status === 'completed' || milestone.status === 'approved') ? (
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      ) : (
                        <Clock className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{milestone.title}</h3>
                        <Badge variant={status.variant as any}>{status.text}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                        </span>
                        {milestone.completedDate && (
                          <span className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            Completed: {format(new Date(milestone.completedDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          Amount: ${milestone.amount.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Action buttons based on role and status */}
                      <div className="flex gap-2 mt-1">
                        {isProvider && milestone.status === 'in-progress' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleComplete(milestone)}
                            disabled={isLoading}
                          >
                            Mark as Completed
                          </Button>
                        )}
                        
                        {!isProvider && milestone.status === 'completed' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleRelease(milestone)}
                            disabled={isLoading}
                          >
                            Approve & Release Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No milestones have been created for this project yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
