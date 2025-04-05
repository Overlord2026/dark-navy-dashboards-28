
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowUp, ArrowDown, Trash2, ExternalLink } from "lucide-react";
import { EducationalResource } from "@/types/education";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Card className="border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow flex flex-col h-full group">
      <div className="relative">
        <AspectRatio ratio={16/9} className="bg-muted overflow-hidden rounded-t-lg">
          <img 
            src={guide.image || "/placeholder.svg"} 
            alt={guide.title} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </AspectRatio>
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onMoveUp(index)}
                  disabled={isFirst}
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Move up</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onMoveDown(index)}
                  disabled={isLast}
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Move down</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(guide.id)}
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Delete guide</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
        <CardDescription className="line-clamp-2 mt-1">
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
          className="w-full border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center gap-2 transition-colors"
          onClick={() => window.open(guide.ghlUrl, "_blank")}
        >
          Read Guide
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Button>
      </CardFooter>
    </Card>
  );
}
