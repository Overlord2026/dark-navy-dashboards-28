
// Service to handle AI analysis using OpenAI API

// OpenAI API key
const OPENAI_API_KEY = "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";

/**
 * Generate AI analysis for a stock based on its data
 * @param stockData - The stock data to analyze
 * @returns Promise with AI-generated analysis text
 */
export const generateStockAnalysis = async (stockData: any): Promise<string> => {
  try {
    const prompt = `
      Analyze the following stock data for ${stockData.companyName} (${stockData.symbol}):
      - Current Price: $${stockData.price}
      - Change: ${stockData.change > 0 ? '+' : ''}${stockData.change} (${stockData.changePercent}%)
      - Market Cap: ${stockData.marketCap ? '$' + (stockData.marketCap / 1000000000).toFixed(2) + 'B' : 'N/A'}
      - P/E Ratio: ${stockData.peRatio || 'N/A'}
      - Dividend Yield: ${stockData.dividendYield ? stockData.dividendYield.toFixed(2) + '%' : 'N/A'}
      - Sector: ${stockData.sector}
      - Industry: ${stockData.industry}
      - 52 Week High: ${stockData.week52High ? '$' + stockData.week52High : 'N/A'}
      - 52 Week Low: ${stockData.week52Low ? '$' + stockData.week52Low : 'N/A'}
      
      Provide a concise investment analysis (max 200 words) covering:
      1. Brief overview of recent performance
      2. Valuation assessment (undervalued/overvalued)
      3. Key strengths and risks
      4. Investment outlook (short and mid-term)
      
      Format the response in 3-4 short paragraphs without any preamble or introduction.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor with expertise in stock analysis. Provide concise, professional insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return `Error generating analysis: ${data.error.message || "Unknown error"}`;
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating stock analysis:", error);
    return "Unable to generate analysis at this time. Please try again later.";
  }
};

/**
 * Generate portfolio analysis based on multiple stocks
 * @param portfolioData - Array of stock data objects 
 * @param portfolioName - Name of the portfolio
 * @returns Promise with AI-generated portfolio analysis
 */
export const generatePortfolioAnalysis = async (
  portfolioData: any[], 
  portfolioName: string
): Promise<string> => {
  try {
    // Convert portfolio data to a string representation
    const portfolioSummary = portfolioData.map(stock => 
      `${stock.symbol} (${stock.companyName}): $${stock.price}, Weight: ${stock.weight}%, Sector: ${stock.sector}`
    ).join('\n');

    const prompt = `
      Analyze the following investment portfolio named "${portfolioName}":
      
      ${portfolioSummary}
      
      Provide a comprehensive portfolio analysis (max 300 words) covering:
      1. Overall portfolio composition and diversification
      2. Sector allocation assessment
      3. Risk exposure and volatility assessment
      4. Recommendations for potential rebalancing or adjustments
      5. Market outlook for this portfolio composition
      
      Format the response in 4-5 paragraphs without any preamble or introduction.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a portfolio manager with expertise in asset allocation and investment strategy. Provide concise, professional portfolio analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return `Error generating portfolio analysis: ${data.error.message || "Unknown error"}`;
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating portfolio analysis:", error);
    return "Unable to generate portfolio analysis at this time. Please try again later.";
  }
};
