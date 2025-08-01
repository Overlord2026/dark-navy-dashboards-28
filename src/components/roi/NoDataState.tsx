import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart3, Upload, Plus } from 'lucide-react';

interface NoDataStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  showSampleActions?: boolean;
  onImportLeads?: () => void;
  onImportCampaigns?: () => void;
  onAddLead?: () => void;
  onAddCampaign?: () => void;
}

export function NoDataState({ 
  title, 
  description, 
  action,
  showSampleActions = false,
  onImportLeads,
  onImportCampaigns,
  onAddLead,
  onAddCampaign
}: NoDataStateProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        
        {showSampleActions && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {onAddLead && (
              <Button variant="outline" size="sm" onClick={onAddLead}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            )}
            {onAddCampaign && (
              <Button variant="outline" size="sm" onClick={onAddCampaign}>
                <Plus className="h-4 w-4 mr-2" />
                Add Campaign
              </Button>
            )}
            {onImportLeads && (
              <Button variant="outline" size="sm" onClick={onImportLeads}>
                <Upload className="h-4 w-4 mr-2" />
                Import Leads
              </Button>
            )}
            {onImportCampaigns && (
              <Button variant="outline" size="sm" onClick={onImportCampaigns}>
                <Upload className="h-4 w-4 mr-2" />
                Import Campaigns
              </Button>
            )}
          </div>
        )}
        
        {action && (
          <Button onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>💡 Tip: Download sample CSV templates to get started quickly</p>
        </div>
      </CardContent>
    </Card>
  );
}