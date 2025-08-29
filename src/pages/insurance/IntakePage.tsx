import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { submitIntake, InsuranceRisk } from '@/services/insuranceIntake';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, Car } from 'lucide-react';
import { toast } from 'sonner';

export function IntakePage() {
  const navigate = useNavigate();
  const [insuranceType, setInsuranceType] = useState<'home' | 'auto'>('home');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Applicant info
    age: '',
    credit_score: '',
    zip_code: '',
    
    // Home specific
    property_value: '',
    year_built: '',
    construction_type: 'frame',
    protection_class: 'class_4',
    
    // Auto specific
    vehicle_year: '',
    vehicle_make: '',
    vehicle_usage: 'commute',
    safety_rating: 'good',
    
    // Coverage
    coverage_limits: {} as Record<string, string>,
    deductibles: {} as Record<string, string>
  });

  // Map UI form to risk
  const toRisk = (form: any, type: 'home'|'auto'): InsuranceRisk => {
    if (type === 'home') {
      return {
        type: 'home',
        applicant: {
          age_band: form.age,
          credit_band: form.credit_score,
          location_zip_first3: form.zip_code.slice(0,3)
        },
        property: {
          year_built_band: form.year_built,
          value_band: form.property_value,
          construction_type: form.construction_type,
          protection_class: form.protection_class,
        },
        coverage_limits: form.coverage_limits || {},
        deductibles: form.deductibles || {}
      };
    }
    return {
      type: 'auto',
      applicant: {
        age_band: form.age,
        credit_band: form.credit_score,
        location_zip_first3: form.zip_code.slice(0,3)
      },
      vehicle: {
        year_band: form.vehicle_year,
        make_category: form.vehicle_make,
        usage_type: form.vehicle_usage,
        safety_rating_band: form.safety_rating,
      },
      coverage_limits: form.coverage_limits || {},
      deductibles: form.deductibles || {}
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert form data to risk using discriminated union
      const risk = toRisk(formData, insuranceType);
      const submissionId = await submitIntake(risk);
      
      toast.success('Intake submitted successfully!');
      navigate(`/insurance/quote/${submissionId}`);
    } catch (error) {
      console.error('Intake submission failed:', error);
      toast.error('Failed to submit intake. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCoverage = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      coverage_limits: { ...prev.coverage_limits, [key]: value }
    }));
  };

  const updateDeductible = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      deductibles: { ...prev.deductibles, [key]: value }
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Insurance Intake</h1>
        <Badge variant="secondary">Personal Lines</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={insuranceType} onValueChange={(value) => setInsuranceType(value as 'home' | 'auto')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Homeowners
              </TabsTrigger>
              <TabsTrigger value="auto" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Auto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="credit_score">Credit Score</Label>
                  <Input
                    id="credit_score"
                    value={formData.credit_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, credit_score: e.target.value }))}
                    placeholder="700"
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="property_value">Property Value</Label>
                  <Input
                    id="property_value"
                    value={formData.property_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_value: e.target.value }))}
                    placeholder="300000"
                  />
                </div>
                <div>
                  <Label htmlFor="year_built">Year Built</Label>
                  <Input
                    id="year_built"
                    value={formData.year_built}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_built: e.target.value }))}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="construction_type">Construction Type</Label>
                  <Select value={formData.construction_type} onValueChange={(value) => setFormData(prev => ({ ...prev, construction_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frame">Frame</SelectItem>
                      <SelectItem value="masonry">Masonry</SelectItem>
                      <SelectItem value="steel">Steel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coverage Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Dwelling Coverage</Label>
                    <Select onValueChange={(value) => updateCoverage('dwelling', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="replacement_cost">Replacement Cost</SelectItem>
                        <SelectItem value="actual_cash_value">Actual Cash Value</SelectItem>
                        <SelectItem value="extended_replacement">Extended Replacement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Liability Coverage</Label>
                    <Select onValueChange={(value) => updateCoverage('liability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100000">$100,000</SelectItem>
                        <SelectItem value="300000">$300,000</SelectItem>
                        <SelectItem value="500000">$500,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>All Other Perils Deductible</Label>
                  <Select onValueChange={(value) => updateDeductible('all_other_perils', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deductible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                      <SelectItem value="2500">$2,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="auto" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="credit_score">Credit Score</Label>
                  <Input
                    id="credit_score"
                    value={formData.credit_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, credit_score: e.target.value }))}
                    placeholder="700"
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_year">Vehicle Year</Label>
                  <Input
                    id="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_year: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_make">Vehicle Make</Label>
                  <Input
                    id="vehicle_make"
                    value={formData.vehicle_make}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_make: e.target.value }))}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle_usage">Usage Type</Label>
                  <Select value={formData.vehicle_usage} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_usage: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commute">Commute</SelectItem>
                      <SelectItem value="pleasure">Pleasure</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coverage Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Bodily Injury Liability</Label>
                    <Select onValueChange={(value) => updateCoverage('bodily_injury', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100000/300000">$100,000/$300,000</SelectItem>
                        <SelectItem value="250000/500000">$250,000/$500,000</SelectItem>
                        <SelectItem value="500000/1000000">$500,000/$1,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Property Damage Liability</Label>
                    <Select onValueChange={(value) => updateCoverage('property_damage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50000">$50,000</SelectItem>
                        <SelectItem value="100000">$100,000</SelectItem>
                        <SelectItem value="250000">$250,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Collision Deductible</Label>
                    <Select onValueChange={(value) => updateDeductible('collision', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deductible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="250">$250</SelectItem>
                        <SelectItem value="500">$500</SelectItem>
                        <SelectItem value="1000">$1,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Comprehensive Deductible</Label>
                    <Select onValueChange={(value) => updateDeductible('comprehensive', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deductible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="250">$250</SelectItem>
                        <SelectItem value="500">$500</SelectItem>
                        <SelectItem value="1000">$1,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit} disabled={loading} size="lg">
              {loading ? 'Submitting...' : 'Get Quote'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        All personal information is normalized and banded for privacy • Creates Intake-RDS receipt
      </div>
    </div>
  );
}

export default IntakePage;