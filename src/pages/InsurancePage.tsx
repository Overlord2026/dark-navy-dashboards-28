import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { useInsurance } from '@/hooks/useInsurance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Plus, 
  Car, 
  Home, 
  Heart, 
  Umbrella, 
  FileText, 
  Calendar,
  DollarSign,
  Building,
  Phone,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Helper function for currency formatting
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export default function InsurancePage() {
  const { policies, providers, loading, addPolicy } = useInsurance();
  const [selectedTab, setSelectedTab] = useState('policies');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auto': return <Car className="h-4 w-4" />;
      case 'homeowners': return <Home className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'umbrella': return <Umbrella className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTotalCoverage = () => {
    return policies.reduce((total, policy) => total + policy.coverage_amount, 0);
  };

  const getTotalPremiums = () => {
    return policies.reduce((total, policy) => {
      // Convert to annual premium for comparison
      const annual = policy.frequency === 'monthly' ? policy.premium * 12 :
                   policy.frequency === 'quarterly' ? policy.premium * 4 :
                   policy.premium;
      return total + annual;
    }, 0);
  };

  const getActivePolicies = () => {
    return policies.filter(p => p.status === 'active').length;
  };

  if (loading) {
    return (
      <ThreeColumnLayout title="Insurance Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading insurance data...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title="Insurance Management">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{getActivePolicies()}</p>
                  <p className="text-sm text-muted-foreground">Active Policies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalCoverage())}</p>
                  <p className="text-sm text-muted-foreground">Total Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalPremiums())}</p>
                  <p className="text-sm text-muted-foreground">Annual Premiums</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{providers.length}</p>
                  <p className="text-sm text-muted-foreground">Provider Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="policies">My Policies</TabsTrigger>
              <TabsTrigger value="providers">Provider Network</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            </TabsList>

            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New Policy
            </Button>
          </div>

          <TabsContent value="policies" className="space-y-4">
            {policies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {policies.map((policy) => (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(policy.type)}
                          <CardTitle className="text-lg">{policy.name}</CardTitle>
                        </div>
                        <Badge className={cn("capitalize", getStatusColor(policy.status))}>
                          {policy.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Provider</p>
                          <p className="font-medium">{policy.provider}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-medium">{formatCurrency(policy.coverage_amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Premium</p>
                          <p className="font-medium">
                            {formatCurrency(policy.premium)}/{policy.frequency}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Policy #</p>
                          <p className="font-medium text-xs">{policy.policy_number || 'N/A'}</p>
                        </div>
                      </div>
                      
                      {policy.beneficiaries && (
                        <div>
                          <p className="text-muted-foreground text-sm">Beneficiaries</p>
                          <p className="text-sm">{policy.beneficiaries}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit Policy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No insurance policies found</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by adding your first insurance policy or exploring our provider network.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Policy
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <Badge variant={provider.compliance_status === 'approved' ? 'default' : 'secondary'}>
                        {provider.compliance_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {provider.description}
                    </p>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Insurance Types</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.insurance_types.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs capitalize">
                            {type.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {provider.workflow && (
                      <div>
                        <p className="text-sm font-medium mb-1">Workflow</p>
                        <p className="text-xs text-muted-foreground">{provider.workflow}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Globe className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4">
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Fiduciary Insurance Education</h3>
                <p className="text-muted-foreground mb-6">
                  Get unbiased education and fiduciary advice on complex insurance products.
                </p>
                
                {/* Fiduciary Products */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/insurance/education/ltc'}>
                    <CardContent className="p-6 text-center">
                      <Heart className="h-8 w-8 mx-auto mb-3 text-red-600" />
                      <h4 className="font-semibold mb-2">Long-Term Care</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Protect your family from catastrophic care costs
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-3">
                        <Shield className="h-3 w-3 mr-1" />
                        Fiduciary Education
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/insurance/education/medicare'}>
                    <CardContent className="p-6 text-center">
                      <Shield className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                      <h4 className="font-semibold mb-2">Medicare Supplement</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Navigate Medicare options without sales pressure
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-3">
                        <Shield className="h-3 w-3 mr-1" />
                        Fiduciary Education
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/insurance/education/iul'}>
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                      <h4 className="font-semibold mb-2">Indexed Universal Life</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The truth about IUL vs. term + investing
                      </p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-3">
                        <Shield className="h-3 w-3 mr-1" />
                        Fiduciary Education
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Traditional Products */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Traditional Insurance Products</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    <Button variant="outline" className="flex flex-col h-20 gap-2">
                      <Car className="h-5 w-5" />
                      <span className="text-xs">Auto Insurance</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2">
                      <Home className="h-5 w-5" />
                      <span className="text-xs">Home Insurance</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2">
                      <Shield className="h-5 w-5" />
                      <span className="text-xs">Term Life</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2">
                      <Umbrella className="h-5 w-5" />
                      <span className="text-xs">Umbrella Policy</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}