
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CheckCircle } from "lucide-react";

interface TargetRetirementAgeSectionProps {
  targetRetirementAge?: number;
  onUpdateAge: (age: number) => void;
}

export const TargetRetirementAgeSection: React.FC<TargetRetirementAgeSectionProps> = ({
  targetRetirementAge = 67,
  onUpdateAge
}) => {
  const [editingAge, setEditingAge] = useState<number>(targetRetirementAge);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAge = async () => {
    if (editingAge >= 50 && editingAge <= 85) {
      await onUpdateAge(editingAge);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditingAge(targetRetirementAge);
    setIsEditing(false);
  };

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          Target Retirement Age
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="retirement-age">Retirement Age</Label>
              <Input
                id="retirement-age"
                type="number"
                min="50"
                max="85"
                value={editingAge}
                onChange={(e) => setEditingAge(parseInt(e.target.value) || 67)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Age must be between 50 and 85
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveAge} size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{targetRetirementAge}</p>
              <p className="text-sm text-muted-foreground">years old</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              size="sm"
            >
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
