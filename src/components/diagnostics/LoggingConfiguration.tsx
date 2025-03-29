
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Bug, Save, Trash2 } from "lucide-react";
import { LogConfig, LogLevel } from "@/services/diagnostics/types";
import { logger, LogLevels } from "@/services/logging/loggingService";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const LoggingConfiguration = () => {
  const [config, setConfig] = useState<LogConfig>(logger.getConfig());
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Load current configuration
    setConfig(logger.getConfig());
  }, []);

  const handleChange = (field: keyof LogConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      setIsDirty(true);
      return newConfig;
    });
  };

  const handleNestedChange = (parent: 'alertThreshold', field: string, value: any) => {
    setConfig(prev => {
      const newConfig = { 
        ...prev, 
        [parent]: { 
          ...prev[parent], 
          [field]: value 
        } 
      };
      setIsDirty(true);
      return newConfig;
    });
  };

  const saveConfiguration = () => {
    logger.updateConfig(config);
    toast.success("Logging configuration saved");
    setIsDirty(false);
  };

  const clearAllLogs = () => {
    logger.clearLogs();
    toast.success("All logs have been cleared");
  };

  const testLogLevels = () => {
    logger.info("This is an info log message", { test: "Info test data" }, "LoggingConfiguration");
    logger.warning("This is a warning log message", { test: "Warning test data" }, "LoggingConfiguration");
    logger.error("This is an error log message", { test: "Error test data" }, "LoggingConfiguration");
    logger.critical("This is a critical log message", { test: "Critical test data" }, "LoggingConfiguration");
    
    toast.success("Test logs generated at all levels");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Logging Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Changes to logging configuration will take effect immediately but must be saved to persist.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logLevel">Minimum Log Level</Label>
                <Select
                  value={config.minLevel}
                  onValueChange={(value: LogLevel) => handleChange("minLevel", value)}
                >
                  <SelectTrigger id="logLevel">
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LogLevels.INFO}>Info</SelectItem>
                    <SelectItem value={LogLevels.WARNING}>Warning</SelectItem>
                    <SelectItem value={LogLevels.ERROR}>Error</SelectItem>
                    <SelectItem value={LogLevels.CRITICAL}>Critical</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Only logs at or above this level will be recorded</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                <Input
                  id="retentionPeriod"
                  type="number"
                  min="1"
                  max="90"
                  value={config.retentionPeriod}
                  onChange={(e) => handleChange("retentionPeriod", parseInt(e.target.value) || 7)}
                />
                <p className="text-xs text-muted-foreground">Logs older than this will be automatically cleared</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEntries">Maximum Log Entries</Label>
              <Input
                id="maxEntries"
                type="number"
                min="100"
                max="10000"
                value={config.maxEntries || 1000}
                onChange={(e) => handleChange("maxEntries", parseInt(e.target.value) || 1000)}
              />
              <p className="text-xs text-muted-foreground">Maximum number of logs to store (oldest will be removed first)</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="enableAlerts"
                checked={config.enableRealTimeAlerts}
                onCheckedChange={(checked) => handleChange("enableRealTimeAlerts", checked)}
              />
              <Label htmlFor="enableAlerts">Enable Real-Time Error Alerts</Label>
            </div>

            {config.enableRealTimeAlerts && (
              <div className="space-y-4 p-4 border rounded-md mt-2">
                <h4 className="font-medium">Alert Thresholds</h4>
                
                <div className="space-y-2">
                  <Label>Critical Errors Threshold</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.alertThreshold.critical]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(values) => handleNestedChange("alertThreshold", "critical", values[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{config.alertThreshold.critical}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {config.alertThreshold.critical === 1 
                      ? "Alert on any critical error" 
                      : `Alert after ${config.alertThreshold.critical} critical errors`}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Error Threshold</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.alertThreshold.error]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(values) => handleNestedChange("alertThreshold", "error", values[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{config.alertThreshold.error}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {config.alertThreshold.error === 1 
                      ? "Alert on any error" 
                      : `Alert after ${config.alertThreshold.error} errors`}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Window (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[config.alertThreshold.timeWindow]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(values) => handleNestedChange("alertThreshold", "timeWindow", values[0])}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{config.alertThreshold.timeWindow}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Time window for counting errors before alerting
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-between gap-4 pt-4">
            <div className="space-x-2">
              <Button onClick={testLogLevels} variant="outline">
                Test Log Levels
              </Button>
              <Button onClick={clearAllLogs} variant="outline" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Logs
              </Button>
            </div>
            <Button onClick={saveConfiguration} disabled={!isDirty}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
