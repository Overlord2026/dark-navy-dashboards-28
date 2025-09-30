import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { RetirementPolicy, GuardrailMethod } from '@/types/retirement';

interface PolicyPanelProps {
  policy: RetirementPolicy;
  onChange: (policy: RetirementPolicy) => void;
}

export function PolicyPanel({ policy, onChange }: PolicyPanelProps) {
  const { guardrails, metrics } = policy;

  const generateSummary = (): string => {
    if (guardrails.method === 'none') {
      return 'No guardrails active. Using fixed withdrawal strategy.';
    }
    
    const rate = (guardrails.initial_withdrawal_rate * 100).toFixed(1);
    const bands = (guardrails.bands_pct * 100).toFixed(0);
    const up = (guardrails.raise_cut_pct.up * 100).toFixed(0);
    const down = (guardrails.raise_cut_pct.down * 100).toFixed(0);
    
    return `Using Guyton-Klinger with ${rate}% initial rate, ±${bands}% bands. Raise ${up}% if above, cut ${down}% if below.`;
  };

  const handleGuardrailChange = (field: string, value: any) => {
    onChange({
      ...policy,
      guardrails: {
        ...guardrails,
        [field]: value
      }
    });
  };

  const handleNestedGuardrailChange = (parent: string, field: string, value: number) => {
    onChange({
      ...policy,
      guardrails: {
        ...guardrails,
        [parent]: {
          ...(guardrails as any)[parent],
          [field]: value
        }
      }
    });
  };

  const handleMetricChange = (field: 'etayFormula' | 'seayFormula', value: string) => {
    onChange({
      ...policy,
      metrics: {
        ...metrics,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Configuration</CardTitle>
        <CardDescription>
          Configure guardrails and alternative asset metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Guardrails Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Guardrails</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px]">
                    Guardrails adjust withdrawals based on portfolio performance
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="method">Method</Label>
              <Select
                value={guardrails.method}
                onValueChange={(value: GuardrailMethod) => 
                  handleGuardrailChange('method', value)
                }
              >
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Fixed)</SelectItem>
                  <SelectItem value="gk">Guyton-Klinger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {guardrails.method === 'gk' && (
              <>
                <div>
                  <Label htmlFor="withdrawal-rate">
                    Initial Withdrawal Rate (%)
                  </Label>
                  <Input
                    id="withdrawal-rate"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={(guardrails.initial_withdrawal_rate * 100).toFixed(1)}
                    onChange={(e) =>
                      handleGuardrailChange(
                        'initial_withdrawal_rate',
                        parseFloat(e.target.value) / 100
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="bands">Band Width (±%)</Label>
                  <Input
                    id="bands"
                    type="number"
                    min="0"
                    max="50"
                    step="5"
                    value={(guardrails.bands_pct * 100).toFixed(0)}
                    onChange={(e) =>
                      handleGuardrailChange(
                        'bands_pct',
                        parseFloat(e.target.value) / 100
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="raise">Raise if Above (%)</Label>
                    <Input
                      id="raise"
                      type="number"
                      min="0"
                      max="50"
                      step="5"
                      value={(guardrails.raise_cut_pct.up * 100).toFixed(0)}
                      onChange={(e) =>
                        handleNestedGuardrailChange(
                          'raise_cut_pct',
                          'up',
                          parseFloat(e.target.value) / 100
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cut">Cut if Below (%)</Label>
                    <Input
                      id="cut"
                      type="number"
                      min="0"
                      max="50"
                      step="5"
                      value={(guardrails.raise_cut_pct.down * 100).toFixed(0)}
                      onChange={(e) =>
                        handleNestedGuardrailChange(
                          'raise_cut_pct',
                          'down',
                          parseFloat(e.target.value) / 100
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {/* Live Summary */}
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                {generateSummary()}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Alternative Asset Metrics</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[250px]">
                    ETAY = Effective Tax-Adjusted Yield<br />
                    SEAY = Staking Equivalent After-tax Yield<br />
                    Store formulas for reference
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="etay">ETAY Formula</Label>
              <Textarea
                id="etay"
                placeholder="e.g., ETAY = (interest × (1 - t_ordinary) + qualified × (1 - t_qualified) + ...) - fees"
                value={metrics.etayFormula}
                onChange={(e) => handleMetricChange('etayFormula', e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.etayFormula.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="seay">SEAY Formula</Label>
              <Textarea
                id="seay"
                placeholder="e.g., SEAY = (stakingAPR × (1 - tax)) - (latency_penalty + slashing_risk)"
                value={metrics.seayFormula}
                onChange={(e) => handleMetricChange('seayFormula', e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.seayFormula.length}/500 characters
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
