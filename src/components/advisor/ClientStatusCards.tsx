import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Send,
  Eye,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'action-needed' | 'pending-review' | 'up-to-date';
  lastActivity: string;
  documentsRequired: number;
  aiOpportunities: number;
  priority: 'high' | 'medium' | 'low';
  taxSavingsEstimate: number;
}

interface ClientStatusCardsProps {
  clients: Client[];
  selectedClients: string[];
  onClientSelect: (clientId: string) => void;
}

export function ClientStatusCards({ clients, selectedClients, onClientSelect }: ClientStatusCardsProps) {
  const getStatusConfig = (status: Client['status']) => {
    switch (status) {
      case 'action-needed':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertTriangle,
          label: 'Action Needed'
        };
      case 'pending-review':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Clock,
          label: 'Pending Review'
        };
      case 'up-to-date':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          label: 'Up to Date'
        };
    }
  };

  const getPriorityConfig = (priority: Client['priority']) => {
    switch (priority) {
      case 'high':
        return { color: 'bg-red-500', label: 'High Priority' };
      case 'medium':
        return { color: 'bg-yellow-500', label: 'Medium Priority' };
      case 'low':
        return { color: 'bg-green-500', label: 'Low Priority' };
    }
  };

  const handleGenerateReport = async (clientId: string) => {
    // This would call an edge function to generate the PDF report
    console.log('Generating report for client:', clientId);
    // Placeholder - in production this would call the generate-client-report edge function
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {clients.map((client, index) => {
        const statusConfig = getStatusConfig(client.status);
        const priorityConfig = getPriorityConfig(client.priority);
        const StatusIcon = statusConfig.icon;
        const isSelected = selectedClients.includes(client.id);

        return (
          <motion.div
            key={client.id}
            variants={itemVariants}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${statusConfig.borderColor} ${statusConfig.bgColor}`}
              role="article"
              aria-label={`Client: ${client.name}. Status: ${statusConfig.label}. Priority: ${client.priority}. ${client.taxSavingsEstimate} potential tax savings.`}
            >
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onClientSelect(client.id)}
                      className="mt-1 flex-shrink-0"
                      aria-label={`Select client ${client.name}`}
                    />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                      <CardTitle className="text-base sm:text-lg truncate">{client.name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div 
                      className={`h-2 w-2 rounded-full ${priorityConfig.color}`} 
                      aria-label={priorityConfig.label}
                      title={priorityConfig.label}
                    />
                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} aria-hidden="true" />
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 ml-9 text-sm">
                  <Mail className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{client.email}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 px-4 sm:px-6">
                {/* Status Badge */}
                <Badge className={`${statusConfig.color} ${statusConfig.bgColor} text-xs`}>
                  {statusConfig.label}
                </Badge>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Last Activity:</span>
                    <p className="font-medium truncate">{client.lastActivity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Priority:</span>
                    <p className="font-medium capitalize">{client.priority}</p>
                  </div>
                </div>

                {/* Action Items */}
                {(client.documentsRequired > 0 || client.aiOpportunities > 0) && (
                  <div className="space-y-2" role="list" aria-label="Client action items">
                    {client.documentsRequired > 0 && (
                      <div className="flex items-center gap-2 text-sm" role="listitem">
                        <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" aria-hidden="true" />
                        <span>{client.documentsRequired} documents required</span>
                      </div>
                    )}
                    
                    {client.aiOpportunities > 0 && (
                      <div className="flex items-center gap-2 text-sm" role="listitem">
                        <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
                        <span>{client.aiOpportunities} AI opportunities found</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tax Savings Estimate */}
                <div className="bg-white p-3 rounded-lg border" role="region" aria-label="Tax savings estimate">
                  <span className="text-sm text-muted-foreground block">Potential Tax Savings:</span>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(client.taxSavingsEstimate)}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2" role="group" aria-label="Client quick actions">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 min-h-[44px] px-3 py-2 text-xs sm:text-sm"
                    onClick={() => handleGenerateReport(client.id)}
                    aria-label={`Generate report for ${client.name}`}
                  >
                    <Download className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Report</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 min-h-[44px] px-3 py-2 text-xs sm:text-sm"
                    aria-label={`Contact ${client.name}`}
                  >
                    <Send className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Contact</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="min-h-[44px] px-3 py-2"
                    aria-label={`View details for ${client.name}`}
                  >
                    <Eye className="h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}