
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { EducationalResource } from "@/types/education";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceFormProps {
  resource?: EducationalResource;
  resourceType: "guide" | "book" | "whitepaper";
  onSubmit: (resource: EducationalResource) => void;
  onCancel: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ resource, resourceType, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(resource?.title || "");
  const [description, setDescription] = useState(resource?.description || "");
  const [level, setLevel] = useState(resource?.level || "All Levels");
  const [duration, setDuration] = useState(resource?.duration || "");
  const [isPaid, setIsPaid] = useState(resource?.isPaid || false);
  const [ghlUrl, setGhlUrl] = useState(resource?.ghlUrl || "");
  const [author, setAuthor] = useState(resource?.author || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedResource: EducationalResource = {
      id: resource?.id || uuidv4(),
      title,
      description,
      level,
      isPaid,
      ghlUrl,
      ...(resourceType === "guide" && { duration }),
      ...(resourceType === "book" && { author })
    };
    
    onSubmit(updatedResource);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
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
            onValueChange={setLevel}
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
        
        {resourceType === "guide" && (
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required={resourceType === "guide"}
              placeholder="e.g. Self-paced"
            />
          </div>
        )}
        
        {resourceType === "book" && (
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ghlUrl">Resource URL</Label>
        <Input
          id="ghlUrl"
          value={ghlUrl}
          onChange={(e) => setGhlUrl(e.target.value)}
          required
          placeholder="https://..."
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="isPaid" 
          checked={isPaid}
          onCheckedChange={(checked) => setIsPaid(checked as boolean)}
        />
        <Label htmlFor="isPaid">Paid Resource</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {resource ? 'Update' : 'Add'} {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
        </Button>
      </div>
    </form>
  );
};
