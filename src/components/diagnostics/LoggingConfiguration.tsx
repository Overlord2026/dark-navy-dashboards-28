
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileTerminal, Save } from "lucide-react";
import { logger, LoggingConfig } from "@/services/logging/loggingService";
import { toast } from "sonner";

export function LoggingConfiguration() {
  const [config, setConfig] = useState<LoggingConfig>(logger.getConfig());
  
  useEffect(() => {
    setConfig(logger.getConfig());
  }, []);
  
  const handleSaveConfig = () => {
    try {
      logger.updateConfig(config);
      toast.success("Logging configuration updated");
    } catch (error) {
      toast.error("Failed to update logging configuration");
      console.error("Error updating logging config:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileTerminal className="h-5 w-5" />
          Logging Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="log-level">Minimum Log Level</Label>
              <Select 
                value={config.minLevel} 
                onValueChange={(value) => setConfig({...config, minLevel: value as any})}
              >
                <SelectTrigger id="log-level">
                  <SelectValue placeholder="Select minimum log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention">Log Retention (days)</Label>
              <Select 
                value={config.retentionPeriod.toString()} 
                onValueChange={(value) => setConfig({...config, retentionPeriod: parseInt(value)})}
              >
                <SelectTrigger id="retention">
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="alerts" 
              checked={config.enableRealTimeAlerts}
              onCheckedChange={(checked) => setConfig({...config, enableRealTimeAlerts: checked})}
            />
            <Label htmlFor="alerts">Enable Real-Time Critical Alerts</Label>
          </div>
          
          <Button onClick={handleSaveConfig} className="gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
