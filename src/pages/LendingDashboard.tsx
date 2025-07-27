import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLending } from '@/hooks/useLending';
import { Building2, DollarSign, Clock, CheckCircle, AlertCircle, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function LendingDashboard() {
  const { partners, requests, loading, saving, submitLoanRequest } = useLending();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    partner_id: '',
    loan_type: '',
    requested_amount: '',
    purpose: ''
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'home-loans', label: 'Home Loans' },
    { value: 'securities-loans', label: 'Securities-Based Loans' },
    { value: 'commercial-loans', label: 'Commercial Loans' },
    { value: 'specialty-loans', label: 'Specialty Loans' },
    { value: 'personal-loans', label: 'Personal Loans' }
  ];

  const filteredPartners = selectedCategory === 'all' 
    ? partners 
    : partners.filter(p => p.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'funded': return 'bg-green-500';
      case 'under_review': case 'submitted': return 'bg-yellow-500';
      case 'denied': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitLoanRequest({
        partner_id: formData.partner_id || undefined,
        loan_type: formData.loan_type,
        requested_amount: formData.requested_amount ? parseFloat(formData.requested_amount) : undefined,
        purpose: formData.purpose || undefined,
        status: 'submitted'
      });
      setIsRequestDialogOpen(false);
      setFormData({ partner_id: '', loan_type: '', requested_amount: '', purpose: '' });
    } catch (error) {
      console.error('Error submitting loan request:', error);
    }
  };

  if (loading) {
    return (
      <ThreeColumnLayout activeMainItem="lending" title="Lending Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading lending data...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="lending" title="Lending Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lending Dashboard</h1>
            <p className="text-muted-foreground">
              Explore loan options and manage your requests
            </p>
          </div>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Loan Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Loan Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <Label htmlFor="partner">Preferred Partner (Optional)</Label>
                  <Select value={formData.partner_id} onValueChange={(value) => setFormData(prev => ({ ...prev, partner_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map(partner => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="loan_type">Loan Type</Label>
                  <Input
                    id="loan_type"
                    value={formData.loan_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, loan_type: e.target.value }))}
                    placeholder="e.g., Home Purchase, Refinance"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Requested Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.requested_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, requested_amount: e.target.value }))}
                    placeholder="Enter loan amount"
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="Describe the purpose of the loan"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Partners</p>
                  <p className="text-2xl font-bold">{partners.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                  <p className="text-2xl font-bold">{requests.filter(r => ['submitted', 'under_review'].includes(r.status)).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'under_review').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="partners" className="space-y-4">
          <TabsList>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map(partner => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {partner.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {partner.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Offering:</strong> {partner.offering}</p>
                      {partner.other_offerings && partner.other_offerings.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {partner.other_offerings.slice(0, 3).map((offering, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {offering}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4" onClick={() => {
                      setFormData(prev => ({ ...prev, partner_id: partner.id }));
                      setIsRequestDialogOpen(true);
                    }}>
                      Request Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Loan Requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any loan requests yet.
                  </p>
                  <Button onClick={() => setIsRequestDialogOpen(true)}>
                    Submit Your First Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map(request => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.loan_type}</CardTitle>
                          <p className="text-muted-foreground">
                            Submitted {new Date(request.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {request.requested_amount && (
                          <p><strong>Amount:</strong> ${request.requested_amount.toLocaleString()}</p>
                        )}
                        {request.purpose && (
                          <p><strong>Purpose:</strong> {request.purpose}</p>
                        )}
                        {request.advisor_notes && (
                          <div className="md:col-span-2">
                            <p><strong>Advisor Notes:</strong></p>
                            <p className="text-muted-foreground">{request.advisor_notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}