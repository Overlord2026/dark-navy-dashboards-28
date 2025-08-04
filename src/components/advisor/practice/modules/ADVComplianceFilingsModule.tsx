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
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  DownloadCloud,
  UploadCloud,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { useCelebration } from '@/hooks/useCelebration';
import { toast } from 'sonner';

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
  draft: { color: 'bg-muted-foreground', label: 'Draft', icon: Clock },
  pending: { color: 'bg-amber text-amber-foreground', label: 'Pending Review', icon: AlertTriangle },
  submitted: { color: 'bg-navy text-navy-foreground', label: 'Submitted', icon: UploadCloud },
  approved: { color: 'bg-emerald text-emerald-foreground', label: 'Approved', icon: CheckCircle },
  rejected: { color: 'bg-destructive text-destructive-foreground', label: 'Rejected', icon: XCircle },
  due_soon: { color: 'bg-amber text-amber-foreground', label: 'Due Soon', icon: Calendar }
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
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`);
    
    // Simulate successful filing submission to trigger celebration
    if (acceptedFiles.length > 0) {
      setTimeout(() => {
        triggerCelebration('success', 'Filing submitted on time! 🎉');
      }, 1000);
    }
  }, [triggerCelebration]);

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
      <Badge 
        variant="secondary" 
        className={cn("flex items-center gap-1 font-medium", config.color)}
        role="status"
        aria-label={`Filing status: ${config.label}`}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
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
    <div className="space-y-6" role="main" aria-label="ADV & Compliance Filings">
      <CelebrationComponent />
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ADV & Compliance Filings</h1>
          <p className="text-muted-foreground">Manage your regulatory filings and compliance documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="bg-navy hover:bg-navy/90 text-navy-foreground"
            aria-label="Add new compliance filing"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add New Filing
          </Button>
          <Button 
            variant="outline" 
            className="border-gold text-gold hover:bg-gold hover:text-gold-foreground"
            aria-label="Export filings data"
          >
            <DownloadCloud className="h-4 w-4 mr-2" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-navy">
            <UploadCloud className="h-5 w-5 text-emerald" aria-hidden="true" />
            Quick Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2",
              isDragActive ? "border-emerald bg-emerald/5" : "border-border hover:border-emerald/50"
            )}
            role="button"
            tabIndex={0}
            aria-label="File upload area - drag and drop files or click to select"
          >
            <input {...getInputProps()} aria-label="File selection input" />
            <UploadCloud className="h-8 w-8 mx-auto mb-4 text-emerald" aria-hidden="true" />
            {isDragActive ? (
              <p className="text-emerald font-medium">Drop your ADV PDFs and CE certificates here...</p>
            ) : (
              <div>
                <p className="text-foreground font-medium">Drag & drop your filing documents here</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Supports PDF, JPG, PNG files up to 10MB
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to browse files if drag & drop is not available
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="filings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger 
            value="filings" 
            className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
          >
            <ClipboardList className="h-4 w-4 mr-2" aria-hidden="true" />
            Active Filings
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-navy data-[state=active]:text-navy-foreground"
          >
            <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
            Document Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filings" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                  aria-hidden="true" 
                />
                <Input
                  placeholder="Search filings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-navy"
                  aria-label="Search filings by type or description"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter filings by status">
              {['all', 'due_soon', 'pending', 'submitted', 'approved'].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "capitalize",
                    activeFilter === filter ? "bg-navy hover:bg-navy/90 text-navy-foreground" : "border-navy text-navy hover:bg-navy hover:text-navy-foreground"
                  )}
                  aria-pressed={activeFilter === filter}
                >
                  {filter === 'all' ? 'All' : filter.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Filings Table */}
          <Card>
            <CardContent className="p-0">
              <Table role="table" aria-label="Compliance filings table">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Filing Type</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Due Date</TableHead>
                    <TableHead scope="col">Days Left</TableHead>
                    <TableHead scope="col">Last Updated</TableHead>
                    <TableHead scope="col">Actions</TableHead>
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
                            daysLeft <= 7 ? "text-destructive" : 
                            daysLeft <= 30 ? "text-amber" : "text-emerald"
                          )}
                          aria-label={daysLeft > 0 ? `${daysLeft} days remaining` : `${Math.abs(daysLeft)} days overdue`}
                          >
                            {daysLeft > 0 ? `${daysLeft} days` : `${Math.abs(daysLeft)} days overdue`}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(filing.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1" role="group" aria-label="Filing actions">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-navy/10 hover:text-navy"
                              aria-label={`View ${filing.type} details`}
                            >
                              <FileText className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-emerald/10 hover:text-emerald"
                              aria-label={`Download ${filing.type} document`}
                            >
                              <Download className="h-4 w-4" aria-hidden="true" />
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
              <CardTitle className="text-navy">
                <ShieldCheck className="h-5 w-5 inline mr-2 text-emerald" aria-hidden="true" />
                Download Template Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templateDocuments.map((template, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-emerald/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-navy" aria-hidden="true" />
                      <div>
                        <div className="font-medium text-foreground">{template.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {template.type} • {template.size}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-gold/10 hover:text-gold"
                      aria-label={`Download ${template.name}`}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Deadlines Alert */}
      <Card 
        className="border-amber bg-amber/5" 
        role="alert" 
        aria-labelledby="deadlines-heading"
      >
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle 
              className="h-5 w-5 text-amber mt-0.5 flex-shrink-0" 
              aria-hidden="true" 
            />
            <div className="flex-1">
              <h3 id="deadlines-heading" className="font-medium text-amber-foreground">
                Upcoming Deadlines
              </h3>
              <p className="text-sm text-amber-foreground/80 mt-1">
                You have 2 filings due within the next 30 days. Review and submit them to avoid penalties.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-gold text-gold hover:bg-gold hover:text-gold-foreground"
                aria-label="View upcoming deadline details"
              >
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}