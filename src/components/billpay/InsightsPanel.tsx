
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Bell, 
  CalendarClock, 
  CircleDollarSign,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface InsightCardProps {
  id: string;
  type: "bill_spike" | "payment_date" | "duplicate_vendor" | "cash_flow" | "payment_schedule";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  actionText?: string;
  onAction?: () => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string, days: number) => void;
}

export const InsightCard = ({
  id,
  type,
  title,
  description,
  severity,
  actionText,
  onAction,
  onDismiss,
  onSnooze
}: InsightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

  const getIcon = () => {
    switch (type) {
      case "bill_spike":
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case "payment_date":
        return <CalendarClock className="h-5 w-5 text-blue-500" />;
      case "duplicate_vendor":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "cash_flow":
        return <CircleDollarSign className="h-5 w-5 text-green-500" />;
      case "payment_schedule":
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityClass = () => {
    switch (severity) {
      case "critical": return "border-red-300 bg-red-50";
      case "warning": return "border-amber-300 bg-amber-50";
      case "info": return "border-blue-300 bg-blue-50";
      default: return "";
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    // In a real application, we would send this feedback to improve the AI
    console.log(`User gave ${isPositive ? 'positive' : 'negative'} feedback for insight ${id}`);
  };

  return (
    <Card className={`mb-3 transition-all ${getSeverityClass()}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {getIcon()}
            <div>
              <h4 className="font-medium text-sm">{title}</h4>
              <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
            >
              <Bell className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onDismiss(id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 text-sm">
            <p>{description}</p>
            {actionText && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={onAction}
                className="mt-3"
              >
                {actionText}
              </Button>
            )}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs">Was this useful?</span>
              <Button 
                variant="outline" 
                size="sm"
                className="h-7 px-2"
                onClick={() => handleFeedback(true)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Yes
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-7 px-2"
                onClick={() => handleFeedback(false)}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                No
              </Button>
            </div>
          </div>
        )}

        {showSnoozeOptions && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs">Snooze for:</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => {
                onSnooze(id, 1);
                setShowSnoozeOptions(false);
              }}
            >
              1d
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => {
                onSnooze(id, 7);
                setShowSnoozeOptions(false);
              }}
            >
              1w
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => {
                onSnooze(id, 30);
                setShowSnoozeOptions(false);
              }}
            >
              1m
            </Button>
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs h-7"
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export interface InsightsPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const defaultInsights: InsightCardProps[] = [
  {
    id: "insight-1",
    type: "bill_spike",
    title: "Unusual Increase: Electric Bill",
    description: "Your electric bill is 35% higher than your 6-month average. Consider checking for unusual usage or contacting your provider.",
    severity: "warning",
    actionText: "View Bill History",
    onAction: () => {},
    onDismiss: () => {},
    onSnooze: () => {},
  },
  {
    id: "insight-2",
    type: "payment_date",
    title: "Optimal Payment Date: Water Bill",
    description: "Based on your cash flow patterns, paying your Water Bill on the 18th instead of the 15th would help maintain your minimum balance target.",
    severity: "info",
    actionText: "Reschedule Payment",
    onAction: () => {},
    onDismiss: () => {},
    onSnooze: () => {},
  },
  {
    id: "insight-3",
    type: "duplicate_vendor",
    title: "Potential Duplicate: Office Supplies",
    description: "You have two bills from Office Depot with similar amounts ($235.87 and $235.97) due on the same date. These may be duplicates.",
    severity: "critical",
    actionText: "Compare Bills",
    onAction: () => {},
    onDismiss: () => {},
    onSnooze: () => {},
  },
  {
    id: "insight-4",
    type: "cash_flow",
    title: "Cash Flow Optimization",
    description: "If you pay your Car Insurance bill on the 20th instead of the 15th, you can avoid a potential cash flow issue with your Mortgage payment on the 16th.",
    severity: "warning",
    actionText: "View Cash Flow Forecast",
    onAction: () => {},
    onDismiss: () => {},
    onSnooze: () => {},
  },
  {
    id: "insight-5",
    type: "payment_schedule",
    title: "Payment Bundles Available",
    description: "You have 3 bills due on the 15th. Bundling these payments could save processing fees and simplify your finances.",
    severity: "info",
    actionText: "Create Payment Bundle",
    onAction: () => {},
    onDismiss: () => {},
    onSnooze: () => {},
  }
];

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  isExpanded,
  onToggle,
}) => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<InsightCardProps[]>(defaultInsights);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  
  const handleDismissInsight = (id: string) => {
    setInsights(insights.filter(insight => insight.id !== id));
    toast({
      title: "Insight dismissed",
      description: "You can restore it from your settings",
    });
  };
  
  const handleSnoozeInsight = (id: string, days: number) => {
    setInsights(insights.filter(insight => insight.id !== id));
    toast({
      title: `Insight snoozed for ${days} day${days > 1 ? 's' : ''}`,
      description: "You'll be notified again after this period",
    });
  };

  const filteredInsights = filter === "all" 
    ? insights 
    : insights.filter(insight => insight.severity === filter);

  return (
    <div className={`border-l transition-all overflow-hidden ${isExpanded ? 'w-80' : 'w-0'}`}>
      {isExpanded && (
        <div className="h-full flex flex-col bg-background">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Insights & Suggestions
              </h3>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("all")}
                className={filter === "all" ? "" : "bg-transparent"}
              >
                All ({insights.length})
              </Button>
              <Button 
                variant={filter === "critical" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("critical")}
                className={filter === "critical" ? "bg-red-500 hover:bg-red-600" : "border-red-300 text-red-600"}
              >
                High
              </Button>
              <Button 
                variant={filter === "warning" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("warning")}
                className={filter === "warning" ? "bg-amber-500 hover:bg-amber-600" : "border-amber-300 text-amber-600"}
              >
                Medium
              </Button>
              <Button 
                variant={filter === "info" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("info")}
                className={filter === "info" ? "bg-blue-500 hover:bg-blue-600" : "border-blue-300 text-blue-600"}
              >
                Low
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {filteredInsights.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <h4 className="font-medium">No insights available</h4>
                <p className="text-sm text-muted-foreground">
                  {filter === "all" 
                    ? "Check back later for new insights" 
                    : "Try changing your filter"}
                </p>
              </div>
            ) : (
              filteredInsights.map(insight => (
                <InsightCard 
                  key={insight.id}
                  {...insight}
                  onDismiss={handleDismissInsight}
                  onSnooze={handleSnoozeInsight}
                />
              ))
            )}
          </div>
          
          <div className="p-3 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <span>Customize Insights</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
