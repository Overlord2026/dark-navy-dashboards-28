import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Shield, 
  Calendar, 
  Download, 
  Upload, 
  Search,
  Lock,
  Eye,
  FolderOpen,
  Heart,
  Home,
  DollarSign,
  Scale,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  category: 'estate' | 'financial' | 'health' | 'insurance' | 'tax';
  type: string;
  lastUpdated: string;
  expiryDate?: string;
  status: 'current' | 'expiring' | 'expired' | 'needs-review';
  size: string;
  isPrivate: boolean;
}

export default function FamilyRoadmapVault() {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Last Will and Testament',
      category: 'estate',
      type: 'PDF',
      lastUpdated: '2024-03-15',
      status: 'current',
      size: '2.1 MB',
      isPrivate: true
    },
    {
      id: '2',
      name: 'Living Trust Document',
      category: 'estate',
      type: 'PDF',
      lastUpdated: '2024-03-15',
      status: 'current',
      size: '3.8 MB',
      isPrivate: true
    },
    {
      id: '3',
      name: 'Medicare Supplement Policy',
      category: 'insurance',
      type: 'PDF',
      lastUpdated: '2024-01-01',
      expiryDate: '2024-12-31',
      status: 'expiring',
      size: '1.2 MB',
      isPrivate: false
    },
    {
      id: '4',
      name: 'Financial Power of Attorney',
      category: 'estate',
      type: 'PDF',
      lastUpdated: '2023-08-10',
      status: 'needs-review',
      size: '892 KB',
      isPrivate: true
    },
    {
      id: '5',
      name: '401(k) Beneficiary Forms',
      category: 'financial',
      type: 'PDF',
      lastUpdated: '2023-12-05',
      status: 'needs-review',
      size: '645 KB',
      isPrivate: true
    },
    {
      id: '6',
      name: 'Advance Healthcare Directive',
      category: 'health',
      type: 'PDF',
      lastUpdated: '2024-02-20',
      status: 'current',
      size: '756 KB',
      isPrivate: true
    },
    {
      id: '7',
      name: '2023 Tax Return',
      category: 'tax',
      type: 'PDF',
      lastUpdated: '2024-04-15',
      status: 'current',
      size: '4.2 MB',
      isPrivate: true
    },
    {
      id: '8',
      name: 'Homeowners Insurance',
      category: 'insurance',
      type: 'PDF',
      lastUpdated: '2024-06-01',
      expiryDate: '2025-06-01',
      status: 'current',
      size: '1.8 MB',
      isPrivate: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleRestrictedAction = (action: string) => {
    toast.error(`${action} requires premium plan`, {
      description: 'Upgrade to access full document vault features'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'estate': return <Scale className="h-4 w-4 text-purple-500" />;
      case 'financial': return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case 'health': return <Heart className="h-4 w-4 text-pink-500" />;
      case 'insurance': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'tax': return <FileText className="h-4 w-4 text-orange-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'expiring': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      case 'needs-review': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-3 w-3" />;
      case 'expiring': return <AlertCircle className="h-3 w-3" />;
      case 'expired': return <AlertCircle className="h-3 w-3" />;
      case 'needs-review': return <AlertCircle className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const categories = [
    { key: 'all', label: 'All Documents', count: documents.length },
    { key: 'estate', label: 'Estate Planning', count: documents.filter(d => d.category === 'estate').length },
    { key: 'financial', label: 'Financial', count: documents.filter(d => d.category === 'financial').length },
    { key: 'health', label: 'Healthcare', count: documents.filter(d => d.category === 'health').length },
    { key: 'insurance', label: 'Insurance', count: documents.filter(d => d.category === 'insurance').length },
    { key: 'tax', label: 'Tax Records', count: documents.filter(d => d.category === 'tax').length }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(d => d.category === selectedCategory);

  const documentStats = {
    total: documents.length,
    needsReview: documents.filter(d => d.status === 'needs-review' || d.status === 'expiring').length,
    current: documents.filter(d => d.status === 'current').length,
    private: documents.filter(d => d.isPrivate).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Vault</h2>
          <p className="text-muted-foreground">Secure storage for all your important retirement documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRestrictedAction('Upload document')}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
            <Lock className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRestrictedAction('Advanced search')}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search
            <Lock className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Total Documents</span>
          </div>
          <div className="text-2xl font-bold">{documentStats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Needs Review</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{documentStats.needsReview}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Current</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{documentStats.current}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Private</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{documentStats.private}</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-3">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.key 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <span className="text-sm">{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-9">
          <Card className="p-6">
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(document.category)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{document.name}</h4>
                        {document.isPrivate && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                        <Badge variant="outline" className={getStatusColor(document.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(document.status)}
                            {document.status.replace('-', ' ')}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{document.type}</span>
                        <span>{document.size}</span>
                        <span>Updated {new Date(document.lastUpdated).toLocaleDateString()}</span>
                        {document.expiryDate && (
                          <span>Expires {new Date(document.expiryDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRestrictedAction('View document')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRestrictedAction('Download document')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Action Items */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <h3 className="text-lg font-semibold mb-3 text-orange-900 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Document Action Items
        </h3>
        <div className="space-y-2 text-orange-800">
          <p className="text-sm">• Medicare Supplement Policy expires in 30 days - review renewal options</p>
          <p className="text-sm">• Financial Power of Attorney hasn't been updated in over a year</p>
          <p className="text-sm">• 401(k) Beneficiary Forms need review after recent family changes</p>
          <p className="text-sm">• Consider digitizing remaining paper documents for secure cloud storage</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
            onClick={() => handleRestrictedAction('Set document reminders')}
          >
            Set Reminders
            <Lock className="h-3 w-3 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
            onClick={() => handleRestrictedAction('Schedule document review')}
          >
            Schedule Review
            <Lock className="h-3 w-3 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}