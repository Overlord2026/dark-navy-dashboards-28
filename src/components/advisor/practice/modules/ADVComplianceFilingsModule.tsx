import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Upload, 
  Download, 
  Filter, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  DownloadCloud,
  Upload as UploadIcon
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface Filing {
  id: string;
  type: 'ADV Part 1' | 'ADV Part 2' | 'Form U4' | 'Annual Update' | 'CE Certificate';
  status: 'draft' | 'pending' | 'submitted' | 'approved' | 'rejected' | 'due_soon';
  dueDate: string;
  lastUpdated: string;
  description: string;
  filingYear: number;
}

const mockFilings: Filing[] = [
  {
    id: '1',
    type: 'ADV Part 1',
    status: 'due_soon',
    dueDate: '2024-03-15',
    lastUpdated: '2024-02-10',
    description: 'Annual Update - Investment Adviser Registration',
    filingYear: 2024
  },
  {
    id: '2',
    type: 'ADV Part 2',
    status: 'pending',
    dueDate: '2024-03-15',
    lastUpdated: '2024-02-08',
    description: 'Brochure and Supplement Updates',
    filingYear: 2024
  },
  {
    id: '3',
    type: 'CE Certificate',
    status: 'submitted',
    dueDate: '2024-01-31',
    lastUpdated: '2024-01-15',
    description: 'Continuing Education Requirement',
    filingYear: 2024
  },
  {
    id: '4',
    type: 'Form U4',
    status: 'approved',
    dueDate: '2024-01-15',
    lastUpdated: '2024-01-10',
    description: 'Uniform Application for Securities Industry Registration',
    filingYear: 2024
  }
];

const statusConfig = {
  draft: { color: 'bg-gray-500', label: 'Draft', icon: Clock },
  pending: { color: 'bg-orange-500', label: 'Pending Review', icon: AlertCircle },
  submitted: { color: 'bg-blue-500', label: 'Submitted', icon: Upload },
  approved: { color: 'bg-green-500', label: 'Approved', icon: CheckCircle },
  rejected: { color: 'bg-red-500', label: 'Rejected', icon: XCircle },
  due_soon: { color: 'bg-amber-500', label: 'Due Soon', icon: Calendar }
};

const templateDocuments = [
  { name: 'ADV Part 1 Template', type: 'PDF', size: '2.4 MB' },
  { name: 'ADV Part 2 Template', type: 'PDF', size: '1.8 MB' },
  { name: 'Form U4 Template', type: 'PDF', size: '1.2 MB' },
  { name: 'CE Certificate Form', type: 'PDF', size: '0.8 MB' },
  { name: 'Annual Update Checklist', type: 'PDF', size: '0.5 MB' }
];

export function ADVComplianceFilingsModule() {
  const [filings, setFilings] = useState<Filing[]>(mockFilings);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    // Handle file upload logic here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  });

  const filteredFilings = filings.filter(filing => {
    const matchesFilter = activeFilter === 'all' || filing.status === activeFilter;
    const matchesSearch = filing.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         filing.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatusBadge = ({ status }: { status: Filing['status'] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant="secondary" className={cn("text-white", config.color)}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ADV & Compliance Filings</h2>
          <p className="text-muted-foreground">Manage your regulatory filings and compliance documents</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Filing
          </Button>
          <Button variant="outline">
            <DownloadCloud className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            Quick Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary">Drop your ADV PDFs and CE certificates here...</p>
            ) : (
              <div>
                <p className="text-foreground font-medium">Drag & drop your filing documents here</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Supports PDF, JPG, PNG files up to 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="filings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="filings">Active Filings</TabsTrigger>
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="filings" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search filings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'due_soon', 'pending', 'submitted', 'approved'].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className="capitalize"
                >
                  {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Filings Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filing Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFilings.map((filing) => {
                    const daysLeft = getDaysUntilDue(filing.dueDate);
                    return (
                      <TableRow key={filing.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{filing.type}</div>
                            <div className="text-sm text-muted-foreground">{filing.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={filing.status} />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(filing.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "text-sm font-medium",
                            daysLeft <= 7 ? "text-red-600" : 
                            daysLeft <= 30 ? "text-amber-600" : "text-green-600"
                          )}>
                            {daysLeft > 0 ? `${daysLeft} days` : `${Math.abs(daysLeft)} days overdue`}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(filing.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Template Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templateDocuments.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {template.type} • {template.size}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Deadlines Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900">Upcoming Deadlines</h3>
              <p className="text-sm text-amber-700 mt-1">
                You have 2 filings due within the next 30 days. Review and submit them to avoid penalties.
              </p>
              <Button variant="outline" size="sm" className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}