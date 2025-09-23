import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  Calendar,
  Briefcase,
  PhoneCall,
  Mail,
  FileText
} from 'lucide-react';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

export default function AdvisorsHome() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Client Management',
      description: 'Manage your client relationships and portfolios',
      icon: Users,
      action: () => navigate('/advisors/clients'),
      gradient: 'from-bfo-purple to-bfo-purple/80'
    },
    {
      title: 'ROI Tracker',
      description: 'Track marketing performance and campaign ROI',
      icon: TrendingUp,
      action: () => navigate('/advisors/roi-tracker'),
      gradient: 'from-bfo-gold to-bfo-gold/80'
    },
    {
      title: 'Tools & Analytics',
      description: 'Access advisor tools and client analytics',
      icon: BarChart3,
      action: () => navigate('/tools'),
      gradient: 'from-bfo-emerald to-bfo-emerald/80'
    },
    {
      title: 'Meetings',
      description: 'Schedule and manage client meetings',
      icon: Calendar,
      action: () => navigate('/meetings'),
      gradient: 'from-bfo-blue to-bfo-blue/80'
    }
  ];

  const metrics = [
    { label: 'Active Clients', value: '156', change: '+8%', icon: Users },
    { label: 'Monthly AUM', value: '$12.4M', change: '+12.3%', icon: DollarSign },
    { label: 'Conversion Rate', value: '24.5%', change: '+2.1%', icon: Target },
    { label: 'Portfolio Performance', value: '8.7%', change: '+1.4%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-bfo-black p-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bfo-card border border-bfo-gold p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Advisor Dashboard</h1>
            <p className="text-white/70 text-lg">
              Your comprehensive platform for client management and business growth
            </p>
          </div>
          
          <div className="flex gap-3">
            <GoldOutlineButton onClick={() => navigate('/professionals')}>
              <Briefcase className="w-4 h-4 mr-2" />
              Professional Network
            </GoldOutlineButton>
            <GoldButton onClick={() => navigate('/advisors/roi-tracker')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              View ROI Tracker
            </GoldButton>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <div key={metric.label} className="bfo-card border border-bfo-gold/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-8 h-8 text-bfo-gold" />
              <span className="text-bfo-emerald text-sm font-medium">{metric.change}</span>
            </div>
            <div className="space-y-1">
              <p className="text-white text-2xl font-bold">{metric.value}</p>
              <p className="text-white/60 text-sm">{metric.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-white text-2xl font-semibold">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className={`bfo-card border border-bfo-gold/30 p-6 cursor-pointer hover:border-bfo-gold transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${action.gradient} bg-opacity-10`}
              onClick={action.action}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <action.icon className="w-6 h-6 text-bfo-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-white/70 text-sm">{action.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Activity */}
        <div className="lg:col-span-2 bfo-card border border-bfo-gold/30 p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <PhoneCall className="w-5 h-5 text-bfo-gold" />
              <div className="flex-1">
                <p className="text-white text-sm">Client meeting scheduled with Johnson Family</p>
                <p className="text-white/60 text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Mail className="w-5 h-5 text-bfo-blue" />
              <div className="flex-1">
                <p className="text-white text-sm">Portfolio review sent to 5 clients</p>
                <p className="text-white/60 text-xs">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <FileText className="w-5 h-5 text-bfo-emerald" />
              <div className="flex-1">
                <p className="text-white text-sm">Q4 compliance report completed</p>
                <p className="text-white/60 text-xs">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Tools */}
        <div className="bfo-card border border-bfo-gold/30 p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Professional Tools</h3>
          <div className="space-y-3">
            <GoldOutlineButton 
              onClick={() => navigate('/tools/retirement-analyzer')}
              className="w-full justify-start"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Retirement Analyzer
            </GoldOutlineButton>
            <GoldOutlineButton 
              onClick={() => navigate('/tools/portfolio-optimizer')}
              className="w-full justify-start"
            >
              <Target className="w-4 h-4 mr-2" />
              Portfolio Optimizer
            </GoldOutlineButton>
            <GoldOutlineButton 
              onClick={() => navigate('/professionals')}
              className="w-full justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              Professional Network
            </GoldOutlineButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}