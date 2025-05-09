
import { useState, useEffect, useRef } from "react";
import { FolderPlus, Loader2, Tag, PaintBucket } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NewFolderDialogProps {
  onCreateFolder: (folderName: string, category?: string, description?: string, color?: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  activeCategory?: string;
  categories?: Array<{ id: string; name: string }>;
}

export const NewFolderDialog = ({ 
  onCreateFolder, 
  open, 
  onOpenChange, 
  activeCategory,
  categories = []
}: NewFolderDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(activeCategory || "");
  const [folderColor, setFolderColor] = useState("blue");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const folderColors = [
    { id: "blue", color: "#0EA5E9", name: "Blue" },
    { id: "green", color: "#22C55E", name: "Green" },
    { id: "red", color: "#EF4444", name: "Red" },
    { id: "purple", color: "#8B5CF6", name: "Purple" },
    { id: "yellow", color: "#F59E0B", name: "Yellow" },
    { id: "gray", color: "#64748B", name: "Gray" },
  ];
  
  // When dialog opens, focus the input field
  useEffect(() => {
    if ((open || isOpen) && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, isOpen]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!open && !isOpen) {
      resetForm();
    }
  }, [open, isOpen]);
  
  // Set category when activeCategory changes
  useEffect(() => {
    if (activeCategory) {
      setCategory(activeCategory);
    }
  }, [activeCategory]);

  const resetForm = () => {
    setFolderName("");
    setDescription("");
    setCategory(activeCategory || "");
    setFolderColor("blue");
    setError("");
  };

  const handleSubmit = async () => {
    // Form validation
    if (!folderName.trim()) {
      setError("Folder name is required");
      inputRef.current?.focus();
      return;
    }
    
    // Simulate loading state
    setIsCreating(true);
    setError("");
    
    try {
      // Create folder with optional fields
      await onCreateFolder(folderName, category, description, folderColor);
      
      // Close dialog and reset form
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setIsOpen(false);
      }
      resetForm();
    } catch (err) {
      console.error("Failed to create folder:", err);
      setError("Failed to create folder. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setIsOpen(open);
    }
    
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {!open && (
        <DialogTrigger asChild>
          <Button 
            variant="vault" 
            className="gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Create new folder"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="font-medium">New Folder</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-blue-500" />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            Create a new folder to organize your important documents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folderName" className="text-right font-medium">
              Name<span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="folderName"
                ref={inputRef}
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                onKeyDown={handleKeyDown}
                className={cn(error && "border-red-500")}
                maxLength={50}
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby="folderNameError"
              />
              {error ? (
                <p id="folderNameError" className="text-xs text-red-500">
                  {error}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Name must be between 1-50 characters
                </p>
              )}
            </div>
          </div>
          
          {categories && categories.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium">
                Category
              </Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right font-medium pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description (optional)"
              className="col-span-3 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">
              Color
            </Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {folderColors.map((color) => (
                <Button
                  key={color.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-8 h-8 p-0 border-2 rounded-full",
                    folderColor === color.id && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                  )}
                  style={{ backgroundColor: color.color }}
                  onClick={() => setFolderColor(color.id)}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                >
                  <span className="sr-only">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isCreating}
            className="min-w-[120px]"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Folder</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
