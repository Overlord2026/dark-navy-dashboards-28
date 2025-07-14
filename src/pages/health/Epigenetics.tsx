import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, TrendingDown, Calendar } from "lucide-react";

export default function Epigenetics() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Biological Age & Epigenetics</h1>
        <p className="text-muted-foreground">
          Track your biological age and epigenetic markers for longevity insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biological Age</CardTitle>
            <Microscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5 years</div>
            <p className="text-xs text-muted-foreground">Based on latest test</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Age Delta</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-2.3 years</div>
            <p className="text-xs text-muted-foreground">Younger than chronological</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Test</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Oct 2024</div>
            <p className="text-xs text-muted-foreground">Next test due: Apr 2025</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Epigenetic Testing</CardTitle>
          <CardDescription>Monitor your biological age and aging patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Microscope className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Epigenetic testing integration coming soon</p>
            <p className="text-sm text-muted-foreground">
              Track biological age, methylation patterns, and longevity biomarkers
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}