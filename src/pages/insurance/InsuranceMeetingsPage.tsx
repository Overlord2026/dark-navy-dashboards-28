import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, FileText, Upload, Play, Square, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const InsuranceMeetingsPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [disclaimerRead, setDisclaimerRead] = useState(false);

  const handleStartRecording = () => {
    if (!disclaimerRead) {
      toast.error("Please confirm disclaimers were read aloud before starting recording");
      return;
    }
    
    setIsRecording(true);
    // Track analytics
    console.log('[Analytics] call.record.start', { disclaimer_read: disclaimerRead });
    toast.success("Call recording started with compliance tracking");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Track analytics
    console.log('[Analytics] call.record.stop');
    toast.success("Call recording stopped, processing for vault storage");
  };

  const handleImportMeeting = () => {
    // Track analytics
    console.log('[Analytics] meeting.import.start');
    toast.success("Meeting import initiated");
  };

  const callHistory = [
    {
      id: '1',
      date: '2024-12-20',
      client: 'Patricia Wilson',
      type: 'Medicare Needs Analysis',
      duration: '32 min',
      status: 'completed',
      hasTranscript: true,
      hasVault: true,
      hasAnchor: true
    },
    {
      id: '2', 
      date: '2024-12-19',
      client: 'Robert Smith',
      type: 'Annual Enrollment',
      duration: '28 min',
      status: 'completed',
      hasTranscript: true,
      hasVault: true,
      hasAnchor: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Insurance Meetings</h1>
        <Button onClick={handleImportMeeting} variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Meeting
        </Button>
      </div>

      <Tabs defaultValue="calls" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calls">Call Recording</TabsTrigger>
          <TabsTrigger value="history">Call History</TabsTrigger>
          <TabsTrigger value="summaries">AI Summaries</TabsTrigger>
        </TabsList>

        <TabsContent value="calls">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Medicare Call Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Disclaimer Banner */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4">
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                    Required Disclaimer - Read Aloud Before Recording
                  </p>
                  <div className="text-amber-700 dark:text-amber-300 space-y-1 mb-3">
                    <p>"This call may be recorded for quality and training purposes."</p>
                    <p>"We do not offer every plan available in your area. Any information we provide is limited to the plans we do offer."</p>
                    <p>"Please contact Medicare.gov or 1-800-MEDICARE for information on all your options."</p>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={disclaimerRead}
                      onChange={(e) => setDisclaimerRead(e.target.checked)}
                    />
                    <span className="text-sm font-medium">Disclaimers read aloud to beneficiary</span>
                  </label>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                {!isRecording ? (
                  <Button 
                    onClick={handleStartRecording}
                    disabled={!disclaimerRead}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopRecording}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
                
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Recording in progress...</span>
                  </div>
                )}
              </div>

              {/* Current Call Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">Patricia Wilson</p>
                    <p className="text-sm text-muted-foreground">Medicare Supplement Review</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">SOA Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-green-600">
                      ✓ On File
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Retention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">
                      10 Year WORM
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Artifacts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callHistory.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>{call.date}</TableCell>
                      <TableCell className="font-medium">{call.client}</TableCell>
                      <TableCell>{call.type}</TableCell>
                      <TableCell>{call.duration}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {call.hasTranscript && (
                            <Badge variant="outline" className="text-xs">T</Badge>
                          )}
                          {call.hasVault && (
                            <Badge variant="outline" className="text-xs">V</Badge>
                          )}
                          {call.hasAnchor && (
                            <Badge variant="outline" className="text-xs">A</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries">
          <Card>
            <CardHeader>
              <CardTitle>AI Meeting Summaries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Patricia Wilson - Medicare Needs Analysis</h4>
                    <Badge variant="outline">Dec 20, 2024</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive Medicare supplement review discussing current coverage gaps and available options.
                  </p>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Action Items:</strong>
                      <ul className="list-disc list-inside ml-2 text-muted-foreground">
                        <li>Prepare Medicare Supplement illustrations</li>
                        <li>Schedule PECL completion meeting</li>
                        <li>Review current plan benefits</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Risk Factors:</strong>
                      <ul className="list-disc list-inside ml-2 text-muted-foreground">
                        <li>Current coverage has significant gaps</li>
                        <li>Approaching 65th birthday - time sensitive</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};