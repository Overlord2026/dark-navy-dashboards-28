
import React, { useState } from "react";
import { usePayment, Project } from "@/context/PaymentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTimeline } from "./ProjectTimeline";
import { ProjectCommunication } from "./ProjectCommunication";
import { ProjectFeedback } from "./ProjectFeedback";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { MessageSquare, ClipboardList, Star, PieChart } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";

interface ProjectManagementProps {
  projectId: string;
}

export function ProjectManagement({ projectId }: ProjectManagementProps) {
  const { getProjectById, milestones, communications, getFeedbackForProject } = usePayment();
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState("timeline");
  
  const project = getProjectById(projectId);
  const projectMilestones = milestones.filter(m => m.projectId === projectId);
  const projectCommunications = communications.filter(c => c.projectId === projectId);
  const projectFeedback = getFeedbackForProject(projectId);
  
  const userIsProvider = project?.providerId === userProfile.id;

  if (!project) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold">Project not found</h3>
        <p className="text-muted-foreground mt-2">The requested project could not be found.</p>
      </div>
    );
  }
  
  // Calculate stats
  const completedMilestones = projectMilestones.filter(m => 
    m.status === 'completed' || m.status === 'approved'
  ).length;
  
  const progressPercentage = projectMilestones.length > 0 
    ? Math.round((completedMilestones / projectMilestones.length) * 100) 
    : 0;
  
  const upcomingMilestones = projectMilestones.filter(m => 
    m.status === 'pending' || m.status === 'in-progress'
  ).length;
  
  const unreadMessages = projectCommunications.filter(c => 
    !c.readStatus && c.senderId !== userProfile.id
  ).length;
  
  const averageRating = projectFeedback.length > 0
    ? projectFeedback.reduce((sum, fb) => sum + fb.rating, 0) / projectFeedback.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Project Progress"
          icon={<PieChart className="h-5 w-5" />}
        >
          <div className="text-3xl font-bold">{progressPercentage}%</div>
          <p className="text-muted-foreground text-sm">
            {completedMilestones} of {projectMilestones.length} milestones completed
          </p>
        </DashboardCard>
        
        <DashboardCard
          title="Upcoming Milestones"
          icon={<ClipboardList className="h-5 w-5" />}
        >
          <div className="text-3xl font-bold">{upcomingMilestones}</div>
          <p className="text-muted-foreground text-sm">
            {upcomingMilestones === 0 ? "No upcoming milestones" : "Milestones to be completed"}
          </p>
        </DashboardCard>
        
        <DashboardCard
          title="Unread Messages"
          icon={<MessageSquare className="h-5 w-5" />}
        >
          <div className="text-3xl font-bold">{unreadMessages}</div>
          <p className="text-muted-foreground text-sm">
            {unreadMessages === 0 ? "No unread messages" : "Messages require attention"}
          </p>
        </DashboardCard>
        
        <DashboardCard
          title="Feedback Rating"
          icon={<Star className="h-5 w-5" />}
        >
          <div className="text-3xl font-bold">
            {averageRating ? averageRating.toFixed(1) : "N/A"}
          </div>
          <p className="text-muted-foreground text-sm">
            {projectFeedback.length} {projectFeedback.length === 1 ? "review" : "reviews"}
          </p>
        </DashboardCard>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="timeline" className="flex gap-2 items-center">
            <ClipboardList className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex gap-2 items-center">
            <MessageSquare className="h-4 w-4" />
            Communication
            {unreadMessages > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {unreadMessages}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex gap-2 items-center">
            <Star className="h-4 w-4" />
            Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          <ProjectTimeline projectId={projectId} isProvider={userIsProvider} />
        </TabsContent>
        
        <TabsContent value="communication">
          <ProjectCommunication projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="feedback">
          <ProjectFeedback projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
