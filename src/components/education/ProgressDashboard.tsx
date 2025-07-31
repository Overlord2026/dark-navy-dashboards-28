import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, Download } from 'lucide-react';
import { useEducationProgress } from '@/hooks/useEducationProgress';

export function ProgressDashboard() {
  const { 
    progressStats, 
    getCompletedModules, 
    getBookmarkedModules, 
    getTotalTimeSpent, 
    getOverallProgress 
  } = useEducationProgress();

  const completedModules = getCompletedModules();
  const bookmarkedModules = getBookmarkedModules();
  const totalTimeSpent = getTotalTimeSpent();
  const overallProgress = getOverallProgress();

  const generateCertificate = () => {
    // Certificate generation logic would go here
    console.log('Generating certificate...');
  };

  const recentAchievements = [
    { title: 'First Course Completed', date: '2024-01-15', badge: 'Beginner' },
    { title: 'Tax Planning Path Started', date: '2024-01-20', badge: 'In Progress' },
    { title: '10 Hours of Learning', date: '2024-01-25', badge: 'Milestone' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Learning Progress</h2>
        <Button onClick={generateCertificate} disabled={progressStats.completedPaths === 0}>
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Completion Rate</span>
                <span className="font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progressStats.completedModules} of {progressStats.totalModules} modules completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Learning Time</CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{Math.round(totalTimeSpent)}h</p>
              <p className="text-xs text-muted-foreground">
                Total time spent learning
              </p>
              <div className="text-xs">
                <span className="text-muted-foreground">This week: </span>
                <span className="font-medium">2.5h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Achievements</CardTitle>
              <Trophy className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{progressStats.completedPaths}</p>
              <p className="text-xs text-muted-foreground">
                Learning paths completed
              </p>
              <div className="text-xs">
                <span className="text-muted-foreground">Active paths: </span>
                <span className="font-medium">{progressStats.activePaths}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Achievements</CardTitle>
            <CardDescription>Your latest learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </div>
                  <Badge variant="secondary">{achievement.badge}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bookmarked Content</CardTitle>
            <CardDescription>Save for later reference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookmarkedModules.length > 0 ? (
                bookmarkedModules.slice(0, 3).map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Bookmarked Module</p>
                      <p className="text-xs text-muted-foreground">
                        Progress: {Math.round(module.progress)}%
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Continue
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No bookmarked content yet. Start exploring courses to bookmark your favorites!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}