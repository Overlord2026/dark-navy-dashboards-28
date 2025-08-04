import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Video, 
  Book, 
  HelpCircle, 
  Calendar,
  MessageCircle,
  Bot
} from 'lucide-react';

const trainingResources = [
  { id: 1, title: 'Getting Started with BFO', type: 'video', duration: '15 min', completed: true },
  { id: 2, title: 'Platform Navigation', type: 'video', duration: '8 min', completed: true },
  { id: 3, title: 'Client Onboarding Process', type: 'guide', duration: '20 min', completed: false },
  { id: 4, title: 'Compliance Best Practices', type: 'guide', duration: '30 min', completed: false }
];

const upcomingTraining = [
  { id: 1, title: 'Advanced Portfolio Management', date: 'Jan 25, 2024', time: '2:00 PM EST' },
  { id: 2, title: 'Compliance Deep Dive', date: 'Jan 30, 2024', time: '10:00 AM EST' }
];

export const TrainingResourceCenter = () => {
  const completedCount = trainingResources.filter(item => item.completed).length;
  const totalCount = trainingResources.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Training & Resource Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Training Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Getting Started Resources */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Video className="h-4 w-4" />
            Getting Started
          </h4>
          <div className="space-y-2">
            {trainingResources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  {resource.type === 'video' ? (
                    <Video className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Book className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <span className="font-medium text-sm">{resource.title}</span>
                    <p className="text-xs text-muted-foreground">{resource.duration}</p>
                  </div>
                </div>
                {resource.completed ? (
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="outline">Start</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Book className="h-4 w-4" />
            Knowledge Base
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Book className="h-4 w-4 mr-2" />
              User Guides
            </Button>
          </div>
        </div>

        {/* Live Training */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Live Training
          </h4>
          <div className="space-y-2">
            {upcomingTraining.map((training) => (
              <div key={training.id} className="p-3 border rounded-lg">
                <div className="font-medium text-sm">{training.title}</div>
                <div className="text-xs text-muted-foreground">
                  {training.date} at {training.time}
                </div>
                <Button size="sm" className="mt-2 w-full">
                  Register
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Get instant help with BFO platform questions
          </p>
          <Button className="w-full flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Ask BFO AI
          </Button>
        </div>

        {/* 1-on-1 Support */}
        <Button variant="outline" className="w-full">
          Schedule 1-on-1 Training Session
        </Button>
      </CardContent>
    </Card>
  );
};