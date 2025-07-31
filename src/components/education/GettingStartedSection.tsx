import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Users, Award, ArrowRight } from 'lucide-react';

export function GettingStartedSection() {
  const steps = [
    {
      id: 1,
      title: 'Choose Your Learning Path',
      description: 'Select a structured learning path based on your experience level and interests.',
      icon: BookOpen,
      action: 'Browse Paths',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Watch Introduction Videos',
      description: 'Get familiar with key concepts through our expert-led video courses.',
      icon: Play,
      action: 'Watch Videos',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Join the Community',
      description: 'Connect with other learners and professionals in our discussion forums.',
      icon: Users,
      action: 'Join Community',
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Earn Certificates',
      description: 'Complete learning paths to earn certificates and showcase your expertise.',
      icon: Award,
      action: 'Start Learning',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          New to our education platform? Follow these steps to make the most of your learning journey.
        </p>
      </div>

      {/* Quick Start Video */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Platform Walkthrough</h3>
              <p className="text-muted-foreground">
                5-minute overview of how to navigate and use all education features
              </p>
            </div>
            <Button size="lg" className="shrink-0">
              <Play className="h-5 w-5 mr-2" />
              Watch Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <Card key={step.id} className="relative hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription className="text-sm">{step.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full">
                  {step.action}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Popular Starting Points */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Starting Points</CardTitle>
          <CardDescription>Most popular courses for beginners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Retirement Planning Basics</h4>
              <p className="text-sm text-muted-foreground mt-1">Perfect for beginners</p>
              <div className="text-xs text-primary mt-2">2,341 students enrolled</div>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Investment Fundamentals</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn the basics of investing</p>
              <div className="text-xs text-primary mt-2">1,892 students enrolled</div>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium">Tax Planning 101</h4>
              <p className="text-sm text-muted-foreground mt-1">Essential tax knowledge</p>
              <div className="text-xs text-primary mt-2">1,567 students enrolled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}