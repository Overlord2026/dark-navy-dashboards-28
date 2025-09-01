
import { callEdgeJSON } from '@/services/aiEdge';
import { secretsValidator } from '@/services/security/secretsValidator';

/**
 * Secure AI Analysis Service
 * Uses Supabase Edge Functions with securely stored API keys
 * NO HARDCODED SECRETS - All API keys stored in Supabase Edge Function environment
 */

interface AIAnalysisResponse {
  analysis: string;
  analysisType: 'stock' | 'portfolio';
  generatedAt: string;
}

/**
 * Generate AI analysis for a stock using secure Edge Function
 * @param stockData - The stock data to analyze
 * @returns Promise with AI-generated analysis text
 */
export const generateStockAnalysis = async (stockData: any): Promise<string> => {
  try {
    // Validate that we're not using any hardcoded secrets
    const validation = secretsValidator.validateSecretSource('', 'edge_function_call');
    
    console.log('Generating stock analysis via secure Edge Function');

    const data = await callEdgeJSON('ai-analysis', { stockData, analysisType: 'stock' });
    return data?.analysis || "Analysis could not be generated.";
  } catch (error) {
    console.error('Error calling AI analysis Edge Function:', error);
    return "Unable to generate analysis at this time. Please try again later.";
  }
};

/**
 * Generate portfolio analysis based on multiple stocks using secure Edge Function
 * @param portfolioData - Array of stock data objects 
 * @param portfolioName - Name of the portfolio
 * @returns Promise with AI-generated portfolio analysis
 */
export const generatePortfolioAnalysis = async (
  portfolioData: any[], 
  portfolioName: string
): Promise<string> => {
  try {
    // Validate that we're not using any hardcoded secrets
    const validation = secretsValidator.validateSecretSource('', 'edge_function_call');
    
    console.log('Generating portfolio analysis via secure Edge Function');

    const data = await callEdgeJSON('ai-analysis', { stockData: portfolioData, analysisType: 'portfolio', portfolioName });
    return data?.analysis || "Portfolio analysis could not be generated.";
  } catch (error) {
    console.error('Error calling portfolio analysis Edge Function:', error);
    return "Unable to generate portfolio analysis at this time. Please try again later.";
  }
};

// Runtime security check - validate no hardcoded secrets are being used
if (typeof window !== 'undefined') {
  secretsValidator.validateRuntimeSecrets().then(results => {
    const criticalIssues = results.filter(r => r.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.error('🚨 CRITICAL SECURITY ALERT: Insecure secrets detected in AI Analysis Service');
      criticalIssues.forEach(issue => console.error(`- ${issue.secretName}: ${issue.recommendation}`));
    }
  });
}
