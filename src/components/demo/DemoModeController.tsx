import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Play, RotateCcw, Eye } from 'lucide-react';
import { PersonaType } from '@/types/personas';

interface DemoModeControllerProps {
  onPersonaChange?: (persona: PersonaType) => void;
  onDemoStateChange?: (isDemo: boolean) => void;
}

const DemoModeController: React.FC<DemoModeControllerProps> = ({
  onPersonaChange,
  onDemoStateChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('advisor');
  const [isVisible, setIsVisible] = useState(false);

  // Check if we should show demo controller (development/staging environment)
  useEffect(() => {
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname.includes('lovableproject.com') ||
                  localStorage.getItem('fom_demo_mode_enabled') === 'true';
    setIsVisible(isDev);
  }, []);

  const personas: { value: PersonaType; label: string }[] = [
    { value: 'advisor', label: 'Financial Advisor' },
    { value: 'attorney', label: 'Estate Attorney' },
    { value: 'accountant', label: 'CPA/Accountant' },
    { value: 'coach', label: 'Business Coach' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'compliance', label: 'Compliance Officer' },
    { value: 'imo_fmo', label: 'IMO/FMO Partner' },
    { value: 'agency', label: 'Marketing Agency' },
    { value: 'organization', label: 'Industry Organization' },
    { value: 'client', label: 'Family Office Client' }
  ];

  const handleDemoToggle = (checked: boolean) => {
    setIsDemoMode(checked);
    onDemoStateChange?.(checked);
    
    if (checked) {
      // Store demo state
      localStorage.setItem('fom_demo_active', 'true');
      localStorage.setItem('fom_demo_persona', selectedPersona);
    } else {
      localStorage.removeItem('fom_demo_active');
      localStorage.removeItem('fom_demo_persona');
    }
  };

  const handlePersonaChange = (persona: PersonaType) => {
    setSelectedPersona(persona);
    onPersonaChange?.(persona);
    localStorage.setItem('fom_demo_persona', persona);
  };

  const handleResetDemo = () => {
    // Clear all demo-related localStorage
    localStorage.removeItem('fom_demo_active');
    localStorage.removeItem('fom_demo_persona');
    localStorage.removeItem('fom_welcome_modal_seen_demo');
    localStorage.removeItem('fom_welcome_banner_seen_demo');
    setIsDemoMode(false);
    setSelectedPersona('advisor');
    onDemoStateChange?.(false);
    onPersonaChange?.('advisor');
  };

  const startPersonaTour = () => {
    // Trigger guided tour for selected persona
    alert(`Starting guided tour for ${selectedPersona}. This would normally launch an interactive walkthrough.`);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-80 bg-card/95 backdrop-blur-sm border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              <Badge variant="secondary" className="text-xs">
                Demo Mode
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              <Eye className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Active</span>
            <Switch
              checked={isDemoMode}
              onCheckedChange={handleDemoToggle}
              aria-label="Toggle demo mode"
            />
          </div>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Test as Persona:
                </label>
                <Select value={selectedPersona} onValueChange={handlePersonaChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.value} value={persona.value}>
                        {persona.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={startPersonaTour}
                  size="sm" 
                  className="flex-1 gap-1"
                  disabled={!isDemoMode}
                >
                  <Play className="w-3 h-3" />
                  Tour
                </Button>
                <Button 
                  onClick={handleResetDemo}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <strong>Demo Features:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Test persona-specific onboarding</li>
                  <li>• Preview welcome modals & banners</li>
                  <li>• Simulate new user experience</li>
                  <li>• Test viral sharing flows</li>
                </ul>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DemoModeController;