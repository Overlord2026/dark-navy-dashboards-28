import React, { useState, useEffect } from 'react';
import { Plus, Edit, FileText, Upload, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  ria_firm: string;
  minimum_investment: number;
  maximum_investment?: number;
  risk_level: string;
  status: string;
  compliance_approved: boolean;
  fee_structure?: any;
  asset_allocation?: any;
  eligibility_requirements?: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Document {
  id: string;
  product_id: string;
  document_type: string;
  file_name: string;
  version: number;
  is_current: boolean;
  created_at: string;
}

export function RIAAdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    ria_firm: '',
    minimum_investment: '',
    maximum_investment: '',
    risk_level: '',
    fee_structure: '',
    asset_allocation: '',
    eligibility_requirements: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDocuments();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('products', {
        method: 'GET'
      });

      if (error) throw error;
      setProducts(data.products || []);
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

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('product-documents', {
        method: 'GET'
      });

      if (error) throw error;
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const productData = {
        ...formData,
        minimum_investment: parseFloat(formData.minimum_investment),
        maximum_investment: formData.maximum_investment ? parseFloat(formData.maximum_investment) : null,
        fee_structure: formData.fee_structure ? JSON.parse(formData.fee_structure) : null,
        asset_allocation: formData.asset_allocation ? JSON.parse(formData.asset_allocation) : null,
      };

      const { error } = await supabase.functions.invoke('products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    try {
      const productData = {
        id: selectedProduct.id,
        ...formData,
        minimum_investment: parseFloat(formData.minimum_investment),
        maximum_investment: formData.maximum_investment ? parseFloat(formData.maximum_investment) : null,
        fee_structure: formData.fee_structure ? JSON.parse(formData.fee_structure) : null,
        asset_allocation: formData.asset_allocation ? JSON.parse(formData.asset_allocation) : null,
      };

      const { error } = await supabase.functions.invoke('products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const submitForCompliance = async (productId: string) => {
    try {
      const { error } = await supabase.functions.invoke('products', {
        method: 'POST',
        body: JSON.stringify({
          id: productId,
          status: 'pending_approval'
        })
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product submitted for compliance review",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error submitting for compliance:', error);
      toast({
        title: "Error",
        description: "Failed to submit for compliance",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      ria_firm: '',
      minimum_investment: '',
      maximum_investment: '',
      risk_level: '',
      fee_structure: '',
      asset_allocation: '',
      eligibility_requirements: ''
    });
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      ria_firm: product.ria_firm,
      minimum_investment: product.minimum_investment.toString(),
      maximum_investment: product.maximum_investment?.toString() || '',
      risk_level: product.risk_level,
      fee_structure: product.fee_structure ? JSON.stringify(product.fee_structure, null, 2) : '',
      asset_allocation: product.asset_allocation ? JSON.stringify(product.asset_allocation, null, 2) : '',
      eligibility_requirements: product.eligibility_requirements || ''
    });
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending_changes': return 'bg-orange-100 text-orange-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending_approval': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending_changes': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const ProductForm = ({ isEdit = false }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter product name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ria_firm">RIA Firm</Label>
        <Input
          id="ria_firm"
          value={formData.ria_firm}
          onChange={(e) => setFormData({...formData, ria_firm: e.target.value})}
          placeholder="Enter RIA firm name"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk_level">Risk Level</Label>
        <Select value={formData.risk_level} onValueChange={(value) => setFormData({...formData, risk_level: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minimum_investment">Minimum Investment</Label>
        <Input
          id="minimum_investment"
          type="number"
          value={formData.minimum_investment}
          onChange={(e) => setFormData({...formData, minimum_investment: e.target.value})}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maximum_investment">Maximum Investment (Optional)</Label>
        <Input
          id="maximum_investment"
          type="number"
          value={formData.maximum_investment}
          onChange={(e) => setFormData({...formData, maximum_investment: e.target.value})}
          placeholder="0"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="eligibility_requirements">Eligibility Requirements</Label>
        <Textarea
          id="eligibility_requirements"
          value={formData.eligibility_requirements}
          onChange={(e) => setFormData({...formData, eligibility_requirements: e.target.value})}
          placeholder="Enter eligibility requirements"
          rows={2}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="fee_structure">Fee Structure (JSON)</Label>
        <Textarea
          id="fee_structure"
          value={formData.fee_structure}
          onChange={(e) => setFormData({...formData, fee_structure: e.target.value})}
          placeholder='{"management_fee": "1.5%", "performance_fee": "20%"}'
          rows={3}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="asset_allocation">Asset Allocation (JSON)</Label>
        <Textarea
          id="asset_allocation"
          value={formData.asset_allocation}
          onChange={(e) => setFormData({...formData, asset_allocation: e.target.value})}
          placeholder='{"stocks": "60%", "bonds": "30%", "alternatives": "10%"}'
          rows={3}
        />
      </div>

      <div className="md:col-span-2 flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setSelectedProduct(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={isEdit ? handleEditProduct : handleCreateProduct}
        >
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RIA Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage your investment products and documentation
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')}>
          View Marketplace
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Investment Products</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Investment Product</DialogTitle>
                  <DialogDescription>
                    Add a new investment product to your offering
                  </DialogDescription>
                </DialogHeader>
                <ProductForm />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
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
                        {product.compliance_approved && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Compliant
                          </Badge>
                        )}
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
                        <span className="text-sm font-medium">Created:</span>
                        <p className="text-sm text-muted-foreground">{new Date(product.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Updated:</span>
                        <p className="text-sm text-muted-foreground">{new Date(product.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/marketplace/product/${product.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {product.status === 'draft' && (
                        <Button size="sm" onClick={() => submitForCompliance(product.id)}>
                          Submit for Compliance
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Investment Product</DialogTitle>
                <DialogDescription>
                  Update product information
                </DialogDescription>
              </DialogHeader>
              <ProductForm isEdit={true} />
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Documents</h2>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
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
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <h2 className="text-2xl font-bold">Compliance Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Products by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['approved', 'pending_approval', 'rejected', 'draft'].map((status) => {
                    const count = products.filter(p => p.status === status).length;
                    return (
                      <div key={status} className="flex justify-between">
                        <span className="capitalize">{status.replace('_', ' ')}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Compliant:</span>
                    <span className="font-medium">{products.filter(p => p.compliance_approved).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-medium">{products.filter(p => !p.compliance_approved).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {products.length} total products managed
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}