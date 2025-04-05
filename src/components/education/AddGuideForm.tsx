
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-lg">Add New Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={newGuideTitle}
            onChange={(e) => setNewGuideTitle(e.target.value)}
            className="w-full p-2 rounded-md border border-blue-300 dark:border-blue-700 bg-background"
            placeholder="Guide title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={newGuideDescription}
            onChange={(e) => setNewGuideDescription(e.target.value)}
            className="w-full p-2 rounded-md border border-blue-300 dark:border-blue-700 bg-background"
            rows={3}
            placeholder="Guide description"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Add Guide
        </Button>
      </CardFooter>
    </Card>
  );
}
