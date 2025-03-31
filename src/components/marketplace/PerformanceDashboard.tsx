import React from "react";
import { usePayment, Project, Milestone, Feedback } from "@/context/PaymentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarIcon, CheckCircle2, Clock, AlertTriangle, BarChart, Calendar, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartBarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface PerformanceDashboardProps {
  isProvider?: boolean;
}

export function PerformanceDashboard({ isProvider = false }: PerformanceDashboardProps) {
  const { projects, milestones, getFeedbackForProject } = usePayment();
  const { userProfile } = useUser();
  
  const userProjects = isProvider
    ? projects.filter(project => project.providerId === userProfile.id)
    : projects.filter(project => project.clientId === userProfile.id);
  
  const userMilestones = milestones.filter(milestone => 
    userProjects.some(project => project.id === milestone.projectId)
  );
  
  const allFeedback = userProjects.flatMap(project => getFeedbackForProject(project.id));
  
  const activeProjects = userProjects.filter(project => project.status === 'active').length;
  const completedProjects = userProjects.filter(project => project.status === 'completed').length;
  
  const completedMilestones = userMilestones.filter(milestone => 
    milestone.status === 'completed' || milestone.status === 'approved'
  ).length;
  
  const pendingMilestones = userMilestones.filter(milestone => 
    milestone.status === 'pending' || milestone.status === 'in-progress'
  ).length;
  
  const overdueMilestones = userMilestones.filter(milestone => 
    (milestone.status === 'pending' || milestone.status === 'in-progress') &&
    isBefore(parseISO(milestone.dueDate), new Date())
  ).length;
  
  const onTrackProjects = userProjects.filter(project => {
    const projectMilestones = userMilestones.filter(m => m.projectId === project.id);
    const overdueCount = projectMilestones.filter(m => 
      (m.status === 'pending' || m.status === 'in-progress') &&
      isBefore(parseISO(m.dueDate), new Date())
    ).length;
    return project.status === 'active' && overdueCount === 0;
  }).length;
  
  const averageRating = allFeedback.length > 0 
    ? allFeedback.reduce((sum, fb) => sum + fb.rating, 0) / allFeedback.length 
    : 0;
  
  const statusData = [
    { name: 'Active', value: activeProjects, color: '#2563eb' },
    { name: 'Completed', value: completedProjects, color: '#16a34a' }
  ];
  
  const milestoneStatusData = [
    { name: 'Completed', value: completedMilestones, color: '#16a34a' },
    { name: 'In Progress', value: pendingMilestones - overdueMilestones, color: '#2563eb' },
    { name: 'Overdue', value: overdueMilestones, color: '#ef4444' }
  ];
  
  const revenueData = userProjects.map(project => ({
    name: project.title.length > 15 ? project.title.substring(0, 15) + '...' : project.title,
    amount: project.totalAmount
  }));
  
  const ratingDistribution = [0, 0, 0, 0, 0];
  allFeedback.forEach(fb => {
    if (fb.rating >= 1 && fb.rating <= 5) {
      ratingDistribution[fb.rating - 1]++;
    }
  });
  
  const ratingData = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating !== 1 ? 's' : ''}`,
    count: ratingDistribution[rating - 1]
  }));
  
  const upcomingMilestones = userMilestones
    .filter(milestone => 
      (milestone.status === 'pending' || milestone.status === 'in-progress') &&
      isAfter(parseISO(milestone.dueDate), new Date())
    )
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Project Status"
          icon={<BarChart className="h-5 w-5" />}
        >
          <div className="flex justify-between">
            <div>
              <div className="text-3xl font-bold">{activeProjects}</div>
              <p className="text-muted-foreground text-sm">Active Projects</p>
            </div>
            <div>
              <div className="text-3xl font-bold">{completedProjects}</div>
              <p className="text-muted-foreground text-sm">Completed</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Milestone Progress"
          icon={<CheckCircle2 className="h-5 w-5" />}
        >
          <div className="flex justify-between">
            <div>
              <div className="text-3xl font-bold">{completedMilestones}</div>
              <p className="text-muted-foreground text-sm">Completed</p>
            </div>
            <div>
              <div className="text-3xl font-bold">{pendingMilestones}</div>
              <p className="text-muted-foreground text-sm">Pending</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Project Health"
          icon={<AlertTriangle className="h-5 w-5" />}
        >
          <div className="flex justify-between">
            <div>
              <div className="text-3xl font-bold">{onTrackProjects}</div>
              <p className="text-muted-foreground text-sm">On Track</p>
            </div>
            <div>
              <div className="text-3xl font-bold">{overdueMilestones}</div>
              <p className="text-muted-foreground text-sm">Overdue</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Client Satisfaction"
          icon={<StarIcon className="h-5 w-5" />}
        >
          <div className="text-3xl font-bold">
            {averageRating ? averageRating.toFixed(1) : "N/A"}
          </div>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {allFeedback.length} {allFeedback.length === 1 ? "review" : "reviews"}
          </p>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMilestones.length > 0 ? (
              <div className="space-y-4">
                {upcomingMilestones.map((milestone, index) => {
                  const project = userProjects.find(p => p.id === milestone.projectId);
                  return (
                    <div key={milestone.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{milestone.title}</div>
                          <div className="text-sm text-muted-foreground">{project?.title}</div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Due:</span> {format(parseISO(milestone.dueDate), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant={milestone.status === 'in-progress' ? 'default' : 'outline'}>
                            {milestone.status === 'in-progress' ? 'In Progress' : 'Pending'}
                          </Badge>
                          <span className="text-sm font-medium mt-1">${milestone.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming milestones
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="h-5 w-5" />
              Ratings & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                {allFeedback.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`h-6 w-6 ${
                                star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-2">
                          Based on {allFeedback.length} {allFeedback.length === 1 ? "rating" : "ratings"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Latest Reviews</h4>
                      <div className="space-y-3">
                        {allFeedback.slice(0, 3).map(feedback => (
                          <div key={feedback.id} className="p-3 rounded-md border">
                            <div className="flex items-center gap-2">
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
                            <p className="mt-1 text-xs text-muted-foreground">
                              {format(parseISO(feedback.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No ratings received yet
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="distribution">
                {allFeedback.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartBarChart
                      data={ratingData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="rating" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" barSize={30} />
                    </RechartBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No ratings received yet
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProjects.length > 0 ? (
              <div className="h-[250px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No projects found
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {isProvider ? "Revenue by Project" : "Spend by Project"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <RechartBarChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
                  <Bar dataKey="amount" fill="#2563eb" />
                </RechartBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No project data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/marketplace/payments">View Full Payment Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
