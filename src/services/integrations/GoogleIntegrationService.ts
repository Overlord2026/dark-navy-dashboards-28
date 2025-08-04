import { supabase } from '@/integrations/supabase/client';

export interface GoogleOAuthConfig {
  clientId: string;
  scopes: string[];
  redirectUri: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  conferenceData?: {
    conferenceSolution: {
      key: {
        type: string;
      };
    };
    createRequest?: {
      requestId: string;
    };
  };
  meetLink?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  downloadUrl?: string;
}

class GoogleIntegrationService {
  private defaultScopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  async initiateGoogleAuth(userType: 'advisor' | 'client' | 'optional' = 'optional'): Promise<string> {
    const config = await this.getOAuthConfig();
    const state = btoa(JSON.stringify({ userType, timestamp: Date.now() }));
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', config.clientId);
    authUrl.searchParams.set('redirect_uri', config.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.defaultScopes.join(' '));
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    return authUrl.toString();
  }

  async handleOAuthCallback(code: string, state: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('google-oauth-handler', {
        body: { code, state }
      });

      if (error) throw error;
      
      // Store tokens and sync initial data
      await this.syncInitialData();
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      throw new Error('Failed to complete Google authentication');
    }
  }

  async createCalendarEvent(event: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-integration', {
        body: {
          action: 'create_event',
          event: {
            ...event,
            conferenceData: {
              createRequest: {
                requestId: `meet-${Date.now()}`,
                conferenceSolutionKey: {
                  type: 'hangoutsMeet'
                }
              }
            }
          }
        }
      });

      if (error) throw error;
      return data.event;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  async getAvailability(
    startDate: string, 
    endDate: string, 
    calendars: string[] = ['primary']
  ): Promise<{ busy: Array<{ start: string; end: string }> }> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-integration', {
        body: {
          action: 'get_availability',
          timeMin: startDate,
          timeMax: endDate,
          calendars
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw new Error('Failed to fetch calendar availability');
    }
  }

  async syncCalendarEvents(syncDirection: 'import' | 'export' | 'bidirectional' = 'bidirectional'): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { syncDirection }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      throw new Error('Failed to sync calendar events');
    }
  }

  async uploadToGoogleDrive(
    file: File, 
    folderId?: string,
    metadata?: Record<string, any>
  ): Promise<GoogleDriveFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folderId', folderId);
      if (metadata) formData.append('metadata', JSON.stringify(metadata));

      const { data, error } = await supabase.functions.invoke('google-drive-integration', {
        body: formData
      });

      if (error) throw error;
      return data.file;
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }

  async sendGmailNotification(
    to: string,
    subject: string,
    htmlContent: string,
    templateData?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('gmail-integration', {
        body: {
          action: 'send_email',
          to,
          subject,
          htmlContent,
          templateData
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending Gmail notification:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async getGoogleMeetJoinUrl(eventId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-integration', {
        body: {
          action: 'get_meet_link',
          eventId
        }
      });

      if (error) throw error;
      return data.meetLink;
    } catch (error) {
      console.error('Error getting Google Meet link:', error);
      return null;
    }
  }

  private async getOAuthConfig(): Promise<GoogleOAuthConfig> {
    // Get from environment or database
    return {
      clientId: 'your-google-client-id', // This should come from Supabase secrets
      scopes: this.defaultScopes,
      redirectUri: `${window.location.origin}/auth/google/callback`
    };
  }

  private async syncInitialData(): Promise<void> {
    try {
      // Initial calendar sync
      await this.syncCalendarEvents('import');
      
      // Store integration status
      const { error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          integration_type: 'google_workspace',
          status: 'connected',
          connected_at: new Date().toISOString(),
          scopes: this.defaultScopes,
          auto_sync_enabled: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing initial data:', error);
    }
  }

  async isGoogleConnected(): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_integrations')
        .select('status')
        .eq('integration_type', 'google_workspace')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      return data?.status === 'connected';
    } catch {
      return false;
    }
  }
}

export const googleIntegrationService = new GoogleIntegrationService();