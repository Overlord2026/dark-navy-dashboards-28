import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Upload, Play, Download, Filter, Search, Clock, FileText } from 'lucide-react';

export default function RecordingsPage() {
  return (
    <>
      <Helmet>
        <title>Recording Management | Advisor Platform</title>
        <meta name="description" content="Manage call recordings, transcriptions, and compliance documentation for client meetings" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="w-6 h-6" />
              Recording Management
            </h1>
            <p className="text-muted-foreground">
              Manage call recordings, transcriptions, and compliance documentation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Recording
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Recordings</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transcribed</p>
                  <p className="text-2xl font-bold">144</p>
                </div>
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-2xl font-bold">45m</p>
                </div>
                <Play className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Recordings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by client name, meeting topic, or date..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <Button variant="outline">
                Advanced Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recordings List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Replace with actual recording management component */}
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mic className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Client Consultation - Smith Family</h3>
                    <p className="text-sm text-muted-foreground">Estate planning discussion • 52 minutes</p>
                    <p className="text-xs text-muted-foreground">Recorded on Dec 15, 2024 at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Transcribed</Badge>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Discovery Call - Johnson Trust</h3>
                    <p className="text-sm text-muted-foreground">Initial consultation • 38 minutes</p>
                    <p className="text-xs text-muted-foreground">Recorded on Dec 14, 2024 at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Processing</Badge>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Portfolio Review - Davis Family</h3>
                    <p className="text-sm text-muted-foreground">Quarterly review meeting • 45 minutes</p>
                    <p className="text-xs text-muted-foreground">Recorded on Dec 13, 2024 at 3:15 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Transcribed</Badge>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">
                Load More Recordings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Compliance Requirements</h3>
                <p className="text-sm text-blue-700 mt-1">
                  All client recordings are subject to regulatory requirements. Ensure proper consent is obtained before recording 
                  and maintain recordings according to your compliance policies. Contact your compliance officer for specific 
                  retention requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}