import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { getAllReviewSessions } from '@/features/estate/review/service';
import { generateExecutionInstructions } from '@/features/estate/review/deliver';
import type { ReviewSession } from '@/features/estate/review/types';

export default function ReviewView() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [executionInstructions, setExecutionInstructions] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      if (id) {
        const sessions = await getAllReviewSessions();
        const foundSession = sessions.find((s: any) => s.id === id);
        if (foundSession) {
          setSession(foundSession);
          setExecutionInstructions(generateExecutionInstructions(foundSession.state));
        }
      }
    };
    loadSession();
  }, [id]);

  const handleDownload = (type: 'packet' | 'letter' | 'instructions') => {
    // In a real implementation, this would download the actual files
    console.log(`Downloading ${type} for session ${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-6">
            <p>Review session not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session.status !== 'delivered') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-6">
            <p>This review package is not yet available. Please wait for attorney review to be completed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Your Estate Planning Review Package
            {session.deliveredVno && ` v${session.deliveredVno}`}
          </h1>
          <Badge variant="default">Ready for Execution</Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          State: {session.state} • Reviewed: {new Date(session.createdAt).toLocaleDateString()}
        </p>
        {session.deliveredVno && session.currentVno !== session.deliveredVno && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠ You received v{session.deliveredVno}, but a newer version v{session.currentVno} is available. Contact your attorney for the latest version.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attorney-Reviewed Documents
            </CardTitle>
            <CardDescription>
              Your complete estate planning package, reviewed and signed by a licensed attorney.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Attorney Review Complete</span>
              </div>
              <p className="text-sm text-green-700">
                Your documents have been reviewed and approved for execution according to {session.state} law.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => handleDownload('packet')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Complete Review Package
              </Button>
              
              <Button 
                onClick={() => handleDownload('letter')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Attorney Review Letter
              </Button>

              <Button 
                onClick={handlePrint} 
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Print All Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Important steps to properly execute your estate planning documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Execution Requirements for {session.state}</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• DO NOT sign any documents until you are with the notary and witnesses</li>
                  <li>• Bring valid photo identification</li>
                  <li>• All parties must be present simultaneously</li>
                  <li>• Follow the signing order specified by the notary</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Next Steps:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>1. Review all documents carefully</li>
                  <li>2. Schedule notarization appointments</li>
                  <li>3. Arrange for required witnesses</li>
                  <li>4. Execute documents in proper order</li>
                  <li>5. Store originals safely</li>
                  <li>6. Distribute copies as needed</li>
                </ol>
              </div>

              <Button 
                onClick={() => handleDownload('instructions')} 
                variant="outline"
                className="w-full mt-4"
              >
                Download Detailed Execution Instructions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Execution Instructions</CardTitle>
          <CardDescription>
            Detailed step-by-step instructions for executing your documents in {session.state}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
            {executionInstructions}
          </pre>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-900 mb-2">Important Reminders</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Keep original documents in a secure location</li>
          <li>• Provide copies to relevant parties (banks, doctors, family)</li>
          <li>• Update beneficiary designations on accounts and insurance</li>
          <li>• Contact your attorney if circumstances change</li>
        </ul>
      </div>
    </div>
  );
}