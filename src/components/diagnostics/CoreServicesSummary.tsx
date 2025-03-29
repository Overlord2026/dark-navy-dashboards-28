
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon, getStatusColor } from "./StatusIcon";

interface CoreServicesSummaryProps {
  report: any;
}

export const CoreServicesSummary = ({ report }: CoreServicesSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(report)
        .filter(([key]) => 
          key !== 'overall' && 
          key !== 'timestamp' && 
          key !== 'navigationTests' && 
          key !== 'permissionsTests' && 
          key !== 'iconTests' &&
          key !== 'formValidationTests' &&
          key !== 'apiIntegrationTests' &&
          key !== 'roleSimulationTests')
        .map(([key, value]: [string, any]) => (
          <Card key={key} className={`border ${getStatusColor(value.status)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <StatusIcon status={value.status} />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{value.message}</p>
              {value.details && (
                <p className="text-sm text-muted-foreground mt-2">{value.details}</p>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
