import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NoContentStubProps {
  title: string;
  route: string;
  description?: string;
  showContactButton?: boolean;
}

export function NoContentStub({ 
  title, 
  route, 
  description,
  showContactButton = true 
}: NoContentStubProps) {
  const navigate = useNavigate();

  const defaultDescription = `The ${title} page is currently under development. Our team is working to bring you this content soon.`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="bfo-card max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-bfo-gold/10 border border-bfo-gold/20">
              <Construction className="h-12 w-12 text-bfo-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {title}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-bfo-gold">
            <span className="text-sm font-mono bg-black/20 px-2 py-1 rounded border border-bfo-gold/20">
              {route}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bfo-gold/10 border border-bfo-gold/20">
              <div className="w-2 h-2 bg-bfo-gold rounded-full animate-pulse" />
              <span className="text-sm text-bfo-gold font-medium">
                Stubbed — Content Incoming
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              {description || defaultDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="text-white border-bfo-gold/40 hover:bg-bfo-gold/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              asChild
              className="bfo-cta"
            >
              <Link to="/">
                Return Home
              </Link>
            </Button>
            
            {showContactButton && (
              <Button 
                asChild
                variant="outline"
                className="text-white border-bfo-gold/40 hover:bg-bfo-gold/10"
              >
                <Link to="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-bfo-gold/20">
            <p className="text-xs text-gray-400">
              This page was automatically generated to prevent 404 errors.
              <br />
              Content will be available in a future release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}