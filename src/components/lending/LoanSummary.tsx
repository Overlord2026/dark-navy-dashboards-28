
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function LoanSummary() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
          <CheckCircle className="h-10 w-10" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold">Application Submitted</h2>
      
      <p className="text-muted-foreground">
        Thank you for your application. We have received your information and will begin processing your request.
      </p>
      
      <div className="rounded-lg border p-4 text-left space-y-2">
        <p className="text-sm flex justify-between">
          <span>Application ID:</span>
          <span className="font-medium">APP-12345-678</span>
        </p>
        <p className="text-sm flex justify-between">
          <span>Submitted on:</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </p>
        <p className="text-sm flex justify-between">
          <span>Status:</span>
          <span className="font-medium text-amber-500">Under Review</span>
        </p>
      </div>
      
      <p className="text-sm text-muted-foreground">
        One of our loan specialists will contact you within 1-2 business days to discuss the next steps.
      </p>
      
      <div className="flex justify-center">
        <Button>Return to Dashboard</Button>
      </div>
    </div>
  );
}
