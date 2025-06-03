
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmailJSSetup: React.FC = () => {
  const isConfigured = false; // You can implement a check for this later

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Configuration
        </CardTitle>
        <CardDescription>
          Configure EmailJS to send invitation emails to family members
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConfigured ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              EmailJS is not configured yet. Follow the steps below to enable email invitations.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              EmailJS is configured and ready to send invitations.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Setup Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Create a free account at EmailJS.com</li>
            <li>Add an email service (Gmail, Outlook, etc.)</li>
            <li>Create an email template with these variables:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>to_name - Recipient's name</li>
                <li>from_name - Your name</li>
                <li>relationship - Family relationship</li>
                <li>access_level - Access level granted</li>
                <li>app_url - Application URL</li>
                <li>message - Invitation message</li>
              </ul>
            </li>
            <li>Get your Service ID, Template ID, and Public Key</li>
            <li>Update the EMAILJS_CONFIG in useFamilyMembers.ts</li>
          </ol>
        </div>

        <Button asChild variant="outline" className="w-full">
          <a 
            href="https://www.emailjs.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Go to EmailJS.com
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
