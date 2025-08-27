export const runtimeFlags = {
  paymentsEnabled: false,
  emailEnabled: false,
  smsEnabled: false,
  pushNotificationsEnabled: false,
  analyticsEnabled: true,
  debugMode: false,
  showPatentBadge: true,
  demoMode: true,
  demoPlan: "premium" as const,
  demoSegment: "retirees" as const,
  prelaunchMode: true,
  
  // External provider availability
  mailProviderConfigured: false,
  speechToTextEnabled: false,
  weatherAlertsEnabled: false
};

// Helper to check if email functionality is available
export const canSendEmails = () => runtimeFlags.emailEnabled;

// Helper to check if we're in development mode
export const isDevelopment = () => runtimeFlags.debugMode;

// Helper to enable email when secrets are configured
export const enableEmailDelivery = () => {
  runtimeFlags.emailEnabled = true;
  runtimeFlags.mailProviderConfigured = true;
};

// Helper to enable speech-to-text when configured
export const enableSpeechToText = () => {
  runtimeFlags.speechToTextEnabled = true;
};

// Helper to enable weather alerts when configured  
export const enableWeatherAlerts = () => {
  runtimeFlags.weatherAlertsEnabled = true;
};