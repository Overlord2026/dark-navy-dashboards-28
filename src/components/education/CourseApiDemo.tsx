
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { fetchCourses, fetchCourseById } from '@/services/api/courseApi';
import { Course, CourseCategory } from '@/types/education';
import { CourseFilter } from '@/types/api';
import { courseCategories } from '@/data/education';
import { Loader2, RefreshCw, Filter, Eye } from 'lucide-react';

export function CourseApiDemo() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState<CourseFilter>({});
  const [authToken, setAuthToken] = useState('Bearer mock-jwt-token');
  const [courseId, setCourseId] = useState('');
  
  // Mock function to get courses
  const handleFetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetchCourses(authToken, filters);
      
      if (response.success && response.data) {
        setCourses(response.data);
        toast.success(response.message || 'Courses loaded successfully');
      } else {
        toast.error(response.error || 'Failed to load courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Mock function to get a single course
  const handleFetchCourseById = async () => {
    if (!courseId.trim()) {
      toast.error('Please enter a course ID');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetchCourseById(authToken, courseId);
      
      if (response.success && response.data) {
        setSelectedCourse(response.data);
        toast.success(response.message || 'Course loaded successfully');
      } else {
        toast.error(response.error || 'Failed to load course');
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key: keyof CourseFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  // Mock change token (simulating login/logout)
  const toggleAuthToken = () => {
    if (authToken === 'Bearer mock-jwt-token') {
      setAuthToken('invalid-token');
      toast.info('Using invalid token for testing');
    } else {
      setAuthToken('Bearer mock-jwt-token');
      toast.info('Using valid token');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course API Demo</CardTitle>
          <CardDescription>
            Demonstration of the Course Management API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Course List API</TabsTrigger>
              <TabsTrigger value="single">Single Course API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category Filter</Label>
                  <Select 
                    value={filters.category || ''} 
                    onValueChange={(value) => handleFilterChange('category', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {courseCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Level Filter</Label>
                  <Select 
                    value={filters.level || ''} 
                    onValueChange={(value) => handleFilterChange('level', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Course Type</Label>
                  <Select 
                    value={filters.isPaid !== undefined ? filters.isPaid.toString() : ''} 
                    onValueChange={(value) => {
                      if (value === '') {
                        handleFilterChange('isPaid', undefined);
                      } else {
                        handleFilterChange('isPaid', value === 'true');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      <SelectItem value="true">Paid Courses</SelectItem>
                      <SelectItem value="false">Free Courses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={handleFetchCourses} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Fetch Courses
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
                
                <Button variant="secondary" onClick={toggleAuthToken}>
                  Toggle Auth ({authToken === 'Bearer mock-jwt-token' ? 'Valid' : 'Invalid'})
                </Button>
              </div>
              
              {courses.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-sm font-medium">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Title</div>
                    <div className="col-span-3">Level</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Type</div>
                  </div>
                  
                  <div className="divide-y">
                    {courses.map(course => (
                      <div key={course.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-muted/20">
                        <div className="col-span-1 text-sm text-muted-foreground">{course.id}</div>
                        <div className="col-span-4 font-medium">{course.title}</div>
                        <div className="col-span-3">{course.level}</div>
                        <div className="col-span-2 text-sm">{course.duration}</div>
                        <div className="col-span-2">
                          <Badge variant={course.isPaid ? "default" : "secondary"}>
                            {course.isPaid ? 'Paid' : 'Free'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {courses.length === 0 && !loading && (
                <div className="p-8 text-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">No courses found. Try adjusting filters or fetching courses.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="single" className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Course ID</Label>
                  <Input 
                    placeholder="Enter course ID" 
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleFetchCourseById} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Fetch Course
                    </>
                  )}
                </Button>
                
                <Button variant="secondary" onClick={toggleAuthToken}>
                  Toggle Auth ({authToken === 'Bearer mock-jwt-token' ? 'Valid' : 'Invalid'})
                </Button>
              </div>
              
              {selectedCourse && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCourse.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={selectedCourse.isPaid ? "default" : "secondary"}>
                        {selectedCourse.isPaid ? 'Paid' : 'Free'}
                      </Badge>
                      <Badge variant="outline">{selectedCourse.level}</Badge>
                      <Badge variant="outline">{selectedCourse.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedCourse.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                      Close
                    </Button>
                    <Button>
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {!selectedCourse && !loading && courseId && (
                <div className="p-8 text-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">No course found with that ID.</p>
                </div>
              )}
              
              {!selectedCourse && !loading && !courseId && (
                <div className="p-8 text-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Enter a course ID to fetch details.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
