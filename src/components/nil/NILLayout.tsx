import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getReceiptsCount } from '@/features/receipts/record';

interface NILLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const navigation = [
  { name: 'Education', href: '/nil/education', icon: '📚' },
  { name: 'Disclosures', href: '/nil/disclosures', icon: '📋' },
  { name: 'Offers', href: '/nil/offers', icon: '💼' },
  { name: 'Marketplace', href: '/nil/marketplace', icon: '🤝' },
  { name: 'Payments', href: '/nil/payments', icon: '💰' },
  { name: 'Disputes', href: '/nil/disputes', icon: '⚖️' },
  { name: 'Receipts', href: '/nil/receipts', icon: '🧾' },
  { name: 'Admin', href: '/nil/admin', icon: '⚙️' },
];

export default function NILLayout({ children, title, description }: NILLayoutProps) {
  const location = useLocation();
  const receiptCount = getReceiptsCount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/nil/onboarding" className="text-xl font-bold">
                NIL Hub
              </Link>
              <Badge variant="secondary">Demo Mode</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Receipts: {receiptCount}
              </Badge>
              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  Upgrade
                </Button>
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
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}