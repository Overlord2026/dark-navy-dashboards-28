
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Course } from "@/types/education";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CourseFormProps {
  course?: Course;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "All Levels">(
    course?.level || "All Levels"
  );
  const [duration, setDuration] = useState(course?.duration || "");
  const [isPaid, setIsPaid] = useState(course?.isPaid || false);
  const [comingSoon, setComingSoon] = useState(course?.comingSoon || false);
  const [ghlUrl, setGhlUrl] = useState(course?.ghlUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCourse: Course = {
      id: course?.id || uuidv4(),
      title,
      description,
      level,
      duration,
      isPaid,
      comingSoon,
      ghlUrl
    };
    
    onSubmit(updatedCourse);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select 
            value={level} 
            onValueChange={(value) => setLevel(value as "Beginner" | "Intermediate" | "Advanced" | "All Levels")}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="All Levels">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            placeholder="e.g. 2 hours, 4 weeks"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ghlUrl">Course URL</Label>
        <Input
          id="ghlUrl"
          value={ghlUrl}
          onChange={(e) => setGhlUrl(e.target.value)}
          required
          placeholder="https://..."
        />
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isPaid" 
            checked={isPaid}
            onCheckedChange={(checked) => setIsPaid(checked as boolean)}
          />
          <Label htmlFor="isPaid">Paid Course</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="comingSoon" 
            checked={comingSoon}
            onCheckedChange={(checked) => setComingSoon(checked as boolean)}
          />
          <Label htmlFor="comingSoon">Coming Soon</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {course ? 'Update' : 'Add'} Course
        </Button>
      </div>
    </form>
  );
};
