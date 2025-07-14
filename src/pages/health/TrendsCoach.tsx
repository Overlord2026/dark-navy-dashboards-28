import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Bot, Target } from "lucide-react";

export default function TrendsCoach() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trends & AI Coach</h1>
        <p className="text-muted-foreground">
          Analyze health trends and get personalized AI-powered coaching insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Health Trends
            </CardTitle>
            <CardDescription>Your health metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Health trends analysis coming soon</p>
              <p className="text-sm text-muted-foreground">
                Visualize patterns in your vitals, lab results, and lifestyle metrics
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Health Coach
            </CardTitle>
            <CardDescription>Personalized health recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">AI health coaching coming soon</p>
              <p className="text-sm text-muted-foreground">
                Get personalized insights and recommendations based on your health data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}