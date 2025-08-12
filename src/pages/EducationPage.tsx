import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Video, Users } from 'lucide-react';

export default function EducationPage() {
  return (
    <ThreeColumnLayout 
      title="Education Center" 
      activeMainItem="education"
      activeSecondaryItem="all"
      secondaryMenuItems={[]}
    >
      <div className="space-y-6 px-1 pb-8">
        <div className="text-center bg-gradient-primary rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Financial Education Center</h1>
          <p className="text-lg opacity-90">
            Comprehensive guides, courses, and resources to enhance your financial knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Interactive learning modules</p>
              <Button className="w-full">Browse Courses</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Guides and documentation</p>
              <Button className="w-full">View Resources</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Educational video content</p>
              <Button className="w-full">Watch Videos</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Webinars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Live learning sessions</p>
              <Button className="w-full">Join Webinars</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}