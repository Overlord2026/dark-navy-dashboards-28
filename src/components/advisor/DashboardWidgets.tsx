import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardMetrics {
  clientsRequiringAction: number;
  pendingDocReviews: number;
  aiFlaggedOpportunities: number;
  totalTaxSavings: number;
  totalClients: number;
}

interface DashboardWidgetsProps {
  metrics: DashboardMetrics;
}

export function DashboardWidgets({ metrics }: DashboardWidgetsProps) {
  const widgets = [
    {
      title: 'Clients Requiring Action',
      value: metrics.clientsRequiringAction,
      description: 'Immediate attention needed',
      icon: AlertTriangle,
      trend: '+2 from last week',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Pending Doc Reviews',
      value: metrics.pendingDocReviews,
      description: 'Documents awaiting review',
      icon: FileText,
      trend: '-1 from yesterday',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'AI-Flagged Opportunities',
      value: metrics.aiFlaggedOpportunities,
      description: 'Tax-saving opportunities identified',
      icon: TrendingUp,
      trend: '+5 new this week',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Potential Tax Savings',
      value: formatCurrency(metrics.totalTaxSavings),
      description: 'Across all client opportunities',
      icon: DollarSign,
      trend: '+$12K this month',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Active Clients',
      value: metrics.totalClients,
      description: 'Currently under management',
      icon: Users,
      trend: '+3 new this month',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Avg Response Time',
      value: '2.3 days',
      description: 'Client query resolution',
      icon: Clock,
      trend: '-0.5 days improved',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget, index) => {
        const IconComponent = widget.icon;
        return (
          <motion.div
            key={widget.title}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-md transition-shadow ${widget.borderColor} ${widget.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {widget.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${widget.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${widget.color}`}>
                  {widget.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {widget.description}
                </p>
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {widget.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}