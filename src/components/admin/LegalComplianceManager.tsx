import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { FileText, Globe, Languages, Download, Copy, Send, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface LegalTemplate {
  id: string;
  title: string;
  type: 'privacy' | 'terms' | 'disclosure' | 'disclaimer';
  language: string;
  content: string;
  lastUpdated: Date;
  isActive: boolean;
  complianceRegions: string[];
}

const LegalComplianceManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', regions: ['US', 'CA', 'AU', 'GB'] },
    { code: 'es', name: 'Español', flag: '🇪🇸', regions: ['ES', 'MX', 'AR', 'CL'] },
    { code: 'fr', name: 'Français', flag: '🇫🇷', regions: ['FR', 'CA', 'BE', 'CH'] },
    { code: 'zh', name: '中文', flag: '🇨🇳', regions: ['CN', 'TW', 'HK', 'SG'] },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', regions: ['IN'] },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', regions: ['SA', 'AE', 'QA', 'KW'] },
  ];

  // Mock legal templates data
  const legalTemplates: LegalTemplate[] = [
    {
      id: 'privacy-en',
      title: 'Privacy Policy',
      type: 'privacy',
      language: 'en',
      content: `# BFOCFO Privacy Policy

## Effective Date: [Date]

At Boutique Family Office Platform™ (BFOCFO), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.

## Information We Collect

### Personal Information
- Contact details (name, email, phone, address)
- Financial information (account details, investment preferences)
- Identity verification documents
- Communication records

### Usage Data
- Platform interaction data
- Device and browser information
- IP addresses and location data
- Cookies and tracking technologies

## How We Use Your Information

1. **Service Provision**: To provide and maintain our family office platform services
2. **Account Management**: To manage your account and provide customer support
3. **Security**: To protect against fraud and ensure platform security
4. **Compliance**: To meet legal and regulatory requirements
5. **Communications**: To send service updates and notifications

## Data Protection & Security

We implement bank-grade security measures including:
- End-to-end encryption
- Zero-knowledge architecture
- Multi-factor authentication
- Regular security audits
- SOC 2 Type II compliance

## Your Rights

Depending on your jurisdiction, you may have rights including:
- Access to your personal data
- Data portability
- Correction of inaccurate data
- Deletion of personal data
- Objection to processing
- Withdrawal of consent

## International Transfers

We operate globally and may transfer data across borders. We ensure appropriate safeguards are in place for international transfers.

## Contact Us

For privacy-related inquiries:
Email: privacy@bfocfo.com
Address: [Company Address]

This policy is available in multiple languages at [website]/legal`,
      lastUpdated: new Date('2024-01-15'),
      isActive: true,
      complianceRegions: ['US', 'CA', 'AU', 'GB']
    },
    {
      id: 'privacy-es',
      title: 'Política de Privacidad',
      type: 'privacy',
      language: 'es',
      content: `# Política de Privacidad de BFOCFO

## Fecha de Vigencia: [Fecha]

En Boutique Family Office Platform™ (BFOCFO), estamos comprometidos a proteger su privacidad y garantizar la seguridad de su información personal.

## Información que Recopilamos

### Información Personal
- Detalles de contacto (nombre, correo, teléfono, dirección)
- Información financiera (detalles de cuenta, preferencias de inversión)
- Documentos de verificación de identidad
- Registros de comunicación

## Cómo Usamos Su Información

1. **Prestación de Servicios**: Para proporcionar y mantener nuestros servicios
2. **Gestión de Cuenta**: Para gestionar su cuenta y brindar soporte al cliente
3. **Seguridad**: Para proteger contra fraudes y garantizar la seguridad
4. **Cumplimiento**: Para cumplir con requisitos legales y regulatorios

## Sus Derechos

Dependiendo de su jurisdicción, puede tener derechos que incluyen:
- Acceso a sus datos personales
- Portabilidad de datos
- Corrección de datos inexactos
- Eliminación de datos personales

## Contáctenos

Para consultas relacionadas con privacidad:
Correo: privacy@bfocfo.com`,
      lastUpdated: new Date('2024-01-15'),
      isActive: true,
      complianceRegions: ['ES', 'MX', 'AR', 'CL']
    },
    {
      id: 'terms-en',
      title: 'Terms of Service',
      type: 'terms',
      language: 'en',
      content: `# BFOCFO Terms of Service

## Acceptance of Terms

By accessing and using the Boutique Family Office Platform™, you accept and agree to be bound by these Terms of Service.

## Services Description

BFOCFO provides a digital family office platform that includes:
- Secure document storage and management
- Financial planning tools and resources
- Access to professional advisors
- Legacy planning capabilities

## User Responsibilities

1. **Account Security**: Maintain confidentiality of login credentials
2. **Accurate Information**: Provide truthful and current information
3. **Compliance**: Follow all applicable laws and regulations
4. **Prohibited Uses**: Do not use the platform for illegal activities

## Service Availability

- Platform available 24/7 with scheduled maintenance windows
- 99.9% uptime service level agreement
- Customer support during business hours

## Limitation of Liability

BFOCFO's liability is limited to the extent permitted by law. We are not liable for indirect, incidental, or consequential damages.

## Governing Law

These terms are governed by [Jurisdiction] law.

## Contact Information

For legal inquiries: legal@bfocfo.com`,
      lastUpdated: new Date('2024-01-10'),
      isActive: true,
      complianceRegions: ['US', 'CA']
    }
  ];

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard');
  };

  const downloadTemplate = (template: LegalTemplate) => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title}_${template.language}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTemplates = legalTemplates.filter(template => 
    selectedLanguage === 'all' || template.language === selectedLanguage
  );

  const getComplianceRegions = (template: LegalTemplate) => {
    return template.complianceRegions.map(region => {
      const lang = languages.find(l => l.regions.includes(region));
      return { region, flag: lang?.flag || '🌍' };
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            {t('legal.compliance.title', 'Legal & Compliance Manager')}
          </h1>
          <p className="text-muted-foreground">{t('legal.compliance.description', 'Manage legal documents and compliance across all regions')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            6 Languages
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {legalTemplates.length} Templates
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Matrix</TabsTrigger>
          <TabsTrigger value="localization">Auto-Localization</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Template List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Templates</CardTitle>
                <CardDescription>Select a template to view or edit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {languages.find(l => l.code === template.language)?.flag}
                        </span>
                        <span className="font-medium text-sm">{template.title}</span>
                      </div>
                      <Badge variant={template.isActive ? 'default' : 'secondary'} className="text-xs">
                        {template.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getComplianceRegions(template).map(r => r.flag).join(' ')}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      Updated: {template.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedTemplate ? (
                        <>
                          <span>{languages.find(l => l.code === selectedTemplate.language)?.flag}</span>
                          {selectedTemplate.title}
                        </>
                      ) : (
                        'Select a Template'
                      )}
                    </CardTitle>
                    {selectedTemplate && (
                      <CardDescription>
                        {selectedTemplate.type} • {selectedTemplate.language} • 
                        Regions: {getComplianceRegions(selectedTemplate).map(r => r.region).join(', ')}
                      </CardDescription>
                    )}
                  </div>
                  {selectedTemplate && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {isEditing ? 'Preview' : 'Edit'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(selectedTemplate.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadTemplate(selectedTemplate)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="template-title">Template Title</Label>
                          <Input id="template-title" defaultValue={selectedTemplate.title} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="template-type">Document Type</Label>
                            <Select defaultValue={selectedTemplate.type}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="privacy">Privacy Policy</SelectItem>
                                <SelectItem value="terms">Terms of Service</SelectItem>
                                <SelectItem value="disclosure">Risk Disclosure</SelectItem>
                                <SelectItem value="disclaimer">Legal Disclaimer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="template-active" 
                              defaultChecked={selectedTemplate.isActive}
                            />
                            <Label htmlFor="template-active">Active Template</Label>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="template-content">Template Content</Label>
                          <Textarea 
                            id="template-content"
                            defaultValue={selectedTemplate.content}
                            className="min-h-[400px] font-mono text-sm"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button>Save Changes</Button>
                          <Button variant="outline">Preview</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm">
                            {selectedTemplate.content}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a template from the list to view or edit its content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Compliance Matrix</CardTitle>
              <CardDescription>Track compliance requirements across all regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {languages.map((language) => (
                  <div key={language.code} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{language.flag}</span>
                      <h3 className="font-semibold">{language.name} Markets</h3>
                      <Badge variant="outline">{language.regions.join(', ')}</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-3">
                      {['privacy', 'terms', 'disclosure', 'disclaimer'].map((docType) => {
                        const hasTemplate = legalTemplates.some(t => 
                          t.language === language.code && t.type === docType && t.isActive
                        );
                        
                        return (
                          <div key={docType} className={`p-3 rounded border ${
                            hasTemplate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                hasTemplate ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className="text-sm font-medium capitalize">{docType}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {hasTemplate ? 'Compliant' : 'Missing'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Localization Engine</CardTitle>
              <CardDescription>Automatically translate and localize legal documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source-language">Source Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="target-languages">Target Languages</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select languages to translate to" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="source-content">Source Document Content</Label>
                <Textarea 
                  id="source-content"
                  placeholder="Paste the legal document content to translate..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button>
                  <Languages className="h-4 w-4 mr-2" />
                  Auto-Translate
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Translations
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send for Legal Review
                </Button>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Translation Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All legal translations require professional legal review</li>
                  <li>• Regulatory terms must maintain specific regional terminology</li>
                  <li>• Contact information and addresses must be localized</li>
                  <li>• Compliance references must reflect local regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalComplianceManager;