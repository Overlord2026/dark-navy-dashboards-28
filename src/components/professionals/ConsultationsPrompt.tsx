
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Users, ArrowRight } from "lucide-react";

export function ConsultationsPrompt() {
  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 dark:from-indigo-950/40 dark:to-blue-950/30 dark:border-blue-900">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Need expert guidance?</h2>
        <p className="text-muted-foreground mb-6">
          Choose from our vetted network of professionals to help with your financial needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-md mr-3">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Browse Profiles</h3>
              <p className="text-sm text-muted-foreground">
                Review backgrounds and specialties
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-md mr-3">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Free Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Schedule a 15-minute meeting
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-md mr-3">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Request Proposal</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed service offerings
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
          <span>Browse all available professionals</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}
