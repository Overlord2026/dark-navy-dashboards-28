
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { secretsValidator, SecretValidationResult } from '@/services/security/secretsValidator';
import { toast } from 'sonner';

interface SecretsMonitorProps {
  showOnlyWarnings?: boolean;
  enableRealTimeMonitoring?: boolean;
}

export const SecretsMonitor: React.FC<SecretsMonitorProps> = ({ 
  showOnlyWarnings = false, 
  enableRealTimeMonitoring = true 
}) => {
  const [validationResults, setValidationResults] = useState<SecretValidationResult[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const runSecurityScan = async () => {
    setIsMonitoring(true);
    
    try {
      const results = await secretsValidator.validateRuntimeSecrets();
      setValidationResults(results);
      setLastScanTime(new Date());
      
      const criticalIssues = results.filter(r => r.severity === 'critical');
      if (criticalIssues.length > 0) {
        toast.error(`🚨 ${criticalIssues.length} critical security issues detected!`);
      } else if (results.length === 0) {
        toast.success('✅ No insecure secrets detected');
      }
    } catch (error) {
      console.error('Error running security scan:', error);
      toast.error('Failed to run security scan');
    } finally {
      setIsMonitoring(false);
    }
  };

  useEffect(() => {
    // Run initial scan
    runSecurityScan();

    // Set up real-time monitoring if enabled
    if (enableRealTimeMonitoring) {
      const interval = setInterval(runSecurityScan, 30000); // Scan every 30 seconds
      return () => clearInterval(interval);
    }
  }, [enableRealTimeMonitoring]);

  const getSeverityColor = (severity: SecretValidationResult['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: SecretValidationResult['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredResults = showOnlyWarnings 
    ? validationResults.filter(r => r.severity === 'critical' || r.severity === 'high')
    : validationResults;

  if (showOnlyWarnings && filteredResults.length === 0) {
    return null; // Don't show anything if no warnings and only showing warnings
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Secrets Security Monitor</h3>
          {enableRealTimeMonitoring && (
            <span className="text-xs text-muted-foreground">
              (Real-time monitoring active)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {lastScanTime && (
            <span className="text-xs text-muted-foreground">
              Last scan: {lastScanTime.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={runSecurityScan}
            disabled={isMonitoring}
          >
            {isMonitoring ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            ✅ All secrets are secure. No security issues detected.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result, index) => (
            <Alert 
              key={index} 
              className={`border-l-4 ${
                result.severity === 'critical' ? 'border-l-red-500' :
                result.severity === 'high' ? 'border-l-orange-500' :
                result.severity === 'medium' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(result.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{result.secretName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                      {result.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.isSecure ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                      {result.source.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <AlertDescription className="text-sm mb-2">
                    {result.recommendation}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecretsMonitor;
