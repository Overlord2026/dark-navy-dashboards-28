import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Download, Share, Trash2, Folder, Search, Calendar, HeartPulse, Shield, Pill, Users, Activity } from 'lucide-react';
import { useHealthcare } from '@/hooks/useHealthcare';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const healthcareCategories = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: HeartPulse,
    description: 'General healthcare documents and records',
    iconColor: 'text-red-500'
  },
  {
    id: 'insurance-coverage',
    name: 'Insurance Coverage',
    icon: Shield,
    description: 'Health insurance policies and coverage details',
    iconColor: 'text-blue-500'
  },
  {
    id: 'prescriptions',
    name: 'Prescriptions & Medications',
    icon: Pill,
    description: 'Prescription records and medication information',
    iconColor: 'text-green-500'
  },
  {
    id: 'physicians',
    name: 'Physicians & Providers',
    icon: Users,
    description: 'Healthcare provider information and contacts',
    iconColor: 'text-purple-500'
  },
  {
    id: 'medical-records',
    name: 'Medical Records & Documents',
    icon: Activity,
    description: 'Medical records, test results, and reports',
    iconColor: 'text-orange-500'
  }
];

export const HealthcareDocumentsList: React.FC = () => {
  const { documents, loading, uploading, uploadDocument, deleteDocument, getDocumentUrl } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('healthcare');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = doc.category === activeCategory || 
      (doc.tags && doc.tags.includes(activeCategory));
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const description = `Document uploaded to ${healthcareCategories.find(cat => cat.id === activeCategory)?.name} category`;
    
    await uploadDocument(file, fileName, description);
    
    // Reset the input
    event.target.value = '';
  };

  const handleDownloadDocument = async (document: any) => {
    if (!document.file_path) {
      console.log('No file path available for download');
      return;
    }

    const url = await getDocumentUrl(document.file_path);
    if (url) {
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(documentId);
    }
  };

  const getCategoryDocuments = (categoryId: string) => {
    return documents.filter(doc => 
      doc.category === categoryId || 
      (doc.tags && doc.tags.includes(categoryId))
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading healthcare documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activecat = healthcareCategories.find(cat => cat.id === activeCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Healthcare Documents by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Side Menu */}
          <div className="w-64 space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Categories</h3>
            {healthcareCategories.map((category) => {
              const Icon = category.icon;
              const count = getCategoryDocuments(category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    activeCategory === category.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", category.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{category.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{category.description}</div>
                  </div>
                  {count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-semibold">{activecat?.name}</h3>
                <p className="text-sm text-muted-foreground">{activecat?.description}</p>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    disabled={uploading}
                  />
                  <Button disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No documents found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search terms or upload a new document to {activecat?.name}.
                    </p>
                  </>
                ) : (
                  <>
                    <activecat.icon className={cn("mx-auto h-12 w-12", activecat?.iconColor || "text-muted-foreground")} />
                    <h3 className="mt-4 text-lg font-medium">No {activecat?.name} Documents</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Upload your first document to the {activecat?.name} category to get started.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((document) => (
                  <div key={document.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        {document.is_folder ? (
                          <Folder className="h-5 w-5 text-blue-500 mt-1" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary mt-1" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{document.name}</h4>
                          {document.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {document.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {document.encrypted && (
                          <Badge variant="secondary" className="text-xs">
                            Encrypted
                          </Badge>
                        )}
                        {document.shared && (
                          <Badge variant="outline" className="text-xs">
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(document.created_at), "MMM d, yyyy")}
                      </span>
                      {document.size && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{(document.size / (1024 * 1024)).toFixed(1)} MB</span>
                        </>
                      )}
                    </div>

                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!document.is_folder && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDownloadDocument(document)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
