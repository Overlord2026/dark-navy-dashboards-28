import * as React from 'react';

export function useAiesSSE(endpoint: string, agent: string, authToken: string | null) {
  const [events, setEvents] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (!authToken) return;
    const url = `${endpoint}?agent=${encodeURIComponent(agent)}`;
    const es = new EventSource(url, { withCredentials: false });
    es.onmessage = (ev) => {
      try { setEvents(prev => [...prev, JSON.parse(ev.data)]); }
      catch { /* ignore */ }
    };
    es.onerror = () => { /* network hiccup; let the server loop continue */ };
    return () => es.close();
  }, [endpoint, agent, authToken]);
  return events;
}