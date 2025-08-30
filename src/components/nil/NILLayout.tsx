import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getReceiptsCount } from '@/features/receipts/record';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

interface NILLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const navigation = [
  { name: 'Education', href: '/nil/education', icon: '📚' },
  { name: 'Search', href: '/nil/search', icon: '🔍' },
  { name: 'Goals', href: '/nil/goals', icon: '🎯' },
  { name: 'Offers', href: '/nil/offers', icon: '💼' },
  { name: 'Marketplace', href: '/nil/marketplace', icon: '🤝' },
  { name: 'Payments', href: '/nil/payments', icon: '💰' },
  { name: 'Receipts', href: '/nil/receipts', icon: '🧾' },
  { name: 'Admin', href: '/nil/admin', icon: '⚙️' },
];

export default function NILLayout({ children, title, description }: NILLayoutProps) {
  const location = useLocation();
  const receiptCount = getReceiptsCount();

  return (
    <div className="min-h-screen bg-bfo-black text-white">
      {/* Header */}
      <header className="border-b border-bfo-gold/30 bg-bfo-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/nil/onboarding" className="text-xl font-bold text-white hover:text-bfo-gold transition-colors">
                NIL Hub
              </Link>
              <Badge variant="secondary" className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30">
                Demo Mode
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-bfo-gold/40 text-bfo-gold">
                Receipts: {receiptCount}
              </Badge>
              <Link to="/pricing">
                <GoldOutlineButton>
                  Upgrade
                </GoldOutlineButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-64 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#24313d] text-bfo-gold border border-bfo-gold/40'
                      : 'text-white hover:text-bfo-gold hover:bg-[#24313d]/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
              <CardHeader className="border-b border-bfo-gold/30">
                <CardTitle className="text-white font-semibold">{title}</CardTitle>
                {description && (
                  <CardDescription className="text-white/70">{description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-white">
                {children}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}