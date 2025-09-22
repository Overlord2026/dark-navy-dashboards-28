import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Linkedin } from 'lucide-react';
import { useLinkedInOAuth } from '@/hooks/useLinkedInOAuth';
import { useToast } from '@/hooks/use-toast';

const LinkedInCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleLinkedInCallback, setIsConnecting } = useLinkedInOAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle OAuth errors
      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || 'LinkedIn authentication was cancelled or failed');
        setIsConnecting(false);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Missing required parameters from LinkedIn');
        setIsConnecting(false);
        return;
      }

      try {
        setIsConnecting(true);
        const profile = await handleLinkedInCallback(code, state);
        
        if (profile) {
          setStatus('success');
          toast({
            title: "Success!",
            description: "Your LinkedIn profile has been imported successfully.",
          });
          
          // Redirect to dashboard after successful import
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error('Failed to process LinkedIn profile');
        }
      } catch (error) {
        console.error('LinkedIn callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to import LinkedIn profile');
      } finally {
        setIsConnecting(false);
      }
    };

    processCallback();
  }, [searchParams, handleLinkedInCallback, setIsConnecting, navigate, toast]);

  const handleRetry = () => {
    navigate('/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Importing LinkedIn Profile</h2>
              <p className="text-muted-foreground">
                Please wait while we import your professional information...
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Profile Imported Successfully!</h2>
              <p className="text-muted-foreground mb-4">
                Your LinkedIn profile has been imported and your account has been updated.
              </p>
              <Button onClick={handleGoToDashboard}>
                Continue to Dashboard
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Import Failed</h2>
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <div className="space-x-2">
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={handleGoToDashboard}>
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Linkedin className="h-6 w-6 text-[#0077b5]" />
            LinkedIn Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInCallback;