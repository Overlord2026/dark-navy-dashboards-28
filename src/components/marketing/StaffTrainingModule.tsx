import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Play, FileText, Video, Clock, Users } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'guide' | 'interactive';
  completed: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const trainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'CSV Upload & Contact Management',
    description: 'Learn how to upload, clean, and manage contact lists',
    duration: '15 min',
    type: 'video',
    completed: true,
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Campaign Assignment & Automation',
    description: 'Master the campaign assignment and automated outreach process',
    duration: '20 min',
    type: 'interactive',
    completed: true,
    difficulty: 'beginner'
  },
  {
    id: '3',
    title: 'VIP Contact Handling',
    description: 'Special procedures for high-priority VIP contacts',
    duration: '12 min',
    type: 'guide',
    completed: false,
    difficulty: 'intermediate'
  },
  {
    id: '4',
    title: 'Analytics & Reporting',
    description: 'Understanding campaign performance and generating reports',
    duration: '18 min',
    type: 'video',
    completed: false,
    difficulty: 'intermediate'
  },
  {
    id: '5',
    title: 'Troubleshooting Common Issues',
    description: 'How to handle bounces, errors, and technical problems',
    duration: '25 min',
    type: 'guide',
    completed: false,
    difficulty: 'advanced'
  }
];

const quickActions = [
  {
    title: 'Upload New CSV',
    description: 'Step-by-step walkthrough',
    icon: FileText,
    action: 'guide'
  },
  {
    title: 'Handle VIP Contact',
    description: 'Quick reference guide',
    icon: Users,
    action: 'checklist'
  },
  {
    title: 'Review Failed Deliveries',
    description: 'Troubleshooting steps',
    icon: Clock,
    action: 'guide'
  }
];

export default function StaffTrainingModule() {
  const [completedModules, setCompletedModules] = useState<string[]>(['1', '2']);
  
  const completionRate = (completedModules.length / trainingModules.length) * 100;

  const toggleCompletion = (moduleId: string) => {
    setCompletedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'guide': return <FileText className="h-4 w-4" />;
      case 'interactive': return <Play className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Training Progress</CardTitle>
          <CardDescription>
            Complete training modules to master the marketing automation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completedModules.length}/{trainingModules.length} completed</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          {trainingModules.map((module) => (
            <Card key={module.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(module.type)}
                      <h4 className="font-semibold">{module.title}</h4>
                      <Badge variant={getDifficultyColor(module.difficulty) as any} className="text-xs">
                        {module.difficulty}
                      </Badge>
                      {completedModules.includes(module.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>⏱️ {module.duration}</span>
                      <span>📋 {module.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant={completedModules.includes(module.id) ? "default" : "outline"}
                      onClick={() => toggleCompletion(module.id)}
                    >
                      {completedModules.includes(module.id) ? "✓" : "Mark Complete"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <action.icon className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">{action.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <Button size="sm" className="mt-3 w-full">
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Documentation</h4>
                  <ul className="space-y-1 text-sm">
                    <li><a href="#" className="text-primary hover:underline">Platform User Manual</a></li>
                    <li><a href="#" className="text-primary hover:underline">CSV Format Guidelines</a></li>
                    <li><a href="#" className="text-primary hover:underline">Campaign Best Practices</a></li>
                    <li><a href="#" className="text-primary hover:underline">Troubleshooting Guide</a></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Support</h4>
                  <ul className="space-y-1 text-sm">
                    <li><a href="#" className="text-primary hover:underline">Contact Support</a></li>
                    <li><a href="#" className="text-primary hover:underline">Report a Bug</a></li>
                    <li><a href="#" className="text-primary hover:underline">Feature Requests</a></li>
                    <li><a href="#" className="text-primary hover:underline">Team Slack Channel</a></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}