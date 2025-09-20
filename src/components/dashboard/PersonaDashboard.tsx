/**
 * Dynamic Persona Dashboard
 * Renders persona-specific tool grids with your recommended UX improvements
 */

import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Users, 
  Calculator, 
  Heart, 
  Trophy,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ToolCard } from '@/components/ui/ToolCard';
import PersonaCard, { PersonaType } from '@/components/ui/PersonaCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PersonaDashboardProps {
  currentPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
}

// Tool configurations for each persona - NIL gated  
const personaTools: Partial<Record<PersonaType, Array<{
  title: string;
  features: string[];
  tagline: string;
  icon: any;
  priority: 'high' | 'medium' | 'low';
}>>> = {
  advisor: [
    {
      title: 'Reg BI Tracker',
      features: [
        'Automated compliance monitoring',
        'Client interaction logging',
        'Suitability analysis reports',
        'Real-time violation alerts'
      ],
      tagline: 'Stay compliant, save hours',
      icon: Shield,
      priority: 'high'
    },
    {
      title: 'Client Portfolio Manager',
      features: [
        'AUM tracking dashboard',
        'Performance reporting',
        'Risk assessment tools',
        'Rebalancing alerts'
      ],
      tagline: 'Optimize client outcomes',
      icon: TrendingUp,
      priority: 'high'
    },
    {
      title: 'FINRA Filing Assistant',
      features: [
        'Form ADV management',
        'U4/U5 processing',
        'Continuing education tracking',
        'Audit preparation tools'
      ],
      tagline: 'Simplify regulatory paperwork',
      icon: FileText,
      priority: 'medium'
    }
  ],
  insurance: [
    {
      title: '10-Year Records Vault',
      features: [
        'NAIC-compliant record retention',
        'Automated policy tracking',
        'Claim documentation system',
        'Audit-ready reports'
      ],
      tagline: 'Secure. Compliant. Accessible.',
      icon: Shield,
      priority: 'high'
    },
    {
      title: 'Policy Lifecycle Manager',
      features: [
        'Application processing',
        'Underwriting workflow',
        'Premium calculations',
        'Renewal notifications'
      ],
      tagline: 'End-to-end policy management',
      icon: FileText,
      priority: 'high'
    },
    {
      title: 'Claims Processing Hub',
      features: [
        'Claim intake automation',
        'Investigation tracking',
        'Settlement management',
        'Fraud detection alerts'
      ],
      tagline: 'Faster claims, happier clients',
      icon: CheckCircle,
      priority: 'medium'
    }
  ],
  attorney: [
    {
      title: 'Ethics Compliance Hub',
      features: [
        'Bar rule monitoring',
        'Conflict checking system',
        'Trust account reconciliation',
        'CLE credit tracking'
      ],
      tagline: 'Ethical practice, simplified',
      icon: Shield,
      priority: 'high'
    },
    {
      title: 'Case Management Suite',
      features: [
        'Matter tracking dashboard',
        'Time and billing integration',
        'Document management',
        'Calendar synchronization'
      ],
      tagline: 'Organize your practice',
      icon: FileText,
      priority: 'high'
    },
    {
      title: 'Discovery Assistant',
      features: [
        'Document review workflow',
        'Privilege log generation',
        'Production management',
        'Deadline tracking'
      ],
      tagline: 'Streamline litigation',
      icon: AlertTriangle,
      priority: 'medium'
    }
  ],
  healthcare: [
    {
      title: 'HIPAA Compliance Center',
      features: [
        'Privacy impact assessments',
        'Breach notification system',
        'Staff training tracker',
        'Audit preparation tools'
      ],
      tagline: 'Protect patient privacy',
      icon: Shield,
      priority: 'high'
    },
    {
      title: 'Patient Care Coordinator',
      features: [
        'Appointment scheduling',
        'Treatment plan tracking',
        'Insurance verification',
        'Outcome monitoring'
      ],
      tagline: 'Better care, better outcomes',
      icon: Heart,
      priority: 'high'
    },
    {
      title: 'Quality Metrics Dashboard',
      features: [
        'Performance indicators',
        'Patient satisfaction scores',
        'Compliance reporting',
        'Improvement recommendations'
      ],
      tagline: 'Measure what matters',
      icon: TrendingUp,
      priority: 'medium'
    }
  ],
  ...((window as any).__ENABLE_NIL__ ? {
    nil: [
      {
        title: 'NIL Deal Tracker',
        features: [
          'NCAA compliance verification',
          'Deal structure analysis',
          'Revenue reporting tools',
          'Coach notification system'
        ],
        tagline: 'Game-changing compliance',
        icon: Trophy,
        priority: 'high'
      },
      {
        title: 'Athlete Portfolio Manager',
        features: [
          'Brand value assessment',
          'Social media monitoring',
          'Performance analytics',
          'Contract management'
        ],
        tagline: 'Maximize athlete potential',
        icon: Users,
        priority: 'high'
      },
      {
        title: 'Educational Progress Tracker',
        features: [
          'Academic performance monitoring',
          'Eligibility verification',
          'Graduation pathway planning',
          'Academic support coordination'
        ],
        tagline: 'Student-athlete success',
        icon: CheckCircle,
        priority: 'medium'
      }
    ]
  } : {}),
  accountant: [
    {
      title: 'AICPA Compliance Suite',
      features: [
        'Ethics rule monitoring',
        'Quality control reviews',
        'Peer review preparation',
        'CPE credit tracking'
      ],
      tagline: 'Professional excellence',
      icon: Shield,
      priority: 'high'
    },
    {
      title: 'Tax Workflow Manager',
      features: [
        'Return preparation system',
        'IRS communication tracking',
        'Deadline management',
        'Client portal access'
      ],
      tagline: 'Streamline tax season',
      icon: Calculator,
      priority: 'high'
    },
    {
      title: 'Audit Assistant Pro',
      features: [
        'Working paper organization',
        'Risk assessment tools',
        'Testing documentation',
        'Review note management'
      ],
      tagline: 'Efficient audit execution',
      icon: FileText,
      priority: 'medium'
    }
  ],
  family: [
    {
      title: 'Wealth Optimization Hub',
      features: [
        'Portfolio performance tracking',
        'Tax loss harvesting alerts',
        'Estate planning coordination',
        'Legacy goal monitoring'
      ],
      tagline: 'Build generational wealth',
      icon: TrendingUp,
      priority: 'high'
    },
    {
      title: 'Family Office Dashboard',
      features: [
        'Multi-generation tracking',
        'Education fund management',
        'Philanthropic planning',
        'Risk management overview'
      ],
      tagline: 'Unified family strategy',
      icon: Users,
      priority: 'high'
    },
    {
      title: 'Compliance Monitoring',
      features: [
        'Regulatory change alerts',
        'Professional oversight',
        'Documentation management',
        'Audit coordination'
      ],
      tagline: 'Stay ahead of regulations',
      icon: Shield,
      priority: 'medium'
    }
  ],
  ...((window as any).__ENABLE_NIL__ ? {
    nil: [
      {
        title: 'NIL Deal Tracker',
        features: [
          'NCAA compliance verification',
          'Deal structure analysis',
          'Revenue reporting tools',
          'Coach notification system'
        ],
        tagline: 'Game-changing compliance',
        icon: Trophy,
        priority: 'high' as const
      },
      {
        title: 'Athlete Portfolio Manager',
        features: [
          'Brand value assessment',
          'Social media monitoring',
          'Performance analytics',
          'Contract management'
        ],
        tagline: 'Maximize athlete potential',
        icon: Users,
        priority: 'high' as const
      },
      {
        title: 'Educational Progress Tracker',
        features: [
          'Academic performance monitoring',
          'Eligibility verification',
          'Graduation pathway planning',
          'Academic support coordination'
        ],
        tagline: 'Student-athlete success',
        icon: CheckCircle,
        priority: 'medium' as const
      }
    ]
  } : {})
};

export function PersonaDashboard({ currentPersona, onPersonaChange }: PersonaDashboardProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  const currentTools = personaTools[currentPersona] || [];
  const highPriorityTools = currentTools.filter(tool => tool.priority === 'high');
  const mediumPriorityTools = currentTools.filter(tool => tool.priority === 'medium');

  return (
    <div className="space-y-6">
      {/* Persona Selection Header */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(personaTools).map((persona) => (
          <Button
            key={persona}
            variant={currentPersona === persona ? "default" : "outline"}
            size="sm"
            onClick={() => onPersonaChange(persona as PersonaType)}
            className="capitalize"
          >
            {persona}
          </Button>
        ))}
      </div>

      {/* Current Persona Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 capitalize">
          {currentPersona} Dashboard
        </h2>
        <div className="flex gap-4 text-sm">
          <Badge className="bg-emerald text-black">
            {highPriorityTools.length} Priority Tools
          </Badge>
          <Badge variant="outline" className="text-white border-white">
            {mediumPriorityTools.length} Additional Tools
          </Badge>
          <Badge variant="outline" className="text-brand-gold border-brand-gold">
            {currentPersona === 'insurance' ? '10-Year' : 'Compliant'} Records
          </Badge>
        </div>
      </div>

      {/* High Priority Tools */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-brand-gold" />
          Priority Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highPriorityTools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              features={tool.features}
              tagline={tool.tagline}
              persona={currentPersona}
              icon={tool.icon}
              onClick={() => setSelectedTool(tool.title)}
              className={selectedTool === tool.title ? 'ring-2 ring-brand-gold' : ''}
            />
          ))}
        </div>
      </div>

      {/* Additional Tools */}
      {mediumPriorityTools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/70" />
            Additional Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediumPriorityTools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                features={tool.features}
                tagline={tool.tagline}
                persona={currentPersona}
                icon={tool.icon}
                onClick={() => setSelectedTool(tool.title)}
                className={selectedTool === tool.title ? 'ring-2 ring-brand-gold' : ''}
              />
            ))}
          </div>
        </div>
      )}

      {/* Selected Tool Actions */}
      {selectedTool && (
        <div className="fixed bottom-4 right-4 bg-brand-black border border-brand-gold rounded-lg p-4 shadow-xl">
          <p className="text-white text-sm mb-2">Selected: {selectedTool}</p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-brand-gold text-black hover:bg-brand-gold/90">
              Launch Tool
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedTool(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}