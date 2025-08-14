import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Event schemas
export const AccountUpsertedSchema = z.object({
  account_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  account_number: z.string(),
  institution_id: z.string().uuid(),
  balance: z.number(),
  currency: z.string()
});

export const PositionUpsertedSchema = z.object({
  position_id: z.string().uuid(),
  account_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  symbol: z.string(),
  units: z.number(),
  market_value: z.number(),
  as_of_date: z.string()
});

export const TransactionBookedSchema = z.object({
  transaction_id: z.string().uuid(),
  account_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  trade_date: z.string(),
  type: z.string(),
  amount: z.number(),
  description: z.string().optional()
});

export const ReportRenderedSchema = z.object({
  report_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  portfolio_id: z.string().uuid(),
  report_type: z.string(),
  persona_scope: z.string(),
  storage_url: z.string(),
  file_size: z.number()
});

export const ExceptionCreatedSchema = z.object({
  exception_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  account_id: z.string().uuid().optional(),
  exception_type: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  metadata: z.record(z.any()).optional()
});

export const NotarizationCompletedSchema = z.object({
  session_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  document_id: z.string().uuid(),
  vendor: z.string(),
  status: z.string(),
  evidence_hash: z.string()
});

export const ReconciliationCompletedSchema = z.object({
  accounts_processed: z.number(),
  exceptions_found: z.number().optional(),
  timestamp: z.string()
});

export const BillingDailyProcessedSchema = z.object({
  billing_date: z.string(),
  entities_processed: z.number(),
  total_estimated_cost: z.number()
});

// Event type mappings
export const EventSchemas = {
  'account.upserted': AccountUpsertedSchema,
  'position.upserted': PositionUpsertedSchema,
  'transaction.booked': TransactionBookedSchema,
  'report.rendered': ReportRenderedSchema,
  'exception.created': ExceptionCreatedSchema,
  'notarization.completed': NotarizationCompletedSchema,
  'reconciliation.completed': ReconciliationCompletedSchema,
  'reconciliation.failed': z.object({ error: z.string(), timestamp: z.string() }),
  'billing.daily_processed': BillingDailyProcessedSchema,
  'billing.daily_failed': z.object({ error: z.string(), timestamp: z.string() })
} as const;

export type EventKind = keyof typeof EventSchemas;
export type EventPayload<T extends EventKind> = z.infer<typeof EventSchemas[T]>;

// Event publishing function
export interface DomainEvent {
  kind: EventKind;
  payload: any;
  entity_id: string | null;
  correlation_id?: string;
}

let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

export async function publishEvent(event: DomainEvent): Promise<string> {
  const supabase = getSupabaseClient();
  
  // Validate payload against schema
  const schema = EventSchemas[event.kind];
  if (schema) {
    try {
      schema.parse(event.payload);
    } catch (error) {
      console.error(`Event payload validation failed for ${event.kind}:`, error);
      throw new Error(`Invalid event payload: ${error}`);
    }
  }

  const eventId = crypto.randomUUID();
  const occurredAt = new Date().toISOString();

  // Insert into domain_events table
  const { error } = await supabase
    .from('domain_events')
    .insert({
      event_id: eventId,
      kind: event.kind,
      payload: event.payload,
      occurred_at: occurredAt,
      entity_id: event.entity_id,
      correlation_id: event.correlation_id
    });

  if (error) {
    console.error('Failed to publish event:', error);
    throw error;
  }

  // Notify via PostgreSQL NOTIFY
  try {
    await supabase.rpc('pg_notify', {
      channel: 'domain_events',
      payload: JSON.stringify({ event_id: eventId, kind: event.kind })
    });
  } catch (error) {
    console.warn('Failed to send NOTIFY:', error);
    // Don't throw - event was still saved
  }

  console.log(`Published event ${event.kind} with ID ${eventId}`);
  return eventId;
}

// Client SDK for subscribing to events
export class EventSubscriber {
  private supabase: any;
  private subscriptions: Map<string, any> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Subscribe to events via Supabase Realtime
  subscribe<T extends EventKind>(
    kind: T,
    handler: (payload: EventPayload<T>, metadata: { event_id: string; occurred_at: string; entity_id: string | null }) => void,
    options?: { entity_id?: string }
  ): () => void {
    const subscriptionKey = `${kind}_${options?.entity_id || 'all'}`;
    
    if (this.subscriptions.has(subscriptionKey)) {
      throw new Error(`Already subscribed to ${subscriptionKey}`);
    }

    let filter: any = {
      event: 'INSERT',
      schema: 'public',
      table: 'domain_events',
      filter: `kind=eq.${kind}`
    };

    if (options?.entity_id) {
      filter.filter += `,entity_id=eq.${options.entity_id}`;
    }

    const channel = this.supabase
      .channel(`events_${subscriptionKey}`)
      .on(
        'postgres_changes',
        filter,
        (payload: any) => {
          try {
            handler(payload.new.payload, {
              event_id: payload.new.event_id,
              occurred_at: payload.new.occurred_at,
              entity_id: payload.new.entity_id
            });
          } catch (error) {
            console.error(`Error handling event ${kind}:`, error);
          }
        }
      )
      .subscribe();

    this.subscriptions.set(subscriptionKey, channel);

    // Return unsubscribe function
    return () => {
      const channel = this.subscriptions.get(subscriptionKey);
      if (channel) {
        this.supabase.removeChannel(channel);
        this.subscriptions.delete(subscriptionKey);
      }
    };
  }

  // Poll for events (alternative to realtime)
  async poll<T extends EventKind>(
    kind: T,
    handler: (events: Array<{ payload: EventPayload<T>; event_id: string; occurred_at: string; entity_id: string | null }>) => void,
    options?: { 
      entity_id?: string; 
      since?: string; 
      limit?: number;
      interval?: number;
    }
  ): Promise<() => void> {
    const { entity_id, limit = 100, interval = 5000 } = options || {};
    let since = options?.since || new Date().toISOString();
    let isPolling = true;

    const pollEvents = async () => {
      try {
        let query = this.supabase
          .from('domain_events')
          .select('*')
          .eq('kind', kind)
          .gt('occurred_at', since)
          .order('occurred_at', { ascending: true })
          .limit(limit);

        if (entity_id) {
          query = query.eq('entity_id', entity_id);
        }

        const { data: events, error } = await query;

        if (error) {
          console.error('Error polling events:', error);
          return;
        }

        if (events && events.length > 0) {
          // Update since timestamp to last event
          since = events[events.length - 1].occurred_at;
          
          handler(events.map(event => ({
            payload: event.payload,
            event_id: event.event_id,
            occurred_at: event.occurred_at,
            entity_id: event.entity_id
          })));
        }
      } catch (error) {
        console.error('Polling error:', error);
      }

      if (isPolling) {
        setTimeout(pollEvents, interval);
      }
    };

    // Start polling
    setTimeout(pollEvents, interval);

    // Return stop function
    return () => {
      isPolling = false;
    };
  }

  disconnect() {
    this.subscriptions.forEach(channel => {
      this.supabase.removeChannel(channel);
    });
    this.subscriptions.clear();
  }
}

// Helper function to create event subscriber
export function createEventSubscriber(supabaseUrl: string, supabaseKey: string): EventSubscriber {
  return new EventSubscriber(supabaseUrl, supabaseKey);
}