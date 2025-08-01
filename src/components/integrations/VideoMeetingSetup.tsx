import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Key, Settings, AlertCircle } from 'lucide-react';

export function VideoMeetingSetup() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Video Meeting Setup</h2>
        <p className="text-muted-foreground">
          Configure OAuth credentials for Zoom, Google Meet, and Microsoft Teams integration
        </p>
      </div>

      <div className="grid gap-6">
        {/* Zoom Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🎥</span>
              Zoom OAuth Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Required Secrets:</h4>
              <ul className="space-y-1 text-sm">
                <li><code>ZOOM_CLIENT_ID</code> - Your Zoom OAuth app client ID</li>
                <li><code>ZOOM_CLIENT_SECRET</code> - Your Zoom OAuth app client secret</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Setup Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Go to <a href="https://marketplace.zoom.us/" target="_blank" rel="noopener" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Zoom Marketplace <ExternalLink className="h-3 w-3" />
                </a></li>
                <li>Click "Develop" → "Build App" → "OAuth"</li>
                <li>Fill in app details and set redirect URL to: 
                  <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                    {window.location.origin}/api/auth/zoom/callback
                  </code>
                </li>
                <li>Add required scopes: <code>meeting:write</code>, <code>meeting:read</code></li>
                <li>Get your Client ID and Secret from the app credentials</li>
                <li>Add these as secrets in your Supabase project</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Google Meet Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📹</span>
              Google Meet OAuth Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Required Secrets:</h4>
              <ul className="space-y-1 text-sm">
                <li><code>GOOGLE_CLIENT_ID</code> - Your Google OAuth client ID</li>
                <li><code>GOOGLE_CLIENT_SECRET</code> - Your Google OAuth client secret</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Setup Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Google Cloud Console <ExternalLink className="h-3 w-3" />
                </a></li>
                <li>Create new project or select existing project</li>
                <li>Enable Google Calendar API and Google Meet API</li>
                <li>Go to "Credentials" → "Create Credentials" → "OAuth client ID"</li>
                <li>Set application type to "Web application"</li>
                <li>Add authorized redirect URI:
                  <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                    {window.location.origin}/api/auth/google/callback
                  </code>
                </li>
                <li>Download the credentials JSON and extract Client ID and Secret</li>
                <li>Add these as secrets in your Supabase project</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Microsoft Teams Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💻</span>
              Microsoft Teams OAuth Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Required Secrets:</h4>
              <ul className="space-y-1 text-sm">
                <li><code>TEAMS_CLIENT_ID</code> - Your Azure app client ID</li>
                <li><code>TEAMS_CLIENT_SECRET</code> - Your Azure app client secret</li>
                <li><code>TEAMS_TENANT_ID</code> - Your Azure tenant ID</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Setup Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Go to <a href="https://portal.azure.com/" target="_blank" rel="noopener" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Azure Portal <ExternalLink className="h-3 w-3" />
                </a></li>
                <li>Navigate to "Azure Active Directory" → "App registrations"</li>
                <li>Click "New registration" and fill in app details</li>
                <li>Set redirect URI to:
                  <code className="block mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                    {window.location.origin}/api/auth/teams/callback
                  </code>
                </li>
                <li>Go to "API permissions" and add Microsoft Graph permissions:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <code>OnlineMeetings.ReadWrite</code></li>
                    <li>• <code>Calendars.ReadWrite</code></li>
                  </ul>
                </li>
                <li>Go to "Certificates & secrets" and create a new client secret</li>
                <li>Copy Application (client) ID, Directory (tenant) ID, and Client secret</li>
                <li>Add these as secrets in your Supabase project</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Adding Secrets to Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Important</p>
                  <p className="text-sm text-yellow-700">
                    You need to add the OAuth credentials as Edge Function secrets in your Supabase project.
                  </p>
                </div>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                Supabase Dashboard <ExternalLink className="h-3 w-3" />
              </a></li>
              <li>Navigate to Settings → Edge Functions</li>
              <li>Add the required secrets for each provider you want to use</li>
              <li>Click "Save" to apply the secrets</li>
              <li>Test the integration by connecting an account</li>
            </ol>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Test URLs:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                After setting up credentials, test OAuth flows with these URLs:
              </p>
              <ul className="space-y-1 text-xs font-mono">
                <li>Zoom: <code>{window.location.origin}/api/auth/zoom</code></li>
                <li>Google: <code>{window.location.origin}/api/auth/google</code></li>
                <li>Teams: <code>{window.location.origin}/api/auth/teams</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}