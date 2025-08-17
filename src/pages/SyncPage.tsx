import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  RefreshCw as SyncIcon, 
  Copy, 
  FileText, 
  ClipboardList,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SyncPage = () => {
  const [syncData, setSyncData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    docName: 'Family Office Marketplace',
    link: 'https://project.lovable.app',
    owner: 'CTO',
    status: 'In Progress',
    customNotes: ''
  });
  const { toast } = useToast();

  const generateSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setSyncData(data);
      toast({
        title: "HQ Sync Generated",
        description: "Copy-paste blocks ready for HQ tracker",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate HQ sync",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6 space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">HQ Sync Generator</h1>
        <p className="text-muted-foreground">
          Generate paste-ready updates for HQ Tracker & Decisions Log
        </p>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SyncIcon className="w-5 h-5" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="docName">Document Name</Label>
              <Input
                id="docName"
                value={formData.docName}
                onChange={(e) => handleInputChange('docName', e.target.value)}
                placeholder="Family Office Marketplace"
              />
            </div>
            <div>
              <Label htmlFor="link">Project Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                placeholder="https://project.lovable.app"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Select value={formData.owner} onValueChange={(value) => handleInputChange('owner', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CTO">CTO</SelectItem>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Engineering Lead">Engineering Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="customNotes">Custom Notes (Optional)</Label>
            <Textarea
              id="customNotes"
              value={formData.customNotes}
              onChange={(e) => handleInputChange('customNotes', e.target.value)}
              placeholder="Add any custom notes for this update..."
              rows={3}
            />
          </div>

          <Button 
            onClick={generateSync}
            disabled={isLoading}
            className="w-full"
          >
            <SyncIcon className="w-4 h-4 mr-2" />
            {isLoading ? 'Generating...' : 'Generate HQ Sync'}
          </Button>
        </CardContent>
      </Card>

      {syncData && (
        <div className="space-y-6">
          {/* Project Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Project Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {syncData.metrics.features.percentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">Features Complete</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {syncData.metrics.testing.e2eTests}
                  </div>
                  <p className="text-sm text-muted-foreground">E2E Test Suites</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {syncData.metrics.testing.performanceScore}
                  </div>
                  <p className="text-sm text-muted-foreground">Performance Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {syncData.metrics.technical.testCoverage}
                  </div>
                  <p className="text-sm text-muted-foreground">Test Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HQ Tracker Update */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  HQ Tracker Update
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(syncData.hqTrackerUpdate, 'HQ Tracker Update')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {syncData.hqTrackerUpdate}
              </pre>
            </CardContent>
          </Card>

          {/* Decisions Log Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Decisions Log Entry
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(syncData.decisionsLogEntry, 'Decisions Log Entry')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {syncData.decisionsLogEntry}
              </pre>
            </CardContent>
          </Card>

          {/* Quick Copy Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Copy Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => copyToClipboard(syncData.copyPaste.tracker, 'Tracker Update')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4" />
                    <span className="font-semibold">Copy Tracker Update</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Paste into HQ project tracker spreadsheet
                  </p>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start"
                  onClick={() => copyToClipboard(syncData.copyPaste.decisions, 'Decisions Log')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-semibold">Copy Decisions Log</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Paste into technical decisions documentation
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Generated for Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Project:</span> {syncData.project.name}
                  </div>
                  <div>
                    <span className="font-semibold">Owner:</span> {syncData.project.owner}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Status:</span> {syncData.project.status}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Link:</span> 
                    <a 
                      href={syncData.project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Project URL <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default SyncPage;