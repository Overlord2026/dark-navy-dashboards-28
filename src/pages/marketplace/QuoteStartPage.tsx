import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Car, Home, Shield, Plus, Trash2 } from 'lucide-react';
import { startQuoteSession } from '@/services/marketplace';

interface Vehicle {
  year: string;
  make: string;
  model: string;
  use: string;
}

interface Driver {
  age: string;
  license_years: string;
  violations: boolean;
}

interface Property {
  type: string;
  year_built: string;
  square_feet: string;
  value: string;
}

export function QuoteStartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state
  const [coverageType, setCoverageType] = useState<'auto' | 'home' | 'both'>('auto');
  const [personalInfo, setPersonalInfo] = useState({
    zip_code: '',
    state: '',
    current_carrier: '',
    desired_coverage_level: 'standard'
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { year: '', make: '', model: '', use: 'commute' }
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    { age: '', license_years: '', violations: false }
  ]);

  const [properties, setProperties] = useState<Property[]>([
    { type: 'single_family', year_built: '', square_feet: '', value: '' }
  ]);

  const [coverageNeeds, setCoverageNeeds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const intakeData = {
        coverage_type: coverageType,
        ...personalInfo,
        vehicles: coverageType === 'home' ? [] : vehicles,
        drivers: coverageType === 'home' ? [] : drivers,
        properties: coverageType === 'auto' ? [] : properties,
        coverage_needs: coverageNeeds,
        submitted_at: new Date().toISOString()
      };

      const session = await startQuoteSession(intakeData);

      toast({
        title: "Quote Request Submitted",
        description: "Your quote request has been submitted and will be processed shortly."
      });

      // Navigate to quote status page
      navigate(`/quotes/${session.id}`);
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { year: '', make: '', model: '', use: 'commute' }]);
  };

  const removeVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const addDriver = () => {
    setDrivers([...drivers, { age: '', license_years: '', violations: false }]);
  };

  const removeDriver = (index: number) => {
    setDrivers(drivers.filter((_, i) => i !== index));
  };

  const addProperty = () => {
    setProperties([...properties, { type: 'single_family', year_built: '', square_feet: '', value: '' }]);
  };

  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const toggleCoverageNeed = (need: string) => {
    setCoverageNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
    );
  };

  const coverageOptions = [
    'collision', 'comprehensive', 'rental_reimbursement', 'roadside_assistance',
    'gap_coverage', 'new_car_replacement', 'personal_injury_protection',
    'uninsured_motorist', 'umbrella', 'flood', 'earthquake'
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Get Your Insurance Quote</h1>
            <p className="text-muted-foreground">Tell us about your insurance needs and we'll connect you with licensed agents</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coverage Type */}
            <Card>
              <CardHeader>
                <CardTitle>What type of coverage do you need?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={coverageType === 'auto' ? 'default' : 'outline'}
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setCoverageType('auto')}
                  >
                    <Car className="h-6 w-6" />
                    Auto Insurance
                  </Button>
                  <Button
                    type="button"
                    variant={coverageType === 'home' ? 'default' : 'outline'}
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setCoverageType('home')}
                  >
                    <Home className="h-6 w-6" />
                    Home Insurance
                  </Button>
                  <Button
                    type="button"
                    variant={coverageType === 'both' ? 'default' : 'outline'}
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setCoverageType('both')}
                  >
                    <Shield className="h-6 w-6" />
                    Bundle Both
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={personalInfo.zip_code}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, zip_code: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={personalInfo.state}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="e.g., CA, NY, TX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="current_carrier">Current Insurance Carrier</Label>
                  <Input
                    id="current_carrier"
                    value={personalInfo.current_carrier}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, current_carrier: e.target.value }))}
                    placeholder="e.g., State Farm, Geico"
                  />
                </div>
                <div>
                  <Label htmlFor="coverage_level">Desired Coverage Level</Label>
                  <Select 
                    value={personalInfo.desired_coverage_level}
                    onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, desired_coverage_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="enhanced">Enhanced</SelectItem>
                      <SelectItem value="maximum">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Vehicles */}
            {(coverageType === 'auto' || coverageType === 'both') && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Vehicles</CardTitle>
                    <Button type="button" onClick={addVehicle} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Year</Label>
                        <Input
                          value={vehicle.year}
                          onChange={(e) => {
                            const newVehicles = [...vehicles];
                            newVehicles[index].year = e.target.value;
                            setVehicles(newVehicles);
                          }}
                          placeholder="2020"
                        />
                      </div>
                      <div>
                        <Label>Make</Label>
                        <Input
                          value={vehicle.make}
                          onChange={(e) => {
                            const newVehicles = [...vehicles];
                            newVehicles[index].make = e.target.value;
                            setVehicles(newVehicles);
                          }}
                          placeholder="Honda"
                        />
                      </div>
                      <div>
                        <Label>Model</Label>
                        <Input
                          value={vehicle.model}
                          onChange={(e) => {
                            const newVehicles = [...vehicles];
                            newVehicles[index].model = e.target.value;
                            setVehicles(newVehicles);
                          }}
                          placeholder="Civic"
                        />
                      </div>
                      <div>
                        <Label>Primary Use</Label>
                        <Select 
                          value={vehicle.use}
                          onValueChange={(value) => {
                            const newVehicles = [...vehicles];
                            newVehicles[index].use = value;
                            setVehicles(newVehicles);
                          }}
                        >
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
                      <div className="flex items-end">
                        {vehicles.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeVehicle(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Drivers */}
            {(coverageType === 'auto' || coverageType === 'both') && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Drivers</CardTitle>
                    <Button type="button" onClick={addDriver} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Driver
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {drivers.map((driver, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Age</Label>
                        <Input
                          value={driver.age}
                          onChange={(e) => {
                            const newDrivers = [...drivers];
                            newDrivers[index].age = e.target.value;
                            setDrivers(newDrivers);
                          }}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label>Years Licensed</Label>
                        <Input
                          value={driver.license_years}
                          onChange={(e) => {
                            const newDrivers = [...drivers];
                            newDrivers[index].license_years = e.target.value;
                            setDrivers(newDrivers);
                          }}
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <Label>Recent Violations</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id={`violations-${index}`}
                            checked={driver.violations}
                            onCheckedChange={(checked) => {
                              const newDrivers = [...drivers];
                              newDrivers[index].violations = !!checked;
                              setDrivers(newDrivers);
                            }}
                          />
                          <Label htmlFor={`violations-${index}`}>Yes</Label>
                        </div>
                      </div>
                      <div className="flex items-end">
                        {drivers.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeDriver(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Properties */}
            {(coverageType === 'home' || coverageType === 'both') && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Properties</CardTitle>
                    <Button type="button" onClick={addProperty} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Property
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {properties.map((property, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Property Type</Label>
                        <Select 
                          value={property.type}
                          onValueChange={(value) => {
                            const newProperties = [...properties];
                            newProperties[index].type = value;
                            setProperties(newProperties);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single_family">Single Family</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="rental">Rental Property</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Year Built</Label>
                        <Input
                          value={property.year_built}
                          onChange={(e) => {
                            const newProperties = [...properties];
                            newProperties[index].year_built = e.target.value;
                            setProperties(newProperties);
                          }}
                          placeholder="1995"
                        />
                      </div>
                      <div>
                        <Label>Square Feet</Label>
                        <Input
                          value={property.square_feet}
                          onChange={(e) => {
                            const newProperties = [...properties];
                            newProperties[index].square_feet = e.target.value;
                            setProperties(newProperties);
                          }}
                          placeholder="2000"
                        />
                      </div>
                      <div>
                        <Label>Estimated Value</Label>
                        <Input
                          value={property.value}
                          onChange={(e) => {
                            const newProperties = [...properties];
                            newProperties[index].value = e.target.value;
                            setProperties(newProperties);
                          }}
                          placeholder="$400,000"
                        />
                      </div>
                      <div className="flex items-end">
                        {properties.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeProperty(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Coverage Needs */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Coverage Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {coverageOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={coverageNeeds.includes(option)}
                        onCheckedChange={() => toggleCoverageNeed(option)}
                      />
                      <Label htmlFor={option} className="text-sm">
                        {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="text-center">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? 'Submitting...' : 'Get My Quote'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Your information will be securely transmitted to licensed agents
              </p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}