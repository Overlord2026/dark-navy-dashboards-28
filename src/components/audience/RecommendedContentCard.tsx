
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, Film, GraduationCap, Settings, Share2 } from "lucide-react";
import { RecommendedContent } from "@/types/audience";

interface RecommendedContentCardProps {
  content: RecommendedContent;
}

export function RecommendedContentCard({ content }: RecommendedContentCardProps) {
  const getContentIcon = () => {
    switch(content.type) {
      case 'article':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Film className="h-5 w-5" />;
      case 'webinar':
        return <GraduationCap className="h-5 w-5" />;
      case 'tool':
        return <Settings className="h-5 w-5" />;
      case 'service':
        return <ExternalLink className="h-5 w-5" />;
    }
  };
  
  const getTypeBadgeColor = () => {
    switch(content.type) {
      case 'article':
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 'video':
        return "bg-red-100 text-red-800 border-red-300";
      case 'webinar':
        return "bg-purple-100 text-purple-800 border-purple-300";
      case 'tool':
        return "bg-green-100 text-green-800 border-green-300";
      case 'service':
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-muted p-1.5 rounded-full">
              {getContentIcon()}
            </div>
            <div>
              <Badge variant="outline" className={getTypeBadgeColor()}>
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-base mb-2">{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm">
          {content.type === 'article' || content.type === 'video' 
            ? 'View' 
            : content.type === 'webinar' 
              ? 'Register' 
              : content.type === 'tool' 
                ? 'Use Tool' 
                : 'Learn More'}
        </Button>
      </CardFooter>
    </Card>
  );
}
