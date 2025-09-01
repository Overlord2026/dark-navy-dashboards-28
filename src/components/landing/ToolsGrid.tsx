import React from 'react';
import { BfoCard } from '@/components/ui/BfoCard';
import { Calculator, FileText, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Tool {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  comingSoon?: boolean;
}

const defaultTools: Tool[] = [
  {
    title: 'Financial Calculator',
    description: 'Advanced calculations for retirement and investment planning',
    icon: Calculator,
    href: '/tools/calculator'
  },
  {
    title: 'Document Vault',
    description: 'Secure storage and organization of financial documents',
    icon: FileText,
    href: '/tools/vault'
  },
  {
    title: 'Risk Assessment',
    description: 'Comprehensive risk analysis and mitigation strategies',
    icon: Shield,
    href: '/tools/risk'
  },
  {
    title: 'Portfolio Tracker',
    description: 'Real-time monitoring of investment performance',
    icon: TrendingUp,
    href: '/tools/portfolio'
  },
  {
    title: 'Family Governance',
    description: 'Tools for family meeting and decision management',
    icon: Users,
    href: '/tools/governance'
  },
  {
    title: 'Tax Optimizer',
    description: 'Strategies to minimize tax burden and maximize savings',
    icon: Zap,
    href: '/tools/tax'
  }
];

interface ToolsGridProps {
  tools?: Tool[];
  title?: string;
  className?: string;
}

export function ToolsGrid({ 
  tools = defaultTools, 
  title = "Essential Tools", 
  className 
}: ToolsGridProps) {
  return (
    <section id="tools" className={`py-16 px-4 ${className || ''}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <BfoCard key={index} className="hover:shadow-xl transition-all duration-300 group">
              <Link 
                to={tool.href} 
                className="block h-full"
                onClick={(e) => {
                  if (tool.comingSoon) {
                    e.preventDefault();
                    // Could show a toast about coming soon
                  }
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-colors">
                    <tool.icon className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#FFD700] transition-colors">
                      {tool.title}
                      {tool.comingSoon && (
                        <span className="ml-2 text-xs bg-[#FFD700]/20 text-[#FFD700] px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            </BfoCard>
          ))}
        </div>
      </div>
    </section>
  );
}