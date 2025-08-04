import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, AlertTriangle, FileText, Scale } from 'lucide-react';
import { toast } from 'sonner';

export const EstateDisclaimerBanner: React.FC = () => {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  const downloadDisclaimer = () => {
    const disclaimerText = getFullDisclaimerText();
    const blob = new Blob([disclaimerText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Estate_Planning_Legal_Disclaimer.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Legal disclaimer downloaded successfully');
  };

  const getFullDisclaimerText = () => {
    return `ESTATE PLANNING LEGAL DISCLAIMER

IMPORTANT NOTICE: This estate planning platform provides general information and tools for educational and planning purposes only. This is NOT legal advice and does not create an attorney-client relationship.

LEGAL REPRESENTATION REQUIRED:
• Estate planning involves complex legal, tax, and financial considerations that vary by state and individual circumstances
• All estate planning documents (wills, trusts, powers of attorney) must be drafted, reviewed, and executed under the supervision of qualified legal counsel
• State laws govern estate planning requirements and may vary significantly
• Tax implications require consultation with qualified tax professionals

PLATFORM LIMITATIONS:
• Tools and calculators provide estimates for planning purposes only
• Results do not constitute legal, tax, or financial advice
• Information may not reflect current law changes or state-specific requirements
• Complex family situations require personalized legal counsel

PROFESSIONAL CONSULTATION REQUIRED:
Before implementing any estate planning strategy, you must consult with:
• Licensed attorney specializing in estate planning in your state
• Qualified tax professional for tax implications
• Financial advisor for investment and insurance considerations

LIABILITY DISCLAIMER:
The platform providers, advisors, and associated professionals:
• Make no warranties about the accuracy, completeness, or timeliness of information
• Are not liable for any decisions made based on platform content
• Do not guarantee specific legal or tax outcomes
• Recommend independent verification of all information

DOCUMENT EXECUTION:
• All legal documents must comply with state-specific execution requirements
• Notarization, witnessing, and filing requirements vary by state
• Improper execution may invalidate documents
• Legal counsel must supervise all document execution

By using this platform, you acknowledge:
• You understand this disclaimer and its limitations
• You will seek appropriate professional advice before taking action
• You will not rely solely on platform information for legal decisions
• You accept responsibility for verifying all information independently

Last updated: ${new Date().toISOString().split('T')[0]}
© 2024 Family Office Platform - All Rights Reserved`;
  };

  return (
    <>
      {/* Prominent Banner */}
      <Alert className="border-amber-200 bg-amber-50 mb-6">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Legal Notice:</strong> Estate planning tools require qualified legal counsel. 
              This platform provides educational information only and does not constitute legal advice.
            </div>
            <div className="flex gap-2 ml-4">
              <Dialog open={showFullDisclaimer} onOpenChange={setShowFullDisclaimer}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                    <Scale className="h-3 w-3 mr-1" />
                    View Full Disclaimer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Estate Planning Legal Disclaimer
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] w-full">
                    <div className="space-y-4 text-sm leading-relaxed">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="font-semibold text-red-800 mb-2">IMPORTANT NOTICE</h3>
                        <p className="text-red-700">
                          This estate planning platform provides general information and tools for educational 
                          and planning purposes only. This is NOT legal advice and does not create an attorney-client relationship.
                        </p>
                      </div>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Legal Representation Required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• Estate planning involves complex legal, tax, and financial considerations that vary by state and individual circumstances</p>
                          <p>• All estate planning documents (wills, trusts, powers of attorney) must be drafted, reviewed, and executed under the supervision of qualified legal counsel</p>
                          <p>• State laws govern estate planning requirements and may vary significantly</p>
                          <p>• Tax implications require consultation with qualified tax professionals</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Platform Limitations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• Tools and calculators provide estimates for planning purposes only</p>
                          <p>• Results do not constitute legal, tax, or financial advice</p>
                          <p>• Information may not reflect current law changes or state-specific requirements</p>
                          <p>• Complex family situations require personalized legal counsel</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Professional Consultation Required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p className="font-medium">Before implementing any estate planning strategy, you must consult with:</p>
                          <p>• Licensed attorney specializing in estate planning in your state</p>
                          <p>• Qualified tax professional for tax implications</p>
                          <p>• Financial advisor for investment and insurance considerations</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Liability Disclaimer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p className="font-medium">The platform providers, advisors, and associated professionals:</p>
                          <p>• Make no warranties about the accuracy, completeness, or timeliness of information</p>
                          <p>• Are not liable for any decisions made based on platform content</p>
                          <p>• Do not guarantee specific legal or tax outcomes</p>
                          <p>• Recommend independent verification of all information</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Document Execution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• All legal documents must comply with state-specific execution requirements</p>
                          <p>• Notarization, witnessing, and filing requirements vary by state</p>
                          <p>• Improper execution may invalidate documents</p>
                          <p>• Legal counsel must supervise all document execution</p>
                        </CardContent>
                      </Card>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">By using this platform, you acknowledge:</h3>
                        <div className="text-blue-700 space-y-1 text-sm">
                          <p>• You understand this disclaimer and its limitations</p>
                          <p>• You will seek appropriate professional advice before taking action</p>
                          <p>• You will not rely solely on platform information for legal decisions</p>
                          <p>• You accept responsibility for verifying all information independently</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground border-t pt-4">
                        <p>Last updated: {new Date().toISOString().split('T')[0]}</p>
                        <p>© 2024 Family Office Platform - All Rights Reserved</p>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" onClick={downloadDisclaimer}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Disclaimer
                    </Button>
                    <Button onClick={() => setShowFullDisclaimer(false)}>
                      I Understand
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={downloadDisclaimer} className="border-amber-300 text-amber-700 hover:bg-amber-100">
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </>
  );
};