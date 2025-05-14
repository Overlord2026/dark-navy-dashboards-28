
import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MainSidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Integration', path: '/integration' },
    { name: 'Diagnostics', path: '/diagnostics' }
  ];

  return (
    <aside
      className={cn(
        'h-screen bg-background border-r border-border transition-all duration-300 flex flex-col',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className={cn("font-semibold", !isOpen && "sr-only")}>
          Family Office
        </h2>
        <Button variant="ghost" size="icon" onClick={toggle}>
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <span className={cn(!isOpen && "sr-only")}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default MainSidebar;
