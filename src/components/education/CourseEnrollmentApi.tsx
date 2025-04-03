
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { enrollUserInCourse, CourseEnrollmentRequest } from '@/services/api/ghlCourseApi';

export const CourseEnrollmentApi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [token, setToken] = useState('Bearer mock-jwt-token');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [enrollmentResult, setEnrollmentResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleEnrollment = async () => {
    if (!courseId.trim()) {
      toast.error('Please enter a course ID');
      return;
    }

    setLoading(true);
    setError('');
    setEnrollmentResult(null);

    try {
      const enrollmentData: CourseEnrollmentRequest = {
        courseId,
        userData: {
          name: userName.trim() || undefined,
          email: userEmail.trim() || undefined
        }
      };

      const response = await enrollUserInCourse(token, enrollmentData);
      
      if (response.success && response.data) {
        setEnrollmentResult(response.data);
        toast.success(response.message || 'Enrollment successful');
      } else {
        setError(response.error || 'Enrollment failed');
        toast.error(response.error || 'Enrollment failed');
      }
    } catch (err) {
      console.error('Error in enrollment process:', err);
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
          <CardTitle>Course Enrollment API Demo</CardTitle>
          <CardDescription>
            Test the POST /api/courses/enroll endpoint by providing a course ID and user details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-id">Course ID</Label>
            <Input 
              id="course-id" 
              value={courseId} 
              onChange={(e) => setCourseId(e.target.value)} 
              placeholder="Enter course ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token">Authorization Token</Label>
            <Input 
              id="token" 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Bearer your-jwt-token"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-name">User Name (optional)</Label>
            <Input 
              id="user-name" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              placeholder="Enter user name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-email">User Email (optional)</Label>
            <Input 
              id="user-email" 
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)} 
              placeholder="Enter user email"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEnrollment} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing Enrollment
              </>
            ) : (
              'Enroll in Course'
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

      {enrollmentResult && (
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Enrollment ID:</span> 
                <span className="ml-2">{enrollmentResult.enrollmentId}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className="ml-2 capitalize">{enrollmentResult.status}</span>
              </div>
              <div>
                <span className="font-medium">Course ID:</span> 
                <span className="ml-2">{enrollmentResult.courseId}</span>
              </div>
              <div>
                <span className="font-medium">Enrollment Date:</span> 
                <span className="ml-2">{new Date(enrollmentResult.enrollmentDate).toLocaleString()}</span>
              </div>
              {enrollmentResult.accessUrl && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(enrollmentResult.accessUrl, '_blank', 'noopener,noreferrer')}
                  >
                    Access Course
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
