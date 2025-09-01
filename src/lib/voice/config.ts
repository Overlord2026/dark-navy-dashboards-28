// Voice-AI Configuration
export const VOICE_GUARDRAILS = {
  DISCLAIMER_TEXT: "Educational only. Not advice.",
  CONSENT_REQUIRED: true,
  LOG_CONSENT_EVENTS: true,
  HUMAN_HANDOFF_ROUTES: {
    schedule: '/contact/schedule',
    message: '/contact/message'
  }
} as const;

export const getGuardrailMessage = (persona: string) => {
  const messages = {
    family: "This AI provides educational information only and is not personalized financial advice. Please consult with qualified professionals for your specific situation.",
    advisor: "This AI assists with client communication and documentation. All recommendations should be reviewed and approved by the licensed advisor.",
    default: "This AI provides general information only. Professional consultation is recommended for specific decisions."
  };
  
  return messages[persona as keyof typeof messages] || messages.default;
};

export const CONTACT_OPTIONS = {
  schedule: {
    title: "Schedule a Call",
    description: "Book time with our licensed professionals",
    route: "/contact/schedule"
  },
  message: {
    title: "Send a Message", 
    description: "Get help via our secure message center",
    route: "/contact/message"
  }
} as const;