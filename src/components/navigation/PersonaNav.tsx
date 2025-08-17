import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Users, Building2, Calculator, BookOpen, Shield, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface PersonaNavProps {
  className?: string;
}

const familyMenuItems = [
  {
    label: 'Dashboard',
    href: '/family-dashboard',
    icon: TrendingUp,
    description: 'Your personalized family overview'
  },
  {
    label: 'Financial Planning',
    href: '/family/planning',
    icon: Calculator,
    description: 'Retirement, education, and estate planning'
  },
  {
    label: 'Investment Management',
    href: '/family/investments',
    icon: TrendingUp,
    description: 'Portfolio tracking and rebalancing'
  },
  {
    label: 'Tax Planning',
    href: '/family/tax',
    icon: Shield,
    description: 'Tax optimization strategies'
  },
  {
    label: 'Education Center',
    href: '/family/education',
    icon: BookOpen,
    description: 'Guides and resources for families'
  },
  {
    label: 'Family Office Services',
    href: '/family/office',
    icon: Building2,
    description: 'Comprehensive family wealth management'
  }
];

const professionalMenuItems = [
  {
    label: 'Professional Dashboard',
    href: '/professional-dashboard',
    icon: Building2,
    description: 'Your practice management hub'
  },
  {
    label: 'Client Management',
    href: '/professional/clients',
    icon: Users,
    description: 'Manage your client relationships'
  },
  {
    label: 'Planning Tools',
    href: '/professional/tools',
    icon: Calculator,
    description: 'Advanced planning calculators'
  },
  {
    label: 'Compliance Center',
    href: '/professional/compliance',
    icon: Shield,
    description: 'Regulatory compliance and documentation'
  },
  {
    label: 'Business Development',
    href: '/professional/business',
    icon: TrendingUp,
    description: 'Grow your practice and referral network'
  },
  {
    label: 'Professional Education',
    href: '/professional/education',
    icon: BookOpen,
    description: 'CE credits and continuing education'
  }
];

export const PersonaNav: React.FC<PersonaNavProps> = ({ className }) => {
  const navigate = useNavigate();
  const [familyOpen, setFamilyOpen] = useState(false);
  const [professionalOpen, setProfessionalOpen] = useState(false);

  return (
    <nav className={cn("flex items-center space-x-8", className)}>
      {/* Families Dropdown */}
      <DropdownMenu open={familyOpen} onOpenChange={setFamilyOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 text-base font-medium hover:text-primary"
          >
            <Users className="h-4 w-4" />
            <span>Families</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", familyOpen && "rotate-180")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-80 bg-background/95 backdrop-blur-sm border shadow-lg" 
          align="start"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground">
            Family Services
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {familyMenuItems.map((item) => (
              <DropdownMenuItem key={item.href} className="p-0" asChild>
                <Link 
                  to={item.href}
                  className="flex items-start space-x-3 p-3 rounded-sm hover:bg-muted/50 cursor-pointer"
                  onClick={() => setFamilyOpen(false)}
                >
                  <item.icon className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Service Professionals Dropdown */}
      <DropdownMenu open={professionalOpen} onOpenChange={setProfessionalOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 text-base font-medium hover:text-primary"
          >
            <Building2 className="h-4 w-4" />
            <span>Service Professionals</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", professionalOpen && "rotate-180")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-80 bg-background/95 backdrop-blur-sm border shadow-lg" 
          align="start"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground">
            Professional Services
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {professionalMenuItems.map((item) => (
              <DropdownMenuItem key={item.href} className="p-0" asChild>
                <Link 
                  to={item.href}
                  className="flex items-start space-x-3 p-3 rounded-sm hover:bg-muted/50 cursor-pointer"
                  onClick={() => setProfessionalOpen(false)}
                >
                  <item.icon className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Additional Nav Items */}
      <Link 
        to="/about" 
        className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        About
      </Link>
      <Link 
        to="/contact" 
        className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        Contact
      </Link>
    </nav>
  );
};