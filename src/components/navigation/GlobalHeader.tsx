import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { TreePine, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const GlobalHeader: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();

  const navItems = [
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Calculator', path: '/value-calculator' },
    { label: 'Athletes', path: '/athletes' },
    { label: 'Estate Planning', path: '/estate-planning' },
    { label: 'Get Started', path: '/auth/signup' }
  ];

  const adminRoles = ['system_administrator', 'tenant_admin'];
  const showAdminMenu = userProfile?.role && adminRoles.includes(userProfile.role);

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <TreePine className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BFO</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="text-foreground hover:text-primary"
              >
                {item.label}
              </Button>
            ))}

            {/* Admin Menu */}
            {showAdminMenu && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Dashboard
                  </DropdownMenuItem>
                  {userProfile?.role === 'system_administrator' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/cfo')}>
                      CFO Center
                    </DropdownMenuItem>
                  )}
                  {userProfile?.role === 'system_administrator' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/marketing')}>
                      Marketing
                    </DropdownMenuItem>
                  )}
                  {userProfile?.role === 'system_administrator' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin/security')}>
                        Security
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/vetting')}>
                        Vetting
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
                {showAdminMenu && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};