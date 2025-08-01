import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  BarChart, 
  FileText, 
  Users,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Mail,
  Zap
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'action-needed' | 'pending-review' | 'up-to-date';
  lastActivity: string;
  documentsRequired: number;
  aiOpportunities: number;
  priority: 'high' | 'medium' | 'low';
  taxSavingsEstimate: number;
}

interface BatchActionsProps {
  clients: Client[];
}

interface BatchJob {
  id: string;
  type: 'document-request' | 'tax-analysis' | 'email-campaign' | 'report-generation';
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  clientCount: number;
  createdAt: string;
  completedAt?: string;
}

export function BatchActions({ clients }: BatchActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([
    {
      id: '1',
      type: 'tax-analysis',
      name: 'Q4 Tax Analysis - High Priority Clients',
      status: 'completed',
      progress: 100,
      clientCount: 12,
      createdAt: '2024-01-15',
      completedAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'document-request',
      name: 'Year-End Document Collection',
      status: 'running',
      progress: 75,
      clientCount: 8,
      createdAt: '2024-01-14'
    }
  ]);

  const batchActions = [
    {
      id: 'document-request',
      name: 'Request Documents from All Clients',
      description: 'Send document request emails to selected clients',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'tax-analysis',
      name: 'Run Batch Tax Analysis',
      description: 'Execute comprehensive tax analysis for selected clients',
      icon: BarChart,
      color: 'bg-green-500'
    },
    {
      id: 'email-campaign',
      name: 'Send Custom Email Campaign',
      description: 'Send personalized emails to selected clients',
      icon: Mail,
      color: 'bg-purple-500'
    },
    {
      id: 'report-generation',
      name: 'Generate Client Reports',
      description: 'Create PDF reports for all selected clients',
      icon: Download,
      color: 'bg-orange-500'
    }
  ];

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(c => c.id));
    }
  };

  const handleRunBatchAction = async () => {
    if (!selectedAction || selectedClients.length === 0) return;

    setIsRunningBatch(true);
    
    // Create new batch job
    const newJob: BatchJob = {
      id: Date.now().toString(),
      type: selectedAction as any,
      name: `${batchActions.find(a => a.id === selectedAction)?.name} - ${new Date().toLocaleDateString()}`,
      status: 'running',
      progress: 0,
      clientCount: selectedClients.length,
      createdAt: new Date().toISOString()
    };

    setBatchJobs(prev => [newJob, ...prev]);

    // Simulate batch processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBatchJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress: i } : job
      ));
    }

    // Complete the job
    setBatchJobs(prev => prev.map(job => 
      job.id === newJob.id 
        ? { ...job, status: 'completed', completedAt: new Date().toISOString() }
        : job
    ));

    setIsRunningBatch(false);
    setSelectedAction('');
    setSelectedClients([]);
    setEmailSubject('');
    setEmailContent('');
  };

  const getStatusIcon = (status: BatchJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BatchJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'running':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Action Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Operations</CardTitle>
          <CardDescription>
            Perform actions across multiple clients simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batchActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={action.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAction === action.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedAction(action.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{action.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Client Selection */}
          {selectedAction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Select Clients</h4>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedClients.length === clients.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4">
                <div className="grid grid-cols-1 gap-2">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleClientToggle(client.id)}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{client.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({client.email})
                        </span>
                      </div>
                      <Badge variant={
                        client.status === 'action-needed' ? 'destructive' :
                        client.status === 'pending-review' ? 'secondary' : 'default'
                      }>
                        {client.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Email Fields */}
              {selectedAction === 'email-campaign' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Subject</label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Content</label>
                    <Textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Enter email content..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {selectedClients.length} clients selected
                </div>
                <Button 
                  onClick={handleRunBatchAction}
                  disabled={selectedClients.length === 0 || isRunningBatch}
                  className="flex items-center gap-2"
                >
                  {isRunningBatch ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Execute Batch Action
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Batch Job History */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Job History</CardTitle>
          <CardDescription>
            Track the status of your batch operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batchJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <h4 className="font-medium">{job.name}</h4>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {job.clientCount} clients • Created {new Date(job.createdAt).toLocaleDateString()}
                      {job.completedAt && ` • Completed ${new Date(job.completedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
                {job.status === 'running' && (
                  <div className="mt-3">
                    <Progress value={job.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {job.progress}% complete
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}