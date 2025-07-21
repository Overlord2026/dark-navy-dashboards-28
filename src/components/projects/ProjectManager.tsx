import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Target,
  Plus,
  Edit3,
  AlertCircle,
  TrendingUp,
  FileText,
  MessageCircle,
  Settings,
  MoreVertical,
  Flag,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  useProjects, 
  useProjectMilestones, 
  useProjectTasks,
  Project,
  ProjectMilestone,
  ProjectTask
} from "@/hooks/useProjects";
import { ProjectChat } from "./ProjectChat";
import { ProjectCalendar } from "./ProjectCalendar";
import { ProjectDocuments } from "./ProjectDocuments";

interface ProjectManagerProps {
  projectId: string;
  onClose?: () => void;
}

export function ProjectManager({ projectId, onClose }: ProjectManagerProps) {
  const { projects, updateProject } = useProjects();
  const { milestones, createMilestone, updateMilestone } = useProjectMilestones(projectId);
  const { tasks, createTask, updateTask } = useProjectTasks(projectId);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewMilestoneDialog, setShowNewMilestoneDialog] = useState(false);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(false);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
            <p className="text-muted-foreground">The requested project could not be found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': case 'active': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'on_hold': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const completedMilestones = milestones.filter(m => m.completed).length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;

  const NewMilestoneDialog = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium' as const
    });

    const handleSubmit = async () => {
      await createMilestone(formData);
      setShowNewMilestoneDialog(false);
      setFormData({ title: '', description: '', due_date: '', priority: 'medium' });
    };

    return (
      <Dialog open={showNewMilestoneDialog} onOpenChange={setShowNewMilestoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Milestone</DialogTitle>
            <DialogDescription>
              Add a new milestone to track major project deliverables.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Milestone title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the milestone objectives"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMilestoneDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title}>
              Create Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const NewTaskDialog = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'medium' as const,
      due_date: '',
      milestone_id: ''
    });

    const handleSubmit = async () => {
      await createTask({
        ...formData,
        milestone_id: formData.milestone_id || undefined
      });
      setShowNewTaskDialog(false);
      setFormData({ title: '', description: '', priority: 'medium', due_date: '', milestone_id: '' });
    };

    return (
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to track specific work items.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task details"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            {milestones.length > 0 && (
              <div>
                <label className="text-sm font-medium">Milestone (Optional)</label>
                <Select value={formData.milestone_id} onValueChange={(value) => setFormData({ ...formData, milestone_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Link to milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No milestone</SelectItem>
                    {milestones.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", getStatusColor(project.status))} />
                  <Badge variant="outline" className="capitalize">
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    <Flag className="h-3 w-3 mr-1" />
                    {project.priority}
                  </Badge>
                </div>
              </div>
              {project.description && (
                <p className="text-muted-foreground max-w-2xl">{project.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  <Archive className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <div className="space-y-1">
                <Progress value={project.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Milestones</span>
              </div>
              <p className="text-2xl font-bold">{completedMilestones}/{milestones.length}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Tasks</span>
              </div>
              <p className="text-2xl font-bold">{completedTasks}/{tasks.length}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Milestones
                  </CardTitle>
                  <CardDescription>
                    Track major project deliverables
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowNewMilestoneDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones.slice(0, 5).map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox
                        checked={milestone.completed}
                        onCheckedChange={(checked) => 
                          updateMilestone(milestone.id, { 
                            completed: checked as boolean,
                            completed_date: checked ? new Date().toISOString().split('T')[0] : undefined
                          })
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-medium",
                          milestone.completed && "line-through text-muted-foreground"
                        )}>
                          {milestone.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(milestone.priority)}>
                            {milestone.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(milestone.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {milestones.length === 0 && (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-medium mb-2">No milestones yet</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create milestones to track major project deliverables.
                      </p>
                      <Button size="sm" onClick={() => setShowNewMilestoneDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Create First Milestone
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Recent Tasks
                  </CardTitle>
                  <CardDescription>
                    Latest task updates
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowNewTaskDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={(checked) => 
                          updateTask(task.id, { 
                            status: checked ? 'completed' : 'todo'
                          })
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-medium",
                          task.status === 'completed' && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'in_progress' ? 'secondary' :
                            task.status === 'blocked' ? 'destructive' : 'outline'
                          }>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          {task.due_date && (
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-medium mb-2">No tasks yet</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create tasks to track specific work items.
                      </p>
                      <Button size="sm" onClick={() => setShowNewTaskDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Create First Task
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  Manage and track all project tasks
                </CardDescription>
              </div>
              <Button onClick={() => setShowNewTaskDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.status === 'completed'}
                          onCheckedChange={(checked) => 
                            updateTask(task.id, { 
                              status: checked ? 'completed' : 'todo'
                            })
                          }
                        />
                        <div className="space-y-2">
                          <h4 className={cn(
                            "font-medium",
                            task.status === 'completed' && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge variant={
                              task.status === 'completed' ? 'default' :
                              task.status === 'in_progress' ? 'secondary' :
                              task.status === 'blocked' ? 'destructive' : 'outline'
                            }>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            {task.due_date && (
                              <span className="text-xs text-muted-foreground">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first task to start organizing project work.
                    </p>
                    <Button onClick={() => setShowNewTaskDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Project Team
              </CardTitle>
              <CardDescription>
                Team members assigned to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Team management coming soon</h3>
                <p className="text-muted-foreground">
                  Team assignment and collaboration features will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <ProjectChat 
            projectId={projectId} 
            projectName={project.name}
            teamMembers={[]} // TODO: Pass actual team members
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <ProjectCalendar projectId={projectId} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <ProjectDocuments projectId={projectId} />
        </TabsContent>
      </Tabs>

      <NewMilestoneDialog />
      <NewTaskDialog />
    </div>
  );
}