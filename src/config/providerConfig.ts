// External service provider configuration
export interface ProviderConfig {
  // Mail providers
  mailProvider: 'sendgrid' | 'ses' | 'mailgun' | null;
  mailApiKey: string | null;
  mailFrom: string | null;
  mailReplyTo: string | null;
  publicBaseUrl: string | null;
  
  // Speech-to-text providers (for meetings)
  sttProvider: 'assemblyai' | 'gcp' | 'openai' | null;
  sttApiKey: string | null;
  
  // Weather providers (for storm alerts)
  weatherProvider: 'openweather' | 'tomorrow' | 'accuweather' | null;
  weatherApiKey: string | null;
}

// Check if configuration exists in environment or secrets
export async function getProviderConfig(): Promise<ProviderConfig> {
  // In production, these would come from Supabase secrets
  // For now, checking if basic configuration exists
  return {
    mailProvider: checkEnvOrSecret('MAIL_PROVIDER') as any,
    mailApiKey: checkEnvOrSecret('MAIL_API_KEY'),
    mailFrom: checkEnvOrSecret('MAIL_FROM'),
    mailReplyTo: checkEnvOrSecret('MAIL_REPLY_TO'),
    publicBaseUrl: checkEnvOrSecret('PUBLIC_BASE_URL'),
    
    sttProvider: checkEnvOrSecret('STT_PROVIDER') as any,
    sttApiKey: checkEnvOrSecret('STT_API_KEY'),
    
    weatherProvider: checkEnvOrSecret('WEATHER_PROVIDER') as any,
    weatherApiKey: checkEnvOrSecret('WEATHER_API_KEY')
  };
}

function checkEnvOrSecret(key: string): string | null {
  // In browser environment, these would be set via edge functions
  // This is a placeholder for the configuration check
  if (typeof window !== 'undefined') {
    return null; // Browser environment - secrets handled server-side
  }
  return null;
}

export async function checkProviderAvailability(): Promise<{
  mail: boolean;
  speechToText: boolean;
  weather: boolean;
}> {
  const config = await getProviderConfig();
  
  return {
    mail: !!(config.mailProvider && config.mailApiKey && config.mailFrom),
    speechToText: !!(config.sttProvider && config.sttApiKey),
    weather: !!(config.weatherProvider && config.weatherApiKey)
  };
}

// Provider-specific configuration validation
export const PROVIDER_CONFIGS = {
  mail: {
    sendgrid: {
      requiredFields: ['MAIL_API_KEY', 'MAIL_FROM'],
      apiEndpoint: 'https://api.sendgrid.com/v3/mail/send'
    },
    ses: {
      requiredFields: ['MAIL_API_KEY', 'MAIL_FROM'],
      apiEndpoint: 'https://email.us-east-1.amazonaws.com'
    },
    mailgun: {
      requiredFields: ['MAIL_API_KEY', 'MAIL_FROM'],
      apiEndpoint: 'https://api.mailgun.net/v3'
    }
  },
  stt: {
    assemblyai: {
      requiredFields: ['STT_API_KEY'],
      apiEndpoint: 'https://api.assemblyai.com/v2'
    },
    gcp: {
      requiredFields: ['STT_API_KEY'],
      apiEndpoint: 'https://speech.googleapis.com/v1'
    },
    openai: {
      requiredFields: ['STT_API_KEY'],
      apiEndpoint: 'https://api.openai.com/v1/audio'
    }
  },
  weather: {
    openweather: {
      requiredFields: ['WEATHER_API_KEY'],
      apiEndpoint: 'https://api.openweathermap.org/data/2.5'
    },
    tomorrow: {
      requiredFields: ['WEATHER_API_KEY'],
      apiEndpoint: 'https://api.tomorrow.io/v4'
    },
    accuweather: {
      requiredFields: ['WEATHER_API_KEY'],
      apiEndpoint: 'https://dataservice.accuweather.com'
    }
  }
} as const;