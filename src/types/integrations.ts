export type IntegrationType = 'schwab' | 'advyzon' | 'cpa' | 'attorney' | 'google' | 'zoom' | 'teams';

export type MeetingProvider = 'google_meet' | 'zoom' | 'teams';

export interface MeetingPreferences {
  defaultProvider: MeetingProvider;
  enabledProviders: MeetingProvider[];
  googleCalendarIntegration: boolean;
  bfoSchedulingEnabled: boolean;
}

export type IntegrationStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  enabled: boolean;
  lastSync?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface IntegrationConnector {
  type: IntegrationType;
  name: string;
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  sync: () => Promise<void>;
  getStatus: () => IntegrationStatus;
}

export interface IntegrationConfig {
  apiEndpoint?: string;
  authType?: 'oauth' | 'api_key' | 'basic';
  credentials?: Record<string, string>;
  settings?: Record<string, any>;
}

export interface SchedulingConfig {
  provider: 'bfo' | 'calendly';
  defaultMeetingType: MeetingProvider;
  bufferTime: number;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  availableDurations: number[];
}