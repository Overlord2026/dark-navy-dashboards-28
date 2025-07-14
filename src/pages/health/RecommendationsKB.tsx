import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Star, TrendingUp, CheckCircle } from "lucide-react";

export default function RecommendationsKB() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Recommendations</h1>
        <p className="text-muted-foreground">
          Personalized health recommendations based on your data and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Current recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Star className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">Health score change</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Increase Vitamin D Intake</CardTitle>
                <CardDescription>Based on your recent lab results showing deficiency</CardDescription>
              </div>
              <Badge variant="destructive">High Priority</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                Your vitamin D level (22 ng/mL) is below the optimal range (30-50 ng/mL).
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Recommended action:</span>
                <span>Take 2000 IU daily, retest in 3 months</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Improve Sleep Consistency</CardTitle>
                <CardDescription>Sleep tracking shows irregular bedtime patterns</CardDescription>
              </div>
              <Badge variant="secondary">Medium Priority</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                Your bedtime varies by 2+ hours nightly, affecting sleep quality and recovery.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Recommended action:</span>
                <span>Set consistent bedtime within 30-minute window</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Schedule Preventive Screening</CardTitle>
                <CardDescription>Annual physical exam is due</CardDescription>
              </div>
              <Badge variant="outline">Low Priority</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                Based on your age and risk factors, annual physical exam is recommended.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Recommended action:</span>
                <span>Schedule appointment with Dr. Johnson</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}