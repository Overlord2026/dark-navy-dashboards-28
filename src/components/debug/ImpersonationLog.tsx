import React, { useState, useEffect } from 'react';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { getRoleDisplayName } from '@/utils/roleHierarchy';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, RotateCcw, Trash2, User, Clock } from 'lucide-react';

interface ImpersonationEvent {
  id: string;
  timestamp: Date;
  fromRole: string;
  toRole: string;
  tier?: 'basic' | 'premium';
  route: string;
}

const STORAGE_KEY = 'impersonation_log';

export function ImpersonationLog() {
  const { emulatedRole, getCurrentRole, getCurrentClientTier, setEmulatedRole, setClientTier, isDevMode } = useRoleContext();
  const { userProfile } = useUser();
  const [events, setEvents] = useState<ImpersonationEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEvents(parsed.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })));
      } catch (error) {
        console.error('Error loading impersonation log:', error);
      }
    }
  }, []);

  // Save events to localStorage
  const saveEvents = (newEvents: ImpersonationEvent[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  // Track role changes
  useEffect(() => {
    if (!isDevMode || !userProfile) return;

    const currentRole = getCurrentRole();
    const currentTier = getCurrentClientTier();
    const currentRoute = window.location.pathname;

    // Only log when role actually changes
    const lastEvent = events[0];
    if (lastEvent && lastEvent.toRole === currentRole && lastEvent.tier === currentTier) {
      return;
    }

    const newEvent: ImpersonationEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      fromRole: lastEvent ? lastEvent.toRole : userProfile.role,
      toRole: currentRole,
      tier: currentRole.includes('client') ? currentTier : undefined,
      route: currentRoute
    };

    const updatedEvents = [newEvent, ...events.slice(0, 49)]; // Keep last 50 events
    saveEvents(updatedEvents);
  }, [emulatedRole, getCurrentRole(), getCurrentClientTier(), isDevMode]);

  const clearLog = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEvents([]);
  };

  const revertToEvent = (event: ImpersonationEvent) => {
    if (event.toRole === userProfile?.role) {
      setEmulatedRole(null);
    } else {
      setEmulatedRole(event.toRole);
    }
    
    if (event.tier && event.toRole.includes('client')) {
      setClientTier(event.tier);
    }

    // Navigate to the route from that event
    window.location.href = event.route;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!isDevMode) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="bg-background border border-muted-foreground"
      >
        <History className="h-4 w-4 mr-2" />
        Role History ({events.length})
      </Button>

      {isOpen && (
        <Card className="w-80 max-h-64 overflow-y-auto bg-background border shadow-xl mt-2">
          <div className="p-3 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                Impersonation Log
              </h3>
              <div className="flex items-center gap-2">
                <Button onClick={clearLog} variant="ghost" size="sm" title="Clear log">
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">×</Button>
              </div>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {events.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No role changes recorded yet
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50 text-xs border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{formatTime(event.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{getRoleDisplayName(event.fromRole)}</span>
                        <span>→</span>
                        <span className="font-medium">{getRoleDisplayName(event.toRole)}</span>
                        {event.tier && (
                          <Badge variant="secondary" className="text-xs">
                            {event.tier}
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        Route: {event.route}
                      </div>
                    </div>
                    <Button
                      onClick={() => revertToEvent(event)}
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      title="Revert to this state"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}