import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Settings, Globe, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhiteLabelSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const WhiteLabelSlide: React.FC<WhiteLabelSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [selectedBrand, setSelectedBrand] = useState('firm-a');

  const brandExamples = [
    {
      id: 'firm-a',
      name: 'Wealth Advisors Group',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      logo: 'WAG',
      tagline: 'Building Generational Wealth',
      style: 'Professional & Traditional'
    },
    {
      id: 'firm-b',
      name: 'NextGen Financial',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      logo: 'NGF',
      tagline: 'Future-Forward Planning',
      style: 'Modern & Innovative'
    },
    {
      id: 'firm-c',
      name: 'Heritage Capital',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      logo: 'HC',
      tagline: 'Legacy-Focused Solutions',
      style: 'Classic & Prestigious'
    }
  ];

  const customizationOptions = [
    {
      category: 'Branding',
      options: [
        'Custom logo placement',
        'Color scheme customization',
        'Font and typography',
        'Custom taglines and messaging'
      ]
    },
    {
      category: 'Terminology',
      options: [
        'Rename SWAG™ phases',
        'Custom methodology names',
        'Firm-specific language',
        'Branded calculations'
      ]
    },
    {
      category: 'Features',
      options: [
        'Enable/disable modules',
        'Custom report templates',
        'Firm compliance overlays',
        'Custom investment options'
      ]
    },
    {
      category: 'Client Experience',
      options: [
        'Custom portal domains',
        'Branded mobile apps',
        'Personalized onboarding',
        'Firm-specific workflows'
      ]
    }
  ];

  const selectedBrandData = brandExamples.find(b => b.id === selectedBrand) || brandExamples[0];

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            Complete Customization
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">White-Label</span> Ready
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            You can fully brand the SWAG™ GPS™ as your own, customizing terminology, phases, 
            and even the look and feel, while leveraging our robust engine.
          </p>
        </motion.div>

        {/* Brand Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-4 mb-6">
            {brandExamples.map((brand) => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand.id)}
                className="flex items-center space-x-2"
                style={selectedBrand === brand.id ? {
                  backgroundColor: brand.primaryColor,
                  borderColor: brand.primaryColor
                } : {}}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {brand.logo}
                </div>
                <span>{brand.name}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Mockups */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Desktop View */}
          <Card className="overflow-hidden shadow-lg">
            <div 
              className="p-4 text-white"
              style={{ backgroundColor: selectedBrandData.primaryColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: selectedBrandData.secondaryColor }}
                  >
                    {selectedBrandData.logo}
                  </div>
                  <div>
                    <div className="font-semibold">{selectedBrandData.name}</div>
                    <div className="text-xs opacity-75">{selectedBrandData.tagline}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Desktop Portal</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Retirement Readiness Score</span>
                  <Badge style={{ backgroundColor: selectedBrandData.primaryColor, color: 'white' }}>
                    92/100
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 rounded-full w-[92%]"
                    style={{ backgroundColor: selectedBrandData.primaryColor }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: selectedBrandData.primaryColor }}>
                      $127K
                    </div>
                    <div className="text-sm text-muted-foreground">Annual Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: selectedBrandData.primaryColor }}>
                      94%
                    </div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile View */}
          <Card className="overflow-hidden shadow-lg max-w-sm mx-auto">
            <div 
              className="p-3 text-white"
              style={{ backgroundColor: selectedBrandData.primaryColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: selectedBrandData.secondaryColor }}
                  >
                    {selectedBrandData.logo}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{selectedBrandData.name}</div>
                    <div className="text-xs opacity-75">Mobile App</div>
                  </div>
                </div>
                <Smartphone className="h-4 w-4" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: selectedBrandData.primaryColor }}>
                    Your Retirement Plan
                  </div>
                  <div className="text-sm text-muted-foreground">On Track</div>
                </div>
                <div className="space-y-2">
                  {['Income Now', 'Income Later', 'Growth', 'Legacy'].map((phase, index) => (
                    <div key={phase} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{phase}</span>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedBrandData.primaryColor }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customization Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                White-Label Customization Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {customizationOptions.map((section, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Palette className="h-4 w-4 mr-2 text-primary" />
                      {section.category}
                    </h4>
                    <ul className="space-y-2">
                      {section.options.map((option, optIndex) => (
                        <li key={optIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Complete Brand Control</h3>
              <p className="text-sm text-muted-foreground">
                Make it truly yours with custom branding, colors, and messaging
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Enable only the features you need, customize workflows
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Your Domain</h3>
              <p className="text-sm text-muted-foreground">
                Host on your domain, maintain complete client relationships
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Script Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Advisor Script:</h4>
              <p className="text-sm leading-relaxed italic">
                "You can fully brand the SWAG™ GPS™ as your own, customizing terminology, phases, 
                and even the look and feel, while leveraging our robust engine. Your clients will 
                see your brand, your messaging, and your expertise — powered by institutional-grade 
                planning technology."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};