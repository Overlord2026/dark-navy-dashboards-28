import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Award,
  Star,
  Gift,
  Bell
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MilestoneAlertsProps {
  onUnreadCountChange: (count: number) => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'achievement' | 'goal_progress' | 'deadline' | 'celebration';
  category: 'financial' | 'planning' | 'relationships' | 'education';
  status: 'active' | 'completed' | 'missed' | 'upcoming';
  progress?: number;
  targetValue?: number;
  currentValue?: number;
  dueDate?: string;
  completedDate?: string;
  rewards?: string[];
  read: boolean;
  timestamp: string;
}

export function MilestoneAlerts({ onUnreadCountChange }: MilestoneAlertsProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Estate Planning Complete',
      description: 'Congratulations! You have completed your comprehensive estate planning with Sarah Johnson.',
      type: 'achievement',
      category: 'planning',
      status: 'completed',
      completedDate: '2024-01-26T09:00:00Z',
      rewards: ['Tax optimization', 'Family protection', 'Peace of mind'],
      read: false,
      timestamp: '2024-01-26T09:00:00Z'
    },
    {
      id: '2',
      title: 'Emergency Fund Goal',
      description: 'You are 85% of the way to your 6-month emergency fund target!',
      type: 'goal_progress',
      category: 'financial',
      status: 'active',
      progress: 85,
      targetValue: 30000,
      currentValue: 25500,
      read: false,
      timestamp: '2024-01-25T14:30:00Z'
    },
    {
      id: '3',
      title: 'Tax Document Deadline',
      description: 'Reminder: Tax documents are due to John Smith (CPA) by January 31st.',
      type: 'deadline',
      category: 'financial',
      status: 'upcoming',
      dueDate: '2024-01-31T23:59:59Z',
      read: true,
      timestamp: '2024-01-24T10:00:00Z'
    },
    {
      id: '4',
      title: 'New Professional Added',
      description: 'Successfully connected with Lisa Anderson (Insurance Agent). Your protection team is now complete!',
      type: 'celebration',
      category: 'relationships',
      status: 'completed',
      completedDate: '2024-01-23T16:20:00Z',
      read: true,
      timestamp: '2024-01-23T16:20:00Z'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | string>('all');

  const unreadCount = milestones.filter(m => !m.read).length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  const getMilestoneIcon = (type: string, status: string) => {
    if (status === 'completed') return CheckCircle;
    
    switch (type) {
      case 'achievement': return Trophy;
      case 'goal_progress': return Target;
      case 'deadline': return Calendar;
      case 'celebration': return Gift;
      default: return Star;
    }
  };

  const getMilestoneColor = (type: string, status: string) => {
    if (status === 'completed') return 'text-green-500';
    if (status === 'missed') return 'text-red-500';
    
    switch (type) {
      case 'achievement': return 'text-yellow-500';
      case 'goal_progress': return 'text-blue-500';
      case 'deadline': return 'text-orange-500';
      case 'celebration': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'relationships': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'upcoming':
        return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      default:
        return null;
    }
  };

  const filteredMilestones = milestones.filter(milestone => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !milestone.read;
    return milestone.category === filter || milestone.type === filter;
  });

  const markAsRead = (id: string) => {
    setMilestones(prev => 
      prev.map(m => m.id === id ? { ...m, read: true } : m)
    );
  };

  const markAllAsRead = () => {
    setMilestones(prev => prev.map(m => ({ ...m, read: true })));
  };

  const categories = [
    { id: 'all', label: 'All', count: milestones.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'achievement', label: 'Achievements', count: milestones.filter(m => m.type === 'achievement').length },
    { id: 'goal_progress', label: 'Goals', count: milestones.filter(m => m.type === 'goal_progress').length },
    { id: 'deadline', label: 'Deadlines', count: milestones.filter(m => m.type === 'deadline').length }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <h3 className="text-lg font-medium">Milestones & Progress</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark All Read
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={filter === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category.id)}
            className="flex items-center gap-1"
          >
            {category.label}
            <Badge variant="secondary" className="ml-1 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No milestones found</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? "You're all caught up! No unread milestones."
                  : "No milestones match your current filter."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMilestones.map((milestone) => {
            const Icon = getMilestoneIcon(milestone.type, milestone.status);
            
            return (
              <Card
                key={milestone.id}
                className={`${!milestone.read ? 'ring-2 ring-primary/20' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-muted flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${getMilestoneColor(milestone.type, milestone.status)}`} />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{milestone.title}</h4>
                            {!milestone.read && (
                              <div className="h-2 w-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getCategoryColor(milestone.category)}`}
                            >
                              {milestone.category}
                            </Badge>
                            {getStatusBadge(milestone.status)}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(milestone.timestamp), { addSuffix: true })}
                          </p>
                          {!milestone.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(milestone.id)}
                            >
                              <Bell className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                      
                      {/* Progress Bar for Goal Progress */}
                      {milestone.type === 'goal_progress' && milestone.progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress} className="h-2" />
                          {milestone.currentValue && milestone.targetValue && (
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>${milestone.currentValue.toLocaleString()}</span>
                              <span>${milestone.targetValue.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Due Date for Deadlines */}
                      {milestone.type === 'deadline' && milestone.dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {/* Rewards for Achievements */}
                      {milestone.rewards && milestone.rewards.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Benefits Unlocked:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {milestone.rewards.map((reward, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}