import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuideUploadForm } from './GuideUploadForm';
import { CourseUploadForm } from './CourseUploadForm';
import { BookUploadForm } from './BookUploadForm';
import { ContentLog } from './ContentLog';
import { Upload, BookOpen, PlayCircle, FileText, History } from 'lucide-react';

export function EducationAdminUpload() {
  const [activeTab, setActiveTab] = useState('guides');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Education Center Admin</h2>
        <p className="text-muted-foreground">
          Upload and manage educational content including guides, courses, and book recommendations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="log" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Content Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PDF Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GuideUploadForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Add Video Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CourseUploadForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Add Book Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookUploadForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Content Upload Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContentLog />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}