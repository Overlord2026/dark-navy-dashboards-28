import React from 'react';
import { Outlet } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, PiggyBank, Heart, Building2, FileText, BarChart3, Shield } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';

const taxCalculators = [
  { 
    id: 'roth-conversion', 
    title: 'Roth Conversion', 
    route: '/tax/roth-conversion', 
    icon: TrendingUp,
    description: 'Optimal conversion strategies'
  },
  { 
    id: 'appreciated-stock', 
    title: 'Appreciated Stock', 
    route: '/tax/appreciated-stock', 
    icon: BarChart3,
    description: 'Stock option tax planning'
  },
  { 
    id: 'qsbs', 
    title: 'QSBS Planning', 
    route: '/tax/qsbs', 
    icon: Building2,
    description: 'Qualified Small Business Stock'
  },
  { 
    id: 'nua', 
    title: 'NUA Strategy', 
    route: '/tax/nua', 
    icon: TrendingUp,
    description: 'Net Unrealized Appreciation'
  },
  { 
    id: 'loss-harvest', 
    title: 'Loss Harvesting', 
    route: '/tax/loss-harvest', 
    icon: DollarSign,
    description: 'Tax loss optimization'
  },
  { 
    id: 'basis-planning', 
    title: 'Basis Planning', 
    route: '/tax/basis-planning', 
    icon: Calculator,
    description: 'Cost basis strategies'
  },
  { 
    id: 'charitable-gift', 
    title: 'Charitable Gifts', 
    route: '/tax/charitable-gift', 
    icon: Heart,
    description: 'Tax-efficient giving'
  },
  { 
    id: 'daf', 
    title: 'Donor Advised Fund', 
    route: '/tax/daf', 
    icon: Heart,
    description: 'DAF optimization'
  },
  { 
    id: 'tax-return-analyzer', 
    title: 'Return Analyzer', 
    route: '/tax/tax-return-analyzer', 
    icon: FileText,
    description: 'Tax return insights'
  },
  { 
    id: 'bracket-manager', 
    title: 'Bracket Manager', 
    route: '/tax/bracket-manager', 
    icon: BarChart3,
    description: 'Tax bracket optimization'
  },
  { 
    id: 'social-security', 
    title: 'Social Security', 
    route: '/tax/social-security', 
    icon: Shield,
    description: 'SS tax planning'
  },
];

function TaxSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = taxCalculators.some((calc) => isActive(calc.route));
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible
    >
      <SidebarContent>
        <SidebarGroup
          open={isExpanded}
        >
          <SidebarGroupLabel>Tax Planning Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {taxCalculators.map((calc) => (
                <SidebarMenuItem key={calc.id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={calc.route} end className={getNavCls}>
                      <calc.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{calc.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function TaxShell() {
  return (
    <SidebarProvider collapsedWidth={56}>
      <header className="h-12 flex items-center border-b bg-background">
        <SidebarTrigger className="ml-2" />
        <h1 className="ml-4 text-lg font-semibold">Advanced Tax Planning</h1>
      </header>
      
      <div className="flex min-h-screen w-full">
        <TaxSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}