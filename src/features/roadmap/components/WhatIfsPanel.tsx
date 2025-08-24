import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface WhatIfsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (whatIfs: WhatIfSettings) => void;
}

export interface WhatIfSettings {
  delaySS: number; // years
  rothBracketCap: number; // percentage
  spiaLayer: boolean;
  ltcInsurance: boolean;
  earlyBearShock: boolean;
}

export function WhatIfsPanel({ isOpen, onClose, onApply }: WhatIfsPanelProps) {
  const [settings, setSettings] = useState<WhatIfSettings>({
    delaySS: 0,
    rothBracketCap: 22,
    spiaLayer: false,
    ltcInsurance: false,
    earlyBearShock: false,
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(settings);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background border-l border-border shadow-lg z-50">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">What-If Analysis</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <Card className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Delay Social Security: {settings.delaySS} years
            </Label>
            <Slider
              value={[settings.delaySS]}
              onValueChange={([value]) =>
                setSettings({ ...settings, delaySS: value })
              }
              max={5}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              Roth Conversion Cap: {settings.rothBracketCap}%
            </Label>
            <Slider
              value={[settings.rothBracketCap]}
              onValueChange={([value]) =>
                setSettings({ ...settings, rothBracketCap: value })
              }
              min={10}
              max={37}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">SPIA Layer (Age 75)</Label>
            <Switch
              checked={settings.spiaLayer}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, spiaLayer: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">LTC Insurance</Label>
            <Switch
              checked={settings.ltcInsurance}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, ltcInsurance: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Early Bear Market</Label>
            <Switch
              checked={settings.earlyBearShock}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, earlyBearShock: checked })
              }
            />
          </div>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}