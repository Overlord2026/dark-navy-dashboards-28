import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pill, Star, DollarSign } from "lucide-react";

export default function Supplements() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supplements</h1>
          <p className="text-muted-foreground">
            Track your supplements, dosages, and find the best prices
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Supplements</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Currently taking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence-Based</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">High evidence rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$87</div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Vitamin D3 2000 IU</CardTitle>
                <CardDescription>Bone health and immune support</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 text-gray-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Dosage</p>
                <p className="text-muted-foreground">1 capsule daily</p>
              </div>
              <div>
                <p className="font-medium">Evidence</p>
                <p className="text-muted-foreground">Strong</p>
              </div>
              <div>
                <p className="font-medium">Cost</p>
                <p className="text-muted-foreground">$12/month</p>
              </div>
              <div>
                <p className="font-medium">Brand</p>
                <p className="text-muted-foreground">Nature Made</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Omega-3 Fish Oil</CardTitle>
                <CardDescription>Heart and brain health</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Dosage</p>
                <p className="text-muted-foreground">2 capsules daily</p>
              </div>
              <div>
                <p className="font-medium">Evidence</p>
                <p className="text-muted-foreground">Very Strong</p>
              </div>
              <div>
                <p className="font-medium">Cost</p>
                <p className="text-muted-foreground">$25/month</p>
              </div>
              <div>
                <p className="font-medium">Brand</p>
                <p className="text-muted-foreground">Nordic Naturals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}