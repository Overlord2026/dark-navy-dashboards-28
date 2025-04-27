
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InsightType } from "@/components/insights/AIInsightsProvider";
import { formatDistanceToNow } from "date-fns";
import { LightbulbIcon, BarChart3, GraduationCap, PiggyBank, BadgeDollarSign, Brain } from "lucide-react";

interface InsightCardProps {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  date: Date;
  viewed: boolean;
  onClick?: () => void;
  className?: string;
}

const getIconForInsightType = (type: InsightType) => {
  switch(type) {
    case 'portfolio': return <BarChart3 className="h-5 w-5 text-blue-400" />;
    case 'goal': return <PiggyBank className="h-5 w-5 text-green-400" />;
    case 'tax': return <BadgeDollarSign className="h-5 w-5 text-yellow-400" />;
    case 'retirement': return <LightbulbIcon className="h-5 w-5 text-purple-400" />;
    case 'education': return <GraduationCap className="h-5 w-5 text-orange-400" />;
    case 'general': return <Brain className="h-5 w-5 text-cyan-400" />;
  }
};

const getColorForInsightType = (type: InsightType) => {
  switch(type) {
    case 'portfolio': return "bg-blue-900/20 text-blue-400 border-blue-900/50";
    case 'goal': return "bg-green-900/20 text-green-400 border-green-900/50";
    case 'tax': return "bg-yellow-900/20 text-yellow-400 border-yellow-900/50";
    case 'retirement': return "bg-purple-900/20 text-purple-400 border-purple-900/50";
    case 'education': return "bg-orange-900/20 text-orange-400 border-orange-900/50";
    case 'general': return "bg-cyan-900/20 text-cyan-400 border-cyan-900/50";
  }
};

export function InsightCard({ 
  id, 
  type, 
  title, 
  content, 
  date, 
  viewed, 
  onClick, 
  className = "" 
}: InsightCardProps) {
  return (
    <Card 
      className={`${getColorForInsightType(type)} animate-in fade-in-50 duration-300 cursor-pointer hover:border-blue-500 transition-colors ${
        viewed ? 'opacity-70' : 'opacity-100'
      } ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getIconForInsightType(type)}
            <CardTitle className="text-md">{title}</CardTitle>
          </div>
          {!viewed && (
            <Badge className="bg-blue-600 text-white text-xs">New</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{content}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
