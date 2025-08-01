import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Bell,
  X,
  ExternalLink,
  Clock,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SmartAlert {
  id: string;
  type: 'rmd_reminder' | 'roth_conversion' | 'beneficiary_penalty' | 'tax_opportunity' | 'deadline' | 'market_insight';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  persona: string[];
  actionText?: string;
  actionUrl?: string;
  dismissible: boolean;
  expiresAt?: string;
  estimatedSavings?: number;
  deadline?: string;
}

interface AISmartAlertsProps {
  userPersona: string;
  userAge?: number;
  financialData?: any;
}

export function AISmartAlerts({ userPersona, userAge = 45, financialData }: AISmartAlertsProps) {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();

  useEffect(() => {
    generatePersonalizedAlerts();
  }, [userPersona, userAge, financialData]);

  const generatePersonalizedAlerts = async () => {
    setLoading(true);
    try {
      // Call AI edge function to generate personalized alerts
      const { data, error } = await supabase.functions.invoke('ai-smart-alerts', {
        body: {
          persona: userPersona,
          age: userAge,
          financial_data: financialData,
          current_date: new Date().toISOString()
        }
      });

      if (error) throw error;
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error generating alerts:', error);
      // Fallback to mock alerts for demo
      setAlerts(getMockAlerts(userPersona, userAge));
    } finally {
      setLoading(false);
    }
  };

  const getMockAlerts = (persona: string, age: number): SmartAlert[] => {
    const alerts: SmartAlert[] = [];
    
    // Age-based RMD alerts
    if (age >= 70) {
      alerts.push({
        id: 'rmd-reminder-2024',
        type: 'rmd_reminder',
        title: 'RMD Deadline Approaching',
        message: `Your Required Minimum Distribution deadline is December 31st. Current estimated RMD: $45,000.`,
        severity: 'high',
        persona: ['retiree', 'high_net_worth'],
        actionText: 'Calculate RMD',
        actionUrl: '/tax-planning/rmd-calculator',
        dismissible: false,
        deadline: '2024-12-31',
        expiresAt: '2024-12-31'
      });
    }

    // Roth conversion opportunities
    if (age < 65 && (persona === 'high_net_worth' || persona === 'pre_retiree')) {
      alerts.push({
        id: 'roth-conversion-2024',
        type: 'roth_conversion',
        title: 'Roth Conversion Opportunity',
        message: 'Market downturn creates optimal Roth conversion window. Consider converting $50k at current lower valuations.',
        severity: 'medium',
        persona: ['high_net_worth', 'pre_retiree'],
        actionText: 'Analyze Conversion',
        actionUrl: '/tax-planning',
        dismissible: true,
        estimatedSavings: 15000
      });
    }

    // Beneficiary penalties for inherited IRAs
    if (persona === 'high_net_worth' || persona === 'retiree') {
      alerts.push({
        id: 'beneficiary-penalty-secure-act',
        type: 'beneficiary_penalty',
        title: 'SECURE Act Compliance Required',
        message: 'Inherited IRA must be distributed within 10 years. Failure to comply results in 50% penalty on required amount.',
        severity: 'critical',
        persona: ['high_net_worth', 'retiree', 'business_owner'],
        actionText: 'Review Rules',
        actionUrl: '/education/secure-act',
        dismissible: true
      });
    }

    // Tax loss harvesting
    alerts.push({
      id: 'tax-loss-harvesting',
      type: 'tax_opportunity',
      title: 'Tax Loss Harvesting Opportunity',
      message: 'Portfolio analysis shows $8,500 in tax losses available to harvest before year-end.',
      severity: 'medium',
      persona: ['investor', 'high_net_worth', 'business_owner'],
      actionText: 'View Analysis',
      dismissible: true,
      estimatedSavings: 2500
    });

    return alerts.filter(alert => alert.persona.includes(persona));
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    toast({
      title: "Alert Dismissed",
      description: "You can re-enable alerts in your settings.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rmd_reminder': return <Calendar className="h-5 w-5" />;
      case 'roth_conversion': return <TrendingUp className="h-5 w-5" />;
      case 'beneficiary_penalty': return <AlertTriangle className="h-5 w-5" />;
      case 'tax_opportunity': return <DollarSign className="h-5 w-5" />;
      case 'deadline': return <Clock className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600 text-white';
      case 'high': return 'from-orange-500 to-orange-600 text-white';
      case 'medium': return 'from-yellow-500 to-yellow-600 text-white';
      case 'low': return 'from-blue-500 to-blue-600 text-white';
      default: return 'from-gray-500 to-gray-600 text-white';
    }
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 animate-pulse" />
            Loading Smart Alerts...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (visibleAlerts.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Target className="h-5 w-5" />
            <span className="font-medium">All caught up!</span>
            <span className="text-sm">No critical alerts at this time.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        Smart Tax Alerts
        <Badge variant="outline">{visibleAlerts.length}</Badge>
      </h3>
      
      <AnimatePresence>
        {visibleAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-500' :
              alert.severity === 'high' ? 'border-l-orange-500' :
              alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3">{alert.message}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {alert.estimatedSavings && (
                          <Badge variant="outline" className="text-green-600">
                            Save up to ${alert.estimatedSavings.toLocaleString()}
                          </Badge>
                        )}
                        {alert.deadline && (
                          <Badge variant="outline" className="text-orange-600">
                            Deadline: {new Date(alert.deadline).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {alert.dismissible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              {alert.actionText && (
                <CardContent className="pt-0">
                  <Button className="flex items-center gap-2">
                    {alert.actionText}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}