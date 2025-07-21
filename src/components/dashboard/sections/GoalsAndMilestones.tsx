import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";
import { 
  Target, 
  MapPin, 
  GraduationCap, 
  Heart, 
  Gift, 
  Calendar,
  Edit,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { FamilyGoal } from "@/types/familyOffice";
import { useNavigate } from "react-router-dom";

interface GoalsAndMilestonesProps {
  goals: FamilyGoal[];
}

export const GoalsAndMilestones: React.FC<GoalsAndMilestonesProps> = ({ goals }) => {
  const navigate = useNavigate();

  const getGoalIcon = (category: FamilyGoal['category']) => {
    switch (category) {
      case 'emergency': return <Target className="h-5 w-5 text-red-500" />;
      case 'travel': return <MapPin className="h-5 w-5 text-blue-500" />;
      case 'education': return <GraduationCap className="h-5 w-5 text-purple-500" />;
      case 'health': return <Heart className="h-5 w-5 text-pink-500" />;
      case 'gifting': return <Gift className="h-5 w-5 text-green-500" />;
      default: return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusConfig = (status: FamilyGoal['status']) => {
    switch (status) {
      case 'achieved':
        return { color: "bg-emerald-500", icon: <CheckCircle className="h-4 w-4" />, text: "Achieved" };
      case 'on_track':
        return { color: "bg-blue-500", icon: <Target className="h-4 w-4" />, text: "On Track" };
      case 'at_risk':
        return { color: "bg-amber-500", icon: <AlertTriangle className="h-4 w-4" />, text: "At Risk" };
      case 'paused':
        return { color: "bg-gray-500", icon: <Calendar className="h-4 w-4" />, text: "Paused" };
    }
  };

  const getProgress = (goal: FamilyGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysToTarget = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Goals & Milestones</h2>
          <p className="text-muted-foreground">Your family's next big experiences and achievements</p>
        </div>
        <Button onClick={() => navigate('/goals/create')} className="flex items-center space-x-2">
          <Target className="h-4 w-4" />
          <span>Create Goal</span>
        </Button>
      </div>

      {/* Horizontally Scrollable Goal Cards */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {goals.map((goal) => {
          const progress = getProgress(goal);
          const statusConfig = getStatusConfig(goal.status);
          const daysLeft = getDaysToTarget(goal.targetDate);
          
          return (
            <Card key={goal.id} className="flex-shrink-0 w-80 hover-scale cursor-pointer">
              <CardContent className="p-6">
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getGoalIcon(goal.category)}
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="flex items-center space-x-1"
                  >
                    {statusConfig.icon}
                    <span>{statusConfig.text}</span>
                  </Badge>
                </div>

                {/* Goal Image */}
                {goal.imageUrl && (
                  <div className="mb-4 relative">
                    <div className="w-full h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary opacity-50" />
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {goal.category}
                    </div>
                  </div>
                )}

                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)} remaining
                    </span>
                    <span className={daysLeft > 30 ? "text-muted-foreground" : "text-amber-600 font-medium"}>
                      {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Owner: {goal.owner}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {goal.status === 'achieved' ? (
                    <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Achieved
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1">
                      Prioritize
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Goals CTA */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/goals')}
          className="text-primary hover:text-primary/80"
        >
          View All Goals & Create New Ones →
        </Button>
      </div>
    </div>
  );
};