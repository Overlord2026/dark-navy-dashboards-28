export const runtimeFlags = {
  emailEnabled: false,
  smsEnabled: false,
  pushNotificationsEnabled: false,
  analyticsEnabled: true,
  debugMode: false
};

// Helper to check if email functionality is available
export const canSendEmails = () => runtimeFlags.emailEnabled;

// Helper to check if we're in development mode
export const isDevelopment = () => runtimeFlags.debugMode;

// Helper to enable email when secrets are configured
export const enableEmailDelivery = () => {
  runtimeFlags.emailEnabled = true;
};