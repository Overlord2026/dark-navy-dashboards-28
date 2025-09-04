import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Star, 
  Shield, 
  TrendingUp, 
  Users, 
  Building, 
  Heart,
  Briefcase,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const showcaseCategories = [
  {
    id: 'elite-offices',
    title: 'Elite Family Offices',
    description: 'Connect with premier family offices worldwide',
    icon: Crown,
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/20',
    featured: [
      { name: 'Rockefeller Capital', type: 'Family Office', rating: 5.0, clients: '500+' },
      { name: 'Goldman Sachs PWM', type: 'Private Wealth', rating: 4.9, clients: '1,000+' },
      { name: 'Morgan Stanley FO', type: 'Family Office', rating: 4.8, clients: '750+' }
    ]
  },
  {
    id: 'investment-opportunities',
    title: 'Investment Opportunities',
    description: 'Exclusive private market deals and co-investments',
    icon: TrendingUp,
    color: 'text-emerald',
    bgColor: 'bg-emerald/10',
    borderColor: 'border-emerald/20',
    featured: [
      { name: 'Private Equity Co-Investment', type: 'PE Deal', minInvestment: '$1M+', irr: '18-25%' },
      { name: 'Real Estate Syndication', type: 'Real Estate', minInvestment: '$500K+', irr: '12-16%' },
      { name: 'Venture Capital Fund', type: 'VC Fund', minInvestment: '$250K+', irr: '20-30%' }
    ]
  },
  {
    id: 'professional-services',
    title: 'Professional Services',
    description: 'Top-tier advisors, attorneys, and specialists',
    icon: Briefcase,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    featured: [
      { name: 'Elite Estate Attorneys', type: 'Legal Services', expertise: 'Estate Planning', rate: '$1,500/hr' },
      { name: 'Family Tax Specialists', type: 'Tax Advisory', expertise: 'Family Tax', rate: '$800/hr' },
      { name: 'Wealth Psychologists', type: 'Family Dynamics', expertise: 'Next Gen', rate: '$500/hr' }
    ]
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness',
    description: 'Premium healthcare and longevity services',
    icon: Heart,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
    featured: [
      { name: 'Concierge Medicine', type: 'Healthcare', specialty: 'Executive Health', cost: '$50K/year' },
      { name: 'Longevity Centers', type: 'Wellness', specialty: 'Anti-Aging', cost: '$25K/year' },
      { name: 'Mental Health VIP', type: 'Psychology', specialty: 'Family Therapy', cost: '$500/session' }
    ]
  }
];

export const MarketplaceShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Crown className="h-8 w-8 text-gold" />
          <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
            EXCLUSIVE MARKETPLACE
          </Badge>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Family Office Marketplace
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Where elite families connect with the world's top wealth managers, investment opportunities, and premium services
        </p>
      </div>

      {/* Category Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {showcaseCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${category.borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Featured Items Preview */}
                <div className="space-y-3">
                  {category.featured.slice(0, 2).map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.type}</div>
                      </div>
                      <div className="text-right text-xs">
                        {/* Show different metrics based on category */}
                        {'rating' in item && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-gold text-gold" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        {'minInvestment' in item && (
                          <div className="font-medium">{item.minInvestment}</div>
                        )}
                        {'rate' in item && (
                          <div className="font-medium">{item.rate}</div>
                        )}
                        {'cost' in item && (
                          <div className="font-medium">{item.cost}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Blurred preview for premium content */}
                  <div className="relative">
                    <div className="p-3 bg-muted/50 rounded-lg opacity-50 blur-sm">
                      <div className="font-medium text-sm">Premium Services</div>
                      <div className="text-xs text-muted-foreground">VIP Access Required</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/marketplace?category=${category.id}`}>
                      Explore All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/elite/apply">
                      Request Access
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Access Levels */}
      <Card className="bg-gradient-to-r from-gold/5 via-primary/5 to-accent/5 border-gold/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            Marketplace Access Levels
          </CardTitle>
          <CardDescription>
            Different membership tiers unlock exclusive opportunities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <Badge variant="outline" className="mb-2">Standard</Badge>
              <div className="text-sm text-muted-foreground">
                Access to vetted professionals and basic investment opportunities
              </div>
            </div>
            
            <div className="text-center p-4 border border-primary/50 rounded-lg bg-primary/5">
              <Badge className="mb-2 bg-primary">Premium</Badge>
              <div className="text-sm text-muted-foreground">
                Elite family offices, private deals, and concierge services
              </div>
            </div>
            
            <div className="text-center p-4 border border-gold/50 rounded-lg bg-gold/5">
              <Badge className="mb-2 bg-gold text-gold-foreground">VIP Founding</Badge>
              <div className="text-sm text-muted-foreground">
                Exclusive co-investments, family office partnerships, and equity participation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-4 py-8">
        <h3 className="text-2xl font-bold">Ready to Join the Elite?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Apply for VIP access to unlock exclusive opportunities, connect with premier families, 
          and participate in our founding member equity program.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground">
            <Link to="/elite/apply">
              <Crown className="h-5 w-5 mr-2" />
              Apply for VIP Access
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link to="/family-portal">
              <Users className="h-5 w-5 mr-2" />
              Create Family Portal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};