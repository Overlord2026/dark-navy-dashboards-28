/**
 * Notary Console - Commissioned notary interface
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Video, 
  Clock, 
  User, 
  Shield, 
  Download, 
  Settings,
  CheckCircle,
  AlertCircle,
  Camera,
  Mic,
  Upload,
  Stamp
} from 'lucide-react';
import { recordDecisionRDS } from '@/lib/rds';
import { applyPdfSealAndTimestamp } from '@/features/notary/tamper/timestamp';
import { SealPreview } from '@/features/notary/components/SealPreview';
import { useToast } from '@/hooks/use-toast';

// Mock data - in production, fetch from API
const mockSessions = [
  {
    id: 'notary_1734567890_abc123',
    docName: 'Power of Attorney',
    signerName: 'John Doe',
    signerEmail: 'john@example.com',
    state: 'FL',
    mode: 'RON',
    status: 'scheduled',
    scheduledAt: '2024-01-15T14:00:00Z',
    witnessCount: 1,
    fees: { amount: 25, currency: 'USD' }
  },
  {
    id: 'notary_1734567891_def456',
    docName: 'Real Estate Deed',
    signerName: 'Jane Smith',
    signerEmail: 'jane@example.com',
    state: 'TX',
    mode: 'IN_PERSON',
    status: 'in_progress',
    scheduledAt: '2024-01-15T10:00:00Z',
    witnessCount: 2,
    fees: { amount: 35, currency: 'USD' }
  }
];

const mockProfile = {
  name: 'Sarah Johnson',
  commissionNumber: 'FL-123456789',
  jurisdiction: 'Florida',
  expiresAt: '2025-12-31',
  sealImageUrl: null,
  defaultFees: { ron: 25, inPerson: 15, witnessPerPerson: 10 }
};

export default function NotaryConsole() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('queue');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [profile, setProfile] = useState(mockProfile);
  const [sessions] = useState(mockSessions);

  const handleStartSession = async (sessionId: string) => {
    try {
      recordDecisionRDS({
        action: 'notary.start',
        sessionId,
        state: 'FL', // Get from session
        mode: 'RON', // Get from session
        reasons: ['session_started', 'notary_present', 'identity_verified'],
        result: 'approve',
        metadata: { notaryId: 'current_user_id', startedAt: new Date().toISOString() }
      });
      
      setActiveSession(sessionId);
      setActiveTab('live-session');
      
      toast({
        title: "Session Started",
        description: "RON session is now active. Recording has begun."
      });
    } catch (error) {
      toast({
        title: "Failed to Start Session",
        description: "Unable to initialize notarization session",
        variant: "destructive"
      });
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      // Mock PDF bytes for demo
      const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // PDF header
      
      // Apply premium brand seal and timestamp
      const sealResult = await applyPdfSealAndTimestamp(mockPdfBytes, {
        sealFormat: 'image',
        notary: {
          name: profile.name,
          commission: profile.commissionNumber,
          jurisdiction: profile.jurisdiction,
          expires: profile.expiresAt,
          county: 'Demo County'
        },
        enableLTV: true
      });
      
      // Record completion with hash
      recordDecisionRDS({
        action: 'notary.complete',
        sessionId,
        state: 'FL',
        mode: 'RON',
        reasons: ['session_completed', 'document_notarized', 'seal_applied', sealResult.sha256],
        result: 'approve',
        metadata: { 
          notaryId: 'current_user_id', 
          completedAt: new Date().toISOString(),
          documentsSealed: 1,
          sealHash: sealResult.sha256,
          ltvEnabled: sealResult.ltv
        }
      });
      
      setActiveSession(null);
      
      toast({
        title: "Session Completed",
        description: `Document notarized and sealed with hash: ${sealResult.sha256.slice(0, 16)}...`
      });
    } catch (error) {
      toast({
        title: "Failed to Complete Session",
        description: "Unable to finalize notarization",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Notary Console</h1>
          <p className="text-muted-foreground">
            Commission: {profile.commissionNumber} • Expires: {profile.expiresAt}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="live-session" disabled={!activeSession}>Live Session</TabsTrigger>
            <TabsTrigger value="journal">eJournal</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Session Queue */}
          <TabsContent value="queue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Assigned Sessions
                </CardTitle>
                <CardDescription>
                  Sessions scheduled for notarization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{session.signerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{session.docName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {session.signerName} • {session.signerEmail}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={session.mode === 'RON' ? 'default' : 'secondary'}>
                              {session.mode}
                            </Badge>
                            <Badge variant="outline">{session.state}</Badge>
                            {session.witnessCount > 0 && (
                              <Badge variant="outline">{session.witnessCount} witnesses</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.scheduledAt).toLocaleString()}
                        </p>
                        <p className="font-medium">${session.fees.amount}</p>
                        <div className="flex gap-2">
                          {session.status === 'scheduled' && (
                            <Button size="sm" onClick={() => handleStartSession(session.id)}>
                              Start Session
                            </Button>
                          )}
                          {session.status === 'in_progress' && (
                            <Button size="sm" variant="outline" onClick={() => setActiveSession(session.id)}>
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No sessions currently assigned
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Session Room */}
          <TabsContent value="live-session" className="space-y-4">
            {activeSession ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Conference */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Live Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Video conference active</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" size="sm">
                        <Mic className="h-4 w-4 mr-2" />
                        Mute
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Video
                      </Button>
                      <Button variant="destructive" size="sm">
                        End Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Session Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Identity Verification Status */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Identity Verification</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">KBA (5 questions)</span>
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passed
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">ID Document Scan</span>
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Liveness Check</span>
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passed
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Document Review */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Document Review</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Power of Attorney</span>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Seal Application */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Notarization</h4>
                      <Button 
                        className="w-full" 
                        onClick={() => handleCompleteSession(activeSession)}
                      >
                        <Stamp className="h-4 w-4 mr-2" />
                        Apply Seal & Complete
                      </Button>
                    </div>

                    {/* Journal Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="sessionNotes">Journal Notes</Label>
                      <Textarea
                        id="sessionNotes"
                        placeholder="Additional notes for journal entry..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Active Session</h3>
                  <p className="text-muted-foreground">Start a session from the queue to access live controls</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* eJournal */}
          <TabsContent value="journal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Electronic Journal
                </CardTitle>
                <CardDescription>
                  Record of all notarization activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Search entries..." className="w-64" />
                    <Button variant="outline">Filter</Button>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {/* Mock journal entries */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Power of Attorney</h4>
                        <p className="text-sm text-muted-foreground">John Doe • 2024-01-15 2:30 PM</p>
                        <p className="text-sm">Acknowledgment • FL • RON • 1 witness</p>
                      </div>
                      <Badge>Completed</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Real Estate Deed</h4>
                        <p className="text-sm text-muted-foreground">Jane Smith • 2024-01-14 10:15 AM</p>
                        <p className="text-sm">Acknowledgment • TX • In-Person • 2 witnesses</p>
                      </div>
                      <Badge>Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Management */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Commission Profile
                </CardTitle>
                <CardDescription>
                  Manage your notary commission and seal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Number</Label>
                    <Input value={profile.commissionNumber} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Jurisdiction</Label>
                    <Input value={profile.jurisdiction} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Expires</Label>
                    <Input value={profile.expiresAt} readOnly />
                  </div>
                </div>

                {/* Seal Management */}
                <div className="space-y-2">
                  <Label>Notary Seal</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    {profile.sealImageUrl ? (
                      <img src={profile.sealImageUrl} alt="Notary Seal" className="mx-auto h-32" />
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload your official notary seal</p>
                        <Button variant="outline" className="mt-2">
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seal Preview */}
                <SealPreview 
                  notaryInfo={{
                    name: profile.name,
                    commission: profile.commissionNumber,
                    jurisdiction: profile.jurisdiction,
                    expires: profile.expiresAt,
                    county: 'Demo County'
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notary Settings
                </CardTitle>
                <CardDescription>
                  Configure fees and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Default Fees</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Remote Online Notarization</Label>
                      <Input 
                        type="number" 
                        value={profile.defaultFees.ron}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          defaultFees: { ...prev.defaultFees, ron: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>In-Person Notarization</Label>
                      <Input 
                        type="number" 
                        value={profile.defaultFees.inPerson}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          defaultFees: { ...prev.defaultFees, inPerson: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Per Witness</Label>
                      <Input 
                        type="number" 
                        value={profile.defaultFees.witnessPerPerson}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          defaultFees: { ...prev.defaultFees, witnessPerPerson: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}