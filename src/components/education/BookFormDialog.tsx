
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EducationalResource } from "@/types/education";

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: EducationalResource) => void;
  book?: EducationalResource;
  isEdit?: boolean;
}

export const BookFormDialog: React.FC<BookFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  book,
  isEdit = false
}) => {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [description, setDescription] = useState(book?.description || "");
  const [coverImage, setCoverImage] = useState(book?.coverImage || "");
  const [ghlUrl, setGhlUrl] = useState(book?.ghlUrl || "");
  const [isPaid, setIsPaid] = useState(book?.isPaid || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!ghlUrl.trim()) newErrors.ghlUrl = "URL is required";
    if (!description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookData: EducationalResource = {
      id: book?.id || `book-${Date.now()}`,
      title,
      author,
      description,
      coverImage,
      ghlUrl,
      isPaid,
      level: "All Levels" // Default level
    };
    
    onSave(bookData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter book title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input 
                id="author" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                placeholder="Enter author name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter book description"
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input 
                id="coverImage" 
                value={coverImage} 
                onChange={(e) => setCoverImage(e.target.value)} 
                placeholder="Enter URL for book cover image"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ghlUrl">Book URL <span className="text-red-500">*</span></Label>
              <Input 
                id="ghlUrl" 
                value={ghlUrl} 
                onChange={(e) => setGhlUrl(e.target.value)} 
                placeholder="Enter purchase or details URL"
                className={errors.ghlUrl ? "border-red-500" : ""}
              />
              {errors.ghlUrl && <p className="text-red-500 text-xs">{errors.ghlUrl}</p>}
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="isPaid" 
                checked={isPaid} 
                onCheckedChange={setIsPaid} 
              />
              <Label htmlFor="isPaid">Paid Resource</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
