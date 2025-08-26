import { recordReceipt } from '@/features/receipts/store';
import { validateSliceADV, updateBookState, getTradingLimits, type TradingLimits } from './policy';

export interface TradeSlice {
  id: string;
  symbol: string;
  quantity: number;
  side: 'buy' | 'sell';
  bookId: string;
  parentOrderId?: string;
  inherited_controls?: TradingLimits;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  rejection_reason?: string;
}

export interface ScheduledTrade {
  orderId: string;
  slices: TradeSlice[];
  strategy: string;
  created_at: string;
  status: 'pending' | 'executing' | 'completed' | 'cancelled';
}

// In-memory storage for demo
let SCHEDULED_TRADES: Record<string, ScheduledTrade> = {};

/**
 * Create child slices that inherit parent caps and cooling-off periods
 */
export async function createChildSlices(
  parentOrderId: string,
  slices: Omit<TradeSlice, 'id' | 'inherited_controls' | 'status'>[]
): Promise<TradeSlice[]> {
  
  const inheritedControls = getTradingLimits();
  const childSlices: TradeSlice[] = [];
  
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    const childSlice: TradeSlice = {
      ...slice,
      id: `${parentOrderId}_slice_${i + 1}`,
      parentOrderId,
      inherited_controls: inheritedControls,
      status: 'pending'
    };
    
    // Validate slice against ADV limits
    const validation = await validateSliceADV(slice.symbol, slice.quantity, slice.bookId);
    
    if (!validation.allowed) {
      childSlice.status = 'rejected';
      childSlice.rejection_reason = validation.reason;
    } else {
      childSlice.status = 'approved';
    }
    
    // Log Trade-RDS for each child slice
    await recordReceipt({
      receipt_id: `rds_trade_${Date.now()}_${i}`,
      type: 'Trade-RDS',
      ts: new Date().toISOString(),
      policy_version: 'TG-2025',
      inputs_hash: `sha256:${btoa(JSON.stringify({ 
        symbol: slice.symbol, 
        quantity: slice.quantity, 
        bookId: slice.bookId 
      }))}`,
      trade_details: {
        slice_id: childSlice.id,
        symbol: slice.symbol,
        quantity: slice.quantity,
        side: slice.side,
        book_id: slice.bookId,
        inherited_controls: inheritedControls,
        validation_result: validation,
        status: childSlice.status
      },
      reasons: [
        validation.allowed ? 'adv_within_cap' : 'risk.blocked',
        'child_slice_created',
        `parent:${parentOrderId}`
      ]
    });
    
    childSlices.push(childSlice);
  }
  
  return childSlices;
}

/**
 * Execute approved slices
 */
export async function executeSlices(slices: TradeSlice[]): Promise<TradeSlice[]> {
  const executedSlices: TradeSlice[] = [];
  
  for (const slice of slices) {
    if (slice.status !== 'approved') {
      executedSlices.push(slice);
      continue;
    }
    
    try {
      // Simulate execution
      const tradeValue = Math.abs(slice.quantity) * 100; // Assume $100 per share
      await updateBookState(slice.bookId, tradeValue);
      
      const executedSlice = {
        ...slice,
        status: 'executed' as const
      };
      
      // Log execution
      await recordReceipt({
        receipt_id: `rds_execution_${Date.now()}`,
        type: 'Execution-RDS',
        ts: new Date().toISOString(),
        policy_version: 'TG-2025',
        inputs_hash: `sha256:${btoa(JSON.stringify({ sliceId: slice.id }))}`,
        execution_details: {
          slice_id: slice.id,
          symbol: slice.symbol,
          quantity: slice.quantity,
          trade_value: tradeValue,
          book_id: slice.bookId
        },
        reasons: ['slice_executed', 'adv_tracked']
      });
      
      executedSlices.push(executedSlice);
    } catch (error) {
      executedSlices.push({
        ...slice,
        status: 'rejected',
        rejection_reason: 'execution_failed'
      });
    }
  }
  
  return executedSlices;
}

/**
 * Schedule a new trade with multiple slices
 */
export async function scheduleTrade(
  strategy: string,
  slices: Omit<TradeSlice, 'id' | 'inherited_controls' | 'status' | 'parentOrderId'>[]
): Promise<ScheduledTrade> {
  
  const orderId = `order_${Date.now()}`;
  const childSlices = await createChildSlices(orderId, slices);
  
  const scheduledTrade: ScheduledTrade = {
    orderId,
    slices: childSlices,
    strategy,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  
  SCHEDULED_TRADES[orderId] = scheduledTrade;
  
  // Log the parent order
  await recordReceipt({
    receipt_id: `rds_schedule_${Date.now()}`,
    type: 'Schedule-RDS',
    ts: new Date().toISOString(),
    policy_version: 'TG-2025',
    inputs_hash: `sha256:${btoa(JSON.stringify({ orderId, strategy, sliceCount: slices.length }))}`,
    schedule_details: {
      order_id: orderId,
      strategy,
      slice_count: childSlices.length,
      approved_slices: childSlices.filter(s => s.status === 'approved').length,
      rejected_slices: childSlices.filter(s => s.status === 'rejected').length
    },
    reasons: ['trade_scheduled', 'slices_created']
  });
  
  return scheduledTrade;
}

/**
 * Get scheduled trade by ID
 */
export function getScheduledTrade(orderId: string): ScheduledTrade | null {
  return SCHEDULED_TRADES[orderId] || null;
}

/**
 * List all scheduled trades
 */
export function listScheduledTrades(): ScheduledTrade[] {
  return Object.values(SCHEDULED_TRADES);
}