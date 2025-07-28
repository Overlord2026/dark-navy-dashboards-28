import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bookmark, Star, TrendingUp, Eye, Trash2, Plus, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { PortfolioErrorBoundary } from '@/components/portfolio/PortfolioErrorBoundary';
import { PortfolioPageSkeleton, PortfolioCardSkeleton, SummaryCardSkeleton, InfoRequestDialogSkeleton } from '@/components/ui/skeletons/PortfolioSkeletons';
import { PortfolioPerformanceMonitor } from '@/components/debug/PortfolioPerformanceMonitor';

interface UserInterest {
  id: string;
  product_id: string;
  interest_type: string;
  notes?: string;
  investment_amount?: number;
  contact_preferences?: any;
  status?: string;
  created_at: string;
  investment_products?: {
    id: string;
    name: string;
    description: string;
    ria_firm: string;
    minimum_investment: number;
    status: string;
    risk_level: string;
  };
}

export function UserPortfolioWatchlist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [renderCount, setRenderCount] = useState(0);

  // Performance tracking
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Info request form state
  const [requestData, setRequestData] = useState({
    notes: '',
    investment_amount: '',
    contact_preferences: {
      email: true,
      phone: false,
      meeting: false,
      preferred_time: ''
    }
  });

  useEffect(() => {
    fetchUserInterests();
  }, []);

  // Memoized categorized interests for performance
  const categorizedInterests = useMemo(() => {
    const watchlistItems = interests.filter(i => i.interest_type === 'watchlist');
    const portfolioItems = interests.filter(i => i.interest_type === 'portfolio');
    const infoRequests = interests.filter(i => i.interest_type === 'info_request');

    return {
      watchlistItems,
      portfolioItems,
      infoRequests,
      totalInterests: interests.length
    };
  }, [interests]);

  const fetchUserInterests = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-interests', {
        method: 'GET'
      });

      if (error) throw error;
      setInterests(data.interests || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user interests:', error);
      }
      toast({
        title: "Error",
        description: "Failed to fetch your interests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const removeFromWatchlist = useCallback(async (interestId: string) => {
    try {
      const { error } = await supabase.functions.invoke('user-interests', {
        method: 'DELETE',
        body: new URLSearchParams({
          id: interestId
        })
      });

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Product removed from watchlist",
      });

      fetchUserInterests();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error removing from watchlist:', error);
      }
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    }
  }, [fetchUserInterests, toast]);

  const submitInfoRequest = useCallback(async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase.functions.invoke('user-interests', {
        method: 'POST',
        body: JSON.stringify({
          product_id: selectedProduct.id,
          interest_type: 'info_request',
          notes: requestData.notes,
          investment_amount: requestData.investment_amount ? parseFloat(requestData.investment_amount) : null,
          contact_preferences: requestData.contact_preferences
        })
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your information request has been submitted to the RIA firm",
      });

      setIsRequestDialogOpen(false);
      setSelectedProduct(null);
      resetRequestForm();
      fetchUserInterests();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting info request:', error);
      }
      toast({
        title: "Error",
        description: "Failed to submit information request",
        variant: "destructive",
      });
    }
  }, [selectedProduct, requestData, fetchUserInterests, toast]);

  const resetRequestForm = useCallback(() => {
    setRequestData({
      notes: '',
      investment_amount: '',
      contact_preferences: {
        email: true,
        phone: false,
        meeting: false,
        preferred_time: ''
      }
    });
  }, []);

  const openRequestDialog = useCallback((product: any) => {
    setSelectedProduct(product);
    setIsRequestDialogOpen(true);
  }, []);

  // Memoized helper functions for performance
  const getInterestTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'watchlist': return <Bookmark className="h-4 w-4" />;
      case 'portfolio': return <Star className="h-4 w-4" />;
      case 'info_request': return <MessageSquare className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  }, []);

  const getInterestTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'watchlist': return 'bg-blue-100 text-blue-800';
      case 'portfolio': return 'bg-green-100 text-green-800';
      case 'info_request': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Show loading skeleton immediately
  if (loading) {
    return <PortfolioPageSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Performance Monitor - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4">
          <PortfolioPerformanceMonitor
            componentName="UserPortfolioWatchlist"
            renderCount={renderCount}
            cacheHits={categorizedInterests.totalInterests}
            memoizedCalculations={7}
            interestCount={categorizedInterests.totalInterests}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Portfolio & Watchlist</h1>
          <p className="text-muted-foreground mt-2">
            Manage your investment interests and information requests
          </p>
        </div>
        <Button onClick={() => navigate('/marketplace')}>
          Browse Marketplace
        </Button>
      </div>

      {/* Summary Cards */}
      <PortfolioErrorBoundary componentName="Summary Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist Items</CardTitle>
              <Bookmark className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{categorizedInterests.watchlistItems.length}</div>
              <p className="text-xs text-muted-foreground">Products you're tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Additions</CardTitle>
              <Star className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{categorizedInterests.portfolioItems.length}</div>
              <p className="text-xs text-muted-foreground">Added to portfolio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Info Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{categorizedInterests.infoRequests.length}</div>
              <p className="text-xs text-muted-foreground">Information requested</p>
            </CardContent>
          </Card>
        </div>
      </PortfolioErrorBoundary>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="requests">Information Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="space-y-4">
          <PortfolioErrorBoundary componentName="Watchlist Tab">
            {categorizedInterests.watchlistItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your watchlist is empty</p>
                <Button className="mt-4" onClick={() => navigate('/marketplace')}>
                  Browse Investment Products
                </Button>
              </CardContent>
            </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categorizedInterests.watchlistItems.map((interest) => (
                <Card key={interest.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{interest.investment_products?.name}</CardTitle>
                        <CardDescription>by {interest.investment_products?.ria_firm}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(interest.investment_products?.status || '')}>
                          {interest.investment_products?.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getInterestTypeColor(interest.interest_type)}>
                          {getInterestTypeIcon(interest.interest_type)}
                          <span className="ml-1">Watchlist</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{interest.investment_products?.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium">Min Investment:</span>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(interest.investment_products?.minimum_investment || 0)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Risk Level:</span>
                        <p className="text-sm text-muted-foreground">{interest.investment_products?.risk_level}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Added:</span>
                        <p className="text-sm text-muted-foreground">
                          {new Date(interest.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/marketplace/product/${interest.product_id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openRequestDialog(interest.investment_products)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request Info
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeFromWatchlist(interest.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </PortfolioErrorBoundary>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <PortfolioErrorBoundary componentName="Portfolio Tab">
            {categorizedInterests.portfolioItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No portfolio items yet</p>
                <Button className="mt-4" onClick={() => navigate('/marketplace')}>
                  Add Investment Products
                </Button>
              </CardContent>
            </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categorizedInterests.portfolioItems.map((interest) => (
                <Card key={interest.id} className="border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{interest.investment_products?.name}</CardTitle>
                        <CardDescription>by {interest.investment_products?.ria_firm}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <Star className="h-4 w-4 mr-1" />
                        Portfolio
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{interest.investment_products?.description}</p>
                    {interest.investment_amount && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                        <h4 className="font-semibold text-green-800 mb-1">Investment Amount:</h4>
                        <p className="text-green-700">{formatCurrency(interest.investment_amount)}</p>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/marketplace/product/${interest.product_id}`)}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Performance
                    </Button>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </PortfolioErrorBoundary>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <PortfolioErrorBoundary componentName="Info Requests Tab">
            {categorizedInterests.infoRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No information requests submitted</p>
              </CardContent>
            </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categorizedInterests.infoRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{request.investment_products?.name}</CardTitle>
                        <CardDescription>by {request.investment_products?.ria_firm}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Info Request
                        </Badge>
                        <Badge variant="outline">
                          {request.status || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">Request Date:</span>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {request.notes && (
                        <div>
                          <span className="text-sm font-medium">Your Message:</span>
                          <p className="text-sm text-muted-foreground">{request.notes}</p>
                        </div>
                      )}

                      {request.investment_amount && (
                        <div>
                          <span className="text-sm font-medium">Investment Amount Interest:</span>
                          <p className="text-sm text-muted-foreground">{formatCurrency(request.investment_amount)}</p>
                        </div>
                      )}

                      {request.contact_preferences && (
                        <div>
                          <span className="text-sm font-medium">Contact Preferences:</span>
                          <div className="flex gap-2 mt-1">
                            {request.contact_preferences.email && <Badge variant="outline">Email</Badge>}
                            {request.contact_preferences.phone && <Badge variant="outline">Phone</Badge>}
                            {request.contact_preferences.meeting && <Badge variant="outline">Meeting</Badge>}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </PortfolioErrorBoundary>
        </TabsContent>
      </Tabs>

      {/* Information Request Dialog */}
      <PortfolioErrorBoundary componentName="Info Request Dialog">
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Information: {selectedProduct?.name}</DialogTitle>
              <DialogDescription>
                Submit an information request to the RIA firm for this investment product
              </DialogDescription>
            </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Your Message</Label>
              <Textarea
                id="notes"
                value={requestData.notes}
                onChange={(e) => setRequestData({...requestData, notes: e.target.value})}
                placeholder="What would you like to know about this investment?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment_amount">Potential Investment Amount (Optional)</Label>
              <Input
                id="investment_amount"
                type="number"
                value={requestData.investment_amount}
                onChange={(e) => setRequestData({...requestData, investment_amount: e.target.value})}
                placeholder="$50,000"
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email"
                    checked={requestData.contact_preferences.email}
                    onChange={(e) => setRequestData({
                      ...requestData,
                      contact_preferences: {
                        ...requestData.contact_preferences,
                        email: e.target.checked
                      }
                    })}
                  />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="phone"
                    checked={requestData.contact_preferences.phone}
                    onChange={(e) => setRequestData({
                      ...requestData,
                      contact_preferences: {
                        ...requestData.contact_preferences,
                        phone: e.target.checked
                      }
                    })}
                  />
                  <Label htmlFor="phone">Phone Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="meeting"
                    checked={requestData.contact_preferences.meeting}
                    onChange={(e) => setRequestData({
                      ...requestData,
                      contact_preferences: {
                        ...requestData.contact_preferences,
                        meeting: e.target.checked
                      }
                    })}
                  />
                  <Label htmlFor="meeting">In-Person Meeting</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_time">Preferred Contact Time</Label>
              <Input
                id="preferred_time"
                value={requestData.contact_preferences.preferred_time}
                onChange={(e) => setRequestData({
                  ...requestData,
                  contact_preferences: {
                    ...requestData.contact_preferences,
                    preferred_time: e.target.value
                  }
                })}
                placeholder="e.g., Weekday mornings, After 6 PM"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsRequestDialogOpen(false);
                  setSelectedProduct(null);
                  resetRequestForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={submitInfoRequest}
                disabled={!requestData.notes.trim()}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </PortfolioErrorBoundary>
    </div>
  );
}