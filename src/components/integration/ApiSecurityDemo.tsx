
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, AlertCircle, CheckCircle2, RefreshCcw, Shield, Lock } from "lucide-react";
import { ApiIntegrationTestResult } from "@/services/diagnostics/types";
import { SensitiveDataType } from "@/services/api/security/piiProtection";
import { CircuitState } from "@/services/api/resilience/circuitBreaker";

interface ApiSecurityDemoProps {
  apiTests: ApiIntegrationTestResult[];
  loading: boolean;
  circuitStatus: Record<string, any>;
  onResetCircuit: (name: string) => void;
}

interface CircuitStatusProps {
  circuit: {
    state: CircuitState;
    failures: number;
    successes: number;
    lastFailure: Date | null;
    lastSuccess: Date | null;
  };
  name: string;
  onReset: () => void;
}

const CircuitStatusCard: React.FC<CircuitStatusProps> = ({ circuit, name, onReset }) => {
  const isOpen = circuit?.state === CircuitState.OPEN;
  const isHalfOpen = circuit?.state === CircuitState.HALF_OPEN;
  
  const getBadgeVariant = () => {
    if (isOpen) return "destructive";
    if (isHalfOpen) return "warning";
    return "outline";
  };
  
  const getStatusText = () => {
    if (isOpen) return "Open";
    if (isHalfOpen) return "Half-Open";
    return "Closed";
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString();
  };
  
  if (!circuit) {
    return (
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>No circuit data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className={isOpen ? "border-red-200 bg-red-50" : isHalfOpen ? "border-amber-200 bg-amber-50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>Circuit Breaker Status</CardDescription>
          </div>
          <Badge variant={getBadgeVariant()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-1">
            <span className="text-muted-foreground">Failures:</span>
            <span className="font-medium">{circuit.failures}</span>
            
            <span className="text-muted-foreground">Successes:</span>
            <span className="font-medium">{circuit.successes}</span>
            
            <span className="text-muted-foreground">Last Failure:</span>
            <span className="font-medium">{formatDate(circuit.lastFailure)}</span>
            
            <span className="text-muted-foreground">Last Success:</span>
            <span className="font-medium">{formatDate(circuit.lastSuccess)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onReset} 
          size="sm" 
          className="w-full" 
          variant="outline"
          disabled={!isOpen && !isHalfOpen}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset Circuit
        </Button>
      </CardFooter>
    </Card>
  );
};

const PiiMaskingDemo = () => {
  const [demoText, setDemoText] = React.useState("My credit card is 4111-1111-1111-1111 and my email is test@example.com");
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sample Data with PII</label>
        <textarea
          value={demoText}
          onChange={(e) => setDemoText(e.target.value)}
          className="w-full h-20 px-3 py-2 border rounded-md resize-none"
          placeholder="Enter text with PII..."
        />
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Masking Preview</h4>
        <div className="space-y-2">
          {[
            { label: "Credit Card", type: SensitiveDataType.CREDIT_CARD },
            { label: "Account Number", type: SensitiveDataType.ACCOUNT_NUMBER },
            { label: "Email", type: SensitiveDataType.EMAIL },
            { label: "SSN", type: SensitiveDataType.SSN },
            { label: "Phone", type: SensitiveDataType.PHONE },
          ].map((item) => (
            <div key={item.label} className="bg-white border rounded-md px-3 py-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.type}</span>
              </div>
              <div className="text-sm font-mono break-all">
                {item.type === SensitiveDataType.CREDIT_CARD 
                  ? demoText.replace(/\b(\d{4})[- ]?\d{4}[- ]?\d{4}[- ]?(\d{4})\b/g, '$1-****-****-$2')
                  : item.type === SensitiveDataType.ACCOUNT_NUMBER
                  ? demoText.replace(/\b(\d{4})\d{4,8}(\d{4})\b/g, '$1********$2')
                  : item.type === SensitiveDataType.EMAIL
                  ? demoText.replace(/\b([^@\s]{1,3})([^@\s]+)@([^\s]+)\b/g, '$1***@$3')
                  : item.type === SensitiveDataType.SSN
                  ? demoText.replace(/\b\d{3}[-]?\d{2}[-]?(\d{4})\b/g, '***-**-$1')
                  : item.type === SensitiveDataType.PHONE
                  ? demoText.replace(/\b(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?(\d{4})\b/g, '***-***-$2')
                  : demoText
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button size="sm" variant="outline">
          <Lock className="h-3 w-3 mr-1" />
          Configure PII Rules
        </Button>
      </div>
    </div>
  );
};

export const ApiSecurityDemo: React.FC<ApiSecurityDemoProps> = ({ 
  apiTests, 
  loading, 
  circuitStatus,
  onResetCircuit
}) => {
  const [demoTab, setDemoTab] = React.useState("circuit-breakers");
  
  return (
    <Card className="border-[#333] bg-[#1F1F2E]">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-[#D4AF37]">API Security Features</CardTitle>
        </div>
        <CardDescription>
          Explore and test the enhanced API security features implemented in this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="circuit-breakers" value={demoTab} onValueChange={setDemoTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="circuit-breakers">Circuit Breakers</TabsTrigger>
            <TabsTrigger value="pii-protection">PII Protection</TabsTrigger>
            <TabsTrigger value="api-monitoring">API Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="circuit-breakers">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="h-8 w-8 animate-spin text-[#D4AF37]" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {Object.keys(circuitStatus).length > 0 ? (
                  Object.entries(circuitStatus).map(([name, circuit]) => (
                    <CircuitStatusCard 
                      key={name} 
                      name={name} 
                      circuit={circuit} 
                      onReset={() => onResetCircuit(name)} 
                    />
                  ))
                ) : (
                  <>
                    <CircuitStatusCard 
                      name="Stripe API" 
                      circuit={{
                        state: CircuitState.CLOSED,
                        failures: 0,
                        successes: 12,
                        lastFailure: null,
                        lastSuccess: new Date(),
                      }}
                      onReset={() => {}}
                    />
                    <CircuitStatusCard 
                      name="Financial Data API" 
                      circuit={{
                        state: CircuitState.HALF_OPEN,
                        failures: 3,
                        successes: 1,
                        lastFailure: new Date(Date.now() - 60000),
                        lastSuccess: new Date(),
                      }}
                      onReset={() => {}}
                    />
                    <CircuitStatusCard 
                      name="Document Service" 
                      circuit={{
                        state: CircuitState.OPEN,
                        failures: 5,
                        successes: 0,
                        lastFailure: new Date(),
                        lastSuccess: new Date(Date.now() - 300000),
                      }}
                      onReset={() => {}}
                    />
                  </>
                )}
              </div>
            )}
            
            <div className="mt-4 p-3 bg-slate-800 rounded-md text-xs text-slate-300 font-mono">
              <div className="text-green-400">// Example circuit breaker usage</div>
              <div>const api = createApiClient(&#123;</div>
              <div className="ml-2">baseURL: 'https://api.example.com',</div>
              <div className="ml-2">circuitBreakerConfig: &#123;</div>
              <div className="ml-4">failureThreshold: 3,</div>
              <div className="ml-4">resetTimeout: 30000,</div>
              <div className="ml-4">name: 'exampleApi',</div>
              <div className="ml-2">&#125;</div>
              <div>&#125;);</div>
            </div>
          </TabsContent>
          
          <TabsContent value="pii-protection">
            <PiiMaskingDemo />
          </TabsContent>
          
          <TabsContent value="api-monitoring">
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {apiTests.slice(0, 3).map((test) => (
                  <Card key={test.id} className={`border-${test.status === 'error' ? 'red' : test.status === 'warning' ? 'amber' : 'green'}-200`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{test.service}</CardTitle>
                        <Badge variant={test.status === 'error' ? 'destructive' : test.status === 'warning' ? 'warning' : 'outline'}>
                          {test.status === 'error' ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : test.status === 'warning' ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          )}
                          {test.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{test.endpoint}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-muted-foreground">Response Time:</span>
                          <span className={`font-medium ${test.responseTime > 500 ? 'text-amber-600' : ''}`}>
                            {test.responseTime} ms
                          </span>
                          
                          <span className="text-muted-foreground">Auth Status:</span>
                          <span className={`font-medium ${test.authStatus === 'invalid' ? 'text-red-600' : ''}`}>
                            {test.authStatus}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{test.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="text-[#D4AF37] border-[#D4AF37]">
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Run API Tests
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
