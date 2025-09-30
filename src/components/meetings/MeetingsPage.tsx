import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImportMeetingModal } from '@/components/meetings/ImportMeetingModal';
import { Calendar, Users, FileText, Shield, ExternalLink, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { getFlag } from '@/config/flags';

// Mock data for meetings - in real app this would come from a database
const mockMeetings = [
  {
    id: '1',
    title: 'Q4 Portfolio Review',
    date: '2024-03-15',
    participants: ['John Smith', 'Sarah Johnson', 'Mike Chen'],
    summary: 'Reviewed portfolio performance and discussed rebalancing strategy for next quarter.',
    source: 'zocks',
    has_anchor: true,
    has_vault: true,
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Estate Planning Discussion',
    date: '2024-03-10',
    participants: ['Emily Davis', 'Robert Wilson'],
    summary: 'Discussed trust structures and beneficiary designations.',
    source: 'jump',
    has_anchor: false,
    has_vault: true,
    created_at: '2024-03-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Tax Strategy Meeting',
    date: '2024-03-08',
    participants: ['Lisa Brown', 'David Taylor'],
    summary: 'Reviewed tax-loss harvesting opportunities and Roth conversion strategies.',
    source: 'plain',
    has_anchor: true,
    has_vault: true,
    created_at: '2024-03-08T09:15:00Z'
  }
];

export default function MeetingsPage() {
  const handleImportComplete = () => {
    // In a real app, this would refetch the meetings data
    console.log('Meeting import completed, refreshing data...');
  };

  const openSummaryModal = (meeting: typeof mockMeetings[0]) => {
    // TODO: Implement summary modal
    console.log('Opening summary for meeting:', meeting.id);
  };

  const openVault = (meeting: typeof mockMeetings[0]) => {
    // TODO: Implement vault view
    console.log('Opening vault for meeting:', meeting.id);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'zocks': return 'bg-blue-100 text-blue-800';
      case 'jump': return 'bg-green-100 text-green-800';
      case 'plain': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Meetings | Meeting Summaries & Documentation</title>
        <meta name="description" content="Manage meeting summaries with cryptographic proof and vault storage" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Meetings</h1>
            <p className="text-muted-foreground">
              Import, summarize, and store meeting records with cryptographic proof
            </p>
          </div>
          <div className="flex gap-2">
            {getFlag('MEETING_IMPORT_ENABLED') && (
              <ImportMeetingModal onImportComplete={handleImportComplete} />
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{mockMeetings.length}</p>
                  <p className="text-xs text-muted-foreground">Total Meetings</p>
                </div>
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {mockMeetings.filter(m => m.has_anchor).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Anchored</p>
                </div>
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {mockMeetings.filter(m => m.has_vault).length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Vault</p>
                </div>
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(mockMeetings.flatMap(m => m.participants)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">Unique Participants</p>
                </div>
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Records</CardTitle>
            <CardDescription>
              Imported meetings with summaries, proof slips, and vault storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockMeetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No meetings yet</p>
                <p>Import your first meeting to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meeting</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Proof Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMeetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{meeting.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {meeting.summary}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(meeting.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {meeting.participants.slice(0, 2).map((participant, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {participant.split(' ')[0]}
                              </Badge>
                            ))}
                            {meeting.participants.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{meeting.participants.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSourceBadgeColor(meeting.source)}>
                            {meeting.source.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {meeting.has_vault && (
                              <Badge variant="outline" className="text-xs">
                                Vault ✓
                              </Badge>
                            )}
                            {meeting.has_anchor && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Anchored ✓
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openSummaryModal(meeting)}
                              className="h-8 px-2"
                            >
                              <Eye className="h-4 w-4" />
                              Summary
                            </Button>
                            {meeting.has_vault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openVault(meeting)}
                                className="h-8 px-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Vault
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cryptographic Proof</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vault Storage</span>
                <Badge variant="outline">14-day default</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PII Protection</span>
                <Badge variant="outline">Hash-only</Badge>
              </div>
              {getFlag('ANCHOR_ON_IMPORT') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blockchain Anchoring</span>
                  <Badge variant="outline" className="text-green-600">Enabled</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Supported Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Zocks Transcript JSON</span>
                <Badge variant="outline">✓ Supported</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jump Summary JSON</span>
                <Badge variant="outline">✓ Supported</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Plain Text/Markdown</span>
                <Badge variant="outline">✓ Supported</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Upload</span>
                <Badge variant="outline">.json, .txt, .md</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}