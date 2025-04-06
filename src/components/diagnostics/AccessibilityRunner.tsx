
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Check, 
  Code, 
  Eye, 
  Keyboard, 
  Layers, 
  PanelLeft, 
  ScreenShare
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AccessibilityRunnerProps {
  onRunAudit: () => void;
  isRunning: boolean;
}

export function AccessibilityRunner({ onRunAudit, isRunning }: AccessibilityRunnerProps) {
  const [selectedRules, setSelectedRules] = useState({
    ariaAttributes: true,
    colorContrast: true,
    keyboardNavigation: true,
    imageAlt: true,
    formLabels: true,
    semanticHeadings: true,
    documentLanguage: true,
    pageTitle: true,
    linkText: true,
    focusOrder: true,
    frameTitle: true,
    responsiveDesign: true
  });
  
  const [customUrls, setCustomUrls] = useState('');
  
  // Accessibility rule categories
  const ruleCategories = [
    {
      name: "ARIA and Semantics",
      icon: <Code className="h-4 w-4" />,
      rules: [
        { id: "ariaAttributes", name: "ARIA attributes" },
        { id: "semanticHeadings", name: "Semantic headings" },
        { id: "documentLanguage", name: "Document language" }
      ]
    },
    {
      name: "Visual Design",
      icon: <Eye className="h-4 w-4" />,
      rules: [
        { id: "colorContrast", name: "Color contrast" },
        { id: "responsiveDesign", name: "Responsive design" }
      ]
    },
    {
      name: "Interactive Elements",
      icon: <Keyboard className="h-4 w-4" />,
      rules: [
        { id: "keyboardNavigation", name: "Keyboard navigation" },
        { id: "focusOrder", name: "Focus order" }
      ]
    },
    {
      name: "Content",
      icon: <PanelLeft className="h-4 w-4" />,
      rules: [
        { id: "imageAlt", name: "Image alt text" },
        { id: "linkText", name: "Meaningful link text" },
        { id: "pageTitle", name: "Page title" },
        { id: "formLabels", name: "Form labels" },
        { id: "frameTitle", name: "Frame titles" }
      ]
    }
  ];
  
  const handleToggleRule = (ruleId: string) => {
    setSelectedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId as keyof typeof prev]
    }));
  };
  
  const handleSelectAll = () => {
    const allRules = Object.keys(selectedRules).reduce((acc, key) => {
      acc[key as keyof typeof selectedRules] = true;
      return acc;
    }, {} as typeof selectedRules);
    
    setSelectedRules(allRules);
  };
  
  const handleUnselectAll = () => {
    const allRules = Object.keys(selectedRules).reduce((acc, key) => {
      acc[key as keyof typeof selectedRules] = false;
      return acc;
    }, {} as typeof selectedRules);
    
    setSelectedRules(allRules);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configure Accessibility Audit</CardTitle>
          <CardDescription>
            Select which accessibility rules to check and configure audit options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium">Accessibility Rules</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>Select All</Button>
                <Button variant="outline" size="sm" onClick={handleUnselectAll}>Unselect All</Button>
              </div>
            </div>
            
            <Accordion type="multiple" className="w-full">
              {ruleCategories.map((category) => (
                <AccordionItem key={category.name} value={category.name}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {category.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={rule.id} 
                            checked={selectedRules[rule.id as keyof typeof selectedRules]}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                          <Label 
                            htmlFor={rule.id}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {rule.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customUrls">Custom URLs to test (optional)</Label>
            <Input
              id="customUrls"
              placeholder="Enter URLs separated by commas"
              value={customUrls}
              onChange={(e) => setCustomUrls(e.target.value)}
              disabled={isRunning}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to scan all pages in the application. Separate URLs with commas.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onRunAudit} 
            disabled={isRunning} 
            className="w-full sm:w-auto ml-auto"
          >
            {isRunning ? (
              <>Running audit...</>
            ) : (
              <>
                Run Accessibility Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScreenShare className="h-5 w-5" />
            About Accessibility Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">WCAG Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Tests conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Automated + Manual</h4>
                <p className="text-sm text-muted-foreground">
                  Automated tests can find ~30% of issues, manual testing is still recommended for comprehensive coverage
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
