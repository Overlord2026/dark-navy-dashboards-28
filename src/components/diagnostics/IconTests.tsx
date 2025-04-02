
import React from "react";
import { Eye, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface IconTestsProps {
  tests: any[];
}

export const IconTests = ({ tests }: IconTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Icon Tests
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
                      <span className="font-medium">{test.icon}</span>
                      <p className="text-sm">Location: {test.location}</p>
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
                  {test.status !== "success" && (
                    <>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Detailed Log:</h4>
                        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                          <p>[{new Date().toISOString()}] Icon issue detected</p>
                          <p>Icon: {test.icon}</p>
                          <p>Location: {test.location}</p>
                          <p>Status: {test.status}</p>
                          {test.importPath && <p>Import Path: {test.importPath}</p>}
                          {test.errorType && <p>Error Type: {test.errorType}</p>}
                          {test.libraryVersion && <p>Library Version: {test.libraryVersion}</p>}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Recommended Steps:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {test.errorType?.includes("import") && (
                            <li>Check import statement for {test.icon} icon</li>
                          )}
                          {test.errorType?.includes("missing") && (
                            <li>Verify the icon name is correct and exists in the icon library</li>
                          )}
                          {test.errorType?.includes("props") && (
                            <li>Ensure correct props are passed to the icon component</li>
                          )}
                          <li>Review component usage in {test.location}</li>
                          {test.status === "error" && (
                            <li className="text-destructive font-medium">
                              Fix this issue as it may cause rendering errors
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {test.codeSnippet && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Current Code:</h4>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {test.codeSnippet}
                          </pre>
                        </div>
                      )}
                      
                      {test.suggestedFix && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Suggested Fix:</h4>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {test.suggestedFix}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                  
                  {test.status === "success" && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Icon Details:</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Icon: </span>
                          {test.icon}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Location: </span>
                          {test.location}
                        </div>
                        {test.importPath && (
                          <div className="text-sm">
                            <span className="font-medium">Import Path: </span>
                            <code className="text-xs bg-muted p-1 rounded">{test.importPath}</code>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="font-medium">Status: </span>
                          <span className="text-green-600">Correctly Rendered</span>
                        </div>
                      </div>
                    </div>
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
