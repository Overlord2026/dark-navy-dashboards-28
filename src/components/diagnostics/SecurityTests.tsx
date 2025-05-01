
import React from "react";
import { Shield, ChevronDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SecurityTestsProps {
  tests: any[];
  isLoading?: boolean;
}

export const SecurityTests = ({ tests, isLoading = false }: SecurityTestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Tests
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
                      <p className="text-sm">Category: {test.category.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      test.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      test.severity === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                      test.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {test.severity}
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
                        <h4 className="text-sm font-medium mb-1">Security Issue Details:</h4>
                        <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                          <p>[{new Date().toISOString()}] Security issue detected</p>
                          <p>Test: {test.name}</p>
                          <p>Category: {test.category}</p>
                          <p>Severity: {test.severity}</p>
                          <p>Status: {test.status}</p>
                          {test.affectedComponents && <p>Affected Components: {test.affectedComponents.join(', ')}</p>}
                          {test.cve && <p>CVE ID: {test.cve}</p>}
                          {test.vulnerabilityType && <p>Vulnerability Type: {test.vulnerabilityType}</p>}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">
                          {test.remediation ? "Remediation Steps:" : "Recommended Actions:"}
                        </h4>
                        {test.remediation ? (
                          <div className="p-2 border-l-2 border-primary/40 bg-muted/30">
                            <p className="text-sm">{test.remediation}</p>
                          </div>
                        ) : (
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {test.severity === 'critical' && (
                              <li className="text-red-600 font-medium">
                                Critical security issue - address immediately
                              </li>
                            )}
                            {test.category.includes('auth') && (
                              <li>Review authentication mechanism and update security settings</li>
                            )}
                            {test.category.includes('api') && (
                              <li>Check API security configuration and implement proper validation</li>
                            )}
                            {test.category.includes('data') && (
                              <li>Review data encryption and storage security measures</li>
                            )}
                            <li>Follow best practices for {test.category.replace('-', ' ')} security</li>
                            <li>Document the fix and update security policies</li>
                          </ul>
                        )}
                      </div>
                      
                      {test.codeSnippet && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Vulnerable Code:</h4>
                          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                            {test.codeSnippet}
                          </pre>
                        </div>
                      )}
                      
                      {test.references && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">References:</h4>
                          <ul className="list-disc list-inside text-sm">
                            {test.references.map((ref: string, i: number) => (
                              <li key={i}>
                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  {ref.split('/').pop() || ref}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  
                  {test.status === "success" && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h4 className="text-sm font-medium">Test Passed Successfully</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Security Control: </span>
                          {test.name}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Category: </span>
                          {test.category.replace('-', ' ')}
                        </div>
                        {test.lastTested && (
                          <div className="text-sm">
                            <span className="font-medium">Last Tested: </span>
                            {new Date(test.lastTested).toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="font-medium">Status: </span>
                          <span className="text-green-600">Secure</span>
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
