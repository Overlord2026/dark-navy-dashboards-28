import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell,
  Clock,
  CreditCard,
  FileCheck,
  UserPlus,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'rmd' | 'prospect' | 'billing' | 'compliance';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  acknowledged: boolean;
  client?: {
    name: string;
    id: string;
  };
  metadata?: {
    amount?: number;
    dueDate?: string;
    status?: string;
    prospectEmail?: string;
  };
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'rmd',
    title: 'RMD Deadline Approaching',
    message: 'John Smith (age 73) has an upcoming Required Minimum Distribution due April 1st.',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    acknowledged: false,
    client: { name: 'John Smith', id: 'client-1' },
    metadata: { amount: 45000, dueDate: 'April 1, 2024' }
  },
  {
    id: '2',
    type: 'prospect',
    title: 'New Prospect Signup',
    message: 'Sarah Williams completed the questionnaire and is ready for initial consultation.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    acknowledged: false,
    metadata: { prospectEmail: 'sarah.williams@email.com' }
  },
  {
    id: '3',
    type: 'billing',
    title: 'Payment Failed',
    message: 'Emily Davis subscription payment failed. Card ending in 4567 was declined.',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    acknowledged: false,
    client: { name: 'Emily Davis', id: 'client-3' },
    metadata: { status: 'payment_failed', amount: 299 }
  },
  {
    id: '4',
    type: 'compliance',
    title: 'Document Review Required',
    message: 'Investment proposal for Michael Brown requires compliance approval before sending.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    acknowledged: false,
    client: { name: 'Michael Brown', id: 'client-4' }
  },
  {
    id: '5',
    type: 'rmd',
    title: 'RMD Completed',
    message: 'Required Minimum Distribution processed successfully for Lisa Anderson.',
    priority: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    acknowledged: true,
    client: { name: 'Lisa Anderson', id: 'client-5' },
    metadata: { amount: 28000, status: 'completed' }
  }
];

export function AdvisorAlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('unread');

  // Real-time subscription setup
  useEffect(() => {
    // In a real implementation, you would set up Supabase realtime subscriptions here
    // For example:
    /*
    const channel = supabase
      .channel('advisor-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'advisor_alerts',
          filter: `advisor_id=eq.${advisorId}`
        },
        (payload) => {
          const newAlert = payload.new as Alert;
          setAlerts(prev => [newAlert, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */

    // Simulate real-time alerts for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: ['rmd', 'prospect', 'billing', 'compliance'][Math.floor(Math.random() * 4)] as Alert['type'],
          title: 'New Alert',
          message: 'This is a simulated real-time alert.',
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as Alert['priority'],
          timestamp: new Date(),
          acknowledged: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'rmd': return Clock;
      case 'prospect': return UserPlus;
      case 'billing': return CreditCard;
      case 'compliance': return FileCheck;
      default: return Bell;
    }
  };

  const getAlertColor = (type: Alert['type'], priority: Alert['priority']) => {
    if (priority === 'high') return 'text-red-500';
    switch (type) {
      case 'rmd': return 'text-amber-500';
      case 'prospect': return 'text-green-500';
      case 'billing': return 'text-blue-500';
      case 'compliance': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread': return !alert.acknowledged;
      case 'high': return alert.priority === 'high';
      default: return true;
    }
  });

  const unreadCount = alerts.filter(alert => !alert.acknowledged).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high' && !alert.acknowledged).length;

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
            Real-time Alerts
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({alerts.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High ({highPriorityCount})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {filteredAlerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                const iconColor = getAlertColor(alert.type, alert.priority);
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.3 }}
                    className={`border rounded-lg p-3 space-y-2 transition-all hover:shadow-md ${
                      alert.acknowledged ? 'bg-muted/50 border-muted' : 'bg-background border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${iconColor}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium ${alert.acknowledged ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {alert.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {alert.priority}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className={`text-xs ${alert.acknowledged ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                          {alert.message}
                        </p>
                        
                        {alert.metadata && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {alert.metadata.amount && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                ${alert.metadata.amount.toLocaleString()}
                              </span>
                            )}
                            {alert.metadata.dueDate && (
                              <span>Due: {alert.metadata.dueDate}</span>
                            )}
                            {alert.metadata.prospectEmail && (
                              <span>{alert.metadata.prospectEmail}</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(alert.timestamp)}
                          </span>
                          
                          {!alert.acknowledged && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No alerts found</p>
                <p className="text-xs mt-1">
                  {filter === 'unread' ? 'All alerts have been read' : 'All alerts are up to date'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}