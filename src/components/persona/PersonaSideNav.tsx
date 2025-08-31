import { Link, useLocation } from 'react-router-dom';

export default function PersonaSideNav() {
  const { pathname } = useLocation();
  
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
    <aside className="hidden lg:block w-[240px] border-r border-bfo-gold/40 pr-3">
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
  );
}