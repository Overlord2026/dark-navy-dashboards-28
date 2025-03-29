
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PortalBrandingForm() {
  const [portalBranding, setPortalBranding] = useState({
    companyName: "",
    primaryColor: "#1EAEDB",
    secondaryColor: "#0F0F2D",
    companyLogo: null as File | null,
    loginImage: null as File | null,
    welcomeMessage: "Welcome to your personalized financial portal",
    customDomain: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPortalBranding({
      ...portalBranding,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (field: string) => (file: File) => {
    setPortalBranding({
      ...portalBranding,
      [field]: file,
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Portal Branding</h2>
        <p className="text-gray-400">
          Customize how your client portal looks and feels
        </p>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your company name"
                  value={portalBranding.companyName}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-3">
                  <div 
                    className="h-10 w-10 rounded-md border border-gray-700"
                    style={{ backgroundColor: portalBranding.primaryColor }}
                  />
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={portalBranding.primaryColor}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-3">
                  <div 
                    className="h-10 w-10 rounded-md border border-gray-700"
                    style={{ backgroundColor: portalBranding.secondaryColor }}
                  />
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    value={portalBranding.secondaryColor}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {portalBranding.companyLogo && (
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                      <img 
                        src={URL.createObjectURL(portalBranding.companyLogo)} 
                        alt="Company logo preview" 
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <FileUpload
                    onFileChange={handleFileChange("companyLogo")}
                    accept="image/*"
                    maxSize={5242880}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-gray-400">Max file size: 5MB. Recommended dimensions: 200x200px.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginImage">Login Background Image</Label>
                <div className="flex items-center gap-4">
                  {portalBranding.loginImage && (
                    <div className="h-16 w-24 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                      <img 
                        src={URL.createObjectURL(portalBranding.loginImage)} 
                        alt="Login image preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <FileUpload
                    onFileChange={handleFileChange("loginImage")}
                    accept="image/*"
                    maxSize={10485760}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-gray-400">Max file size: 10MB. Recommended dimensions: 1920x1080px.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  value={portalBranding.welcomeMessage}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Card className="border-dashed border-2 border-gray-700 bg-transparent">
              <CardContent className="p-6">
                <p className="text-sm text-gray-300">
                  <strong>Preview:</strong> Your customized login screen will display your logo, branded colors, and welcome message.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom-domain" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customDomain">Custom Domain</Label>
              <Input
                id="customDomain"
                name="customDomain"
                placeholder="portal.yourcompany.com"
                value={portalBranding.customDomain}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                Enter the domain where you'd like your client portal to be accessible.
              </p>
            </div>

            <Card className="bg-yellow-500/10 border border-yellow-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-yellow-400">
                  <strong>Important:</strong> To use a custom domain, you'll need to add DNS records with your domain registrar.
                  Instructions will be provided after you save your settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
