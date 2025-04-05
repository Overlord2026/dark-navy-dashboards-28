
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUpDown, Trash2 } from "lucide-react";
import { EducationalResource } from "@/types/education";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GuideCardProps {
  guide: EducationalResource;
  index: number;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function GuideCard({ 
  guide, 
  index, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast
}: GuideCardProps) {
  return (
    <Card className="border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full">
      <div className="relative">
        <AspectRatio ratio={4/3} className="bg-muted">
          <img 
            src={guide.image || "/placeholder.svg"} 
            alt={guide.title} 
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <ArrowUpDown className="h-4 w-4 rotate-90" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <ArrowUpDown className="h-4 w-4 -rotate-90" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(guide.id)}
            className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {guide.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-3 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-2 h-4 w-4" />
            <span className="line-clamp-1">By {guide.author || "Unknown"} • {guide.level}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <Button 
            variant="outline" 
            className="w-full border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            onClick={() => window.open(guide.ghlUrl, "_blank")}
          >
            Read Guide
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
