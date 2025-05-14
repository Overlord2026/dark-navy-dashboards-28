
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Prescription } from "./PrescriptionSchema";

interface PrescriptionCardProps {
  prescription: Prescription;
  onEdit: (prescription: Prescription) => void;
  onDelete: (prescription: Prescription) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ 
  prescription, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    
    try {
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(date);
    }
  };

  const getDaysRemaining = (date: string | Date): number => {
    if (!date) return 0;
    
    try {
      const targetDate = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      const targetWithoutTime = new Date(targetDate);
      targetWithoutTime.setHours(0, 0, 0, 0);
      
      const diffTime = targetWithoutTime.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  };

  const getUrgencyColor = (days: number): string => {
    if (days < 0) return "text-red-500";
    if (days < 3) return "text-amber-500";
    if (days < 7) return "text-yellow-500";
    return "text-green-500";
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg">{prescription.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(prescription)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(prescription)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <div className="flex items-center">
            <Label className="w-24 font-medium">Frequency:</Label>
            <span>{prescription.frequency}</span>
          </div>
          <div className="flex items-center">
            <Label className="w-24 font-medium">Next Refill:</Label>
            <span className={getUrgencyColor(getDaysRemaining(prescription.nextRefill))}>
              {formatDate(prescription.nextRefill)} ({getDaysRemaining(prescription.nextRefill) < 0 
                ? `${Math.abs(getDaysRemaining(prescription.nextRefill))} days ago` 
                : getDaysRemaining(prescription.nextRefill) === 0 
                  ? "Today" 
                  : `in ${getDaysRemaining(prescription.nextRefill)} days`})
            </span>
          </div>
          {prescription.doctor && (
            <div className="flex items-center">
              <Label className="w-24 font-medium">Doctor:</Label>
              <span>{prescription.doctor}</span>
            </div>
          )}
          {prescription.pharmacy && (
            <div className="flex items-center">
              <Label className="w-24 font-medium">Pharmacy:</Label>
              <span>{prescription.pharmacy}</span>
            </div>
          )}
          {prescription.notes && (
            <div className="mt-2">
              <Label className="font-medium">Notes:</Label>
              <p className="text-muted-foreground">{prescription.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
