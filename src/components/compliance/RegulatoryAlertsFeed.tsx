import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  Bell, 
  ExternalLink, 
  Filter, 
  Search,
  Calendar,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';

interface RegulatoryAlert {
  id: string;
  title: string;
  content: string;
  alertType: 'SEC' | 'FINRA' | 'STATE' | 'IRS' | 'DOL' | 'INSURANCE' | 'GENERAL';
  severity: 'low' | 'medium' | 'high' | 'critical';
  regulatoryBody: string;
  effectiveDate?: string;
  deadlineDate?: string;
  sourceUrl?: string;
  actionRequired: boolean;
  actionItems: string[];
  isRead: boolean;
  created: string;
}

export const RegulatoryAlertsFeed: React.FC = () => {
  const [alerts] = useState<RegulatoryAlert[]>([
    {
      id: '1',
      title: 'SEC Marketing Rule Updates',
      content: 'The SEC has issued new guidance on the Marketing Rule requirements for investment advisers. All RIAs must review their advertising and client communication practices.',
      alertType: 'SEC',
      severity: 'high',
      regulatoryBody: 'Securities and Exchange Commission',
      effectiveDate: '2024-02-01',
      deadlineDate: '2024-03-01',
      sourceUrl: 'https://sec.gov/marketing-rule-updates',
      actionRequired: true,
      actionItems: [
        'Review current marketing materials',
        'Update compliance procedures',
        'Train staff on new requirements',
        'Document compliance efforts'
      ],
      isRead: false,
      created: '2024-01-20'
    },
    {
      id: '2',
      title: 'FINRA Cybersecurity Notice',
      content: 'FINRA has released updated cybersecurity requirements for broker-dealers. Firms must assess their cybersecurity programs and implement enhanced controls.',
      alertType: 'FINRA',
      severity: 'medium',
      regulatoryBody: 'Financial Industry Regulatory Authority',
      effectiveDate: '2024-01-15',
      deadlineDate: '2024-04-15',
      sourceUrl: 'https://finra.org/cybersecurity-update',
      actionRequired: true,
      actionItems: [
        'Conduct cybersecurity assessment',
        'Update written cybersecurity procedures',
        'Provide staff training',
        'Report any incidents'
      ],
      isRead: true,
      created: '2024-01-18'
    },
    {
      id: '3',
      title: 'State Filing Deadline Reminder',
      content: 'Annual state registration renewals are due by March 31, 2024. Ensure all required filings and fees are submitted timely.',
      alertType: 'STATE',
      severity: 'medium',
      regulatoryBody: 'State Securities Regulators',
      effectiveDate: '2024-03-31',
      actionRequired: true,
      actionItems: [
        'Prepare renewal filings',
        'Calculate renewal fees',
        'Submit before deadline',
        'Update any material changes'
      ],
      isRead: false,
      created: '2024-01-16'
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState<RegulatoryAlert | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'SEC': 'bg-blue-100 text-blue-800',
      'FINRA': 'bg-purple-100 text-purple-800',
      'STATE': 'bg-green-100 text-green-800',
      'IRS': 'bg-red-100 text-red-800',
      'DOL': 'bg-yellow-100 text-yellow-800',
      'INSURANCE': 'bg-orange-100 text-orange-800',
      'GENERAL': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || colors.GENERAL}>
        {type}
      </Badge>
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !alert.isRead) ||
                         (filter === 'action-required' && alert.actionRequired) ||
                         (filter === alert.alertType.toLowerCase());
    
    const matchesSearch = searchTerm === '' || 
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const actionRequiredCount = alerts.filter(alert => alert.actionRequired && !alert.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Regulatory Alerts</h2>
            <p className="text-muted-foreground">Stay updated on regulatory changes and compliance requirements</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} Unread
            </Badge>
          )}
          {actionRequiredCount > 0 && (
            <Badge variant="default" className="bg-warning animate-pulse">
              {actionRequiredCount} Action Required
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Filter Alerts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Alert Type</label>
                <div className="space-y-2 mt-2">
                  {['SEC', 'FINRA', 'STATE', 'IRS', 'DOL'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={type} 
                        checked={filter === type.toLowerCase()}
                        onCheckedChange={() => setFilter(filter === type.toLowerCase() ? 'all' : type.toLowerCase())}
                      />
                      <label htmlFor={type} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unread" 
                      checked={filter === 'unread'}
                      onCheckedChange={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
                    />
                    <label htmlFor="unread" className="text-sm">Unread Only</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="action-required" 
                      checked={filter === 'action-required'}
                      onCheckedChange={() => setFilter(filter === 'action-required' ? 'all' : 'action-required')}
                    />
                    <label htmlFor="action-required" className="text-sm">Action Required</label>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="action">Action Required ({actionRequiredCount})</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`premium-card cursor-pointer hover:shadow-md transition-shadow ${!alert.isRead ? 'border-l-4 border-l-primary' : ''}`}
              onClick={() => setSelectedAlert(alert)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(alert.alertType)}
                      {getSeverityBadge(alert.severity)}
                      {alert.actionRequired && (
                        <Badge variant="outline" className="bg-warning/10 text-warning">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Action Required
                        </Badge>
                      )}
                      {!alert.isRead && (
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{alert.regulatoryBody}</p>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{new Date(alert.created).toLocaleDateString()}</div>
                    {alert.deadlineDate && (
                      <div className="flex items-center gap-1 text-warning mt-1">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(alert.deadlineDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm mb-3">{alert.content}</p>
                
                {alert.actionItems.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Required Actions:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {alert.actionItems.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-warning rounded-full mt-2" />
                          {item}
                        </li>
                      ))}
                      {alert.actionItems.length > 2 && (
                        <li className="text-xs text-muted-foreground">
                          +{alert.actionItems.length - 2} more actions...
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    {alert.effectiveDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Effective: {new Date(alert.effectiveDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {alert.sourceUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Source
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unread">
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Unread Alerts</h3>
            <p className="text-muted-foreground">You're all caught up on regulatory updates!</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle className="flex-1">{selectedAlert.title}</DialogTitle>
                <div className="flex gap-2">
                  {getTypeBadge(selectedAlert.alertType)}
                  {getSeverityBadge(selectedAlert.severity)}
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Regulatory Body</div>
                  <div className="font-medium">{selectedAlert.regulatoryBody}</div>
                </div>
                {selectedAlert.effectiveDate && (
                  <div>
                    <div className="text-sm text-muted-foreground">Effective Date</div>
                    <div className="font-medium">{new Date(selectedAlert.effectiveDate).toLocaleDateString()}</div>
                  </div>
                )}
                {selectedAlert.deadlineDate && (
                  <div>
                    <div className="text-sm text-muted-foreground">Deadline</div>
                    <div className="font-medium text-warning">{new Date(selectedAlert.deadlineDate).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-3">Alert Details</h4>
                <p className="text-sm leading-relaxed">{selectedAlert.content}</p>
              </div>

              {selectedAlert.actionItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Required Actions
                  </h4>
                  <div className="space-y-2">
                    {selectedAlert.actionItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-5 w-5 border-2 border-primary rounded mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add to Tasks
                  </Button>
                </div>
                
                {selectedAlert.sourceUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedAlert.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Notice
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};