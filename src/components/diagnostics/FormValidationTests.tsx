
import React from "react";
import { FileText, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FormValidationTestResult, FormField } from "@/types/diagnostics/forms";

interface FormValidationTestsProps {
  tests: FormValidationTestResult[];
  isLoading?: boolean;
}

export const FormValidationTests = ({ tests, isLoading = false }: FormValidationTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Form Validation Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <Collapsible key={index} className={`rounded-md border ${getStatusColor(test.status)}`}>
              <CollapsibleTrigger className="p-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <StatusIcon status={test.status} />
                    <div>
                      <span className="font-medium">{test.name}</span>
                      <p className="text-sm">Page: {test.location || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded-full bg-muted">
                      {test.status}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                  </div>
                </div>
                <p className="text-sm mt-1 text-left">{test.message}</p>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-3 pt-0 border-t mt-2">
                  {test.fields && test.fields.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Field Tests:</h4>
                      {test.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className={`p-2 rounded-md border ${getStatusColor(field.status || 'success')}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusIcon status={field.status || 'success'} size={4} />
                              <div>
                                <span className="font-medium">{field.name}</span>
                                <p className="text-xs text-muted-foreground">Type: {field.type}</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs mt-1">{field.message || (field.errors && field.errors.length > 0 ? field.errors[0] : '')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {test.status !== "success" && (
                    <>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Detailed Log:</h4>
                        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                          <p>[{new Date().toISOString()}] Form validation issue detected</p>
                          <p>Form: {test.name}</p>
                          <p>Location: {test.location || "Unknown"}</p>
                          <p>Status: {test.status}</p>
                          {test.validationDetails && <p>Error Count: {test.validationDetails.invalidFields?.length || 0}</p>}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Recommended Steps:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Review form validation logic in the component</li>
                          {test.fields?.some((f) => f.errors && f.errors.length > 0) && (
                            <li>Fix field validation issues highlighted above</li>
                          )}
                          <li>Ensure form submission handlers properly validate input</li>
                          {test.status === "error" && (
                            <li className="text-destructive font-medium">
                              Critical form errors must be addressed before deployment
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
