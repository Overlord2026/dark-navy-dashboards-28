
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types/education";

interface MobileCourseCardProps {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  isPaid: boolean;
  onClick: () => void;
}

export function MobileCourseCard({ 
  title, 
  description, 
  level, 
  duration, 
  isPaid, 
  onClick 
}: MobileCourseCardProps) {
  return (
    <Card className="bg-[#1B1B32] border border-[#2A2A45] overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className={`text-xs px-2 py-1 rounded ${isPaid ? 'bg-[#3A3A60]' : 'bg-[#2A4A3A]'}`}>
            {isPaid ? 'Paid' : 'Free'}
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2 mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div>{level}</div>
          <div>{duration}</div>
        </div>
        <Button 
          variant={isPaid ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          {isPaid ? 'Enroll Now' : 'Start Learning'}
        </Button>
      </CardContent>
    </Card>
  );
}
