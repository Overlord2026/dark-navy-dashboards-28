import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { buildReviewLetter, applyAttorneyESign } from '@/features/estate/review/builder';
import { signReviewLetter, deliverReviewPacket, getAllReviewSessions } from '@/features/estate/review/service';
import { useToast } from '@/hooks/use-toast';
import type { ReviewSession, AttorneyInfo } from '@/features/estate/review/types';

export default function ReviewSession() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [letterBody, setLetterBody] = useState('');
  const [attorneyInfo, setAttorneyInfo] = useState<AttorneyInfo>({
    name: 'Dr. Attorney Name',
    barNo: '123456',
    state: 'CA',
    email: 'attorney@example.com'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Load session data
      const sessions = getAllReviewSessions();
      const foundSession = sessions.find(s => s.id === id);
      if (foundSession) {
        setSession(foundSession);
        setLetterBody(generateDefaultLetterBody(foundSession.state));
      }
    }
  }, [id]);

  const generateDefaultLetterBody = (state: string) => {
    return `I have completed my review of the estate planning documents prepared for execution in ${state}. 

Based on my analysis of the applicable state laws and the client's circumstances, the documents appear to be properly prepared and ready for execution, subject to the execution requirements outlined in the attached checklist.

Please ensure all execution formalities are followed precisely as outlined to ensure the documents will be legally effective.`;
  };

  const handleSignLetter = async () => {
    if (!session) return;

    setLoading(true);
    try {
      // Build the review letter
      const letter = await buildReviewLetter({
        clientId: session.clientId,
        state: session.state,
        attorney: attorneyInfo,
        packetPdfId: session.packet.pdfId
      });

      // Apply e-signature
      const signedLetter = await applyAttorneyESign(letter.bytes, attorneyInfo);
      
      // Save the signed letter (simplified - would use actual vault service)
      const signedPdfId = `vault://signed_letter_${Date.now()}.pdf`;

      // Update session with signed letter
      await signReviewLetter({
        sessionId: session.id,
        attorneyUserId: 'current-attorney-id',
        letterPdfId: signedPdfId,
        letterSha256: signedLetter.sha256
      });

      // Refresh session data
      const sessions = getAllReviewSessions();
      const updatedSession = sessions.find(s => s.id === id);
      if (updatedSession) {
        setSession(updatedSession);
      }

      toast({
        title: 'Letter Signed',
        description: 'Attorney review letter has been electronically signed.',
      });
    } catch (error) {
      console.error('Error signing letter:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign review letter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverPacket = async () => {
    if (!session || !session.signedLetter) return;

    setLoading(true);
    try {
      await deliverReviewPacket({
        sessionId: session.id,
        familyUserId: session.clientId, // Simplified - would be actual family user ID
        signedPdfId: session.signedLetter.pdfId
      });

      // Refresh session data
      const sessions = getAllReviewSessions();
      const updatedSession = sessions.find(s => s.id === id);
      if (updatedSession) {
        setSession(updatedSession);
      }

      toast({
        title: 'Package Delivered',
        description: 'Review package has been delivered to the family.',
      });
    } catch (error) {
      console.error('Error delivering package:', error);
      toast({
        title: 'Error',
        description: 'Failed to deliver package. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Attorney Review Session</h1>
          <Badge variant={session.status === 'delivered' ? 'default' : 'secondary'}>
            {session.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          Client: {session.clientId} • State: {session.state} • Created: {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>

      <Tabs defaultValue="packet" className="space-y-6">
        <TabsList>
          <TabsTrigger value="packet">Review Packet</TabsTrigger>
          <TabsTrigger value="checklist">Execution Checklist</TabsTrigger>
          <TabsTrigger value="letter">Review Letter</TabsTrigger>
          <TabsTrigger value="deliver">Deliver to Family</TabsTrigger>
        </TabsList>

        <TabsContent value="packet">
          <Card>
            <CardHeader>
              <CardTitle>Review Packet Preview</CardTitle>
              <CardDescription>
                Preview and download the generated review packet PDF.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Packet ID:</p>
                  <p className="font-mono text-sm">{session.packet.pdfId}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">SHA256:</p>
                  <p className="font-mono text-xs break-all">{session.packet.sha256}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Download Review Packet PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Execution Checklist</CardTitle>
              <CardDescription>
                Review execution requirements for {session.state}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="will-witnesses" />
                    <label htmlFor="will-witnesses" className="text-sm font-medium">
                      Will witnesses (2 required for {session.state})
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notarization" />
                    <label htmlFor="notarization" className="text-sm font-medium">
                      Notarization requirements met
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="self-proving" />
                    <label htmlFor="self-proving" className="text-sm font-medium">
                      Self-proving affidavit (recommended)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trust-notary" />
                    <label htmlFor="trust-notary" className="text-sm font-medium">
                      Trust notarization
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="poa-notary" />
                    <label htmlFor="poa-notary" className="text-sm font-medium">
                      Power of Attorney notarization
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letter">
          <Card>
            <CardHeader>
              <CardTitle>Attorney Review Letter</CardTitle>
              <CardDescription>
                Compose and electronically sign the attorney review letter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attorney-name">Attorney Name</Label>
                  <Input
                    id="attorney-name"
                    value={attorneyInfo.name}
                    onChange={(e) => setAttorneyInfo({ ...attorneyInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bar-number">Bar Number</Label>
                  <Input
                    id="bar-number"
                    value={attorneyInfo.barNo}
                    onChange={(e) => setAttorneyInfo({ ...attorneyInfo, barNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="letter-body">Letter Body</Label>
                <Textarea
                  id="letter-body"
                  value={letterBody}
                  onChange={(e) => setLetterBody(e.target.value)}
                  rows={10}
                  placeholder="Enter the review letter content..."
                />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  {session.signedLetter ? (
                    <Badge variant="default">Letter Signed</Badge>
                  ) : (
                    <Badge variant="secondary">Pending Signature</Badge>
                  )}
                </div>
                <Button 
                  onClick={handleSignLetter} 
                  disabled={loading || !!session.signedLetter}
                >
                  {loading ? 'Signing...' : session.signedLetter ? 'Already Signed' : 'Sign Review Letter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliver">
          <Card>
            <CardHeader>
              <CardTitle>Deliver to Family</CardTitle>
              <CardDescription>
                Send the completed review package to the family for execution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Package Contents:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Review packet PDF with state execution summary</li>
                  <li>• Attorney review letter (signed)</li>
                  <li>• Execution checklist and instructions</li>
                  <li>• Document previews</li>
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Status: {session.status === 'delivered' ? 'Delivered' : 'Ready for Delivery'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.status === 'delivered' 
                      ? 'Package has been delivered to family'
                      : 'Attorney signature required before delivery'
                    }
                  </p>
                </div>
                <Button 
                  onClick={handleDeliverPacket}
                  disabled={loading || !session.signedLetter || session.status === 'delivered'}
                >
                  {loading ? 'Delivering...' : 'Deliver to Family'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}