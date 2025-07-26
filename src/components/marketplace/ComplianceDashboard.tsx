import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  ria_firm: string;
  status: string;
  compliance_approved: boolean;
  risk_level: string;
  minimum_investment: number;
  created_at: string;
  updated_at: string;
  compliance_notes?: string;
  next_review_date?: string;
}

interface ComplianceTracking {
  id: string;
  product_id: string;
  review_type: string;
  status: string;
  reviewed_by: string;
  review_notes?: string;
  compliance_status?: string;
  requirements_met?: any;
  next_review_date?: string;
  created_at: string;
  investment_products?: Product;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function ComplianceDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [complianceTracking, setComplianceTracking] = useState<ComplianceTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Review form state
  const [reviewData, setReviewData] = useState({
    action: '',
    review_notes: '',
    compliance_status: '',
    requirements_met: '',
    next_review_date: ''
  });

  useEffect(() => {
    fetchPendingProducts();
    fetchComplianceHistory();
  }, [statusFilter, riskFilter]);

  const fetchPendingProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('products', {
        method: 'GET',
        body: new URLSearchParams({
          ...(statusFilter !== 'all' && { status: statusFilter }),
          limit: '100'
        })
      });

      if (error) throw error;

      let filteredProducts = data.products || [];

      // Apply additional filters
      if (riskFilter !== 'all') {
        filteredProducts = filteredProducts.filter((p: Product) => p.risk_level === riskFilter);
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('audit-log', {
        method: 'GET',
        body: new URLSearchParams({
          limit: '50'
        })
      });

      if (error) throw error;
      setComplianceTracking(data.compliance_logs || []);
    } catch (error) {
      console.error('Error fetching compliance history:', error);
    }
  };

  const handleComplianceAction = async () => {
    if (!selectedProduct || !reviewData.action) return;

    try {
      const { error } = await supabase.functions.invoke('compliance-action', {
        method: 'POST',
        body: JSON.stringify({
          product_id: selectedProduct.id,
          action: reviewData.action,
          review_notes: reviewData.review_notes,
          compliance_status: reviewData.compliance_status,
          requirements_met: reviewData.requirements_met ? JSON.parse(reviewData.requirements_met) : null,
          next_review_date: reviewData.next_review_date || null
        })
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${reviewData.action}d successfully`,
      });

      setIsReviewDialogOpen(false);
      setSelectedProduct(null);
      resetReviewForm();
      fetchPendingProducts();
      fetchComplianceHistory();
    } catch (error) {
      console.error('Error processing compliance action:', error);
      toast({
        title: "Error",
        description: "Failed to process compliance action",
        variant: "destructive",
      });
    }
  };

  const resetReviewForm = () => {
    setReviewData({
      action: '',
      review_notes: '',
      compliance_status: '',
      requirements_met: '',
      next_review_date: ''
    });
  };

  const openReviewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsReviewDialogOpen(true);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending_approval': return <AlertTriangle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending_changes': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (product: Product) => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(product.updated_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate > 7) return 'border-red-200 bg-red-50';
    if (daysSinceUpdate > 3) return 'border-yellow-200 bg-yellow-50';
    return 'border-gray-200';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const pendingProducts = products.filter(p => p.status === 'pending_approval' || p.status === 'pending_changes');
  const approvedProducts = products.filter(p => p.status === 'approved');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve investment products for marketplace listing
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')}>
          View Marketplace
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingProducts.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedProducts.length}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedProducts.length}</div>
            <p className="text-xs text-muted-foreground">Require changes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <p className="text-xs text-muted-foreground">All submissions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="history">Compliance History</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex gap-4 my-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="pending_changes">Pending Changes</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="pending" className="space-y-4">
          {pendingProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products pending review</p>
              </CardContent>
            </Card>
          ) : (
            pendingProducts.map((product) => (
              <Card key={product.id} className={`${getPriorityColor(product)} transition-all hover:shadow-md`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription>{product.ria_firm}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{product.status.replace('_', ' ').toUpperCase()}</span>
                      </Badge>
                      <Badge variant="outline">
                        {product.risk_level} Risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium">Min Investment:</span>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.minimum_investment)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Risk Level:</span>
                      <p className="text-sm text-muted-foreground">{product.risk_level}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Submitted:</span>
                      <p className="text-sm text-muted-foreground">{new Date(product.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Last Updated:</span>
                      <p className="text-sm text-muted-foreground">{new Date(product.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => openReviewDialog(product)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Review Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription>{product.ria_firm}</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    APPROVED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {product.next_review_date && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      Review: {new Date(product.next_review_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription>{product.ria_firm}</CardDescription>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    <XCircle className="h-4 w-4 mr-1" />
                    REJECTED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                {product.compliance_notes && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <h4 className="font-semibold text-red-800 mb-2">Compliance Notes:</h4>
                    <p className="text-red-700 text-sm">{product.compliance_notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" onClick={() => openReviewDialog(product)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Re-review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {complianceTracking.map((tracking) => (
              <Card key={tracking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tracking.investment_products?.name || 'Unknown Product'}</CardTitle>
                      <CardDescription>
                        {tracking.review_type} by {tracking.profiles?.first_name} {tracking.profiles?.last_name}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(tracking.status)}>
                        {tracking.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(tracking.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                {tracking.review_notes && (
                  <CardContent>
                    <div className="bg-gray-50 border rounded-md p-3">
                      <h4 className="font-semibold mb-2">Review Notes:</h4>
                      <p className="text-sm text-muted-foreground">{tracking.review_notes}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Product: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Approve, reject, or request changes for this investment product
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={reviewData.action} onValueChange={(value) => setReviewData({...reviewData, action: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve Product</SelectItem>
                  <SelectItem value="reject">Reject Product</SelectItem>
                  <SelectItem value="request_changes">Request Changes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review_notes">Review Notes</Label>
              <Textarea
                id="review_notes"
                value={reviewData.review_notes}
                onChange={(e) => setReviewData({...reviewData, review_notes: e.target.value})}
                placeholder="Enter your review comments..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compliance_status">Compliance Status</Label>
              <Input
                id="compliance_status"
                value={reviewData.compliance_status}
                onChange={(e) => setReviewData({...reviewData, compliance_status: e.target.value})}
                placeholder="Overall compliance assessment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements_met">Requirements Met (JSON)</Label>
              <Textarea
                id="requirements_met"
                value={reviewData.requirements_met}
                onChange={(e) => setReviewData({...reviewData, requirements_met: e.target.value})}
                placeholder='{"documentation": true, "risk_assessment": false}'
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_review_date">Next Review Date</Label>
              <Input
                id="next_review_date"
                type="date"
                value={reviewData.next_review_date}
                onChange={(e) => setReviewData({...reviewData, next_review_date: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsReviewDialogOpen(false);
                  setSelectedProduct(null);
                  resetReviewForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleComplianceAction}
                disabled={!reviewData.action}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}