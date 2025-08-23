import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Share2, Shield, Clock, Archive, Fingerprint } from 'lucide-react';
import catalogConfig from '@/config/catalogConfig.json';

/**
 * Marketing preview page for tools that don't have routes yet
 * Shows friendly "Coming soon" instead of 404
 */
export default function MarketingPreview() {
  const { toolKey } = useParams<{ toolKey: string }>();
  
  // Find the catalog item
  const catalogItem = (catalogConfig as any[]).find(item => item.key === toolKey);
  
  if (!catalogItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Tool Not Found</h1>
          <p className="text-muted-foreground">The requested tool could not be found.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: catalogItem.label,
          text: catalogItem.summary,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{catalogItem.label} - Coming Soon | MyBFOCFO</title>
        <meta name="description" content={catalogItem.summary} />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              
              {/* Back button */}
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              
              {/* Main content */}
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Badge variant="secondary" className="mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2">
                    {catalogItem.label}
                  </CardTitle>
                  
                  <p className="text-lg text-muted-foreground">
                    {catalogItem.summary}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {catalogItem.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  
                  {/* Demo CTA if available */}
                  <div className="text-center space-y-3">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Play className="w-4 h-4 mr-2" />
                      See 60-second Demo
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      Get a preview of how this tool will work
                    </div>
                  </div>
                  
                  {/* Share button */}
                  <div className="text-center">
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share this tool
                    </Button>
                  </div>
                  
                  {/* Trust footer */}
                  <div className="border-t pt-6 mt-8">
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center justify-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Smart Checks
                        </span>
                        <span className="flex items-center gap-1">
                          <Fingerprint className="w-3 h-3" />
                          Proof Slips
                        </span>
                        <span className="flex items-center gap-1">
                          <Archive className="w-3 h-3" />
                          Vault
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Time-Stamp
                        </span>
                      </div>
                      <div>
                        Built with enterprise-grade security and audit trails
                      </div>
                    </div>
                  </div>
                  
                </CardContent>
              </Card>
              
            </div>
          </div>
        </main>
      </div>
    </>
  );
}