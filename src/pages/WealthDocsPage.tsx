import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Download, Search, Eye, Lock, Share2, Calendar, User } from "lucide-react";

export const WealthDocsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const documents = [
    {
      id: 1,
      name: "2023 Investment Portfolio Statement",
      category: "Statements",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      lastViewed: "2024-01-18",
      shared: false,
      encrypted: true,
      tags: ["portfolio", "2023", "year-end"]
    },
    {
      id: 2,
      name: "Estate Planning Documents",
      category: "Legal",
      type: "PDF",
      size: "1.8 MB",
      uploadDate: "2023-11-20",
      lastViewed: "2024-01-10",
      shared: true,
      encrypted: true,
      tags: ["estate", "will", "trust"]
    },
    {
      id: 3,
      name: "Tax Return 2023",
      category: "Tax",
      type: "PDF",
      size: "3.2 MB",
      uploadDate: "2024-01-05",
      lastViewed: "2024-01-16",
      shared: false,
      encrypted: true,
      tags: ["tax", "2023", "return"]
    },
    {
      id: 4,
      name: "Insurance Policy - Life",
      category: "Insurance",
      type: "PDF",
      size: "1.1 MB",
      uploadDate: "2023-12-10",
      lastViewed: "2024-01-12",
      shared: true,
      encrypted: true,
      tags: ["insurance", "life", "policy"]
    },
    {
      id: 5,
      name: "Real Estate Deed - Primary Residence",
      category: "Real Estate",
      type: "PDF",
      size: "892 KB",
      uploadDate: "2023-10-15",
      lastViewed: "2024-01-08",
      shared: false,
      encrypted: true,
      tags: ["real estate", "deed", "primary"]
    },
    {
      id: 6,
      name: "Business Entity Formation",
      category: "Business",
      type: "PDF",
      size: "1.5 MB",
      uploadDate: "2023-09-22",
      lastViewed: "2024-01-14",
      shared: true,
      encrypted: true,
      tags: ["business", "formation", "llc"]
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || doc.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const documentsByCategory = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Statements": "bg-blue-100 text-blue-800",
      "Legal": "bg-purple-100 text-purple-800",
      "Tax": "bg-green-100 text-green-800",
      "Insurance": "bg-orange-100 text-orange-800",
      "Real Estate": "bg-red-100 text-red-800",
      "Business": "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Documents & Vault</h1>
        <p className="text-muted-foreground">
          Secure storage and management of your important financial documents
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {Object.keys(documentsByCategory).length} categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8 MB</div>
            <p className="text-xs text-muted-foreground">
              2.1% of 1GB limit
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Documents</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.filter(d => d.shared).length}</div>
            <p className="text-xs text-muted-foreground">
              With trusted parties
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              All documents encrypted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="statements">Statements</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="real estate">Real Estate</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Your securely stored financial documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{document.name}</h3>
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                      {document.encrypted && (
                        <Lock className="h-3 w-3 text-green-600" />
                      )}
                      {document.shared && (
                        <Share2 className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{document.type} • {document.size}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Last viewed: {new Date(document.lastViewed).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or upload your first document
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};