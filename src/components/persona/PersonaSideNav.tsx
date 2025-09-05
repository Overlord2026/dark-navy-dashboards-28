import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function PersonaSideNav() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const Item = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      className={`block px-3 py-2 rounded-lg ${
        pathname === to 
          ? 'bg-white/10 text-bfo-gold' 
          : 'hover:bg-white/5 text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-bfo-black border border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-bfo-black transition-colors"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      {/* Backdrop for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-[240px] border-r border-bfo-gold/40 pr-3 bg-bfo-navy
        lg:block lg:relative lg:translate-x-0 lg:bg-transparent
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        fixed top-[120px] left-0 h-[calc(100vh-120px)] z-50 p-4
        transition-transform duration-300 ease-in-out
      `}>
        <h3 className="text-sm uppercase tracking-widest opacity-60 mb-2 text-white">Services</h3>
        <Item to="/pros/advisors" label="Wealth (Dashboard)" />
        <Item to="/health" label="Health (Tools)" />
        
        <div className="h-4" />
        
        <h3 className="text-sm uppercase tracking-widest opacity-60 mb-2 text-white">Tools</h3>
        <Item to="/tools/retirement" label="Retirement Roadmap" />
        <Item to="/tools/estate" label="Estate Planner" />
        <Item to="/tools/tax" label="Tax Analyzer" />
        <Item to="/tools/vault" label="Secure Vault" />
      </aside>
    </>
  );
}