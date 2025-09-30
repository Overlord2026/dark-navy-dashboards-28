// Demo service to manage fixture loading and network call mocking
import { FLAGS } from '@/config/flags';
import { loadFamilyFixtures } from '@/fixtures/families.fixtures';
import { loadAdvisorFixtures } from '@/fixtures/advisors.fixtures';
import { loadHealthcareFixtures } from '@/fixtures/healthcare.fixtures';
import { loadK401Fixtures } from '@/fixtures/k401.fixtures';

// Cache for loaded fixtures
const demoCache = new Map<string, any>();

export class DemoService {
  private static instance: DemoService;
  
  static getInstance(): DemoService {
    if (!DemoService.instance) {
      DemoService.instance = new DemoService();
    }
    return DemoService.instance;
  }

  // Check if we should use demo mode
  isDemoMode(): boolean {
    return FLAGS.IS_DEVELOPMENT;
  }

  // Load all demo fixtures
  async loadAllFixtures() {
    if (!this.isDemoMode()) {
      console.log('[DemoService] Not in demo mode, skipping fixture loading');
      return;
    }

    console.log('[DemoService] Loading all demo fixtures...');
    
    try {
      const [familyData, advisorData, healthcareData, k401Data] = await Promise.all([
        this.getFamilyData(),
        this.getAdvisorData(), 
        this.getHealthcareData(),
        this.getK401Data()
      ]);

      console.log('[DemoService] All fixtures loaded successfully');
      return {
        families: familyData,
        advisors: advisorData,
        healthcare: healthcareData,
        k401: k401Data
      };
    } catch (error) {
      console.error('[DemoService] Error loading fixtures:', error);
      throw error;
    }
  }

  // Get family demo data
  async getFamilyData() {
    if (demoCache.has('families')) {
      return demoCache.get('families');
    }

    const data = await loadFamilyFixtures();
    demoCache.set('families', data);
    return data;
  }

  // Get advisor demo data
  async getAdvisorData() {
    if (demoCache.has('advisors')) {
      return demoCache.get('advisors');
    }

    const data = await loadAdvisorFixtures();
    demoCache.set('advisors', data);
    return data;
  }

  // Get healthcare demo data
  async getHealthcareData() {
    if (demoCache.has('healthcare')) {
      return demoCache.get('healthcare');
    }

    const data = await loadHealthcareFixtures();
    demoCache.set('healthcare', data);
    return data;
  }

  // Get 401k demo data
  async getK401Data() {
    if (demoCache.has('k401')) {
      return demoCache.get('k401');
    }

    const data = await loadK401Fixtures();
    demoCache.set('k401', data);
    return data;
  }

  // Mock network call with demo data
  async mockNetworkCall<T>(endpoint: string, fallbackData?: T): Promise<T> {
    if (!this.isDemoMode()) {
      throw new Error('Demo service called outside of demo mode');
    }

    console.log(`[DemoService] Mocking network call to: ${endpoint}`);
    
    // Add artificial delay to simulate network
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));

    // Route to appropriate demo data based on endpoint
    if (endpoint.includes('/families') || endpoint.includes('/family')) {
      return (await this.getFamilyData()) as T;
    }
    
    if (endpoint.includes('/advisors') || endpoint.includes('/advisor')) {
      return (await this.getAdvisorData()) as T;
    }
    
    if (endpoint.includes('/healthcare') || endpoint.includes('/health')) {
      return (await this.getHealthcareData()) as T;
    }
    
    if (endpoint.includes('/401k') || endpoint.includes('/k401')) {
      return (await this.getK401Data()) as T;
    }

    // Return fallback data if provided
    if (fallbackData !== undefined) {
      return fallbackData;
    }

    // Default mock response
    return {
      success: true,
      message: 'Demo mode response',
      data: null,
      timestamp: new Date().toISOString()
    } as T;
  }

  // Clear demo cache
  clearCache() {
    demoCache.clear();
    console.log('[DemoService] Demo cache cleared');
  }

  // Get demo status
  getStatus() {
    return {
      demo_mode: this.isDemoMode(),
      fixtures_loaded: demoCache.size > 0,
      cached_fixtures: Array.from(demoCache.keys()),
      flags: FLAGS
    };
  }

  // Synchronous accessors for cached data (used by smoke tests)
  getFamilies() {
    return demoCache.get('families') || [];
  }

  getAdvisors() {
    return demoCache.get('advisors') || [];
  }

  getHealthcare() {
    return demoCache.get('healthcare') || [];
  }

  getK401() {
    return demoCache.get('k401') || [];
  }
}

// Export singleton instance
export const demoService = DemoService.getInstance();

// Utility function to wrap network calls with demo fallback
export async function withDemoFallback<T>(
  networkCall: () => Promise<T>,
  endpoint: string,
  fallbackData?: T
): Promise<T> {
  if (FLAGS.IS_DEVELOPMENT) {
    return demoService.mockNetworkCall(endpoint, fallbackData);
  }
  
  return networkCall();
}

// Utility to check if a service should use live connectors
export function shouldUseLiveConnectors(): boolean {
  return !FLAGS.IS_DEVELOPMENT;
}