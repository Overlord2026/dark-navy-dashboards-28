export interface MarketRegime {
  regime: 'bull' | 'bear' | 'sideways' | 'volatile';
  confidence: number;
  indicators: { volatility: number; momentum: number; trend: number; };
  duration: number;
}

export const classifyMarketRegime = (
  marketData: Array<{date: string; price: number; volume: number}>
): MarketRegime => {
  const returns = marketData.slice(1).map((data, i) => 
    (data.price - marketData[i].price) / marketData[i].price
  );
  
  const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length);
  const momentum = returns.slice(-20).reduce((sum, r) => sum + r, 0) / 20;
  const trend = (marketData[marketData.length - 1].price - marketData[0].price) / marketData[0].price;

  let regime: MarketRegime['regime'];
  if (trend > 0.05 && volatility < 0.02) regime = 'bull';
  else if (trend < -0.05) regime = 'bear';
  else if (volatility > 0.03) regime = 'volatile';
  else regime = 'sideways';

  return {
    regime,
    confidence: Math.min(0.95, Math.abs(trend) + (1 - volatility)),
    indicators: { volatility, momentum, trend },
    duration: marketData.length
  };
};