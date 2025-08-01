import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisStep {
  name: string;
  duration: number;
}

interface TaxAnalysisProgressProps {
  progress: number;
  currentStep: string;
  steps: AnalysisStep[];
}

export function TaxAnalysisProgress({ progress, currentStep, steps }: TaxAnalysisProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.name === currentStep);
  
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Running Tax Analysis
          <Badge variant="outline" className="ml-auto">
            {Math.round(progress)}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{currentStep}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-muted"
          />
        </div>

        {/* Step-by-step Progress */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Analysis Steps
          </h4>
          <div className="grid gap-2">
            {steps.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;
              
              return (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isComplete 
                      ? 'bg-green-50 border border-green-200' 
                      : isCurrent 
                        ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                        : 'bg-muted/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isComplete 
                        ? 'text-green-800' 
                        : isCurrent 
                          ? 'text-blue-800' 
                          : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={isComplete ? 'default' : isCurrent ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {isComplete ? 'Complete' : isCurrent ? 'Running' : 'Pending'}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Estimated Time Remaining */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Analyzing your tax situation across multiple scenarios...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This comprehensive analysis typically takes 30-60 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}