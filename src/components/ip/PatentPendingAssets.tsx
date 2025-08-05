import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Image, Palette, Shield } from 'lucide-react';

export function PatentPendingAssets() {
  const assetCategories = [
    {
      category: "Patent Pending Badges",
      description: "Professional badges for product and marketing use",
      assets: [
        {
          name: "Horizontal Gold Badge",
          description: "Premium horizontal badge with gold tree icon",
          formats: ["SVG", "PNG (300dpi)", "PDF Vector"],
          dimensions: "300x80px, Scalable",
          usage: "Website headers, business cards, presentations"
        },
        {
          name: "Vertical Gold Badge",
          description: "Compact vertical badge for sidebar use",
          formats: ["SVG", "PNG (300dpi)", "PDF Vector"],
          dimensions: "120x150px, Scalable",
          usage: "App sidebars, document footers, mobile interfaces"
        },
        {
          name: "Circular Icon Badge",
          description: "Minimalist circular patent pending icon",
          formats: ["SVG", "PNG (300dpi)", "ICO"],
          dimensions: "64x64px, Scalable",
          usage: "Favicons, app icons, small interface elements"
        }
      ]
    },
    {
      category: "Legal Notices",
      description: "Standardized legal language for various contexts",
      assets: [
        {
          name: "Website Footer Notice",
          description: "Comprehensive patent pending notice for website footers",
          formats: ["HTML", "PDF", "Plain Text"],
          dimensions: "Responsive text block",
          usage: "Website footers, about pages, legal sections"
        },
        {
          name: "App Interface Notice",
          description: "Compact notice for in-app display",
          formats: ["Component Code", "Text", "JSON"],
          dimensions: "Flexible container",
          usage: "App banners, settings pages, help sections"
        },
        {
          name: "Marketing Materials Notice",
          description: "Professional notice for marketing collateral",
          formats: ["PDF", "DOC", "InDesign"],
          dimensions: "Print and digital ready",
          usage: "Brochures, presentations, sales materials"
        }
      ]
    },
    {
      category: "Brand Integration Assets",
      description: "Assets for consistent brand integration",
      assets: [
        {
          name: "Logo Lockup with Patent Notice",
          description: "BFO logo with integrated patent pending notice",
          formats: ["SVG", "PNG", "EPS"],
          dimensions: "Multiple sizes available",
          usage: "Official letterhead, business documents, presentations"
        },
        {
          name: "Color Variations",
          description: "Patent badges in brand color variations",
          formats: ["SVG", "PNG", "AI"],
          dimensions: "Standard and custom sizes",
          usage: "Matching various brand applications"
        },
        {
          name: "White Label Versions",
          description: "Customizable badges for partner use",
          formats: ["SVG Template", "Figma File", "Sketch"],
          dimensions: "Editable and scalable",
          usage: "Partner implementations, white-label solutions"
        }
      ]
    },
    {
      category: "Technical Implementation",
      description: "Developer-ready assets and code snippets",
      assets: [
        {
          name: "React Components",
          description: "Ready-to-use React components for patent notices",
          formats: ["TSX", "CSS", "Storybook"],
          dimensions: "Responsive components",
          usage: "React applications, component libraries"
        },
        {
          name: "CSS Classes",
          description: "Styled CSS classes for consistent patent badge display",
          formats: ["CSS", "SCSS", "Tailwind"],
          dimensions: "Responsive styles",
          usage: "Web applications, style guides"
        },
        {
          name: "SVG Sprites",
          description: "Optimized SVG sprite sheets for efficient loading",
          formats: ["SVG Sprite", "JSON Map", "Documentation"],
          dimensions: "Optimized file sizes",
          usage: "High-performance web applications"
        }
      ]
    }
  ];

  const designSpecs = {
    colors: {
      primary: "#D4AF37", // Gold
      secondary: "#1F2937", // Dark Gray
      accent: "#F59E0B", // Amber
      background: "#FEFBF3" // Light Gold
    },
    typography: {
      primaryFont: "Inter",
      fallbackFont: "system-ui, sans-serif",
      patentText: "11px - 14px",
      brandText: "16px - 24px"
    },
    spacing: {
      badgePadding: "8px - 16px",
      iconSpacing: "4px - 8px",
      textSpacing: "2px - 4px"
    }
  };

  const handleExportAsset = (categoryName: string, assetName: string) => {
    console.log(`Exporting asset: ${categoryName} - ${assetName}`);
  };

  const handleExportAllAssets = () => {
    const exportData = {
      platform: "BFO Family Office Platform",
      exportDate: new Date().toISOString(),
      designSpecs,
      assets: assetCategories,
      totalAssets: assetCategories.reduce((acc, cat) => acc + cat.assets.length, 0)
    };
    
    console.log("Exporting all patent pending assets:", exportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patent Pending Assets</h2>
          <p className="text-muted-foreground">
            Professional badges, notices, and brand assets for patent pending status
          </p>
        </div>
        <Button onClick={handleExportAllAssets} className="bg-gradient-to-r from-amber-500 to-amber-600">
          <Download className="h-4 w-4 mr-2" />
          Export All Assets
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-amber-600" />
            <div>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 mb-2">
                Brand Compliant Assets
              </Badge>
              <p className="text-sm text-amber-700">
                All patent pending assets designed to maintain brand consistency and legal compliance.
                Available in multiple formats for web, print, and digital applications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Design Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-semibold mb-2">Color Palette</h4>
              <div className="space-y-2">
                {Object.entries(designSpecs.colors).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: value }}
                    ></div>
                    <span className="text-sm">{name}: {value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Typography</h4>
              <div className="space-y-1 text-sm">
                <div>Primary: {designSpecs.typography.primaryFont}</div>
                <div>Fallback: {designSpecs.typography.fallbackFont}</div>
                <div>Patent Text: {designSpecs.typography.patentText}</div>
                <div>Brand Text: {designSpecs.typography.brandText}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Spacing</h4>
              <div className="space-y-1 text-sm">
                <div>Badge Padding: {designSpecs.spacing.badgePadding}</div>
                <div>Icon Spacing: {designSpecs.spacing.iconSpacing}</div>
                <div>Text Spacing: {designSpecs.spacing.textSpacing}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {assetCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{category.category}</CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {category.assets.length} Assets
                  </Badge>
                </div>
                <Button 
                  onClick={() => handleExportAsset(category.category, "All")} 
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.assets.map((asset, assetIndex) => (
                  <Card key={assetIndex} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="h-4 w-4" />
                        <span className="font-semibold text-sm">{asset.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {asset.description}
                      </p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="text-xs">
                          <span className="font-medium">Formats:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {asset.formats.map((format, formatIndex) => (
                              <Badge key={formatIndex} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Dimensions:</span>
                          <div className="text-muted-foreground">{asset.dimensions}</div>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Usage:</span>
                          <div className="text-muted-foreground">{asset.usage}</div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleExportAsset(category.category, asset.name)}
                        size="sm" 
                        className="w-full"
                        variant="outline"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Export Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{assetCategories.length}</div>
              <div className="text-sm text-muted-foreground">Asset Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {assetCategories.reduce((acc, cat) => acc + cat.assets.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">File Formats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Ready</div>
              <div className="text-sm text-muted-foreground">For Implementation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}