
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddGuideFormProps {
  onAddGuide: (title: string, description: string) => void;
  onCancel: () => void;
}

export function AddGuideForm({ onAddGuide, onCancel }: AddGuideFormProps) {
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideDescription, setNewGuideDescription] = useState("");

  const handleSubmit = () => {
    if (!newGuideTitle.trim()) {
      toast.error("Guide title is required");
      return;
    }
    
    onAddGuide(newGuideTitle, newGuideDescription);
    setNewGuideTitle("");
    setNewGuideDescription("");
  };

  return (
    <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Add New Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guide-title">Title</Label>
          <Input
            id="guide-title"
            value={newGuideTitle}
            onChange={(e) => setNewGuideTitle(e.target.value)}
            placeholder="Guide title"
            className="border-blue-300 dark:border-blue-700 bg-background focus-visible:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guide-description">Description</Label>
          <Textarea
            id="guide-description"
            value={newGuideDescription}
            onChange={(e) => setNewGuideDescription(e.target.value)}
            placeholder="Guide description"
            rows={3}
            className="border-blue-300 dark:border-blue-700 bg-background resize-none focus-visible:ring-blue-500"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between pt-2">
        <Button 
          variant="ghost" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="default" 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleSubmit}
        >
          Add Guide
        </Button>
      </CardFooter>
    </Card>
  );
}
