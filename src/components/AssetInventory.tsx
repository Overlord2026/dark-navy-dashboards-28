import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// All assets discovered in the project
const projectAssets = {
  srcAssets: [
    { name: 'advisor-hero.png', path: '/src/assets/advisor-hero.png', category: 'Hero Images' },
    { name: 'bfo-homepage-design-reference.jpg', path: '/src/assets/bfo-homepage-design-reference.jpg', category: 'Design Reference' },
    { name: 'care-team-banner.jpg', path: '/src/assets/care-team-banner.jpg', category: 'Healthcare Banners' },
    { name: 'ce-celebration-preview.jpg', path: '/src/assets/ce-celebration-preview.jpg', category: 'Education' },
    { name: 'community-banner.jpg', path: '/src/assets/community-banner.jpg', category: 'Healthcare Banners' },
    { name: 'family-office-icons.png', path: '/src/assets/family-office-icons.png', category: 'Icons' },
    { name: 'health-guides-banner.jpg', path: '/src/assets/health-guides-banner.jpg', category: 'Healthcare Banners' },
    { name: 'healthcare-dashboard-banner.jpg', path: '/src/assets/healthcare-dashboard-banner.jpg', category: 'Healthcare Banners' },
    { name: 'insurance-banner.jpg', path: '/src/assets/insurance-banner.jpg', category: 'Healthcare Banners' },
    { name: 'landing-hero-linkedin.jpg', path: '/src/assets/landing-hero-linkedin.jpg', category: 'Hero Images' },
    { name: 'longevity-programs-banner.jpg', path: '/src/assets/longevity-programs-banner.jpg', category: 'Healthcare Banners' },
    { name: 'storyboard-slide-1-vault.jpg', path: '/src/assets/storyboard-slide-1-vault.jpg', category: 'Storyboard' },
    { name: 'storyboard-slide-2-family.jpg', path: '/src/assets/storyboard-slide-2-family.jpg', category: 'Storyboard' },
    { name: 'storyboard-slide-3-dashboard.jpg', path: '/src/assets/storyboard-slide-3-dashboard.jpg', category: 'Storyboard' },
    { name: 'storyboard-slide-4-delivery.jpg', path: '/src/assets/storyboard-slide-4-delivery.jpg', category: 'Storyboard' },
    { name: 'storyboard-slide-5-logo.jpg', path: '/src/assets/storyboard-slide-5-logo.jpg', category: 'Storyboard' },
  ],
  
  lovableUploads: [
    // Core brand logos (from logos.ts)
    { name: '03120943-9fc3-4374-89ae-ae70bf1425f0.png', path: '/lovable-uploads/03120943-9fc3-4374-89ae-ae70bf1425f0.png', category: 'Brand Logos', description: 'Tree Icon' },
    { name: '48e6fed8-fac5-4be6-8f0b-767dd5f6eacc.png', path: '/lovable-uploads/48e6fed8-fac5-4be6-8f0b-767dd5f6eacc.png', category: 'Brand Logos', description: 'Full Brand Logo' },
    { name: '190d282a-70e8-45cb-a6d5-3b528dc97d46.png', path: '/lovable-uploads/190d282a-70e8-45cb-a6d5-3b528dc97d46.png', category: 'Brand Logos', description: 'Large Hero Logo' },
    { name: '3346c76f-f91c-4791-b77d-adb2f34a06af.png', path: '/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png', category: 'Brand Logos', description: 'Fallback Logo' },
    
    // Advisor profiles and marketplace
    { name: '222b66d7-b7eb-4526-b460-fcfa131b8106.png', path: '/lovable-uploads/222b66d7-b7eb-4526-b460-fcfa131b8106.png', category: 'Advisor Profiles', description: 'Primary Advisor Photo' },
    { name: '031ab7ce-4d6d-4dc5-a085-37febb2093c7.png', path: '/lovable-uploads/031ab7ce-4d6d-4dc5-a085-37febb2093c7.png', category: 'Module Logos' },
    { name: '4f75e021-2c1b-4d0d-bf20-e32a077724de.png', path: '/lovable-uploads/4f75e021-2c1b-4d0d-bf20-e32a077724de.png', category: 'Module Logos' },
    { name: 'de09b008-ad83-47b7-a3bf-d51532be0261.png', path: '/lovable-uploads/de09b008-ad83-47b7-a3bf-d51532be0261.png', category: 'Module Logos' },
    { name: '4f186128-9b08-4965-a540-64cf9b0ec9ee.png', path: '/lovable-uploads/4f186128-9b08-4965-a540-64cf9b0ec9ee.png', category: 'Module Logos' },
    
    // Support and chatbot
    { name: 'c99b3253-fc75-4097-ad44-9ef520280206.png', path: '/lovable-uploads/c99b3253-fc75-4097-ad44-9ef520280206.png', category: 'Support', description: 'Chatbot Avatar' },
    
    // Educational resources
    { name: '290d88b2-f2a5-4de6-af7c-5b69a764664f.png', path: '/lovable-uploads/290d88b2-f2a5-4de6-af7c-5b69a764664f.png', category: 'Education', description: 'Course Cover' },
    
    // Marketplace services
    { name: '8d710c1a-ccab-41d8-b202-41ad5cc5a735.png', path: '/lovable-uploads/8d710c1a-ccab-41d8-b202-41ad5cc5a735.png', category: 'Marketplace Services' },
    { name: '7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png', path: '/lovable-uploads/7f52d8e5-bf6b-4533-8c1b-f933a43cfce7.png', category: 'Marketplace Services' },
    { name: '7faf1d1a-8aff-4541-8400-18aa687704e7.png', path: '/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png', category: 'Marketplace Services' },
    { name: '90781be1-cf1d-4b67-b35a-0e5c45072062.png', path: '/lovable-uploads/90781be1-cf1d-4b67-b35a-0e5c45072062.png', category: 'Marketplace Services' },
    { name: '86dc106a-1666-4334-909d-1ec7b1f114bc.png', path: '/lovable-uploads/86dc106a-1666-4334-909d-1ec7b1f114bc.png', category: 'Marketplace Services' },
    { name: '9d138e85-d6e9-4083-ad34-147b3fc524ab.png', path: '/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png', category: 'Marketplace Services' },
    { name: 'cfb9898e-86f6-43a4-816d-9ecd35536845.png', path: '/lovable-uploads/cfb9898e-86f6-43a4-816d-9ecd35536845.png', category: 'Marketplace Services' },
    
    // Other uploaded assets (categorize these as needed)
    { name: '01eba118-b78a-4bd3-8bd2-556224625c98.png', path: '/lovable-uploads/01eba118-b78a-4bd3-8bd2-556224625c98.png', category: 'Uncategorized' },
    { name: '06a287d8-9047-4181-8e04-88a782c65c19.png', path: '/lovable-uploads/06a287d8-9047-4181-8e04-88a782c65c19.png', category: 'Uncategorized' },
    { name: '07bdac7d-9165-48f5-ab06-ade475828c83.png', path: '/lovable-uploads/07bdac7d-9165-48f5-ab06-ade475828c83.png', category: 'Uncategorized' },
    { name: '2436c2af-e13e-436c-970a-a77e01ba2cd5.png', path: '/lovable-uploads/2436c2af-e13e-436c-970a-a77e01ba2cd5.png', category: 'Uncategorized' },
    { name: '333644ca-ed82-4b57-a52a-56bfe37cac74.png', path: '/lovable-uploads/333644ca-ed82-4b57-a52a-56bfe37cac74.png', category: 'Uncategorized' },
    { name: '3f1d0ac5-00e5-48cc-a437-944e8580ff51.png', path: '/lovable-uploads/3f1d0ac5-00e5-48cc-a437-944e8580ff51.png', category: 'Uncategorized' },
    { name: '49235156-73d8-46ca-9404-c34512c3fafc.png', path: '/lovable-uploads/49235156-73d8-46ca-9404-c34512c3fafc.png', category: 'Uncategorized' },
    { name: '4a56e07f-ef12-47b6-b112-b240aba59bdf.png', path: '/lovable-uploads/4a56e07f-ef12-47b6-b112-b240aba59bdf.png', category: 'Uncategorized' },
    { name: '63f104f0-65d0-47eb-b3ef-74ea0fb998e4.png', path: '/lovable-uploads/63f104f0-65d0-47eb-b3ef-74ea0fb998e4.png', category: 'Uncategorized' },
    { name: '6b80c4ed-a513-491e-b6f8-1a78c48dced5.png', path: '/lovable-uploads/6b80c4ed-a513-491e-b6f8-1a78c48dced5.png', category: 'Uncategorized' },
    { name: '7372735a-98e1-411a-85a3-f01eff66a6be.png', path: '/lovable-uploads/7372735a-98e1-411a-85a3-f01eff66a6be.png', category: 'Uncategorized' },
    { name: '7d0f32fc-56fb-4bcb-a678-2f473a1ef54c.png', path: '/lovable-uploads/7d0f32fc-56fb-4bcb-a678-2f473a1ef54c.png', category: 'Uncategorized' },
    { name: '8a734eac-b185-496b-8582-cc78d296a796.png', path: '/lovable-uploads/8a734eac-b185-496b-8582-cc78d296a796.png', category: 'Uncategorized' },
    { name: '94f35b13-8595-4066-b37f-2fb62be96029.png', path: '/lovable-uploads/94f35b13-8595-4066-b37f-2fb62be96029.png', category: 'Uncategorized' },
    { name: 'b4df25d6-12d7-4c34-874e-804e72335904.png', path: '/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png', category: 'Uncategorized' },
    { name: 'b6a65d03-05d7-4aa4-b33b-e433f9f06314.png', path: '/lovable-uploads/b6a65d03-05d7-4aa4-b33b-e433f9f06314.png', category: 'Uncategorized' },
    { name: 'c598e503-7a57-4a55-9a0b-f09e7ba7003a.png', path: '/lovable-uploads/c598e503-7a57-4a55-9a0b-f09e7ba7003a.png', category: 'Uncategorized' },
    { name: 'd5b2e677-56c7-4359-85f0-d716de4168fa.png', path: '/lovable-uploads/d5b2e677-56c7-4359-85f0-d716de4168fa.png', category: 'Uncategorized' },
    { name: 'dc1ba115-9699-414c-b9d0-7521bf7e7224.png', path: '/lovable-uploads/dc1ba115-9699-414c-b9d0-7521bf7e7224.png', category: 'Uncategorized' },
    { name: 'e4ac2159-1b66-4f15-9257-68a0f00c8311.png', path: '/lovable-uploads/e4ac2159-1b66-4f15-9257-68a0f00c8311.png', category: 'Uncategorized' },
  ],
  
  publicAssets: [
    { name: 'favicon.ico', path: '/favicon.ico', category: 'Favicon' },
    { name: 'favicon.png', path: '/favicon.png', category: 'Favicon' },
    { name: 'placeholder.svg', path: '/placeholder.svg', category: 'Placeholder' },
  ]
};

interface AssetThumbnailProps {
  asset: {
    name: string;
    path: string;
    category: string;
    description?: string;
  };
}

const AssetThumbnail: React.FC<AssetThumbnailProps> = ({ asset }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
          {!imageError ? (
            <img 
              src={asset.path}
              alt={asset.name}
              className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={() => setImageError(true)}
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <div className="text-muted-foreground text-sm text-center p-4">
              Image not found
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {asset.category}
            </Badge>
          </div>
          
          <div>
            <p className="font-mono text-xs text-muted-foreground break-all">
              {asset.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground/70 break-all">
              {asset.path}
            </p>
            {asset.description && (
              <p className="text-sm text-foreground mt-1">
                {asset.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AssetInventory: React.FC = () => {
  const allAssets = [
    ...projectAssets.srcAssets,
    ...projectAssets.lovableUploads,
    ...projectAssets.publicAssets
  ];

  const categories = Array.from(new Set(allAssets.map(asset => asset.category)));
  
  const getAssetsByCategory = (category: string) => 
    allAssets.filter(asset => asset.category === category);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Asset Inventory</h1>
        <p className="text-muted-foreground">
          Visual inventory of all image and logo assets in the project ({allAssets.length} total assets)
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
          <TabsTrigger value="all">All ({allAssets.length})</TabsTrigger>
          <TabsTrigger value="Brand Logos">Logos</TabsTrigger>
          <TabsTrigger value="Healthcare Banners">Healthcare</TabsTrigger>
          <TabsTrigger value="Marketplace Services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allAssets.map((asset, index) => (
              <AssetThumbnail key={index} asset={asset} />
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{category}</h2>
              <p className="text-muted-foreground">
                {getAssetsByCategory(category).length} assets
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getAssetsByCategory(category).map((asset, index) => (
                <AssetThumbnail key={index} asset={asset} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Asset Usage Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Src Assets:</span> {projectAssets.srcAssets.length}
          </div>
          <div>
            <span className="font-medium">Lovable Uploads:</span> {projectAssets.lovableUploads.length}
          </div>
          <div>
            <span className="font-medium">Public Assets:</span> {projectAssets.publicAssets.length}
          </div>
          <div>
            <span className="font-medium">Total:</span> {allAssets.length}
          </div>
        </div>
      </div>
    </div>
  );
};
