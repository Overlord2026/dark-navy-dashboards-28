import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImpactReport } from "@/hooks/useImpactReporting";
import { Download, Calendar, TrendingUp, Heart, Users } from "lucide-react";
import { format } from "date-fns";

interface ImpactReportCardProps {
  report: ImpactReport;
  onDownload?: (reportId: string) => void;
}

export const ImpactReportCard = ({ report, onDownload }: ImpactReportCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPeriod = (start: string, end: string) => {
    return `${format(new Date(start), 'MMM yyyy')} - ${format(new Date(end), 'MMM yyyy')}`;
  };

  const getReportTypeColor = (type: string) => {
    return type === 'quarterly' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {report.report_type === 'quarterly' ? 'Quarterly' : 'Annual'} Impact Report
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {formatPeriod(report.report_period_start, report.report_period_end)}
            </CardDescription>
          </div>
          <Badge className={getReportTypeColor(report.report_type)}>
            {report.report_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(report.total_donated)}
            </div>
            <div className="text-sm text-muted-foreground">Total Donated</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
              <Heart className="h-5 w-5" />
              {report.charities_supported}
            </div>
            <div className="text-sm text-muted-foreground">Charities Supported</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
              <TrendingUp className="h-5 w-5" />
              {report.projects_supported}
            </div>
            <div className="text-sm text-muted-foreground">Projects Supported</div>
          </div>
        </div>

        {report.report_data?.donations_by_charity && (
          <div>
            <h4 className="font-medium mb-2">Top Causes Supported:</h4>
            <div className="space-y-1">
              {report.report_data.donations_by_charity.slice(0, 3).map((charity: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{charity.charity_name}</span>
                  <span className="font-medium">{formatCurrency(charity.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onDownload?.(report.id)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="ghost" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};