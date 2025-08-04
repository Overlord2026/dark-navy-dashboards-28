import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  GraduationCap, 
  Plus, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Download,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CECourse } from '@/hooks/useInsuranceAgent';

interface CECoursesTableProps {
  courses: CECourse[];
  onAddCourse: () => void;
  isLoading?: boolean;
}

export function CECoursesTable({ courses, onAddCourse, isLoading }: CECoursesTableProps) {
  const getVerificationBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-emerald text-emerald-foreground">
          <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-gold text-gold">
        <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
        Pending
      </Badge>
    );
  };

  const getCourseTypeColor = (type?: string) => {
    if (!type) return 'text-muted-foreground';
    
    const colors: Record<string, string> = {
      'Ethics': 'text-emerald',
      'Annuity': 'text-navy',
      'LTC': 'text-gold',
      'General': 'text-muted-foreground',
      'Suitability': 'text-emerald',
      'Product Training': 'text-navy',
    };
    
    return colors[type] || 'text-muted-foreground';
  };

  return (
    <Card className="border-navy/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-navy">
            <GraduationCap className="h-5 w-5 text-emerald" aria-hidden="true" />
            CE Courses Completed
            <Badge variant="outline" className="ml-2">
              {courses.length} courses
            </Badge>
          </CardTitle>
          <Button 
            onClick={onAddCourse}
            className="bg-navy hover:bg-navy/90 text-navy-foreground"
            aria-label="Add new CE course"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add CE Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No CE Courses Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding your completed continuing education courses to track your progress.
            </p>
            <Button 
              onClick={onAddCourse}
              variant="outline"
              className="border-navy text-navy hover:bg-navy hover:text-navy-foreground"
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Your First Course
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Details</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">{course.course_name}</div>
                        {course.course_type && (
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getCourseTypeColor(course.course_type))}
                          >
                            {course.course_type}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {course.provider_name || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm">
                          {course.completion_date?.toLocaleDateString() || 'Not set'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="text-lg font-bold text-emerald">
                          {course.credits_earned}
                        </span>
                        <div className="text-xs text-muted-foreground">credits</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getVerificationBadge(course.verified)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {course.certificate_url && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-emerald/10 hover:text-emerald"
                            onClick={() => window.open(course.certificate_url, '_blank')}
                            aria-label={`View certificate for ${course.course_name}`}
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-navy/10 hover:text-navy"
                          aria-label={`Download details for ${course.course_name}`}
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary Footer */}
        {courses.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Total Credits Earned:
              </span>
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">
                  {courses.reduce((total, course) => total + (course.credits_earned || 0), 0)} credits
                </span>
                <Badge className="bg-emerald text-emerald-foreground">
                  {courses.filter(c => c.verified).length} verified
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}