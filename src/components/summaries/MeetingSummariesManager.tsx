import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Target, 
  ArrowRight,
  Lightbulb,
  Calendar,
  User,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface MeetingSummary {
  id: string;
  meeting_recording_id: string;
  transcription: string;
  summary: string;
  action_items: Array<{
    item: string;
    assignee?: string;
    dueDate?: string;
    priority: string;
  }>;
  key_decisions: Array<{
    decision: string;
    rationale?: string;
    impact?: string;
  }>;
  next_steps: Array<{
    step: string;
    timeline?: string;
    owner?: string;
  }>;
  participants: Array<{
    name: string;
    role?: string;
  }>;
  confidence_score: number;
  processing_status: string;
  error_message?: string;
  created_at: string;
  meeting_recordings?: {
    metadata: any;
    created_at: string;
    duration_seconds: number;
  };
}

export function MeetingSummariesManager() {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<MeetingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingRecordings, setProcessingRecordings] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchSummaries();
    }
  }, [user]);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('meeting_summaries')
        .select(`
          *,
          meeting_recordings (
            metadata,
            created_at,
            duration_seconds
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSummaries(data || []);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast.error('Failed to load meeting summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRecording = async (recordingId: string) => {
    try {
      setProcessingRecordings(prev => [...prev, recordingId]);
      
      const { error } = await supabase.functions.invoke('process-meeting-summary', {
        body: {
          recording_id: recordingId,
          user_id: user?.id
        }
      });

      if (error) throw error;
      
      toast.success('Meeting summary processing started');
      
      // Refresh summaries after a delay to show the new processing status
      setTimeout(() => {
        fetchSummaries();
      }, 2000);
      
    } catch (error) {
      console.error('Error processing meeting summary:', error);
      toast.error('Failed to start summary processing');
    } finally {
      setProcessingRecordings(prev => prev.filter(id => id !== recordingId));
    }
  };

  const getMeetingTitle = (summary: MeetingSummary) => {
    return summary.meeting_recordings?.metadata?.meeting_title ||
           summary.meeting_recordings?.metadata?.meeting_topic ||
           'Meeting Summary';
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const filteredSummaries = summaries.filter(summary =>
    getMeetingTitle(summary).toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading meeting summaries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meeting Summaries</h2>
          <p className="text-muted-foreground">AI-powered meeting analysis and action items</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Label htmlFor="search">Search summaries</Label>
          <Input
            id="search"
            placeholder="Search by meeting title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredSummaries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No summaries found</h3>
                <p className="text-muted-foreground">
                  Meeting summaries will appear here automatically after your video meetings are processed.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((summary) => (
            <Card key={summary.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {getMeetingTitle(summary)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(summary.meeting_recordings?.created_at || summary.created_at).toLocaleDateString()}
                      </span>
                      {summary.meeting_recordings?.duration_seconds && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(summary.meeting_recordings.duration_seconds)}
                        </span>
                      )}
                      {summary.confidence_score && (
                        <span className="text-sm text-muted-foreground">
                          Confidence: {Math.round(summary.confidence_score * 100)}%
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(summary.processing_status)}
                    <Badge variant={summary.processing_status === 'completed' ? 'default' : 'secondary'}>
                      {summary.processing_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              {summary.processing_status === 'completed' && (
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      Summary
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {summary.summary}
                    </p>
                  </div>

                  {/* Action Items */}
                  {summary.action_items && summary.action_items.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4" />
                        Action Items ({summary.action_items.length})
                      </h4>
                      <div className="space-y-2">
                        {summary.action_items.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.item}</p>
                              <div className="flex items-center gap-3 mt-1">
                                {item.assignee && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    {item.assignee}
                                  </span>
                                )}
                                {item.dueDate && (
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {item.dueDate}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge className={getPriorityColor(item.priority)} variant="outline">
                              {item.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Decisions */}
                  {summary.key_decisions && summary.key_decisions.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                        <Lightbulb className="h-4 w-4" />
                        Key Decisions ({summary.key_decisions.length})
                      </h4>
                      <div className="space-y-2">
                        {summary.key_decisions.map((decision, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-sm text-blue-900">{decision.decision}</p>
                            {decision.rationale && (
                              <p className="text-xs text-blue-700 mt-1">
                                <strong>Rationale:</strong> {decision.rationale}
                              </p>
                            )}
                            {decision.impact && (
                              <p className="text-xs text-blue-700 mt-1">
                                <strong>Impact:</strong> {decision.impact}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  {summary.next_steps && summary.next_steps.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                        <ArrowRight className="h-4 w-4" />
                        Next Steps ({summary.next_steps.length})
                      </h4>
                      <div className="space-y-2">
                        {summary.next_steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-green-900">{step.step}</p>
                              <div className="flex items-center gap-3 mt-1">
                                {step.owner && (
                                  <span className="flex items-center gap-1 text-xs text-green-700">
                                    <User className="h-3 w-3" />
                                    {step.owner}
                                  </span>
                                )}
                                {step.timeline && (
                                  <span className="flex items-center gap-1 text-xs text-green-700">
                                    <Clock className="h-3 w-3" />
                                    {step.timeline}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  {summary.participants && summary.participants.length > 0 && (
                    <div>
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" />
                        Participants ({summary.participants.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {summary.participants.map((participant, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {participant.name}
                            {participant.role && ` - ${participant.role}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}

              {summary.processing_status === 'failed' && summary.error_message && (
                <CardContent>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      <strong>Processing failed:</strong> {summary.error_message}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleProcessRecording(summary.meeting_recording_id)}
                      disabled={processingRecordings.includes(summary.meeting_recording_id)}
                    >
                      {processingRecordings.includes(summary.meeting_recording_id) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        'Retry Processing'
                      )}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}