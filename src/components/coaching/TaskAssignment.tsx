import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Target,
  Flag,
  Edit,
  Trash2,
  Send
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  category: string;
  estimatedHours: number;
  completedDate?: string;
  notes?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  targetDate: string;
  progress: number;
  tasks: string[];
  reward?: string;
  category: string;
}

export function TaskAssignment() {
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones'>('tasks');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as const,
    dueDate: '',
    category: '',
    estimatedHours: 1
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    assignedTo: '',
    targetDate: '',
    category: '',
    reward: ''
  });

  // Mock data
  const advisors = [
    { id: 'sarah', name: 'Sarah Johnson' },
    { id: 'mike', name: 'Mike Chen' },
    { id: 'emily', name: 'Emily Davis' },
    { id: 'david', name: 'David Wilson' }
  ];

  const taskCategories = [
    'Prospecting',
    'Client Meetings',
    'Sales Process',
    'Technology',
    'Training',
    'Administrative',
    'Practice Development'
  ];

  const milestoneCategories = [
    'Revenue Goals',
    'Client Acquisition',
    'Skills Development',
    'Process Improvement',
    'Technology Adoption',
    'Certification',
    'Team Building'
  ];

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Complete CRM Setup',
      description: 'Set up and customize CRM system with all current clients',
      assignedTo: 'sarah',
      assignedBy: 'Mike Chen',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-03-15',
      category: 'Technology',
      estimatedHours: 4
    },
    {
      id: '2',
      title: 'Prospect Outreach Campaign',
      description: 'Execute 50 prospect touchpoints using new scripts',
      assignedTo: 'emily',
      assignedBy: 'Lisa Anderson',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-03-10',
      category: 'Prospecting',
      estimatedHours: 8
    },
    {
      id: '3',
      title: 'Client Review Meetings',
      description: 'Complete quarterly reviews with top 10 clients',
      assignedTo: 'mike',
      assignedBy: 'David Martinez',
      priority: 'high',
      status: 'completed',
      dueDate: '2024-02-28',
      category: 'Client Meetings',
      estimatedHours: 12,
      completedDate: '2024-02-26'
    }
  ];

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'First $100K Month',
      description: 'Achieve $100,000 in monthly recurring revenue',
      assignedTo: 'sarah',
      targetDate: '2024-04-30',
      progress: 75,
      tasks: ['1', '2'],
      reward: '$500 bonus',
      category: 'Revenue Goals'
    },
    {
      id: '2',
      title: 'Acquire 20 New Clients',
      description: 'Successfully onboard 20 new clients in Q1',
      assignedTo: 'emily',
      targetDate: '2024-03-31',
      progress: 60,
      tasks: ['2'],
      reward: 'Professional development budget',
      category: 'Client Acquisition'
    },
    {
      id: '3',
      title: 'Complete Advanced Sales Training',
      description: 'Finish all modules in Advanced Sales Certification program',
      assignedTo: 'mike',
      targetDate: '2024-03-20',
      progress: 90,
      tasks: ['3'],
      category: 'Skills Development'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleCreateTask = () => {
    // Handle task creation
    console.log('Creating task:', newTask);
    setShowTaskDialog(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      category: '',
      estimatedHours: 1
    });
  };

  const handleCreateMilestone = () => {
    // Handle milestone creation
    console.log('Creating milestone:', newMilestone);
    setShowMilestoneDialog(false);
    setNewMilestone({
      title: '',
      description: '',
      assignedTo: '',
      targetDate: '',
      category: '',
      reward: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Task & Milestone Management</h3>
          <p className="text-sm text-muted-foreground">
            Assign tasks and set milestones to drive advisor development
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowTaskDialog(true)}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
          <Button className="gap-2" onClick={() => setShowMilestoneDialog(true)}>
            <Target className="h-4 w-4" />
            New Milestone
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tasks' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'milestones' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Milestones ({milestones.length})
        </button>
      </div>

      {/* Tasks View */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-blue-500' :
                      task.status === 'overdue' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Assigned to:</span>
                    <div className="font-medium">
                      {advisors.find(a => a.id === task.assignedTo)?.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned by:</span>
                    <div className="font-medium">{task.assignedBy}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due date:</span>
                    <div className="font-medium">{task.dueDate}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. hours:</span>
                    <div className="font-medium">{task.estimatedHours}h</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{task.category}</Badge>
                  {task.completedDate && (
                    <Badge variant="outline" className="text-green-600">
                      Completed: {task.completedDate}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  {task.status !== 'completed' && (
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Milestones View */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">{milestone.title}</CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{milestone.progress}% Complete</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Assigned to:</span>
                    <div className="font-medium">
                      {advisors.find(a => a.id === milestone.assignedTo)?.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target date:</span>
                    <div className="font-medium">{milestone.targetDate}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Related tasks:</span>
                    <div className="font-medium">{milestone.tasks.length} tasks</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{milestone.category}</Badge>
                  {milestone.reward && (
                    <Badge variant="outline" className="text-purple-600">
                      Reward: {milestone.reward}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="h-3 w-3 mr-1" />
                    Check Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Assign a specific task to an advisor with clear expectations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title..."
              />
            </div>
            <div>
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea
                id="taskDescription"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Describe the task and expectations..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assign to</Label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {advisors.map((advisor) => (
                      <SelectItem key={advisor.id} value={advisor.id}>
                        {advisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: string) => 
                    setNewTask({...newTask, priority: value as any})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({...newTask, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Est. Hours</Label>
                <Input
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value)})}
                  min="1"
                  max="40"
                />
              </div>
            </div>
            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        setNewTask({...newTask, dueDate: format(date, 'yyyy-MM-dd')});
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Milestone Dialog */}
      <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Milestone</DialogTitle>
            <DialogDescription>
              Set an important goal or achievement for an advisor to work towards.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="milestoneTitle">Milestone Title</Label>
              <Input
                id="milestoneTitle"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                placeholder="Enter milestone title..."
              />
            </div>
            <div>
              <Label htmlFor="milestoneDescription">Description</Label>
              <Textarea
                id="milestoneDescription"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                placeholder="Describe the milestone and success criteria..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assign to</Label>
                <Select
                  value={newMilestone.assignedTo}
                  onValueChange={(value) => setNewMilestone({...newMilestone, assignedTo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {advisors.map((advisor) => (
                      <SelectItem key={advisor.id} value={advisor.id}>
                        {advisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={newMilestone.category}
                  onValueChange={(value) => setNewMilestone({...newMilestone, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {milestoneCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="reward">Reward (Optional)</Label>
              <Input
                id="reward"
                value={newMilestone.reward}
                onChange={(e) => setNewMilestone({...newMilestone, reward: e.target.value})}
                placeholder="e.g., $500 bonus, professional development budget"
              />
            </div>
            <div>
              <Label>Target Date</Label>
              <Input
                type="date"
                value={newMilestone.targetDate}
                onChange={(e) => setNewMilestone({...newMilestone, targetDate: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMilestoneDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMilestone}>
                Create Milestone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}