import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, Clock, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProfessionalCredential {
  id: string;
  credential_type: string;
  credential_name: string;
  issuing_authority?: string;
  license_number?: string;
  issue_date?: string;
  expiration_date?: string;
  renewal_period?: string;
  current_hours: number;
  required_hours?: number;
  status: 'active' | 'expired' | 'suspended' | 'pending_renewal';
}

export const ProfessionalComplianceDashboard = () => {
  const [credentials, setCredentials] = useState<ProfessionalCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCredentials();
  }, [user]);

  const fetchCredentials = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('professional_credentials')
        .select('*')
        .eq('professional_id', user.id)
        .order('expiration_date');

      if (error) throw error;
      setCredentials(data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to load professional credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string, expirationDate?: string): "destructive" | "secondary" | "outline" | "default" => {
    if (status === 'expired') return 'destructive';
    if (status === 'suspended') return 'destructive';
    if (status === 'pending_renewal') return 'secondary';
    
    if (expirationDate) {
      const expiry = new Date(expirationDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry <= 30) return 'destructive';
      if (daysUntilExpiry <= 90) return 'secondary';
    }
    
    return 'default';
  };

  const getCredentialTypeDisplay = (type: string) => {
    switch (type) {
      case 'CPA_License':
        return 'CPA License';
      case 'Bar_License':
        return 'Bar License';
      case 'RIA_Registration':
        return 'RIA Registration';
      case 'Insurance_License':
        return 'Insurance License';
      case 'CPE_Hours':
        return 'CPE Hours';
      case 'CLE_Hours':
        return 'CLE Hours';
      default:
        return type.replace('_', ' ');
    }
  };

  const cpaCredentials = credentials.filter(c => ['CPA_License', 'CPE_Hours'].includes(c.credential_type));
  const attorneyCredentials = credentials.filter(c => ['Bar_License', 'CLE_Hours'].includes(c.credential_type));
  const riaCredentials = credentials.filter(c => c.credential_type === 'RIA_Registration');
  const insuranceCredentials = credentials.filter(c => c.credential_type === 'Insurance_License');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Professional Compliance Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Track professional credentials, continuing education, and renewal deadlines
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      {credentials.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No credentials tracked</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your professional credentials to track compliance requirements.
              </p>
              <div className="mt-6">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Credential
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="cpa" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cpa">CPA ({cpaCredentials.length})</TabsTrigger>
            <TabsTrigger value="attorney">Attorney ({attorneyCredentials.length})</TabsTrigger>
            <TabsTrigger value="ria">RIA ({riaCredentials.length})</TabsTrigger>
            <TabsTrigger value="insurance">Insurance ({insuranceCredentials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="cpa">
            <ProfessionalCredentialSection
              title="CPA Credentials"
              description="Track your CPA license and continuing professional education hours"
              credentials={cpaCredentials}
              getStatusColor={getStatusColor}
              getCredentialTypeDisplay={getCredentialTypeDisplay}
            />
          </TabsContent>

          <TabsContent value="attorney">
            <ProfessionalCredentialSection
              title="Attorney Credentials"
              description="Track your bar license and continuing legal education hours"
              credentials={attorneyCredentials}
              getStatusColor={getStatusColor}
              getCredentialTypeDisplay={getCredentialTypeDisplay}
            />
          </TabsContent>

          <TabsContent value="ria">
            <ProfessionalCredentialSection
              title="RIA Registration"
              description="Track your Registered Investment Advisor status and renewals"
              credentials={riaCredentials}
              getStatusColor={getStatusColor}
              getCredentialTypeDisplay={getCredentialTypeDisplay}
            />
          </TabsContent>

          <TabsContent value="insurance">
            <ProfessionalCredentialSection
              title="Insurance Licenses"
              description="Track your insurance licenses and continuing education requirements"
              credentials={insuranceCredentials}
              getStatusColor={getStatusColor}
              getCredentialTypeDisplay={getCredentialTypeDisplay}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

interface ProfessionalCredentialSectionProps {
  title: string;
  description: string;
  credentials: ProfessionalCredential[];
  getStatusColor: (status: string, expirationDate?: string) => "destructive" | "secondary" | "outline" | "default";
  getCredentialTypeDisplay: (type: string) => string;
}

const ProfessionalCredentialSection = ({ 
  title, 
  description, 
  credentials, 
  getStatusColor, 
  getCredentialTypeDisplay 
}: ProfessionalCredentialSectionProps) => {
  if (credentials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Award className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No {title.toLowerCase()} credentials added yet.
            </p>
            <Button className="mt-4" variant="outline">
              Add {title.split(' ')[0]} Credential
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <Card key={credential.id}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold">{credential.credential_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getCredentialTypeDisplay(credential.credential_type)}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusColor(credential.status, credential.expiration_date)}>
                {credential.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                {credential.license_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">License #:</span>
                    <span>{credential.license_number}</span>
                  </div>
                )}
                {credential.issuing_authority && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issuing Authority:</span>
                    <span>{credential.issuing_authority}</span>
                  </div>
                )}
                {credential.expiration_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className={
                      getStatusColor(credential.status, credential.expiration_date) === 'destructive' 
                        ? 'text-destructive' 
                        : ''
                    }>
                      {new Date(credential.expiration_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {credential.required_hours && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CE Hours:</span>
                    <span>{credential.current_hours} / {credential.required_hours}</span>
                  </div>
                  <Progress 
                    value={(credential.current_hours / credential.required_hours) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {credential.required_hours - credential.current_hours > 0 
                      ? `${credential.required_hours - credential.current_hours} hours remaining`
                      : 'Requirements met'
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Update Hours
              </Button>
              <Button size="sm" variant="outline">
                Upload Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};