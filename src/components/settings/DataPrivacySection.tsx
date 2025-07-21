import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Download, 
  Shield, 
  Eye, 
  FileText,
  Clock,
  Globe,
  Lock,
  AlertTriangle
} from "lucide-react";

export function DataPrivacySection() {
  const dataCategories = [
    {
      category: 'Personal Information',
      icon: Shield,
      items: ['Name, email, phone', 'Address, birthday', 'Family relationships'],
      size: '2.3 MB',
      lastUpdated: '2024-01-20'
    },
    {
      category: 'Financial Data',
      icon: Database,
      items: ['Account balances', 'Transaction history', 'Investment portfolios'],
      size: '15.7 MB',
      lastUpdated: '2024-01-21'
    },
    {
      category: 'Health Records',
      icon: FileText,
      items: ['Medical documents', 'Prescription history', 'Health metrics'],
      size: '8.2 MB',
      lastUpdated: '2024-01-19'
    },
    {
      category: 'Professional Communications',
      icon: Eye,
      items: ['Messages with advisors', 'Meeting notes', 'Document shares'],
      size: '4.1 MB',
      lastUpdated: '2024-01-21'
    }
  ];

  const privacySettings = [
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Help improve our platform with anonymized usage data',
      enabled: true,
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing Communications',
      description: 'Receive product updates and educational content',
      enabled: false,
      required: false
    },
    {
      id: 'marketplace',
      name: 'Marketplace Visibility',
      description: 'Allow your profile to be discoverable in professional search',
      enabled: true,
      required: false
    },
    {
      id: 'essential',
      name: 'Essential Services',
      description: 'Account notifications and security communications',
      enabled: true,
      required: true
    }
  ];

  const dataRetention = [
    {
      type: 'Financial Records',
      period: '7 years',
      reason: 'Tax and regulatory compliance',
      required: true
    },
    {
      type: 'Communication History',
      period: '3 years',
      reason: 'Service quality and dispute resolution',
      required: false
    },
    {
      type: 'Usage Analytics',
      period: '2 years',
      reason: 'Platform improvement and analysis',
      required: false
    },
    {
      type: 'Marketing Data',
      period: '1 year',
      reason: 'Personalized communications',
      required: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Your Data Overview
          </CardTitle>
          <CardDescription>
            See what information we store and how it's protected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataCategories.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <category.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.category}</span>
                      <Badge variant="outline">{category.size}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{category.items.join(' • ')}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        Updated: {category.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Preferences
          </CardTitle>
          <CardDescription>
            Control how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {privacySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">{setting.name}</Label>
                  {setting.required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch 
                defaultChecked={setting.enabled} 
                disabled={setting.required}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Retention Policy
          </CardTitle>
          <CardDescription>
            How long we keep different types of information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataRetention.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.type}</span>
                    <Badge variant="outline">{item.period}</Badge>
                    {item.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.reason}
                  </p>
                </div>
                {!item.required && (
                  <Button variant="outline" size="sm">
                    Customize
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
          <CardDescription>
            Your data protection status and certifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-medium">Encryption</span>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                All data encrypted at rest and in transit
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-green-500" />
                <span className="font-medium">SOC 2 Compliance</span>
                <Badge variant="default">Certified</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Annual third-party security audits
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span className="font-medium">Access Controls</span>
                <Badge variant="default">Secured</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Role-based permissions and audit logs
              </p>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="font-medium">Data Backups</span>
                <Badge variant="default">Protected</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Automated backups with encryption
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Documents
          </CardTitle>
          <CardDescription>
            Review our privacy policy and terms of service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Privacy Policy</span>
              <p className="text-sm text-muted-foreground">
                Last updated: January 1, 2024
              </p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Terms of Service</span>
              <p className="text-sm text-muted-foreground">
                Last updated: January 1, 2024
              </p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Data Processing Agreement</span>
              <p className="text-sm text-muted-foreground">
                For enterprise customers
              </p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Data Rights & Requests</CardTitle>
          <CardDescription>
            Exercise your rights regarding your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <Label className="font-medium">Important Notice</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Some data requests may affect your ability to use our services. 
              Please review the implications before proceeding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline">
              Request Data Correction
            </Button>
            <Button variant="outline">
              Request Data Portability
            </Button>
            <Button variant="outline">
              Restrict Data Processing
            </Button>
            <Button variant="outline">
              Object to Processing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}