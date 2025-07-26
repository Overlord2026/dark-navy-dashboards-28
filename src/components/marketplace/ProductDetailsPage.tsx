import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, BookmarkPlus, BookmarkCheck, AlertTriangle, Shield, FileText, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  ria_id: string; // Changed from ria_firm to match database
  minimum_investment: number;
  maximum_investment?: number;
  risk_level: string;
  status: string;
  compliance_approved: boolean;
  fee_structure?: any;
  asset_allocation?: any;
  eligibility_requirements?: any; // Changed to any to match Json type
  performance_data?: any;
  investment_categories?: {
    id: string;
    name: string;
    description: string;
  };
}

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  version: number;
  is_current: boolean;
  created_at: string;
}

interface AuditLog {
  id: string;
  action_type: string;
  change_summary: string;
  created_at: string;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchDocuments();
      fetchAuditLogs();
      checkBookmarkStatus();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_products')
        .select(`
          *,
          investment_categories:category_id (
            id,
            name,
            description
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data as Product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('product-documents', {
        method: 'GET',
        body: new URLSearchParams({
          product_id: id!
        })
      });

      if (error) throw error;
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('audit-log', {
        method: 'GET',
        body: new URLSearchParams({
          record_id: id!,
          limit: '10'
        })
      });

      if (error) throw error;
      setAuditLogs(data.audit_logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-interests', {
        method: 'GET',
        body: new URLSearchParams({
          product_id: id!,
          interest_type: 'watchlist'
        })
      });

      if (error) throw error;
      setIsBookmarked((data.interests || []).length > 0);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        const { error } = await supabase.functions.invoke('user-interests', {
          method: 'DELETE',
          body: new URLSearchParams({
            product_id: id!,
            interest_type: 'watchlist'
          })
        });
        if (error) throw error;
        setIsBookmarked(false);
        toast({
          title: "Removed from Watchlist",
          description: "Product removed from your watchlist",
        });
      } else {
        const { error } = await supabase.functions.invoke('user-interests', {
          method: 'POST',
          body: JSON.stringify({
            product_id: id,
            interest_type: 'watchlist'
          })
        });
        if (error) throw error;
        setIsBookmarked(true);
        toast({
          title: "Added to Watchlist",
          description: "Product added to your watchlist",
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  const requestInfo = async () => {
    try {
      const { error } = await supabase.functions.invoke('user-interests', {
        method: 'POST',
        body: JSON.stringify({
          product_id: id,
          interest_type: 'info_request',
          notes: 'Information request from product details page'
        })
      });
      
      if (error) throw error;
      
      toast({
        title: "Information Requested",
        description: "Your information request has been submitted",
      });
    } catch (error) {
      console.error('Error requesting info:', error);
      toast({
        title: "Error",
        description: "Failed to submit information request",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending_changes': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Product not found</p>
          <Button onClick={() => navigate('/marketplace')} className="mt-4">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="text-muted-foreground">by {product.ria_id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={toggleBookmark}
            className="flex items-center gap-2"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
            {isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
          <Button onClick={requestInfo}>
            Request Information
          </Button>
        </div>
      </div>

      {/* Status and Compliance */}
      <div className="flex gap-4">
        <Badge className={getStatusColor(product.status)}>
          {product.status.replace('_', ' ').toUpperCase()}
        </Badge>
        <Badge className={getRiskColor(product.risk_level)}>
          {product.risk_level} Risk
        </Badge>
        <Badge className={product.compliance_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
          <Shield className="h-3 w-3 mr-1" />
          {product.compliance_approved ? 'Compliance Approved' : 'Pending Compliance'}
        </Badge>
      </div>

      {/* Compliance Warning */}
      {!product.compliance_approved && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This product is pending compliance approval. Information may be subject to change.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Category</h4>
                  <p className="text-muted-foreground">{product.investment_categories?.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Eligibility Requirements</h4>
                  <p className="text-muted-foreground">{product.eligibility_requirements || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Minimum Investment:</span>
                  <span>{formatCurrency(product.minimum_investment)}</span>
                </div>
                {product.maximum_investment && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Maximum Investment:</span>
                    <span>{formatCurrency(product.maximum_investment)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold">Risk Level:</span>
                  <Badge className={getRiskColor(product.risk_level)}>
                    {product.risk_level}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {product.fee_structure && (
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(product.fee_structure, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {product.asset_allocation && (
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(product.asset_allocation, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {documents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No documents available</p>
                </CardContent>
              </Card>
            ) : (
              documents.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doc.file_name}</CardTitle>
                        <CardDescription>
                          {doc.document_type.replace('_', ' ').toUpperCase()} - Version {doc.version}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {doc.is_current && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Data</CardTitle>
            </CardHeader>
            <CardContent>
              {product.performance_data ? (
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(product.performance_data, null, 2)}
                </pre>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Approval Status:</span>
                  <Badge className={product.compliance_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {product.compliance_approved ? 'Approved' : 'Pending Review'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Product Status:</span>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Changes
              </CardTitle>
              <CardDescription>
                Last 10 audit log entries for this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No audit history available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-primary/20 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.change_summary}</p>
                          <p className="text-sm text-muted-foreground">
                            Action: {log.action_type}
                          </p>
                          {log.profiles && (
                            <p className="text-sm text-muted-foreground">
                              By: {log.profiles.first_name} {log.profiles.last_name} ({log.profiles.email})
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}