
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Download, Upload, BarChart } from "lucide-react";

const TaxBudgets = () => {
  return (
    <ThreeColumnLayout activeMainItem="tax-budgets" title="Proactive Tax Planning">
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Proactive Tax Planning</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Tax Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Tax documents uploaded and processed
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Upload className="h-3.5 w-3.5 mr-2" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Next Review</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">April 15</div>
              <p className="text-xs text-muted-foreground">
                Scheduled tax strategy review with your advisor
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Schedule Review
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Tax Reports</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Available tax reports for the current year
              </p>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Download className="h-3.5 w-3.5 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <TaxPlanningSummary />
        
      </div>
    </ThreeColumnLayout>
  );
};

export default TaxBudgets;
