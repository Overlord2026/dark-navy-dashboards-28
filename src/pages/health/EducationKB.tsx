import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Play, FileText } from "lucide-react";

export default function EducationKB() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Education</h1>
        <p className="text-muted-foreground">
          Evidence-based health education and learning resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">Nutrition</CardTitle>
            <CardDescription>24 articles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Learn about optimal nutrition, supplements, and dietary patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Play className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">Exercise</CardTitle>
            <CardDescription>18 videos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Workout routines, recovery, and fitness optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <BookOpen className="mx-auto h-8 w-8 text-purple-600 mb-2" />
            <CardTitle className="text-lg">Sleep</CardTitle>
            <CardDescription>12 guides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Sleep hygiene, circadian rhythms, and sleep optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <FileText className="mx-auto h-8 w-8 text-orange-600 mb-2" />
            <CardTitle className="text-lg">Longevity</CardTitle>
            <CardDescription>31 studies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Research on aging, longevity, and healthspan extension
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Featured Articles</CardTitle>
            <CardDescription>Latest evidence-based health content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">The Role of Omega-3s in Cognitive Health</h4>
                  <p className="text-xs text-muted-foreground">5 min read • Nutrition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">High-Intensity Interval Training Benefits</h4>
                  <p className="text-xs text-muted-foreground">8 min read • Exercise</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">Optimizing Sleep for Recovery</h4>
                  <p className="text-xs text-muted-foreground">6 min read • Sleep</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Paths</CardTitle>
            <CardDescription>Structured health education curricula</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Metabolic Health Mastery</h4>
                <p className="text-xs text-muted-foreground">8 modules • 2 hours</p>
                <div className="w-full bg-muted rounded-full h-1 mt-2">
                  <div className="bg-blue-600 h-1 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Cardiovascular Optimization</h4>
                <p className="text-xs text-muted-foreground">6 modules • 1.5 hours</p>
                <div className="w-full bg-muted rounded-full h-1 mt-2">
                  <div className="bg-green-600 h-1 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}