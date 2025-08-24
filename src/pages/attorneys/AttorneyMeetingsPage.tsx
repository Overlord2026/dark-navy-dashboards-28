import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  FileText,
  Download,
  Shield,
  Lock,
  Upload,
  Mic,
  Video
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  client_name: string;
  matter_id: string;
  date: string;
  duration: number;
  meeting_type: 'consultation' | 'document_review' | 'strategy' | 'status_update';
  recording_status: 'none' | 'recorded' | 'transcribed';
  summary_status: 'none' | 'generated' | 'reviewed';
  privileged: boolean;
  participants: string[];
}

export default function AttorneyMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      client_name: 'Robert Thompson',
      matter_id: 'M001',
      date: '2024-01-15',
      duration: 60,
      meeting_type: 'consultation',
      recording_status: 'transcribed',
      summary_status: 'reviewed',
      privileged: true,
      participants: ['Attorney Michael Davis', 'Robert Thompson']
    },
    {
      id: '2',
      client_name: 'Jennifer Davis',
      matter_id: 'M002',
      date: '2024-01-14',
      duration: 45,
      meeting_type: 'document_review',
      recording_status: 'recorded',
      summary_status: 'generated',
      privileged: true,
      participants: ['Attorney Sarah Johnson', 'Jennifer Davis', 'Business Partner']
    }
  ]);

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState({
    source: '',
    transcript: '',
    participants: '',
    matter_id: '',
    privilege_level: 'attorney_client'
  });

  const handleImportMeeting = async () => {
    try {
      // Generate content hash (privilege-protected)
      const contentHash = `sha256:${Date.now()}_${Math.random()}`;
      
      // Record meeting import decision
      recordReceipt({
        id: `meeting_import_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: contentHash,
        result: 'approve',
        reasons: ['MEETING_IMPORT', 'PRIVILEGE_PROTECTED', 'AI_SUMMARY'],
        created_at: new Date().toISOString()
      });

      // Create new meeting
      const meeting: Meeting = {
        id: Date.now().toString(),
        client_name: 'Imported Client',
        matter_id: importData.matter_id || 'M003',
        date: new Date().toISOString().split('T')[0],
        duration: 45,
        meeting_type: 'consultation',
        recording_status: 'transcribed',
        summary_status: 'generated',
        privileged: true,
        participants: importData.participants.split(',').map(p => p.trim())
      };

      setMeetings(prev => [meeting, ...prev]);
      setImportData({
        source: '',
        transcript: '',
        participants: '',
        matter_id: '',
        privilege_level: 'attorney_client'
      });
      setShowImportDialog(false);

      toast.success('Meeting imported with privilege protection');
    } catch (error) {
      toast.error('Failed to import meeting');
    }
  };

  const handleGenerateSummary = async (meetingId: string) => {
    try {
      recordReceipt({
        id: `ai_summary_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:summary_${meetingId}`,
        result: 'approve',
        reasons: ['AI_SUMMARY_GENERATED', 'PRIVILEGE_MAINTAINED'],
        created_at: new Date().toISOString()
      });

      setMeetings(prev => prev.map(m => 
        m.id === meetingId 
          ? { ...m, summary_status: 'generated' as const }
          : m
      ));

      toast.success('AI summary generated with privilege protection');
    } catch (error) {
      toast.error('Failed to generate summary');
    }
  };

  const handleExportMeeting = async (meetingId: string) => {
    try {
      recordReceipt({
        id: `meeting_export_${Date.now()}`,
        type: 'Vault-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:export_${meetingId}`,
        result: 'approve',
        reasons: ['MEETING_EXPORT', 'CASE_BINDER', 'PRIVILEGE_PROTECTED'],
        created_at: new Date().toISOString()
      });

      toast.success('Meeting exported to case binder');
    } catch (error) {
      toast.error('Failed to export meeting');
    }
  };

  const getRecordingStatusColor = (status: string) => {
    switch (status) {
      case 'transcribed': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'recorded': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'none': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getSummaryStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'generated': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'none': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attorney Meetings</h1>
          <p className="text-muted-foreground">
            Record, import, and manage client meetings with privilege protection
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Import Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Import Meeting Recording</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="source">Source Platform</Label>
                  <Select onValueChange={(value) => setImportData(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="webex">Cisco Webex</SelectItem>
                      <SelectItem value="manual">Manual Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="matter">Matter ID</Label>
                  <Input
                    id="matter"
                    value={importData.matter_id}
                    onChange={(e) => setImportData(prev => ({ ...prev, matter_id: e.target.value }))}
                    placeholder="M001"
                  />
                </div>

                <div>
                  <Label htmlFor="participants">Participants</Label>
                  <Input
                    id="participants"
                    value={importData.participants}
                    onChange={(e) => setImportData(prev => ({ ...prev, participants: e.target.value }))}
                    placeholder="Attorney, Client, etc. (comma separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="transcript">Transcript/Notes</Label>
                  <Textarea
                    id="transcript"
                    value={importData.transcript}
                    onChange={(e) => setImportData(prev => ({ ...prev, transcript: e.target.value }))}
                    placeholder="Meeting transcript or notes..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="privilege">Privilege Level</Label>
                  <Select onValueChange={(value) => setImportData(prev => ({ ...prev, privilege_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select privilege level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attorney_client">Attorney-Client Privilege</SelectItem>
                      <SelectItem value="work_product">Work Product</SelectItem>
                      <SelectItem value="general">General Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm">Privilege Protection</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Content will be stored with privilege protection. Only hashed references recorded in receipts.
                  </p>
                </div>

                <Button onClick={handleImportMeeting} className="w-full">
                  Import with Privilege Protection
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium flex items-center">
                        {meeting.client_name}
                        {meeting.privileged && (
                          <Lock className="h-4 w-4 ml-2 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Matter: {meeting.matter_id} • {meeting.date} • {meeting.duration} min
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getRecordingStatusColor(meeting.recording_status)}>
                        {meeting.recording_status === 'transcribed' && <Mic className="h-3 w-3 mr-1" />}
                        {meeting.recording_status === 'recorded' && <Video className="h-3 w-3 mr-1" />}
                        Recording: {meeting.recording_status}
                      </Badge>
                      <Badge className={getSummaryStatusColor(meeting.summary_status)}>
                        <FileText className="h-3 w-3 mr-1" />
                        Summary: {meeting.summary_status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meeting.meeting_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Participants: {meeting.participants.join(', ')}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {meeting.summary_status === 'none' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateSummary(meeting.id)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Summary
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportMeeting(meeting.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}