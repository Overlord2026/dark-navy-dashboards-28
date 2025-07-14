import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Bot, Target, TrendingUp } from "lucide-react";

export default function CoachingKB() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Coaching</h1>
        <p className="text-muted-foreground">
          Personalized health coaching and wellness guidance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Health Coach
            </CardTitle>
            <CardDescription>Personalized recommendations based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  "Based on your recent blood work, consider increasing your omega-3 intake..."
                </p>
                <p className="text-xs text-muted-foreground mt-1">Today, 9:30 AM</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  "Your sleep pattern has improved 15% this week. Keep up the consistent bedtime!"
                </p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday, 7:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Health Goals
            </CardTitle>
            <CardDescription>Track progress toward your health objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily steps (10,000)</span>
                <span className="text-sm font-medium">8,426 (84%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sleep hours (8)</span>
                <span className="text-sm font-medium">7.5 (94%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Water intake (64oz)</span>
                <span className="text-sm font-medium">48oz (75%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Coaching Resources</CardTitle>
          <CardDescription>Educational content and guidance for your health journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Health coaching content coming soon</p>
            <p className="text-sm text-muted-foreground">
              Personalized coaching based on your health data and goals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}