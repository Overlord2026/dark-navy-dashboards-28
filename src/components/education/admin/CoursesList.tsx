
import React, { useState } from "react";
import { Course } from "@/types/education";
import { useEducationContent } from "@/context/EducationContentContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { CourseForm } from "./CourseForm";

interface CoursesListProps {
  type: "featured" | "popular";
}

export const CoursesList: React.FC<CoursesListProps> = ({ type }) => {
  const { courses, addCourse, updateCourse, deleteCourse } = useEducationContent();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  
  const coursesList = type === "featured" ? courses.featured : courses.popular;
  
  const handleAdd = (course: Course) => {
    addCourse(course, type);
    setIsAddDialogOpen(false);
  };
  
  const handleEdit = (course: Course) => {
    updateCourse(course, type);
    setIsEditDialogOpen(false);
    setSelectedCourse(undefined);
  };
  
  const handleDelete = (courseId: string | number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse(courseId, type);
    }
  };
  
  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {type === "featured" ? "Featured Courses" : "Popular Courses"}
        </h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add Course
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coursesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No courses found. Add your first course.
                </TableCell>
              </TableRow>
            ) : (
              coursesList.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>
                    {course.comingSoon ? (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Coming Soon
                      </Badge>
                    ) : course.isPaid ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Free
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(course)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new course to {type === "featured" ? "featured" : "popular"} courses.
            </DialogDescription>
          </DialogHeader>
          <CourseForm 
            onSubmit={handleAdd} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course details.
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <CourseForm 
              course={selectedCourse} 
              onSubmit={handleEdit} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
