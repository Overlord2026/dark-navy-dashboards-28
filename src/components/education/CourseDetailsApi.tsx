
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { fetchCourseDetailsById, DetailedCourse } from '@/services/api/ghlCourseApi';
import { Loader2 } from 'lucide-react';

export const CourseDetailsApi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [token, setToken] = useState('Bearer mock-jwt-token');
  const [courseDetails, setCourseDetails] = useState<DetailedCourse | null>(null);
  const [error, setError] = useState('');

  const handleFetchDetails = async () => {
    if (!courseId.trim()) {
      toast.error('Please enter a course ID');
      return;
    }

    setLoading(true);
    setError('');
    setCourseDetails(null);

    try {
      const response = await fetchCourseDetailsById(token, courseId);
      
      if (response.success && response.data) {
        setCourseDetails(response.data);
        toast.success('Course details retrieved successfully');
      } else {
        setError(response.error || 'Failed to retrieve course details');
        toast.error(response.error || 'Failed to retrieve course details');
      }
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Details API Demo</CardTitle>
          <CardDescription>
            Test the GET /api/courses/{'{courseId}'} endpoint by providing a course ID and JWT token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="course-id" className="text-sm font-medium">Course ID</label>
            <Input 
              id="course-id" 
              value={courseId} 
              onChange={(e) => setCourseId(e.target.value)} 
              placeholder="Enter course ID"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">Authorization Token</label>
            <Input 
              id="token" 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Bearer your-jwt-token"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleFetchDetails} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Fetching Details
              </>
            ) : (
              'Fetch Course Details'
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {courseDetails && (
        <Card>
          <CardHeader>
            <CardTitle>{courseDetails.title}</CardTitle>
            <CardDescription>
              {courseDetails.instructor && `Instructor: ${courseDetails.instructor}`}
              {courseDetails.lastUpdated && ` • Updated: ${courseDetails.lastUpdated}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{courseDetails.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{courseDetails.level}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{courseDetails.content?.totalDuration || courseDetails.duration}</span>
              </div>
              {courseDetails.enrollmentCount && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">{courseDetails.enrollmentCount.toLocaleString()}</span>
                </div>
              )}
              {courseDetails.rating && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{courseDetails.rating} / 5</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            {courseDetails.content?.sections && (
              <div className="space-y-4">
                <h3 className="font-medium">Course Content</h3>
                
                <div className="space-y-4">
                  {courseDetails.content.sections.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <h4 className="font-medium">{section.title}</h4>
                      {section.description && (
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      )}
                      <ul className="space-y-1">
                        {section.lessons.map((lesson) => (
                          <li key={lesson.id} className="text-sm flex justify-between items-center py-1">
                            <div className="flex items-center">
                              <span className="font-medium">{lesson.title}</span>
                              <span className="ml-2 text-xs bg-slate-100 rounded-full px-2 py-0.5">
                                {lesson.type}
                              </span>
                            </div>
                            <span className="text-muted-foreground">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {courseDetails.objectives && (
              <div className="space-y-2">
                <h3 className="font-medium">Learning Objectives</h3>
                <ul className="list-disc list-inside space-y-1">
                  {courseDetails.objectives.map((objective, index) => (
                    <li key={index} className="text-sm">{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {courseDetails.prerequisites && (
              <div className="space-y-2">
                <h3 className="font-medium">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-1">
                  {courseDetails.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="text-sm">{prerequisite}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
