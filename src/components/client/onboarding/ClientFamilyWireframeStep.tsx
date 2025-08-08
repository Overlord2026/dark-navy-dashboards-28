import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  TrendingUp, 
  Shield, 
  FileText, 
  Calculator,
  Globe,
  CreditCard,
  Heart,
  User,
  Eye,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ClientFamilyWireframeStep: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigationTabs = [
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'investments', label: 'Investments', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'insurance', label: 'Insurance', icon: <Shield className="w-4 h-4" /> },
    { id: 'estate', label: 'Estate Planning', icon: <FileText className="w-4 h-4" /> },
    { id: 'tax', label: 'Tax Planning', icon: <Calculator className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Globe className="w-4 h-4" /> },
    { id: 'vault', label: 'Vault', icon: <Shield className="w-4 h-4" /> },
    { id: 'billpay', label: 'Bill Pay', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> }
  ];

  const dashboardCards = [
    { 
      title: 'Net Worth', 
      description: 'Real-time asset tracking', 
      value: '$2.4M', 
      change: '+5.2%',
      premium: false,
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      title: 'Family Vault', 
      description: 'Secure document storage', 
      value: '47 docs', 
      change: '3 new',
      premium: false,
      icon: <Shield className="w-6 h-6" />
    },
    { 
      title: 'Properties', 
      description: 'Real estate portfolio', 
      value: '3 properties', 
      change: '$1.8M total',
      premium: false,
      icon: <FileText className="w-6 h-6" />
    },
    { 
      title: 'Bill Pay', 
      description: 'Upcoming payments', 
      value: '5 bills due', 
      change: '$4,200',
      premium: false,
      icon: <CreditCard className="w-6 h-6" />
    },
    { 
      title: 'Health', 
      description: 'Wellness tracking', 
      value: '2 checkups', 
      change: 'Schedule due',
      premium: true,
      icon: <Heart className="w-6 h-6" />
    },
    { 
      title: 'Goals', 
      description: 'Financial targets', 
      value: '85% complete', 
      change: 'On track',
      premium: false,
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      title: 'Marketplace', 
      description: 'Professional network', 
      value: '12 advisors', 
      change: '3 matches',
      premium: false,
      icon: <Globe className="w-6 h-6" />
    },
    { 
      title: 'Education', 
      description: 'Learning progress', 
      value: '7 courses', 
      change: '2 completed',
      premium: false,
      icon: <GraduationCap className="w-6 h-6" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Your Family Office Dashboard Preview
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          See how your complete wealth management platform will look and feel. 
          This is your family's command center for everything financial.
        </p>
      </div>

      {/* Navigation Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-muted rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Platform Navigation</h3>
          <Badge variant="outline">Interactive Preview</Badge>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
            {navigationTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex flex-col items-center p-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {tab.icon}
                <span className="mt-1 hidden sm:block">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <div className="text-center py-4">
              <h4 className="font-semibold mb-2">Dashboard Overview</h4>
              <p className="text-sm text-muted-foreground">Your main family office dashboard with all key metrics</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dashboard Cards Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Main Dashboard Cards</h3>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-700">Basic</Badge>
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">Premium</Badge>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <Card className={`relative transition-all duration-300 hover:shadow-lg ${
                card.premium 
                  ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5' 
                  : 'border-green-200 hover:border-green-400'
              }`}>
                {card.premium && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      Premium
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      card.premium ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'
                    }`}>
                      {card.icon}
                    </div>
                    
                    {!card.premium && (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                    
                    {card.premium && (
                      <Lock className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-sm text-muted-foreground">{card.change}</div>
                    <div className="text-xs text-muted-foreground">{card.description}</div>
                  </div>
                  
                  {card.premium && (
                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <div className="flex items-center text-xs text-primary">
                        <Lock className="w-3 h-3 mr-1" />
                        Upgrade to unlock
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Preview Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-muted/50 border border-muted rounded-2xl p-6 text-center"
      >
        <h4 className="font-semibold mb-3">How It Works</h4>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h5 className="font-medium mb-2">Basic Users</h5>
            <p className="text-sm text-muted-foreground">
              Access all green-highlighted features immediately with your free account
            </p>
          </div>
          
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h5 className="font-medium mb-2">Premium Users</h5>
            <p className="text-sm text-muted-foreground">
              Unlock all features including advanced tools marked with premium badges
            </p>
          </div>
          
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h5 className="font-medium mb-2">Scalable</h5>
            <p className="text-sm text-muted-foreground">
              Start with basics and upgrade as your wealth and needs grow over time
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};