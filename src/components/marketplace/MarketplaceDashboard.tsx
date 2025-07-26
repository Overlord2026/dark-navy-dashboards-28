import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, DollarSign, Award, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  fee_structure?: any;
  investment_categories?: {
    id: string;
    name: string;
    description: string;
  };
}

interface MarketplaceDashboardProps {
  userRole?: string;
}

export function MarketplaceDashboard({ userRole }: MarketplaceDashboardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [minInvestment, setMinInvestment] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, selectedRisk, selectedStatus, searchTerm, minInvestment, maxInvestment]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('products', {
        method: 'GET',
        body: new URLSearchParams({
          ...(selectedCategory !== 'all' && { category: selectedCategory }),
          ...(selectedStatus !== 'all' && { status: selectedStatus }),
          ...(searchTerm && { search: searchTerm }),
          page: '1',
          limit: '50'
        })
      });

      if (error) throw error;

      let filteredProducts = data.products || [];

      // Apply additional filters
      if (selectedRisk !== 'all') {
        filteredProducts = filteredProducts.filter((p: Product) => p.risk_level === selectedRisk);
      }
      if (minInvestment) {
        filteredProducts = filteredProducts.filter((p: Product) => p.minimum_investment >= parseInt(minInvestment));
      }
      if (maxInvestment) {
        filteredProducts = filteredProducts.filter((p: Product) => p.minimum_investment <= parseInt(maxInvestment));
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch investment products",
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

  const featuredProducts = products.filter(p => p.status === 'approved').slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investment Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover and explore investment opportunities from top RIA firms
          </p>
        </div>
        {(userRole === 'admin' || userRole === 'ria' || userRole === 'advisor') && (
          <Button 
            onClick={() => navigate('/marketplace/admin')}
            className="bg-primary hover:bg-primary/90"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Manage Products
          </Button>
        )}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Investment opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RIA Firms</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(products.map(p => p.ria_firm)).size}
            </div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Asset classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Min. Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0 
                ? formatCurrency(products.reduce((sum, p) => sum + p.minimum_investment, 0) / products.length)
                : '$0'
              }
            </div>
            <p className="text-xs text-muted-foreground">Entry point</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Min Investment"
              value={minInvestment}
              onChange={(e) => setMinInvestment(e.target.value)}
              type="number"
            />

            <Input
              placeholder="Max Investment"
              value={maxInvestment}
              onChange={(e) => setMaxInvestment(e.target.value)}
              type="number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Featured Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge className="bg-primary/10 text-primary">Featured</Badge>
                    <Badge className={getRiskColor(product.risk_level)}>
                      {product.risk_level} Risk
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    by {product.ria_firm}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min. Investment:</span>
                      <span className="font-medium">{formatCurrency(product.minimum_investment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{product.investment_categories?.name}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate(`/marketplace/product/${product.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Investment Opportunities</h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getRiskColor(product.risk_level)}>
                      {product.risk_level} Risk
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    by {product.ria_firm}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min. Investment:</span>
                      <span className="font-medium">{formatCurrency(product.minimum_investment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{product.investment_categories?.name}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate(`/marketplace/product/${product.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}