import React, { useState } from 'react';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, 
  Upload, 
  Save, 
  Eye,
  Mail,
  Globe,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminBranding() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFaviconFile(e.target.files[0]);
    }
  };

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Branding & Customization</h1>
            <p className="text-muted-foreground">
              Customize your tenant's appearance, branding, and client-facing content.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="domain">Domain & URLs</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6">
            {/* Logo & Visual Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Logo & Visual Identity
                </CardTitle>
                <CardDescription>Upload your company logo and set brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload your logo (PNG, JPG, or SVG)
                      </p>
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="logo" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                      {logoFile && (
                        <p className="text-sm text-foreground mt-2">
                          Selected: {logoFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload favicon (ICO or PNG, 32x32px)
                      </p>
                      <input
                        type="file"
                        id="favicon"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="favicon" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                      {faviconFile && (
                        <p className="text-sm text-foreground mt-2">
                          Selected: {faviconFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Brand Colors</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="primary-color"
                          defaultValue="#0066cc"
                          className="w-12 h-10 rounded border"
                        />
                        <Input defaultValue="#0066cc" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="secondary-color"
                          defaultValue="#6c757d"
                          className="w-12 h-10 rounded border"
                        />
                        <Input defaultValue="#6c757d" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="accent-color"
                          defaultValue="#28a745"
                          className="w-12 h-10 rounded border"
                        />
                        <Input defaultValue="#28a745" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="Your Company Name"
                    defaultValue="Acme Financial Services"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Client-Facing Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Client-Facing Content
                </CardTitle>
                <CardDescription>Customize the content your clients see</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="about-section">About Us</Label>
                  <Textarea
                    id="about-section"
                    placeholder="Tell your clients about your firm..."
                    rows={4}
                    defaultValue="We are a leading financial advisory firm dedicated to helping our clients achieve their financial goals through personalized wealth management strategies."
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    placeholder="Welcome message for new clients..."
                    rows={3}
                    defaultValue="Welcome to our client portal! We're excited to help you on your financial journey."
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="disclosures">Legal Disclosures</Label>
                  <Textarea
                    id="disclosures"
                    placeholder="Required legal disclosures and disclaimers..."
                    rows={6}
                    defaultValue="Investment advisory services are provided by [Company Name], a registered investment advisor. All investments involve risk and may result in loss of principal."
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="footer-text">Footer Text</Label>
                  <Input
                    id="footer-text"
                    placeholder="Footer copyright text..."
                    defaultValue="© 2024 Acme Financial Services. All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            {/* Email Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Templates
                </CardTitle>
                <CardDescription>Customize automated email communications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="welcome-email">Welcome Email</Label>
                  <Textarea
                    id="welcome-email"
                    placeholder="Welcome email template..."
                    rows={6}
                    defaultValue="Dear {{client_name}},

Welcome to {{company_name}}! We're thrilled to have you as a client and look forward to helping you achieve your financial goals.

Your client portal is now ready, and you can access it at {{portal_url}}.

If you have any questions, please don't hesitate to reach out to your advisor {{advisor_name}} at {{advisor_email}}.

Best regards,
The {{company_name}} Team"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Textarea
                    id="notification-email"
                    placeholder="Notification email template..."
                    rows={4}
                    defaultValue="Hello {{client_name}},

This is a notification from {{company_name}} regarding your account.

{{notification_content}}

Best regards,
{{company_name}}"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="reminder-email">Reminder Email</Label>
                  <Textarea
                    id="reminder-email"
                    placeholder="Reminder email template..."
                    rows={4}
                    defaultValue="Dear {{client_name}},

This is a friendly reminder about {{reminder_subject}}.

{{reminder_details}}

Please contact us if you need any assistance.

Best regards,
{{advisor_name}}"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain" className="space-y-6">
            {/* Domain & URLs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain & URLs
                </CardTitle>
                <CardDescription>Configure your custom domain and URL settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="custom-domain">Custom Domain</Label>
                  <Input
                    id="custom-domain"
                    placeholder="portal.yourcompany.com"
                    defaultValue=""
                  />
                  <p className="text-sm text-muted-foreground">
                    Configure DNS settings to point your domain to our platform
                  </p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="subdomain"
                      placeholder="yourcompany"
                      defaultValue="acme-financial"
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">.familyoffice.app</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="portal-title">Portal Title</Label>
                  <Input
                    id="portal-title"
                    placeholder="Client Portal"
                    defaultValue="Acme Financial Client Portal"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="support@yourcompany.com"
                    defaultValue="support@acmefinancial.com"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    placeholder="+1 (555) 123-4567"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPortalLayout>
  );
}