/**
 * AI Edge Service - Routes all AI calls through Supabase Edge Functions
 * Removes client-side API key dependencies for security
 */

export interface EdgeFunctionOptions {
  requireAuth?: boolean;
}

/**
 * Generic function to call Supabase Edge Functions with AI capabilities
 * @param path - Function name or full URL
 * @param payload - Request payload
 * @param opts - Options including auth requirements
 */
export async function callEdgeJSON(
  path: string, 
  payload: unknown, 
  opts: EdgeFunctionOptions = {}
): Promise<any> {
  // Build URL - handle both function names and full URLs
  const url = path.startsWith('http') 
    ? path 
    : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${path.replace(/^\//, '')}`;
  
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json' 
  };
  
  // Attach JWT token if function requires auth
  if (opts.requireAuth) {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.warn('Failed to get session for auth:', error);
    }
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload ?? {})
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Edge function ${path} failed: ${res.status} ${errorText}`);
  }
  
  return res.json();
}

// Specific AI function wrappers for common use cases
export const aiEdge = {
  /**
   * Generate meeting summary from notes
   */
  generateMeetingSummary: (notes: string) => 
    callEdgeJSON('meeting-summary', { notes }),
  
  /**
   * Generate AI analysis for stocks or portfolios
   */
  generateAnalysis: (stockData: any, analysisType: 'stock' | 'portfolio', portfolioName?: string) =>
    callEdgeJSON('ai-analysis', { stockData, analysisType, portfolioName }),
  
  /**
   * Generate personalized smart alerts
   */
  generateSmartAlerts: (persona: string, age: number, financialData?: any, currentDate?: string) =>
    callEdgeJSON('ai-smart-alerts', { persona, age, financial_data: financialData, current_date: currentDate }),
  
  /**
   * Process meeting recording and generate summary
   */
  processMeetingSummary: (meetingId: string) =>
    callEdgeJSON('generate-meeting-summary', { meeting_id: meetingId }, { requireAuth: true })
};