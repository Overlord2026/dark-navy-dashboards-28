import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Clock, DollarSign, Star } from 'lucide-react';

export function MarketplaceStats() {
  const stats = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Family Offices Served',
      trend: '+15% this year',
      color: 'text-blue-500'
    },
    {
      icon: DollarSign,
      value: '$250B+',
      label: 'Combined AUM',
      trend: '+23% growth',
      color: 'text-green-500'
    },
    {
      icon: Award,
      value: '98%',
      label: 'Client Retention',
      trend: 'Industry leading',
      color: 'text-purple-500'
    },
    {
      icon: Clock,
      value: '48hrs',
      label: 'Avg. Response Time',
      trend: 'White-glove service',
      color: 'text-orange-500'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Average Rating',
      trend: '10,000+ reviews',
      color: 'text-yellow-500'
    },
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Goal Achievement Rate',
      trend: 'Measurable outcomes',
      color: 'text-emerald-500'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Elite Families Worldwide
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our marketplace connects sophisticated investors with the most qualified 
            financial professionals specializing in complex wealth management needs.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center hover-scale">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.label}</div>
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}