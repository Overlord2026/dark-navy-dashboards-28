import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ToolDisclaimerProps {
  type: 'social-security' | 'rmd' | 'longevity' | 'general';
  className?: string;
}

const disclaimerContent = {
  'social-security': {
    icon: Info,
    text: 'Social Security rules vary by individual circumstances. Results are estimates based on current law and may change. Consult with a qualified advisor for personalized guidance.',
    className: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  'rmd': {
    icon: AlertTriangle,
    text: 'Required Minimum Distribution rules change frequently. Confirm calculations with your account custodian or CPA before making decisions.',
    className: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  'longevity': {
    icon: Info,
    text: 'Educational protocols for informational purposes only. Consult your clinician or healthcare provider for medical decisions and personalized health advice.',
    className: 'bg-green-50 border-green-200 text-green-800'
  },
  'general': {
    icon: Info,
    text: 'This tool provides educational information and estimates. Results should not be considered as financial, legal, or professional advice.',
    className: 'bg-gray-50 border-gray-200 text-gray-800'
  }
};

export const ToolDisclaimer: React.FC<ToolDisclaimerProps> = ({ type, className = '' }) => {
  const config = disclaimerContent[type];
  const Icon = config.icon;

  return (
    <Card className={`${config.className} ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm leading-relaxed">{config.text}</p>
        </div>
      </CardContent>
    </Card>
  );
};