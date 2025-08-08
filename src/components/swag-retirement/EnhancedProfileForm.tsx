import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Users, 
  Heart, 
  Briefcase, 
  FileText, 
  MapPin, 
  Building,
  DollarSign,
  TrendingUp,
  Home,
  Car,
  Plus,
  Trash2
} from 'lucide-react';
import { EnhancedProfile } from '@/types/swag-retirement';

interface EnhancedProfileFormProps {
  profile: EnhancedProfile;
  onProfileChange: (profile: EnhancedProfile) => void;
  className?: string;
}

export const EnhancedProfileForm: React.FC<EnhancedProfileFormProps> = ({
  profile,
  onProfileChange,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const updateProfile = (section: keyof EnhancedProfile, data: any) => {
    onProfileChange({
      ...profile,
      [section]: data
    });
  };

  const addArrayItem = (section: keyof EnhancedProfile, item: any) => {
    const current = profile[section] as any[];
    updateProfile(section, [...current, item]);
  };

  const removeArrayItem = (section: keyof EnhancedProfile, index: number) => {
    const current = profile[section] as any[];
    updateProfile(section, current.filter((_, i) => i !== index));
  };

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Enhanced Profile Setup</h2>
        <p className="text-muted-foreground">
          Complete your profile for comprehensive retirement planning
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
          <TabsTrigger value="family" className="text-xs">Family</TabsTrigger>
          <TabsTrigger value="professionals" className="text-xs">Team</TabsTrigger>
          <TabsTrigger value="estate" className="text-xs">Estate Docs</TabsTrigger>
          <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
          <TabsTrigger value="income" className="text-xs">Income</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Primary Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Full Name</Label>
                  <Input
                    id="clientName"
                    value={profile.primaryClient.name}
                    onChange={(e) => updateProfile('primaryClient', {
                      ...profile.primaryClient,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="clientAge">Age</Label>
                  <Input
                    id="clientAge"
                    type="number"
                    value={profile.primaryClient.age}
                    onChange={(e) => updateProfile('primaryClient', {
                      ...profile.primaryClient,
                      age: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="clientOccupation">Occupation</Label>
                  <Input
                    id="clientOccupation"
                    value={profile.primaryClient.occupation}
                    onChange={(e) => updateProfile('primaryClient', {
                      ...profile.primaryClient,
                      occupation: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="retirementAge">Planned Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={profile.primaryClient.retirementAge}
                    onChange={(e) => updateProfile('primaryClient', {
                      ...profile.primaryClient,
                      retirementAge: parseInt(e.target.value) || 65
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Tax Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State of Residence</Label>
                  <Select 
                    value={profile.stateOfResidence} 
                    onValueChange={(value) => updateProfile('stateOfResidence', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taxBracket">Current Tax Bracket (%)</Label>
                  <Input
                    id="taxBracket"
                    type="number"
                    step="0.1"
                    value={profile.taxBracket}
                    onChange={(e) => updateProfile('taxBracket', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Information */}
        <TabsContent value="family" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Spouse Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasSpouse"
                  checked={!!profile.spouse}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateProfile('spouse', {
                        name: '',
                        age: 0,
                        occupation: '',
                        retirementAge: 65
                      });
                    } else {
                      updateProfile('spouse', undefined);
                    }
                  }}
                />
                <Label htmlFor="hasSpouse">I have a spouse/partner</Label>
              </div>

              {profile.spouse && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spouseName">Spouse Name</Label>
                    <Input
                      id="spouseName"
                      value={profile.spouse.name}
                      onChange={(e) => updateProfile('spouse', {
                        ...profile.spouse!,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="spouseAge">Age</Label>
                    <Input
                      id="spouseAge"
                      type="number"
                      value={profile.spouse.age}
                      onChange={(e) => updateProfile('spouse', {
                        ...profile.spouse!,
                        age: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="spouseOccupation">Occupation</Label>
                    <Input
                      id="spouseOccupation"
                      value={profile.spouse.occupation}
                      onChange={(e) => updateProfile('spouse', {
                        ...profile.spouse!,
                        occupation: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="spouseRetirementAge">Retirement Age</Label>
                    <Input
                      id="spouseRetirementAge"
                      type="number"
                      value={profile.spouse.retirementAge}
                      onChange={(e) => updateProfile('spouse', {
                        ...profile.spouse!,
                        retirementAge: parseInt(e.target.value) || 65
                      })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Dependents
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('dependents', {
                    name: '',
                    age: 0,
                    relationship: '',
                    supportYears: 0
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependent
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {profile.dependents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No dependents added</p>
              ) : (
                <div className="space-y-4">
                  {profile.dependents.map((dependent, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Dependent {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('dependents', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={dependent.name}
                            onChange={(e) => {
                              const updated = [...profile.dependents];
                              updated[index] = { ...dependent, name: e.target.value };
                              updateProfile('dependents', updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Age</Label>
                          <Input
                            type="number"
                            value={dependent.age}
                            onChange={(e) => {
                              const updated = [...profile.dependents];
                              updated[index] = { ...dependent, age: parseInt(e.target.value) || 0 };
                              updateProfile('dependents', updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Relationship</Label>
                          <Input
                            value={dependent.relationship}
                            onChange={(e) => {
                              const updated = [...profile.dependents];
                              updated[index] = { ...dependent, relationship: e.target.value };
                              updateProfile('dependents', updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Years of Support</Label>
                          <Input
                            type="number"
                            value={dependent.supportYears}
                            onChange={(e) => {
                              const updated = [...profile.dependents];
                              updated[index] = { ...dependent, supportYears: parseInt(e.target.value) || 0 };
                              updateProfile('dependents', updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Team */}
        <TabsContent value="professionals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Advisory Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Attorney */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAttorney"
                    checked={!!profile.professionals.attorney}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateProfile('professionals', {
                          ...profile.professionals,
                          attorney: {
                            name: '',
                            firm: '',
                            contact: '',
                            specialties: []
                          }
                        });
                      } else {
                        const { attorney, ...rest } = profile.professionals;
                        updateProfile('professionals', rest);
                      }
                    }}
                  />
                  <Label htmlFor="hasAttorney">I have an attorney</Label>
                </div>

                {profile.professionals.attorney && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                    <div>
                      <Label>Attorney Name</Label>
                      <Input
                        value={profile.professionals.attorney.name}
                        onChange={(e) => updateProfile('professionals', {
                          ...profile.professionals,
                          attorney: {
                            ...profile.professionals.attorney!,
                            name: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Law Firm</Label>
                      <Input
                        value={profile.professionals.attorney.firm}
                        onChange={(e) => updateProfile('professionals', {
                          ...profile.professionals,
                          attorney: {
                            ...profile.professionals.attorney!,
                            firm: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Contact Information</Label>
                      <Input
                        value={profile.professionals.attorney.contact}
                        onChange={(e) => updateProfile('professionals', {
                          ...profile.professionals,
                          attorney: {
                            ...profile.professionals.attorney!,
                            contact: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Specialties (comma-separated)</Label>
                      <Input
                        value={profile.professionals.attorney.specialties.join(', ')}
                        onChange={(e) => updateProfile('professionals', {
                          ...profile.professionals,
                          attorney: {
                            ...profile.professionals.attorney!,
                            specialties: e.target.value.split(',').map(s => s.trim())
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Similar sections for Accountant and Insurance Agent */}
              {/* ... (abbreviated for space) */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estate Documents */}
        <TabsContent value="estate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Estate Planning Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(profile.estateDocuments).map(([docType, docInfo]) => (
                <div key={docType} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">
                      {docType.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <Badge variant={docInfo.hasDocument ? 'default' : 'secondary'}>
                      {docInfo.hasDocument ? 'Complete' : 'Missing'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      checked={docInfo.hasDocument}
                      onCheckedChange={(checked) => {
                        updateProfile('estateDocuments', {
                          ...profile.estateDocuments,
                          [docType]: {
                            ...docInfo,
                            hasDocument: !!checked
                          }
                        });
                      }}
                    />
                    <Label>I have this document</Label>
                  </div>

                  {docInfo.hasDocument && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Last Updated</Label>
                        <Input
                          type="date"
                          value={docInfo.lastUpdated ? new Date(docInfo.lastUpdated).toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            updateProfile('estateDocuments', {
                              ...profile.estateDocuments,
                              [docType]: {
                                ...docInfo,
                                lastUpdated: e.target.value ? new Date(e.target.value) : undefined
                              }
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Location/Notes</Label>
                        <Input
                          value={docInfo.location || ''}
                          onChange={(e) => {
                            updateProfile('estateDocuments', {
                              ...profile.estateDocuments,
                              [docType]: {
                                ...docInfo,
                                location: e.target.value
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Asset Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add your investment accounts, real estate, business interests, and other assets
              </p>
              <div className="text-center py-8">
                <Badge variant="outline" className="mb-2">Asset Inventory Module</Badge>
                <p className="text-sm text-muted-foreground">
                  Detailed asset collection form will be integrated here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Income Sources & Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Document all income sources and monthly expenses for accurate planning
              </p>
              <div className="text-center py-8">
                <Badge variant="outline" className="mb-2">Income & Expense Module</Badge>
                <p className="text-sm text-muted-foreground">
                  Comprehensive income and expense tracking form will be integrated here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6">
        <Button variant="outline">Save Draft</Button>
        <Button>Continue to Analysis</Button>
      </div>
    </div>
  );
};