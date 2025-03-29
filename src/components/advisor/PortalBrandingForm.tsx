
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

export function PortalBrandingForm() {
  const [branding, setBranding] = useState({
    primaryColor: "#1EAEDB",
    secondaryColor: "#0F0F2D",
    logo: null as File | null,
    backgroundImage: null as File | null,
    theme: "dark",
    portalName: "My Client Portal",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranding({
      ...branding,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (file: File, field: 'logo' | 'backgroundImage') => {
    setBranding({
      ...branding,
      [field]: file,
    });
  };

  const handleThemeChange = (value: string) => {
    setBranding({
      ...branding,
      theme: value,
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
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portalName">Portal Name</Label>
              <Input
                id="portalName"
                name="portalName"
                placeholder="My Client Portal"
                value={branding.portalName}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-400">This name will appear in the browser title and throughout the portal.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-upload">Portal Logo</Label>
              <div className="flex items-center gap-4">
                {branding.logo && (
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                    <img 
                      src={URL.createObjectURL(branding.logo)} 
                      alt="Logo preview" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <FileUpload
                  onUpload={(file) => handleFileUpload(file, 'logo')}
                  accept="image/*"
                  maxSize={5242880}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-400">Max file size: 5MB. Recommended dimensions: 200x50px.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background-upload">Background Image (Optional)</Label>
              <div className="flex items-center gap-4">
                {branding.backgroundImage && (
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                    <img 
                      src={URL.createObjectURL(branding.backgroundImage)} 
                      alt="Background preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <FileUpload
                  onUpload={(file) => handleFileUpload(file, 'backgroundImage')}
                  accept="image/*"
                  maxSize={10485760}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-gray-400">Max file size: 10MB. Recommended dimensions: 1920x1080px.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-8 w-8 rounded-md border border-gray-600" 
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="text"
                    value={branding.primaryColor}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <p className="text-xs text-gray-400">Used for buttons, links, and highlights.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-8 w-8 rounded-md border border-gray-600" 
                    style={{ backgroundColor: branding.secondaryColor }}
                  />
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="text"
                    value={branding.secondaryColor}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <p className="text-xs text-gray-400">Used for backgrounds and secondary elements.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <div className="space-y-4">
            <Label>Portal Theme</Label>
            <RadioGroup 
              value={branding.theme} 
              onValueChange={handleThemeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Card className={`cursor-pointer transition-all duration-200 ${branding.theme === 'dark' ? 'bg-[#1EAEDB]/10 border-[#1EAEDB]' : 'bg-gray-900/30 border-gray-700'}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="cursor-pointer">
                    <div>
                      <h3 className="font-medium">Dark Theme</h3>
                      <p className="text-sm text-gray-400">A sleek dark interface that's easy on the eyes</p>
                    </div>
                  </Label>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all duration-200 ${branding.theme === 'light' ? 'bg-[#1EAEDB]/10 border-[#1EAEDB]' : 'bg-gray-900/30 border-gray-700'}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="cursor-pointer">
                    <div>
                      <h3 className="font-medium">Light Theme</h3>
                      <p className="text-sm text-gray-400">A bright, clean interface with good contrast</p>
                    </div>
                  </Label>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all duration-200 ${branding.theme === 'custom' ? 'bg-[#1EAEDB]/10 border-[#1EAEDB]' : 'bg-gray-900/30 border-gray-700'}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="custom" id="theme-custom" />
                  <Label htmlFor="theme-custom" className="cursor-pointer">
                    <div>
                      <h3 className="font-medium">Custom Theme</h3>
                      <p className="text-sm text-gray-400">Build your own theme with custom colors</p>
                    </div>
                  </Label>
                </CardContent>
              </Card>
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400 mb-2">Portal Preview</p>
              <h3 className="text-xl font-semibold">{branding.portalName}</h3>
            </div>
            
            <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                {branding.logo ? (
                  <img 
                    src={URL.createObjectURL(branding.logo)} 
                    alt="Portal logo" 
                    className="h-8"
                  />
                ) : (
                  <div 
                    className="h-8 px-3 flex items-center justify-center text-sm font-medium bg-gray-700 rounded"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    LOGO
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="flex justify-center my-4">
                  <div 
                    className="px-4 py-2 rounded text-sm"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Sample Button
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 bg-gray-700 rounded"></div>
                  <div className="h-16 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">This is a simplified preview. The actual portal will reflect your branding choices.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
