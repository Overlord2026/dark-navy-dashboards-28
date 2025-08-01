import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { 
  Globe, 
  Palette, 
  Upload, 
  Eye, 
  Copy, 
  CheckCircle, 
  Settings, 
  HelpCircle,
  BookOpen,
  Plus,
  Trash2,
  Monitor,
  Smartphone,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandSettings {
  firmName: string;
  subdomain: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCss: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'guide';
  url: string;
  category: string;
  isPublic: boolean;
}

const defaultBrandSettings: BrandSettings = {
  firmName: 'Smith CPAs',
  subdomain: 'smithcpas',
  primaryColor: '#1B1B32',
  secondaryColor: '#2D2D4A',
  accentColor: '#0EA5E9',
  logoUrl: '',
  faviconUrl: '',
  customCss: ''
};

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I upload my tax documents?',
    answer: 'You can upload documents through the secure document portal. Click on "Documents" in your dashboard and follow the upload instructions.',
    category: 'Documents',
    order: 1
  },
  {
    id: '2',
    question: 'When will my tax return be completed?',
    answer: 'Tax returns are typically completed within 5-10 business days after we receive all required documents.',
    category: 'Tax Services',
    order: 2
  }
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Tax Document Checklist',
    description: 'Complete checklist of documents needed for your tax return',
    type: 'document',
    url: '/resources/tax-checklist.pdf',
    category: 'Tax Preparation',
    isPublic: true
  },
  {
    id: '2',
    title: 'How to Use the Client Portal',
    description: 'Step-by-step video guide for navigating your client portal',
    type: 'video',
    url: '/resources/portal-guide.mp4',
    category: 'Getting Started',
    isPublic: true
  }
];

export function WhiteLabelPortalActivation() {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(defaultBrandSettings);
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' });
  const [newResource, setNewResource] = useState({ 
    title: '', 
    description: '', 
    type: 'document' as const, 
    url: '', 
    category: 'General' 
  });
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const { toast } = useToast();

  const generatePortalUrl = () => {
    return `https://${brandSettings.subdomain}.mybfocfo.com`;
  };

  const handleBrandSettingChange = (field: keyof BrandSettings, value: string) => {
    setBrandSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubdomainChange = (value: string) => {
    // Clean subdomain value
    const cleanSubdomain = value.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 30);
    handleBrandSettingChange('subdomain', cleanSubdomain);
  };

  const handleLogoUpload = (file: File) => {
    // Simulate logo upload
    const mockUrl = URL.createObjectURL(file);
    handleBrandSettingChange('logoUrl', mockUrl);
    toast({
      title: "Logo uploaded",
      description: "Your firm logo has been uploaded successfully",
    });
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      const faq: FAQ = {
        id: Date.now().toString(),
        ...newFaq,
        order: faqs.length + 1
      };
      setFaqs(prev => [...prev, faq]);
      setNewFaq({ question: '', answer: '', category: 'General' });
      toast({
        title: "FAQ added",
        description: "New FAQ has been added to your portal",
      });
    }
  };

  const removeFaq = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  const addResource = () => {
    if (newResource.title && newResource.url) {
      const resource: Resource = {
        id: Date.now().toString(),
        ...newResource,
        isPublic: true
      };
      setResources(prev => [...prev, resource]);
      setNewResource({ 
        title: '', 
        description: '', 
        type: 'document', 
        url: '', 
        category: 'General' 
      });
      toast({
        title: "Resource added",
        description: "New resource has been added to your portal",
      });
    }
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const activatePortal = async () => {
    setIsActivating(true);
    
    // Simulate portal activation
    setTimeout(() => {
      setIsActivating(false);
      setIsActivated(true);
      toast({
        title: "Portal activated!",
        description: `Your white-label portal is now live at ${generatePortalUrl()}`,
      });
    }, 2000);
  };

  const copyPortalUrl = () => {
    navigator.clipboard.writeText(generatePortalUrl());
    toast({
      title: "URL copied",
      description: "Portal URL has been copied to clipboard",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Monitor className="w-4 h-4" />;
      case 'link': return <Globe className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            White-Label Portal Activation
          </h3>
          <p className="text-muted-foreground">
            Create a branded client portal with your firm's identity and custom content
          </p>
        </div>
        
        {isActivated ? (
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Portal Active
            </Badge>
            <Button onClick={copyPortalUrl} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </Button>
          </div>
        ) : (
          <Button 
            onClick={activatePortal} 
            disabled={isActivating || !brandSettings.firmName || !brandSettings.subdomain}
            className="bg-green-600 hover:bg-green-700"
          >
            {isActivating ? 'Activating...' : 'Activate Portal'}
          </Button>
        )}
      </div>

      {/* Portal URL Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Your Portal URL</Label>
              <div className="text-lg font-mono bg-gray-100 px-3 py-2 rounded mt-1">
                {generatePortalUrl()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewMode('desktop')}>
                <Monitor className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewMode('mobile')}>
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="faqs">Custom FAQs</TabsTrigger>
          <TabsTrigger value="resources">Resource Center</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Basic Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="firm-name">Firm Name</Label>
                  <Input
                    id="firm-name"
                    value={brandSettings.firmName}
                    onChange={(e) => handleBrandSettingChange('firmName', e.target.value)}
                    placeholder="Your Firm Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subdomain">Portal Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      value={brandSettings.subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      placeholder="yourfirm"
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">.mybfocfo.com</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only lowercase letters, numbers, and hyphens allowed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Logo & Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Firm Logo</Label>
                  <FileUpload
                    onFileChange={handleLogoUpload}
                    accept="image/*"
                    maxSize={2 * 1024 * 1024}
                    className="mt-2"
                  />
                  {brandSettings.logoUrl && (
                    <div className="mt-2">
                      <img 
                        src={brandSettings.logoUrl} 
                        alt="Logo preview" 
                        className="h-12 w-auto object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Color Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Theme
              </CardTitle>
              <CardDescription>
                Customize the colors to match your firm's brand identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={brandSettings.primaryColor}
                      onChange={(e) => handleBrandSettingChange('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={brandSettings.primaryColor}
                      onChange={(e) => handleBrandSettingChange('primaryColor', e.target.value)}
                      placeholder="#1B1B32"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={brandSettings.secondaryColor}
                      onChange={(e) => handleBrandSettingChange('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={brandSettings.secondaryColor}
                      onChange={(e) => handleBrandSettingChange('secondaryColor', e.target.value)}
                      placeholder="#2D2D4A"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accent-color"
                      type="color"
                      value={brandSettings.accentColor}
                      onChange={(e) => handleBrandSettingChange('accentColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={brandSettings.accentColor}
                      onChange={(e) => handleBrandSettingChange('accentColor', e.target.value)}
                      placeholder="#0EA5E9"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Color Preview */}
              <div className="mt-4 p-4 border rounded-lg" style={{ 
                background: `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})` 
              }}>
                <div className="text-white font-semibold mb-2">{brandSettings.firmName}</div>
                <div className="bg-white/20 backdrop-blur-sm rounded p-2 text-white text-sm">
                  Portal preview with your colors
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Custom FAQs
              </CardTitle>
              <CardDescription>
                Create custom frequently asked questions for your client portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New FAQ */}
              <div className="border rounded-lg p-4 space-y-3">
                <div>
                  <Label htmlFor="faq-question">Question</Label>
                  <Input
                    id="faq-question"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter FAQ question"
                  />
                </div>
                
                <div>
                  <Label htmlFor="faq-answer">Answer</Label>
                  <Textarea
                    id="faq-answer"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter FAQ answer"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newFaq.category}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Category"
                    className="flex-1"
                  />
                  <Button onClick={addFaq}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{faq.question}</h4>
                          <Badge variant="secondary">{faq.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => removeFaq(faq.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resource Center
              </CardTitle>
              <CardDescription>
                Manage documents, guides, and resources for your clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Resource */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="resource-title">Title</Label>
                    <Input
                      id="resource-title"
                      value={newResource.title}
                      onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Resource title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="resource-category">Category</Label>
                    <Input
                      id="resource-category"
                      value={newResource.category}
                      onChange={(e) => setNewResource(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Category"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="resource-description">Description</Label>
                  <Input
                    id="resource-description"
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="URL or file path"
                    className="flex-1"
                  />
                  <Button onClick={addResource}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              </div>

              {/* Resource List */}
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(resource.type)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <Badge variant="secondary">{resource.category}</Badge>
                            {resource.isPublic && (
                              <Badge variant="outline" className="text-green-600">Public</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{resource.description}</p>
                          <p className="text-xs text-muted-foreground">{resource.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => removeResource(resource.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>
                Add custom CSS to further customize your portal appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={brandSettings.customCss}
                onChange={(e) => handleBrandSettingChange('customCss', e.target.value)}
                placeholder="/* Custom CSS styles */
.portal-header {
  background: linear-gradient(135deg, #1B1B32, #2D2D4A);
}

.client-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}"
                rows={10}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}