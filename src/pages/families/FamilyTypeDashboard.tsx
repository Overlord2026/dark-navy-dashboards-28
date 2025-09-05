import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Heart, 
  Target, 
  Coins, 
  GraduationCap, 
  Home,
  BarChart3,
  Calendar,
  Users,
  Shield
} from 'lucide-react';

export const FamilyTypeDashboard: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  if (!type || !['aspiring', 'retirees'].includes(type)) {
    return <Navigate to="/families" replace />;
  }

  const isAspiring = type === 'aspiring';
  
  const dashboardConfig = {
    aspiring: {
      title: 'Aspiring Families Dashboard',
      subtitle: 'Building wealth for tomorrow',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      tools: [
        {
          title: 'Investment Growth Tracker',
          description: 'Monitor portfolio performance and allocation',
          icon: TrendingUp,
          color: 'from-emerald-500 to-teal-600',
          bgColor: 'bg-emerald-50',
          route: '/tools/investments',
          tier: 'Basic'
        },
        {
          title: 'Savings Goals',
          description: 'Track emergency fund and major purchases',
          icon: Target,
          color: 'from-blue-500 to-indigo-600',
          bgColor: 'bg-blue-50',
          route: '/tools/savings',
          tier: 'Elite'
        },
        {
          title: 'Education Funding',
          description: '529 plans and college savings strategies',
          icon: GraduationCap,
          color: 'from-purple-500 to-violet-600',
          bgColor: 'bg-purple-50',
          route: '/tools/education',
          tier: 'Premium'
        },
        {
          title: 'Home Planning',
          description: 'Mortgage planning and home equity tracking',
          icon: Home,
          color: 'from-orange-500 to-red-600',
          bgColor: 'bg-orange-50',
          route: '/tools/home',
          tier: 'Basic'
        }
      ]
    },
    retirees: {
      title: 'Retirees Dashboard',
      subtitle: 'Enjoying your golden years',
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      tools: [
        {
          title: 'Income Planning',
          description: 'Social Security, pensions, and withdrawals',
          icon: Coins,
          color: 'from-amber-500 to-yellow-600',
          bgColor: 'bg-amber-50',
          route: '/tools/income',
          tier: 'Basic'
        },
        {
          title: 'Health Tracking',
          description: 'Wellness monitoring and healthcare costs',
          icon: Heart,
          color: 'from-rose-500 to-pink-600',
          bgColor: 'bg-rose-50',
          route: '/tools/health',
          tier: 'Elite'
        },
        {
          title: 'Bucket List',
          description: 'Travel and experience planning',
          icon: Calendar,
          color: 'from-cyan-500 to-blue-600',
          bgColor: 'bg-cyan-50',
          route: '/tools/bucket-list',
          tier: 'Premium'
        },
        {
          title: 'Legacy Planning',
          description: 'Estate planning and wealth transfer',
          icon: Shield,
          color: 'from-indigo-500 to-purple-600',
          bgColor: 'bg-indigo-50',
          route: '/tools/legacy',
          tier: 'Elite'
        }
      ]
    }
  };

  const config = dashboardConfig[type as keyof typeof dashboardConfig];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${config.gradient} text-white mb-6`}>
            <BarChart3 className="h-6 w-6" />
            <span className="font-semibold">Your Personalized Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            {config.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Tools Available', value: '12+', color: 'text-emerald-600' },
            { label: 'Progress Tracking', value: '24/7', color: 'text-blue-600' },
            { label: 'Expert Support', value: 'Ready', color: 'text-purple-600' },
            { label: 'Security Level', value: 'Bank-Grade', color: 'text-amber-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-lg text-center"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {config.tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="cursor-pointer"
              >
                <Card className={`${tool.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Tier Badge */}
                        <Badge 
                          className={`text-xs font-medium ${
                            tool.tier === 'Basic' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : tool.tier === 'Elite'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-purple-100 text-purple-800 border-purple-200'
                          }`}
                        >
                          {tool.tier} {tool.tier === 'Basic' ? '(Free)' : tool.tier === 'Elite' ? '($9.99/mo)' : '($19.99/mo)'}
                        </Badge>
                        <Badge className="bg-white/80 text-slate-700">
                          {isAspiring ? 'Growth' : 'Lifestyle'}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-800 mb-2">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="space-y-3">
                      <Button 
                        className={`w-full bg-gradient-to-r ${tool.color} text-white hover:opacity-90`}
                      >
                        Get Started
                      </Button>
                      {tool.tier !== 'Basic' && (
                        <a 
                          href="#" 
                          className="block text-center text-sm text-bfo-gold hover:text-bfo-gold/80 underline font-medium"
                          onClick={(e) => e.preventDefault()}
                        >
                          Upgrade to {tool.tier} →
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-0 shadow-xl">
            <CardContent className="py-12">
              <Users className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-3xl font-bold mb-4">
                Ready to Work with Professionals?
              </h3>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Connect with trusted advisors, accountants, and attorneys who specialize in your family's needs.
              </p>
              <Button size="lg" className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 px-8 py-3 text-lg font-semibold">
                Find Your Team
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};