import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Play, 
  Square, 
  Upload,
  FileText,
  Download,
  Mic,
  MicOff
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { emitReceipt } from '@/lib/analytics';

interface Meeting {
  id: string;
  clientName: string;
  date: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  hasRecording: boolean;
  hasSummary: boolean;
  hasAnchor: boolean;
}

export function AdvisorMeetingsPage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState({
    clientName: '',
    meetingDate: '',
    transcript: '',
    platform: 'zoom'
  });

  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      date: '2024-01-15 10:00 AM',
      duration: '45 min',
      status: 'completed',
      hasRecording: true,
      hasSummary: true,
      hasAnchor: true
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      date: '2024-01-14 2:00 PM',
      duration: '30 min',
      status: 'completed',
      hasRecording: true,
      hasSummary: true,
      hasAnchor: false
    },
    {
      id: '3',
      clientName: 'Emily Rodriguez',
      date: '2024-01-16 11:00 AM',
      duration: '60 min',
      status: 'scheduled',
      hasRecording: false,
      hasSummary: false,
      hasAnchor: false
    }
  ]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    
    try {
      await emitReceipt({
        type: 'Call-RDS',
        action: 'call.record.start',
        timestamp: new Date().toISOString(),
        recordingType: 'live'
      });

      toast({
        title: "Recording Started",
        description: "Meeting recording has begun"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    
    try {
      // Emit stop receipt
      await emitReceipt({
        type: 'Call-RDS',
        action: 'call.record.stop',
        timestamp: new Date().toISOString(),
        duration: '45 minutes'
      });

      // Generate AI summary
      await emitReceipt({
        type: 'Decision-RDS',
        action: 'meeting.summary.generated',
        summaryType: 'AI_generated',
        clientName: 'Current Client'
      });

      // Vault the recording
      await emitReceipt({
        type: 'Vault-RDS',
        action: 'recording.vaulted',
        documentType: 'meeting_recording',
        keepSafe: true
      });

      toast({
        title: "Recording Completed",
        description: "Recording stopped, AI summary generated, and content vaulted"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to process recording",
        variant: "destructive"
      });
    }
  };

  const handleImportMeeting = async () => {
    if (!importData.clientName || !importData.meetingDate || !importData.transcript) {
      toast({
        title: "Validation Error",
        description: "Client name, date, and transcript are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate AI summary from transcript
      await emitReceipt({
        type: 'Decision-RDS',
        action: 'meeting.summary.generated',
        summaryType: 'AI_from_transcript',
        clientName: importData.clientName,
        platform: importData.platform
      });

      // Vault the transcript and summary
      await emitReceipt({
        type: 'Vault-RDS',
        action: 'transcript.vaulted',
        documentType: 'meeting_transcript',
        platform: importData.platform,
        keepSafe: true
      });

      // Optional anchor batch
      const anchorEnabled = false; // Feature flag
      if (anchorEnabled) {
        await emitReceipt({
          type: 'Anchor-RDS',
          action: 'meeting.anchored',
          meetingId: 'imported-' + Date.now(),
          batchProcess: true
        });
      }

      toast({
        title: "Meeting Imported",
        description: "Transcript processed, AI summary generated, and content vaulted"
      });

      setIsImportOpen(false);
      setImportData({
        clientName: '',
        meetingDate: '',
        transcript: '',
        platform: 'zoom'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import meeting",
        variant: "destructive"
      });
    }
  };

  const handleExportSummary = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    // Generate PDF content
    const pdfContent = `
Meeting Summary - ${meeting.clientName}
Date: ${meeting.date}
Duration: ${meeting.duration}

Key Discussion Points:
- Retirement planning objectives
- Risk tolerance assessment  
- Investment allocation review
- Action items for next meeting

This summary was generated using AI and is stored in Keep-Safe vault.
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${meeting.clientName}-${meeting.date}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Meeting summary PDF downloaded"
    });
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'in-progress': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meeting Management</h1>
          <p className="text-muted-foreground">Record, import, and manage client meetings</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Import Meeting Recording</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={importData.clientName}
                    onChange={(e) => setImportData({ ...importData, clientName: e.target.value })}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="meetingDate">Meeting Date *</Label>
                  <Input
                    id="meetingDate"
                    type="datetime-local"
                    value={importData.meetingDate}
                    onChange={(e) => setImportData({ ...importData, meetingDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={importData.platform} onValueChange={(value) => setImportData({ ...importData, platform: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="webex">Cisco Webex</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transcript">Transcript/Notes *</Label>
                  <Textarea
                    id="transcript"
                    value={importData.transcript}
                    onChange={(e) => setImportData({ ...importData, transcript: e.target.value })}
                    placeholder="Paste meeting transcript or detailed notes..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleImportMeeting} className="w-full">
                  Import & Process
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {!isRecording ? (
            <Button onClick={handleStartRecording}>
              <Play className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
          ) : (
            <Button onClick={handleStopRecording} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>
      </div>

      {/* Live Recording Status */}
      {isRecording && (
        <Card className="rounded-2xl shadow-sm border-red-200 bg-red-50 p-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <Mic className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium text-red-700">Recording in progress...</span>
              <span className="text-sm text-red-600">AI summary will be generated automatically</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meetings List */}
      <Card className="rounded-2xl shadow-sm border p-6 md:p-8">
        <CardHeader>
          <CardTitle className="text-xl">Recent Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <h3 className="font-medium">{meeting.clientName}</h3>
                    <p className="text-sm text-muted-foreground">{meeting.date} • {meeting.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                    {meeting.hasRecording && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Recorded
                      </Badge>
                    )}
                    {meeting.hasSummary && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        AI Summary
                      </Badge>
                    )}
                    {meeting.hasAnchor && (
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        Anchored ✓
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.hasSummary && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportSummary(meeting.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}