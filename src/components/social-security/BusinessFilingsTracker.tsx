
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Plus, File, CalendarClock, Clock } from "lucide-react";
import { mockBusinessFilings } from "@/data/mock/socialSecurity";

export const BusinessFilingsTracker: React.FC = () => {
  const businessFilings = mockBusinessFilings;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Completed</span>;
      case 'upcoming':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Upcoming</span>;
      case 'overdue':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Overdue</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Business Filings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track business filings and compliance deadlines
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Filing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {businessFilings.length > 0 ? (
          <div className="space-y-6">
            {businessFilings.map((filing) => (
              <div key={filing.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{filing.businessName}</h3>
                    <p className="text-sm text-muted-foreground">{filing.entityType}</p>
                  </div>
                  <div>
                    {getStatusBadge(filing.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Filing Type</p>
                    <p className="text-sm font-medium">{filing.filingType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-sm font-medium">{filing.dueDate}</p>
                    </div>
                  </div>
                  {filing.filedDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Filed Date</p>
                      <p className="text-sm font-medium">{filing.filedDate}</p>
                    </div>
                  )}
                  {!filing.filedDate && filing.status.toLowerCase() !== 'completed' && (
                    <div>
                      <p className="text-xs text-muted-foreground">Timeline</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm font-medium">{getDaysRemaining(filing.dueDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Jurisdictions</p>
                  <div className="flex flex-wrap gap-1">
                    {filing.jurisdictions.map((jurisdiction, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-muted rounded-md">{jurisdiction}</span>
                    ))}
                  </div>
                </div>
                
                {filing.relatedDocuments.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Related Documents</p>
                    <div className="flex flex-col space-y-1">
                      {filing.relatedDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center gap-1 text-sm text-blue-600 hover:underline cursor-pointer">
                          <File className="h-3.5 w-3.5" />
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button variant="outline" size="sm">Manage Filing</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">No Business Filings</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Add business filings to track compliance deadlines for your companies.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Filing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
