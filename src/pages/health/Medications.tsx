import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pill, Clock, AlertCircle } from "lucide-react";

export default function Medications() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-muted-foreground">
            Manage your prescriptions, track refills, and set reminders
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Currently taking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due for Refill</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All up to date</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Lisinopril 10mg</CardTitle>
                <CardDescription>Blood pressure medication</CardDescription>
              </div>
              <Badge variant="secondary">Due Soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Dosage</p>
                <p className="text-muted-foreground">Once daily</p>
              </div>
              <div>
                <p className="font-medium">Next Refill</p>
                <p className="text-muted-foreground">Dec 20, 2024</p>
              </div>
              <div>
                <p className="font-medium">Prescriber</p>
                <p className="text-muted-foreground">Dr. Johnson</p>
              </div>
              <div>
                <p className="font-medium">Pharmacy</p>
                <p className="text-muted-foreground">CVS Main St</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Metformin 500mg</CardTitle>
                <CardDescription>Diabetes medication</CardDescription>
              </div>
              <Badge variant="default">Good</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Dosage</p>
                <p className="text-muted-foreground">Twice daily</p>
              </div>
              <div>
                <p className="font-medium">Next Refill</p>
                <p className="text-muted-foreground">Jan 15, 2025</p>
              </div>
              <div>
                <p className="font-medium">Prescriber</p>
                <p className="text-muted-foreground">Dr. Chen</p>
              </div>
              <div>
                <p className="font-medium">Pharmacy</p>
                <p className="text-muted-foreground">Walgreens Oak Ave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}