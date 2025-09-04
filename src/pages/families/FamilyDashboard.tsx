import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, Target, Coins, Shield } from 'lucide-react';
import { playLindaWelcome } from '@/utils/lindaVoice';

export const FamilyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  useEffect(() => {
    // Linda's post-login question
    if ('speechSynthesis' in window && !hasPlayedWelcome) {
      const timer = setTimeout(() => {
        playLindaWelcome("Welcome! Let's build your health and wealth blueprint.")
          .then(() => setHasPlayedWelcome(true))
          .catch(error => {
            console.error('Linda post-login voice error:', error);
            setHasPlayedWelcome(true);
          });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasPlayedWelcome]);

  const familyTypes = [
    {
      id: 'aspiring',
      title: 'Aspiring Families',
      subtitle: 'Building wealth for the future',
      description: 'Growth-focused planning, savings goals, and investment strategies for families just starting their wealth journey.',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      badge: 'Growth Focus',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      features: ['Investment Planning', 'Savings Goals', 'Education Funding', 'Career Growth']
    },
    {
      id: 'retirees',
      title: 'Retirees',
      subtitle: 'Enjoying your golden years',
      description: 'Income preservation, bucket list planning, and health optimization for families in retirement.',
      icon: Heart,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      badge: 'Lifestyle Focus',
      badgeColor: 'bg-amber-100 text-amber-700',
      features: ['Income Planning', 'Health Tracking', 'Bucket List', 'Legacy Planning']
    }
  ];

  const priorities = [
    {
      title: 'Health',
      description: 'Wellness tracking and longevity planning',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      route: '/health'
    },
    {
      title: 'Wealth',
      description: 'Financial planning and investment growth',
      icon: Coins,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-50',
      route: '/wealth'
    },
    {
      title: 'Trusted Team',
      description: 'Professional advisor coordination',
      icon: Shield,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      route: '/team'
    }
  ];

  const handleFamilyTypeSelect = (familyType: string) => {
    navigate(`/families/${familyType}`);
  };

  const handlePrioritySelect = (route: string) => {
    navigate(route);
  };

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
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to Your Family Office
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose your family's stage to get personalized tools and guidance
          </p>
        </motion.div>

        {/* Family Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          {familyTypes.map((family, index) => {
            const IconComponent = family.icon;
            return (
              <motion.div
                key={family.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="cursor-pointer"
                onClick={() => handleFamilyTypeSelect(family.id)}
              >
                <Card className={`${family.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${family.gradient} flex items-center justify-center`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className={family.badgeColor}>
                        {family.badge}
                      </Badge>
                    </div>
                    <CardTitle className={`text-2xl ${family.textColor} mb-2`}>
                      {family.title}
                    </CardTitle>
                    <p className={`text-lg ${family.textColor} opacity-80`}>
                      {family.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {family.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {family.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${family.gradient}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Priority Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Or Jump Right In
          </h2>
          <p className="text-slate-600 mb-8">
            Start with what matters most to you today
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {priorities.map((priority, index) => {
            const IconComponent = priority.icon;
            return (
              <motion.div
                key={priority.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => handlePrioritySelect(priority.route)}
              >
                <Card className={`${priority.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center`}>
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${priority.color} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {priority.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {priority.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};