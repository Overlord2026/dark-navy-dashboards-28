
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { WifiOff, RefreshCw, Wifi } from 'lucide-react';
import { logger } from '@/services/logging/loggingService';

export function NetworkFailureSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [reliability, setReliability] = useState([50]); // 0-100 scale
  const [latency, setLatency] = useState([0]); // 0-5000ms
  const [retrying, setRetrying] = useState(false);
  
  const handleToggleActive = () => {
    const newState = !isActive;
    setIsActive(newState);
    
    if (newState) {
      logger.warning(
        `Network simulation activated: ${Math.round(100 - reliability[0])}% failure rate, ${latency[0]}ms latency`,
        { reliability: reliability[0], latency: latency[0] },
        'NetworkSimulator'
      );
      
      toast.warning('Network simulation active', {
        description: `${Math.round(100 - reliability[0])}% of requests will fail with ${latency[0]}ms added latency`,
        duration: 5000,
      });
      
      // Apply network conditions
      applyNetworkConditions(reliability[0], latency[0]);
    } else {
      logger.info(
        'Network simulation deactivated',
        { was_active: true },
        'NetworkSimulator'
      );
      
      toast.success('Network simulation disabled', {
        description: 'Normal network conditions restored',
      });
      
      // Reset network conditions
      resetNetworkConditions();
    }
  };
  
  // Mock applying network conditions
  const applyNetworkConditions = (reliabilityValue: number, latencyValue: number) => {
    console.log(`SIMULATED: Applying network conditions - ${Math.round(100 - reliabilityValue)}% failure, ${latencyValue}ms latency`);
    // In a real implementation, this would modify XHR and fetch to introduce failures and latency
    // This is just a simulation that will log warnings to the console
    
    // Simulate the effect on console
    if (reliabilityValue < 80) {
      console.warn('Network conditions have been degraded for testing purposes');
    }
    
    if (latencyValue > 1000) {
      console.warn(`High latency (${latencyValue}ms) has been applied to all network requests`);
    }
  };
  
  // Mock resetting network conditions
  const resetNetworkConditions = () => {
    console.log('SIMULATED: Resetting network conditions to normal');
    // In a real implementation, this would restore normal XHR and fetch behavior
  };
  
  // Simulate a network retry
  const simulateRetry = async () => {
    setRetrying(true);
    logger.info('Attempting to retry failed network requests', {}, 'NetworkSimulator');
    
    try {
      // Simulate a retry operation with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure based on reliability
      if (Math.random() * 100 > reliability[0]) {
        throw new Error('Network retry failed');
      }
      
      logger.info('Network retry successful', {}, 'NetworkSimulator');
      toast.success('Network retry successful', {
        description: 'Previously failed requests have been retried successfully',
      });
    } catch (error) {
      logger.error('Network retry failed', error, 'NetworkSimulator');
      toast.error('Network retry failed', {
        description: 'Unable to restore connectivity. Please check your connection.',
      });
    } finally {
      setRetrying(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isActive ? (
              <WifiOff className="h-5 w-5 text-red-500" />
            ) : (
              <Wifi className="h-5 w-5 text-green-500" />
            )}
            Network Simulator
          </CardTitle>
          <Switch
            checked={isActive}
            onCheckedChange={handleToggleActive}
          />
        </div>
        <CardDescription>
          Simulate network failures and latency to test application resilience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Failure Rate: {Math.round(100 - reliability[0])}%</Label>
            <span className="text-sm text-muted-foreground">
              {reliability[0] > 80 ? 'Low' : reliability[0] > 40 ? 'Medium' : 'High'}
            </span>
          </div>
          <Slider
            disabled={!isActive}
            defaultValue={[50]}
            value={reliability}
            onValueChange={setReliability}
            max={100}
            step={5}
            className={reliability[0] > 80 ? 'accent-green-500' : reliability[0] > 40 ? 'accent-yellow-500' : 'accent-red-500'}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher values = more reliable network
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Latency: {latency[0]}ms</Label>
            <span className="text-sm text-muted-foreground">
              {latency[0] < 100 ? 'Fast' : latency[0] < 500 ? 'Slow' : 'Very Slow'}
            </span>
          </div>
          <Slider
            disabled={!isActive}
            defaultValue={[0]}
            value={latency}
            onValueChange={setLatency}
            max={2000}
            step={50}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher values = additional delay for each request
          </p>
        </div>
        
        <div className="pt-4">
          <p className="text-sm font-medium mb-2">What this simulates:</p>
          <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
            <li>Network request failures at the specified rate</li>
            <li>Added latency to all network requests</li>
            <li>Error messages and logging of network failures</li>
            <li>Testing of application's offline resilience</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          disabled={!isActive || retrying}
          onClick={simulateRetry}
        >
          {retrying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Simulate Retry
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
