import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Lock, 
  Clock,
  Eye,
  Shield
} from 'lucide-react';

export const ComplianceDocumentVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    {
      id: 1,
      name: 'Form ADV Part 2A - 2024',
      type: 'SEC Filing',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      status: 'current',
      retentionPeriod: '7 years',
      confidentiality: 'confidential',
      lastAccessed: '2024-01-20'
    },
    {
      id: 2,
      name: 'Privacy Policy - CCPA Compliant',
      type: 'Policy Document',
      uploadDate: '2024-01-10',
      size: '1.2 MB',
      status: 'current',
      retentionPeriod: '3 years',
      confidentiality: 'public',
      lastAccessed: '2024-01-18'
    },
    {
      id: 3,
      name: 'AML Training Records Q4 2023',
      type: 'Training Record',
      uploadDate: '2023-12-31',
      size: '5.6 MB',
      status: 'archived',
      retentionPeriod: '5 years',
      confidentiality: 'internal',
      lastAccessed: '2024-01-05'
    },
    {
      id: 4,
      name: 'Client Complaint Log 2023',
      type: 'Audit Record',
      uploadDate: '2023-12-31',
      size: '890 KB',
      status: 'current',
      retentionPeriod: '7 years',
      confidentiality: 'confidential',
      lastAccessed: '2024-01-12'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge variant="default">Current</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfidentialityIcon = (level: string) => {
    switch (level) {
      case 'confidential':
        return <Lock className="h-4 w-4 text-destructive" />;
      case 'internal':
        return <Shield className="h-4 w-4 text-warning" />;
      case 'public':
        return <Eye className="h-4 w-4 text-success" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Document Vault</h2>
        <Button className="btn-primary-gold">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">SEC/FINRA Filings</h3>
                <p className="text-sm text-muted-foreground">12 documents</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Policy Documents</h3>
                <p className="text-sm text-muted-foreground">8 documents</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Training Records</h3>
                <p className="text-sm text-muted-foreground">24 documents</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document List */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  {getConfidentialityIcon(doc.confidentiality)}
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Badge variant="outline" className="text-xs">
                        Retain {doc.retentionPeriod}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last accessed: {new Date(doc.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Audit Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="h-4 w-4 text-primary" />
                <span className="text-sm">Sarah Johnson downloaded Form ADV Part 2A</span>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="h-4 w-4 text-success" />
                <span className="text-sm">Mike Chen uploaded Privacy Policy update</span>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">System archived Q3 training records</span>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};