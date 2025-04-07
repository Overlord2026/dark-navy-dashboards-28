
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoursesList } from "@/components/education/admin/CoursesList";
import { ResourcesList } from "@/components/education/admin/ResourcesList";
import { EducationContentProvider } from "@/context/EducationContentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LockIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function EducationAdmin() {
  return (
    <EducationContentProvider>
      <ThreeColumnLayout 
        title="Education Content Manager" 
        activeMainItem="education"
      >
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Education Content Manager</h1>
              <p className="text-muted-foreground">
                Manage all educational content including courses, guides, books, and whitepapers.
              </p>
            </div>
            
            <Card className="w-auto border-amber-500/20 bg-amber-500/5">
              <CardHeader className="py-2 px-4 flex flex-row items-center gap-2">
                <LockIcon className="h-4 w-4 text-amber-500" />
                <div>
                  <CardTitle className="text-sm">Administrator Access</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </div>
          
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList className="bg-muted rounded-md p-1 mb-6">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="whitepapers">Whitepapers</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[calc(100vh-280px)]">
              <TabsContent value="courses" className="space-y-8">
                <CoursesList type="featured" />
                <CoursesList type="popular" />
              </TabsContent>
              
              <TabsContent value="guides" className="space-y-8">
                <ResourcesList type="guides" />
              </TabsContent>
              
              <TabsContent value="books" className="space-y-8">
                <ResourcesList type="books" />
              </TabsContent>
              
              <TabsContent value="whitepapers" className="space-y-8">
                <ResourcesList type="whitepapers" />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </ThreeColumnLayout>
    </EducationContentProvider>
  );
}
