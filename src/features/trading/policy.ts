import { recordReceipt } from '@/features/receipts/store';

export interface TradingLimits {
  adv_symbol_bps: number;  // basis points of symbol ADV
  adv_book_bps: number;    // basis points of book ADV
  cooling_off_sec: number; // cooling off period in seconds
  drawdown_limit_bps: number; // max drawdown in basis points
}

export interface MarketData {
  symbol: string;
  adv_30d: number[];       // 30-day ADV history
  current_price: number;
  last_updated: string;
}

export interface BookState {
  total_nav: number;
  current_adv_usage_bps: number;
  last_trade_timestamp: number;
}

// In-memory storage for demo
let MARKET_DATA: Record<string, MarketData> = {};
let BOOK_STATES: Record<string, BookState> = {};
let TRADING_LIMITS: TradingLimits = {
  adv_symbol_bps: 500,    // 5% of symbol ADV
  adv_book_bps: 1000,     // 10% of book ADV  
  cooling_off_sec: 300,   // 5 minutes
  drawdown_limit_bps: 200 // 2% max drawdown
};

/**
 * Winsorize ADV data by removing outliers at 5th/95th percentiles
 */
function winsorizeADV(advData: number[]): number[] {
  const sorted = [...advData].sort((a, b) => a - b);
  const p5 = Math.floor(sorted.length * 0.05);
  const p95 = Math.floor(sorted.length * 0.95);
  
  const min = sorted[p5];
  const max = sorted[p95];
  
  return advData.map(val => Math.max(min, Math.min(max, val)));
}

/**
 * Calculate winsorized N-day ADV for a symbol
 */
export function calculateWinsorizedADV(symbol: string, days: number = 30): number {
  const data = MARKET_DATA[symbol];
  if (!data || !data.adv_30d.length) return 0;
  
  const recentData = data.adv_30d.slice(-days);
  const winsorized = winsorizeADV(recentData);
  
  return winsorized.reduce((sum, val) => sum + val, 0) / winsorized.length;
}

/**
 * Check if a trade slice violates %ADV limits
 */
export async function validateSliceADV(
  symbol: string, 
  quantity: number, 
  bookId: string
): Promise<{ allowed: boolean; reason?: string; usage_bps?: number }> {
  
  const marketData = MARKET_DATA[symbol];
  const bookState = BOOK_STATES[bookId];
  
  if (!marketData) {
    return { allowed: false, reason: "market_data_unavailable" };
  }
  
  const winsorizedADV = calculateWinsorizedADV(symbol);
  const tradeValue = Math.abs(quantity) * marketData.current_price;
  
  // Check symbol-level ADV usage
  const symbolUsageBps = (tradeValue / winsorizedADV) * 10000;
  if (symbolUsageBps > TRADING_LIMITS.adv_symbol_bps) {
    return { 
      allowed: false, 
      reason: "risk.blocked", 
      usage_bps: symbolUsageBps 
    };
  }
  
  // Check book-level ADV usage
  if (bookState) {
    const bookUsageBps = bookState.current_adv_usage_bps + symbolUsageBps;
    if (bookUsageBps > TRADING_LIMITS.adv_book_bps) {
      return { 
        allowed: false, 
        reason: "risk.blocked", 
        usage_bps: bookUsageBps 
      };
    }
  }
  
  // Check cooling-off period
  const now = Date.now();
  if (bookState && (now - bookState.last_trade_timestamp) < (TRADING_LIMITS.cooling_off_sec * 1000)) {
    return { 
      allowed: false, 
      reason: "cooling_off_active" 
    };
  }
  
  return { allowed: true, usage_bps: symbolUsageBps };
}

/**
 * Update book state after trade execution
 */
export async function updateBookState(bookId: string, tradeValue: number): Promise<void> {
  const now = Date.now();
  
  if (!BOOK_STATES[bookId]) {
    BOOK_STATES[bookId] = {
      total_nav: 1000000, // Default $1M NAV
      current_adv_usage_bps: 0,
      last_trade_timestamp: now
    };
  }
  
  const state = BOOK_STATES[bookId];
  const usageBps = (tradeValue / state.total_nav) * 10000;
  
  state.current_adv_usage_bps += usageBps;
  state.last_trade_timestamp = now;
  
  // Record usage update
  await recordReceipt({
    receipt_id: `rds_book_update_${Date.now()}`,
    type: 'Book-RDS',
    ts: new Date().toISOString(),
    policy_version: 'TG-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ bookId, tradeValue, usageBps }))}`,
    book_details: {
      book_id: bookId,
      usage_bps: usageBps,
      total_usage_bps: state.current_adv_usage_bps,
      limits: TRADING_LIMITS
    },
    reasons: ['book_state_updated', 'adv_tracking']
  });
}

/**
 * Reset book ADV usage (typically done daily)
 */
export function resetBookADVUsage(bookId: string): void {
  if (BOOK_STATES[bookId]) {
    BOOK_STATES[bookId].current_adv_usage_bps = 0;
  }
}

/**
 * Set market data for testing
 */
export function setMarketData(symbol: string, data: MarketData): void {
  MARKET_DATA[symbol] = data;
}

/**
 * Set trading limits
 */
export function setTradingLimits(limits: Partial<TradingLimits>): void {
  TRADING_LIMITS = { ...TRADING_LIMITS, ...limits };
}

/**
 * Get current trading limits
 */
export function getTradingLimits(): TradingLimits {
  return { ...TRADING_LIMITS };
}