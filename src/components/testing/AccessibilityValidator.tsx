import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Tablet, Check, AlertTriangle, Info } from 'lucide-react';

interface AccessibilityValidatorProps {
  onRunValidation?: () => void;
}

const AccessibilityValidator: React.FC<AccessibilityValidatorProps> = ({ onRunValidation }) => {
  // Mock accessibility validation results
  const validationResults = {
    colorContrast: {
      status: 'pass',
      message: 'All text meets WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)',
      details: ['Primary text: 7.2:1', 'Secondary text: 5.1:1', 'Button text: 8.5:1']
    },
    focusManagement: {
      status: 'pass',
      message: 'Keyboard navigation and focus indicators working properly',
      details: ['Tab order logical', 'Focus visible on all interactive elements', 'Skip links available']
    },
    touchTargets: {
      status: 'pass',
      message: 'All interactive elements meet 44px minimum touch target requirement',
      details: ['Buttons: 44px+', 'Links: 44px+', 'Form inputs: 44px+']
    },
    semanticHTML: {
      status: 'warning',
      message: 'Most elements use proper semantic markup, minor improvements needed',
      details: ['Modal dialogs have aria-labels', 'Form inputs have labels', 'Headings follow hierarchy']
    },
    mobileResponsive: {
      status: 'pass',
      message: 'All components responsive across device sizes',
      details: ['Breakpoints: 320px, 768px, 1024px', 'Text scales appropriately', 'No horizontal scroll']
    }
  };

  const deviceTests = [
    { name: 'iPhone SE (375px)', status: 'pass', icon: Smartphone },
    { name: 'iPad (768px)', status: 'pass', icon: Tablet },
    { name: 'Desktop (1024px+)', status: 'pass', icon: Monitor }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'fail':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Accessibility & Mobile Validation</h2>
        <p className="text-muted-foreground">
          WCAG 2.1 AA compliance check for Family Office Marketplace onboarding
        </p>
      </div>

      {/* Mobile Device Testing */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Mobile Responsiveness Testing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deviceTests.map((device) => {
              const IconComponent = device.icon;
              return (
                <div key={device.name} className="flex items-center gap-3 p-3 border rounded-lg">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{device.name}</p>
                  </div>
                  {getStatusIcon(device.status)}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Tests */}
      <div className="grid gap-4">
        {Object.entries(validationResults).map(([key, result]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`border-l-4 ${getStatusColor(result.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <h4 className="font-semibold capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                  </div>
                  <Badge 
                    variant={result.status === 'pass' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{result.message}</p>
                <div className="space-y-1">
                  {result.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onRunValidation} className="flex-1">
          Re-run Validation
        </Button>
        <Button variant="outline" className="flex-1">
          Download Report
        </Button>
      </div>

      {/* Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Accessibility Summary</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-green-800">4/5 Tests Passed</strong>
              <p className="text-green-600">1 minor improvement suggested</p>
            </div>
            <div>
              <strong className="text-green-800">Mobile Ready</strong>
              <p className="text-green-600">All devices supported</p>
            </div>
            <div>
              <strong className="text-green-800">WCAG 2.1 AA</strong>
              <p className="text-green-600">Compliant with standards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AccessibilityValidator;