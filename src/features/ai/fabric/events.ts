export type Event = {
  id: string;
  type:
    | 'advise.requested' 
    | 'advise.issued' 
    | 'trade.signal' 
    | 'trade.placed' 
    | 'rollover.generated' 
    | 'rollover.submitted'
    | 'doc.ingested' 
    | 'health.packet.final' 
    | 'estate.review.merged';
  at: string;
  actor: string;
  subject: string;
  meta?: Record<string, any>;
};

// In-memory event store (replace with actual event bus in production)
let EVENTS: Event[] = [];

export async function emitEvent(event: Omit<Event, 'id' | 'at'>): Promise<Event> {
  const fullEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };
  
  EVENTS.push(fullEvent);
  console.log('[AI Fabric Event]', fullEvent);
  
  return fullEvent;
}

export async function getEvents(filters?: {
  type?: Event['type'];
  actor?: string;
  subject?: string;
  since?: string;
}): Promise<Event[]> {
  let filtered = EVENTS;
  
  if (filters?.type) {
    filtered = filtered.filter(e => e.type === filters.type);
  }
  
  if (filters?.actor) {
    filtered = filtered.filter(e => e.actor === filters.actor);
  }
  
  if (filters?.subject) {
    filtered = filtered.filter(e => e.subject === filters.subject);
  }
  
  if (filters?.since) {
    const sinceDate = new Date(filters.since);
    filtered = filtered.filter(e => new Date(e.at) >= sinceDate);
  }
  
  return filtered.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export async function getEventById(id: string): Promise<Event | undefined> {
  return EVENTS.find(e => e.id === id);
}