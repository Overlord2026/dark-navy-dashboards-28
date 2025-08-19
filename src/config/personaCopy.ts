// Persona copy configuration for personalized onboarding experiences
export interface SegmentCopy {
  hero: string;
  bullets: string[];
}

export interface PersonaCopy {
  [segment: string]: SegmentCopy;
}

export const FAMILY_COPY: PersonaCopy = {
  retirees: {
    hero: "Secure your retirement legacy with confidence",
    bullets: [
      "Coordinate RMDs across all accounts seamlessly",
      "Consolidate scattered investments for clarity",
      "Connect with specialized retirement professionals"
    ]
  },
  aspiring: {
    hero: "Build wealth systematically with smart habits",
    bullets: [
      "Automate saving and investment strategies",
      "Organize important documents securely",
      "Develop disciplined financial routines"
    ]
  },
  hnw: {
    hero: "Optimize advanced wealth strategies at scale",
    bullets: [
      "Execute sophisticated tax optimization",
      "Secure family vault for sensitive assets",
      "Coordinate multi-generational estate planning"
    ]
  },
  uhnw: {
    hero: "Orchestrate ultra-high-net-worth complexity",
    bullets: [
      "Manage multi-entity structures efficiently",
      "Navigate complex liquidity events",
      "Execute succession and governance planning"
    ]
  }
};

export const getPersonaCopy = (persona: string, segment: string): SegmentCopy => {
  if (persona === 'family' && FAMILY_COPY[segment]) {
    return FAMILY_COPY[segment];
  }
  
  // Default fallback
  return {
    hero: "Build your financial future with confidence",
    bullets: [
      "Organize your financial life efficiently",
      "Connect with qualified professionals",
      "Achieve your financial goals faster"
    ]
  };
};