import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'warning' | 'blocked';
  action?: string;
  link?: string;
}

interface MedicareReadyCheckProps {
  clientName?: string;
  onAction?: (action: string) => void;
}

export const MedicareReadyCheck: React.FC<MedicareReadyCheckProps> = ({ 
  clientName = "Patricia Wilson",
  onAction
}) => {
  const complianceItems: ComplianceItem[] = [
    {
      id: 'ptc',
      title: 'Permission to Contact (PTC)',
      description: 'Valid consent for contact recorded',
      status: 'complete'
    },
    {
      id: 'dnc',
      title: 'Do Not Call Check',
      description: 'Phone number cleared for outreach',
      status: 'complete'
    },
    {
      id: 'soa',
      title: 'Scope of Appointment (SOA)',
      description: 'Required before plan-specific discussions',
      status: 'blocked',
      action: 'capture_soa',
      link: '/insurance/soa'
    },
    {
      id: 'disclaimer',
      title: 'Medicare Disclaimers',
      description: 'Must be read aloud before each call',
      status: 'complete'
    },
    {
      id: 'pecl',
      title: 'Pre-Enrollment Checklist',
      description: 'Required before enrollment submission',
      status: 'warning',
      action: 'complete_pecl',
      link: '/insurance/pecl'
    },
    {
      id: 'retention',
      title: '10-Year Retention',
      description: 'All Medicare communications flagged',
      status: 'complete'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'blocked': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600 border-green-200 bg-green-50';
      case 'warning': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'blocked': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const handleAction = (action: string, link?: string) => {
    if (onAction) {
      onAction(action);
    }
    
    if (link) {
      // In a real app, this would navigate to the link
      console.log(`Navigate to: ${link}`);
    }
    
    // Track analytics
    console.log(`[Analytics] compliance.action.${action}`, { client: clientName });
  };

  const completedCount = complianceItems.filter(item => item.status === 'complete').length;
  const totalCount = complianceItems.length;
  const isReady = completedCount === totalCount;
  const blockedItems = complianceItems.filter(item => item.status === 'blocked');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Medicare Compliance ReadyCheck
            {isReady ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </CardTitle>
          <Badge variant="outline">
            {completedCount}/{totalCount} Complete
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Client: {clientName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className={`p-3 rounded-lg border ${
          isReady ? 'bg-green-50 border-green-200' : 
          blockedItems.length > 0 ? 'bg-red-50 border-red-200' : 
          'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm font-medium ${
            isReady ? 'text-green-800' : 
            blockedItems.length > 0 ? 'text-red-800' : 
            'text-yellow-800'
          }`}>
            {isReady ? 
              '✓ Ready for plan-specific discussions and enrollment' :
              blockedItems.length > 0 ?
              '⚠ Blocked items must be resolved before proceeding' :
              '⚠ Some items need attention'
            }
          </p>
        </div>

        {/* Blocked Items Warning */}
        {blockedItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 mb-2">
              Cannot proceed with plan comparisons:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {blockedItems.map(item => (
                <li key={item.id}>• {item.title} - {item.description}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Compliance Items */}
        <div className="space-y-3">
          {complianceItems.map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(item.status)}`}>
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs opacity-80">{item.description}</p>
                </div>
              </div>
              
              {item.action && item.status !== 'complete' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction(item.action!, item.link)}
                  className="flex items-center gap-2"
                >
                  Resolve
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Compliance Progress</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};