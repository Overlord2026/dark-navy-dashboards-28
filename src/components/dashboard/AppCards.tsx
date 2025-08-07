import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Shield, 
  Home, 
  Heart, 
  DollarSign, 
  Shield as Insurance, 
  FileText, 
  Users, 
  GraduationCap,
  Building,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface AppCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  status: 'free' | 'premium' | 'locked';
  route?: string;
  preview: string;
}

const appCards: AppCard[] = [
  {
    id: 'net-worth',
    title: 'Net Worth Dashboard',
    description: 'View all accounts, investments, and assets in real-time',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    status: 'free',
    route: '/net-worth',
    preview: 'See sample asset list with Plaid/manual entry options'
  },
  {
    id: 'vault',
    title: 'Secure Digital Vault',
    description: 'Store and organize important documents with bank-level security',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    status: 'free',
    route: '/vault',
    preview: 'Explore secure folders for Wills, Trusts, Passwords, IDs'
  },
  {
    id: 'properties',
    title: 'Property Management',
    description: 'Track and manage real estate investments and properties',
    icon: Home,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    status: 'free',
    route: '/properties',
    preview: 'View sample property cards and add your own'
  },
  {
    id: 'healthcare',
    title: 'Proactive Health',
    description: 'Health records, insurance, emergency contacts, and wellness',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    status: 'free',
    route: '/healthcare',
    preview: 'Health summary, provider list, document upload'
  },
  {
    id: 'lending',
    title: 'Smart Lending',
    description: 'Access exclusive lending opportunities and credit solutions',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    status: 'premium',
    route: '/lending',
    preview: 'Explore lending options and credit facilities'
  },
  {
    id: 'insurance',
    title: 'Insurance Hub',
    description: 'Comprehensive insurance coverage and risk management',
    icon: Insurance,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    status: 'premium',
    route: '/insurance',
    preview: 'Review coverage options and risk assessments'
  },
  {
    id: 'estate',
    title: 'Estate Planning',
    description: 'Wills, trusts, and legacy planning for generations',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    status: 'premium',
    route: '/estate',
    preview: 'Estate planning tools and family legacy management'
  },
  {
    id: 'marketplace',
    title: 'Expert Marketplace',
    description: 'Connect with vetted advisors, attorneys, and professionals',
    icon: Users,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    status: 'free',
    route: '/marketplace',
    preview: 'Browse directory of trusted professionals'
  },
  {
    id: 'education',
    title: 'Learning Center',
    description: 'Educational resources, guides, and financial literacy',
    icon: GraduationCap,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    status: 'free',
    route: '/education',
    preview: 'Access library of guides, courses, and calculators'
  }
];

export const AppCards: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (app: AppCard) => {
    if (app.route) {
      navigate(app.route);
    }
  };

  const getStatusBadge = (status: AppCard['status']) => {
    switch (status) {
      case 'free':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">Free</Badge>;
      case 'premium':
        return <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">Premium</Badge>;
      case 'locked':
        return <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">Coming Soon</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Your Family Office Apps</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Click any app to preview what's inside. Everything is designed to give you complete control of your financial life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appCards.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`${app.borderColor} hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 ${app.status === 'locked' ? 'opacity-75' : ''}`}
              onClick={() => handleCardClick(app)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${app.bgColor} rounded-lg flex items-center justify-center`}>
                    <app.icon className={`w-6 h-6 ${app.color}`} />
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">{app.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{app.description}</p>
                <div className={`text-xs ${app.color} bg-gray-50 dark:bg-gray-800 p-2 rounded-md`}>
                  <span className="font-medium">Preview: </span>
                  {app.preview}
                </div>
                {app.status === 'premium' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle learn more
                    }}
                  >
                    Learn More
                  </Button>
                )}
                {app.status === 'locked' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Coming Soon
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Become a Client CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-8"
      >
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Ready to unlock premium features?</h3>
              <p className="text-muted-foreground">
                Become a client to access advanced tools, personalized advisory services, and exclusive investment opportunities.
              </p>
              <Button className="btn-primary-gold">
                Become a Client
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};