import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  PlusCircle, 
  MessageSquare, 
  Calendar, 
  BookOpen,
  Heart,
  Gift,
  Camera,
  BarChart3
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create New Goal",
      description: "Start planning your next milestone",
      icon: <Target className="h-6 w-6" />,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => navigate('/goals/create')
    },
    {
      title: "Link Account",
      description: "Connect a new financial account",
      icon: <PlusCircle className="h-6 w-6" />,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => navigate('/accounts-tab')
    },
    {
      title: "Message Advisor",
      description: "Get expert guidance",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => navigate('/collaboration-tab')
    },
    {
      title: "Schedule Review",
      description: "Plan a family meeting",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-amber-500 hover:bg-amber-600",
      onClick: () => {}
    },
    {
      title: "Explore Education",
      description: "Learn about new strategies",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      onClick: () => navigate('/education-tab')
    },
    {
      title: "Health Planning",
      description: "Review wellness goals",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-pink-500 hover:bg-pink-600",
      onClick: () => {}
    },
    {
      title: "Plan a Gift",
      description: "Set up family gifting",
      icon: <Gift className="h-6 w-6" />,
      color: "bg-emerald-500 hover:bg-emerald-600",
      onClick: () => {}
    },
    {
      title: "Add Memory",
      description: "Capture family experiences",
      icon: <Camera className="h-6 w-6" />,
      color: "bg-rose-500 hover:bg-rose-600",
      onClick: () => {}
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-3 hover-scale transition-all"
              onClick={action.onClick}
            >
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};