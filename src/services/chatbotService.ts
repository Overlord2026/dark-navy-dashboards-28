
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useLocation } from "react-router-dom";

export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  content: string;
  sender: MessageRole;
  timestamp: Date;
  category?: string;
}

export interface ChatContext {
  currentRoute: string;
  userProfile?: any;
  isAuthenticated: boolean;
  currentSection?: string;
}

// Mapping of routes to context information
const routeContextMap: Record<string, { section: string, contextPrompt: string }> = {
  '/integration': {
    section: 'Integration Hub',
    contextPrompt: 'You are helping with the Family Office Marketplace integration hub, which allows connecting various projects, APIs, and plugins. Focus on explaining connection processes, architecture, and integration benefits.'
  },
  '/investments': {
    section: 'Investments',
    contextPrompt: 'You are helping with investment management, including portfolios, alternative assets, and asset allocation strategies.'
  },
  '/tax-planning': {
    section: 'Tax Planning',
    contextPrompt: 'You are helping with tax optimization, planning strategies, and integration with accounting software.'
  },
  '/estate-planning': {
    section: 'Estate Planning',
    contextPrompt: 'You are helping with estate planning, wills, trusts, and succession planning.'
  },
  '/dashboard': {
    section: 'Dashboard',
    contextPrompt: 'You are helping with the main dashboard which shows financial overview, net worth, and key metrics.'
  }
};

// Generate context-aware system prompts
export const generateSystemPrompt = (context: ChatContext): string => {
  let basePrompt = "You are a helpful assistant for the Boutique Family Office platform. ";
  
  // Add route-specific context
  const routeInfo = routeContextMap[context.currentRoute];
  if (routeInfo) {
    basePrompt += routeInfo.contextPrompt;
  }
  
  // Add user-specific context if available
  if (context.userProfile) {
    basePrompt += ` The user's name is ${context.userProfile.firstName || 'valued client'}. `;
    if (context.userProfile.investmentPreferences) {
      basePrompt += `They have indicated interest in ${context.userProfile.investmentPreferences.join(', ')} investments. `;
    }
  }
  
  basePrompt += "Provide concise, helpful responses. When discussing features, be specific about how they work in the platform.";
  
  return basePrompt;
};

// Map user queries to relevant responses based on context
export const generateResponse = async (
  message: string, 
  context: ChatContext, 
  messageHistory: ChatMessage[]
): Promise<string> => {
  // For integration hub specific responses
  if (context.currentRoute === '/integration') {
    const integrationKeywords = {
      'connect': 'To connect a new project, use the "Connect New Project" button at the top of the Integration Hub page. You\'ll need to provide API credentials and select the integration type.',
      'api': 'API integrations allow external systems to communicate with your Family Office platform. You can view available endpoints in the API Integrations tab.',
      'plugin': 'Plugins extend the functionality of your Family Office platform. Browse available plugins in the Plugins tab and click "Configure Plugin" to set them up.',
      'architecture': 'The Architecture tab shows how different systems connect to the Family Office platform, including data flows and integration points.',
      'sync': 'Data synchronization happens automatically based on your settings. You can trigger a manual sync from the Connected Projects tab by clicking "Manage Connection" and then "Sync Data".',
      'credentials': 'API credentials are managed securely in the system. When connecting a new integration, you\'ll be prompted to enter the required credentials which are encrypted before storage.'
    };

    // Check if the message contains any integration keywords
    for (const [keyword, response] of Object.entries(integrationKeywords)) {
      if (message.toLowerCase().includes(keyword)) {
        return response;
      }
    }
  }

  // For more complex queries, we would use the AI service
  // This is a simplified version - in a real implementation, we'd call the OpenAI service
  
  // Fallback responses grouped by context
  const fallbackResponses: Record<string, string[]> = {
    'Integration Hub': [
      "The Integration Hub allows you to connect external systems and services to your Family Office platform. What specific aspect are you interested in?",
      "You can manage all your connected projects, API integrations, and plugins from the Integration Hub. Would you like more information about a specific feature?",
      "The Integration Hub provides a central location for managing all external connections to your Family Office platform, including data flows and system architecture."
    ],
    'default': [
      "I'm here to help you with the Boutique Family Office platform. What information are you looking for today?",
      "The Boutique Family Office platform offers comprehensive wealth management tools including investment tracking, tax planning, and document management. What can I help you with?",
      "I can provide information about any feature of the Boutique Family Office platform. Please let me know what you're interested in exploring."
    ]
  };

  // Select appropriate fallback responses based on context
  const section = routeContextMap[context.currentRoute]?.section || 'default';
  const responses = fallbackResponses[section] || fallbackResponses['default'];
  
  // Use a semi-random response but avoid repeating the last response if possible
  const lastBotMessage = messageHistory
    .filter(msg => msg.sender === 'bot')
    .pop()?.content;
    
  let selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Try to avoid repeating the last response
  if (responses.length > 1 && selectedResponse === lastBotMessage) {
    selectedResponse = responses[(responses.indexOf(selectedResponse) + 1) % responses.length];
  }
  
  return selectedResponse;
};

// Utility function to generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Hook to get the current chat context
export const useChatContext = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { userProfile } = useUser();
  
  const currentRoute = location.pathname;
  const currentSection = routeContextMap[currentRoute]?.section;
  
  return {
    currentRoute,
    userProfile,
    isAuthenticated,
    currentSection
  } as ChatContext;
};
