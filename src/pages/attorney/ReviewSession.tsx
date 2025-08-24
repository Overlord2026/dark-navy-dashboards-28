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
import { signReviewLetter, getAllReviewSessions } from '@/features/estate/review/service';
import { finalizeReviewPacket, loadReviewPacketPdfs } from '@/features/estate/review/finalize';
import { rebuildFinalPacket, setCurrentVersion } from '@/features/estate/review/rebuild';
import { deliverReviewPacket } from '@/features/estate/review/deliver';
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

  const handleMergeAndStamp = async () => {
    if (!session) return;

    setLoading(true);
    try {
      // Load PDF bytes from vault
      const { letterPdf, packetPdf } = await loadReviewPacketPdfs(session);
      
      const footerTag = `Reviewed & Signed on ${new Date().toLocaleString()}`;
      const anchorEnabled = import.meta.env.VITE_ARP_ANCHOR_ON_FINAL === 'true';
      
      const result = await finalizeReviewPacket({
        sessionId: session.id,
        clientId: session.clientId,
        letterPdf,
        packetPdf,
        footerTag,
        anchor: anchorEnabled
      });
      
      // Update session with final version
      const updatedSession = {
        ...session,
        finalVersions: [{
          vno: 1,
          pdfId: result.finalPdfId, 
          sha256: result.sha256,
          anchor_ref: result.anchor_ref,
          builtAt: new Date().toISOString(),
          builtBy: 'current-attorney-id',
          reason: 'Initial final packet'
        }],
        currentVno: 1
      };
      setSession(updatedSession);
      
      toast({
        title: 'Final Packet Created',
        description: `Merged and stamped packet ready for delivery${anchorEnabled ? ' (anchored)' : ''}.`,
      });
      
    } catch (error) {
      console.error('Failed to create final packet:', error);
      toast({
        title: 'Error',
        description: 'Failed to create final packet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildFinal = async () => {
    if (!session) return;
    
    const reason = prompt('Why rebuild? (e.g., "Updated POA", "Checklist fixes")') || 'unspecified';
    
    setLoading(true);
    try {
      // Load PDF bytes from vault
      const { letterPdf, packetPdf } = await loadReviewPacketPdfs(session);
      
      const footerTag = `Reviewed & Signed on ${new Date().toLocaleString()}`;
      const anchorEnabled = import.meta.env.VITE_ARP_ANCHOR_ON_FINAL === 'true';
      
      const updatedSession = await rebuildFinalPacket({
        session,
        clientId: session.clientId,
        letterBytes: letterPdf,
        packetBytes: packetPdf,
        footerTag,
        builtBy: 'current-attorney-id', // TODO: get actual user ID
        reason,
        anchor: anchorEnabled
      });
      
      setSession(updatedSession);
      
      toast({
        title: 'Final Packet Rebuilt',
        description: `Final v${updatedSession.currentVno} created${anchorEnabled ? ' (anchored)' : ''}.`,
      });
      
    } catch (error) {
      console.error('Failed to rebuild final packet:', error);
      toast({
        title: 'Error',
        description: 'Failed to rebuild final packet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverPacket = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const updatedSession = { ...session };
      await deliverReviewPacket({
        session: updatedSession,
        familyUserId: session.clientId
      });

      // Update local session state
      updatedSession.deliveredVno = updatedSession.currentVno;
      updatedSession.status = 'delivered';
      setSession(updatedSession);

      toast({
        title: 'Package Delivered',
        description: `Review package v${updatedSession.deliveredVno || 'legacy'} has been delivered to the family.`,
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

              <div className="space-y-4">
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

                {session.signedLetter && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        {session.finalVersions?.length ? (
                          <Badge variant="default">v{session.currentVno} Current</Badge>
                        ) : (
                          <Badge variant="secondary">Ready to Create Final</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleMergeAndStamp}
                          disabled={loading || !session.signedLetter}
                          size="sm"
                        >
                          {loading ? 'Processing...' : session.finalVersions?.length ? 'Create v1' : 'Merge & Stamp Final'}
                        </Button>
                        {session.finalVersions?.length && (
                          <Button 
                            onClick={handleRebuildFinal}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                          >
                            Rebuild v{(session.finalVersions?.length || 0) + 1}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Version history table */}
                    {session.finalVersions?.length ? (
                      <div className="mt-4">
                        <h3 className="font-semibold text-sm mb-2">Final Versions</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border rounded">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-left p-2">Version</th>
                                <th className="text-left p-2">SHA256</th>
                                <th className="text-left p-2">Built</th>
                                <th className="text-left p-2">By</th>
                                <th className="text-left p-2">Anchor</th>
                                <th className="text-left p-2">Reason</th>
                                <th className="text-left p-2">Current</th>
                                <th className="text-left p-2">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {session.finalVersions.map(v => (
                                <tr key={v.vno} className="border-t">
                                  <td className="p-2">v{v.vno}</td>
                                  <td className="p-2 font-mono">{v.sha256.slice(0, 18)}…</td>
                                  <td className="p-2">{new Date(v.builtAt).toLocaleString()}</td>
                                  <td className="p-2">{v.builtBy}</td>
                                  <td className="p-2">{v.anchor_ref ? '✓' : '-'}</td>
                                  <td className="p-2">{v.reason || '-'}</td>
                                  <td className="p-2">{session.currentVno === v.vno ? '●' : ''}</td>
                                  <td className="p-2">
                                    <div className="flex gap-1">
                                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                        Download
                                      </Button>
                                      {session.currentVno !== v.vno && (
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="h-auto p-0 text-xs"
                                          onClick={() => {
                                            const updated = setCurrentVersion(session, v.vno);
                                            if (updated) setSession(updated);
                                          }}
                                        >
                                          Set Current
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
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
                  {session.finalVersions?.length ? (
                    <li>• <strong>Final packet v{session.currentVno}</strong> (branded, signed, ready to print)</li>
                  ) : session.signedLetter ? (
                    <>
                      <li>• Review packet PDF with state execution summary</li>
                      <li>• Attorney review letter (signed)</li>
                      <li>• Execution checklist and instructions</li>
                      <li>• Document previews</li>
                    </>
                  ) : (
                    <li>• Pending attorney signature</li>
                  )}
                  {session.deliveredVno && session.currentVno !== session.deliveredVno && (
                    <li className="text-amber-600">⚠ Delivered v{session.deliveredVno}, but current is v{session.currentVno}</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Status: {session.status === 'delivered' ? 'Delivered' : 'Ready for Delivery'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.status === 'delivered' 
                      ? `Package v${session.deliveredVno || 'legacy'} has been delivered to family`
                      : session.finalVersions?.length
                      ? `Final packet v${session.currentVno} ready for delivery`
                      : 'Final packet creation required'
                    }
                  </p>
                </div>
                <Button 
                  onClick={handleDeliverPacket}
                  disabled={loading || (!session.finalVersions?.length && !session.signedLetter) || session.status === 'delivered'}
                >
                  {loading ? 'Delivering...' : `Deliver v${session.currentVno || 'legacy'} to Family`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}