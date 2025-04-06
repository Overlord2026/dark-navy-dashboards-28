
import React from "react";
import { HelpAndTutorialsDialog } from "@/components/support/HelpAndTutorialsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Find answers to the most common questions about our platform and services.</p>
            <ul className="space-y-2">
              <li>
                <strong>How do I connect my accounts?</strong>
                <p className="text-muted-foreground text-sm">
                  Visit the Accounts page and select "Add New Account" to connect your financial accounts securely.
                </p>
              </li>
              <li>
                <strong>How secure is my data?</strong>
                <p className="text-muted-foreground text-sm">
                  We use enterprise-grade encryption and security practices to protect your information.
                </p>
              </li>
              <li>
                <strong>Can I share documents with my advisors?</strong>
                <p className="text-muted-foreground text-sm">
                  Yes, use the sharing features in the Documents section to share securely with professionals.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Watch step-by-step guides on how to use platform features.</p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="bg-primary/10 text-primary rounded-full p-1.5">▶</span>
                <div>
                  <p className="font-medium">Getting Started Guide</p>
                  <p className="text-sm text-muted-foreground">3:45 • Learn the basics of navigating the platform</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-primary/10 text-primary rounded-full p-1.5">▶</span>
                <div>
                  <p className="font-medium">Financial Planning Tools</p>
                  <p className="text-sm text-muted-foreground">5:12 • How to create and monitor financial goals</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-primary/10 text-primary rounded-full p-1.5">▶</span>
                <div>
                  <p className="font-medium">Document Management</p>
                  <p className="text-sm text-muted-foreground">4:30 • Organize and share important documents</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
