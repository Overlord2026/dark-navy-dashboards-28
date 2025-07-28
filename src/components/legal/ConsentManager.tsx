import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsentRecord {
  id: string;
  consent_type: string;
  version: string;
  given_at: string;
  withdrawn_at?: string;
  is_active: boolean;
}

interface ConsentType {
  type: string;
  title: string;
  description: string;
  version: string;
  required: boolean;
  currentConsent?: ConsentRecord;
}

export const ConsentManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const consentTypes: ConsentType[] = [
    {
      type: 'privacy_policy',
      title: 'Privacy Policy',
      description: 'Consent to collection and processing of personal data',
      version: '2.0',
      required: true
    },
    {
      type: 'terms_of_service',
      title: 'Terms of Service',
      description: 'Agreement to platform terms and conditions',
      version: '1.5',
      required: true
    },
    {
      type: 'marketing_communications',
      title: 'Marketing Communications',
      description: 'Consent to receive marketing emails and notifications',
      version: '1.0',
      required: false
    },
    {
      type: 'analytics_tracking',
      title: 'Analytics & Tracking',
      description: 'Consent to usage analytics and performance tracking',
      version: '1.0',
      required: false
    },
    {
      type: 'hipaa_authorization',
      title: 'HIPAA Authorization',
      description: 'Authorization for use and disclosure of health information',
      version: '1.0',
      required: true
    }
  ];

  useEffect(() => {
    if (user) {
      loadUserConsents();
    }
  }, [user]);

  const loadUserConsents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', user.id)
        .order('given_at', { ascending: false });

      if (error) throw error;

      setConsents(data || []);
    } catch (error) {
      console.error('Error loading user consents:', error);
      toast({
        title: "Error",
        description: "Failed to load consent records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const giveConsent = async (consentType: string, version: string) => {
    if (!user) return;

    try {
      // Withdraw any existing consent for this type
      await supabase
        .from('user_consent')
        .update({ 
          is_active: false, 
          withdrawn_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('consent_type', consentType)
        .eq('is_active', true);

      // Insert new consent
      const { error } = await supabase
        .from('user_consent')
        .insert({
          user_id: user.id,
          consent_type: consentType,
          version: version,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Consent Updated",
        description: "Your consent preferences have been saved",
      });

      await loadUserConsents();
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: "Error",
        description: "Failed to update consent",
        variant: "destructive",
      });
    }
  };

  const withdrawConsent = async (consentType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_consent')
        .update({ 
          is_active: false, 
          withdrawn_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('consent_type', consentType)
        .eq('is_active', true);

      if (error) throw error;

      toast({
        title: "Consent Withdrawn",
        description: "Your consent has been withdrawn",
      });

      await loadUserConsents();
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw consent",
        variant: "destructive",
      });
    }
  };

  const exportConsentHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { 
          export_type: 'consent_history',
          format: 'pdf' 
        }
      });

      if (error) throw error;

      // Trigger download
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consent-history-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting consent history:', error);
      toast({
        title: "Error",
        description: "Failed to export consent history",
        variant: "destructive",
      });
    }
  };

  // Map current consents to consent types
  const consentTypesWithStatus = consentTypes.map(type => {
    const currentConsent = consents.find(
      c => c.consent_type === type.type && c.is_active
    );
    
    return {
      ...type,
      currentConsent
    };
  });

  const getConsentStatus = (consentType: ConsentType) => {
    if (consentType.currentConsent) {
      const isCurrentVersion = consentType.currentConsent.version === consentType.version;
      return isCurrentVersion ? 'current' : 'outdated';
    }
    return consentType.required ? 'required' : 'not_given';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'outdated':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'required':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'outdated':
        return 'bg-yellow-100 text-yellow-800';
      case 'required':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 animate-spin" />
            <span>Loading consent preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Privacy & Consent Management</h2>
          <p className="text-muted-foreground">Manage your data processing consents and privacy preferences</p>
        </div>
        <Button onClick={exportConsentHistory} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Consent Types */}
      <div className="space-y-4">
        {consentTypesWithStatus.map((consentType) => {
          const status = getConsentStatus(consentType);
          const hasConsent = !!consentType.currentConsent;
          
          return (
            <Card key={consentType.type}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <h3 className="font-medium">{consentType.title}</h3>
                      <Badge className={getStatusColor(status)}>
                        {status === 'current' ? 'Active' :
                         status === 'outdated' ? 'Update Required' :
                         status === 'required' ? 'Required' : 'Not Given'}
                      </Badge>
                      {consentType.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {consentType.description}
                    </p>
                    
                    {consentType.currentConsent && (
                      <div className="text-xs text-muted-foreground">
                        <p>Given on: {new Date(consentType.currentConsent.given_at).toLocaleString()}</p>
                        <p>Version: {consentType.currentConsent.version}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {hasConsent ? (
                      <>
                        {status === 'outdated' && (
                          <Button
                            size="sm"
                            onClick={() => giveConsent(consentType.type, consentType.version)}
                          >
                            Update
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => withdrawConsent(consentType.type)}
                          disabled={consentType.required}
                        >
                          Withdraw
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => giveConsent(consentType.type, consentType.version)}
                        variant={consentType.required ? "default" : "outline"}
                      >
                        Give Consent
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* GDPR Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Right to Access</h4>
              <p className="text-sm text-muted-foreground">
                Request a copy of all personal data we hold about you
              </p>
              <Button size="sm" variant="outline">
                Request Data Export
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Right to Rectification</h4>
              <p className="text-sm text-muted-foreground">
                Correct any inaccurate or incomplete data
              </p>
              <Button size="sm" variant="outline">
                Update Profile
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Right to Erasure</h4>
              <p className="text-sm text-muted-foreground">
                Request deletion of your personal data
              </p>
              <Button size="sm" variant="outline">
                Request Deletion
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Right to Portability</h4>
              <p className="text-sm text-muted-foreground">
                Export your data in a machine-readable format
              </p>
              <Button size="sm" variant="outline">
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};