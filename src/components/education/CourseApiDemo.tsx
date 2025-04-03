
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchCourses } from '@/services/api/courseApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CourseDetailsApi } from './CourseDetailsApi';
import { CourseEnrollmentApi } from './CourseEnrollmentApi';

export const CourseApiDemo = () => {
  const [apiTab, setApiTab] = useState('all-courses');
  const [token, setToken] = useState('Bearer mock-jwt-token');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCourses = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetchCourses(token);
      if (response.success) {
        setResults(response.data);
        toast.success('Courses fetched successfully');
      } else {
        setError(response.error || 'Failed to fetch courses');
        toast.error(response.error || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Course API Playground</CardTitle>
          <CardDescription>
            Test our course API endpoints with sample data
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs value={apiTab} onValueChange={setApiTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all-courses" className="flex-1">GET /api/courses</TabsTrigger>
          <TabsTrigger value="course-details" className="flex-1">GET /api/courses/{'{id}'}</TabsTrigger>
          <TabsTrigger value="course-enroll" className="flex-1">POST /api/courses/enroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-courses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Courses Endpoint</CardTitle>
              <CardDescription>
                Fetch all available courses with optional filtering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="token" className="text-sm font-medium">Authorization Token</label>
                <Input 
                  id="token" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                  placeholder="Bearer your-jwt-token"
                />
                <p className="text-xs text-muted-foreground">
                  For testing purposes, you can use the default mock token
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleFetchCourses} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Fetching Courses
                  </>
                ) : (
                  'Fetch All Courses'
                )}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Card className="mt-4 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {results && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-md overflow-auto max-h-96">
                  <pre className="text-sm">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="course-details" className="mt-4">
          <CourseDetailsApi />
        </TabsContent>

        <TabsContent value="course-enroll" className="mt-4">
          <CourseEnrollmentApi />
        </TabsContent>
      </Tabs>
    </div>
  );
};
