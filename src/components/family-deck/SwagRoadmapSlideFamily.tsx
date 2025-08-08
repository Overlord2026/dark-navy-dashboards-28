import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Target, Gift, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SwagRoadmapSlideFamilyProps {
  presentationMode?: boolean;
}

export const SwagRoadmapSlideFamily: React.FC<SwagRoadmapSlideFamilyProps> = ({
  presentationMode
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(0);

  const phases = [
    {
      id: 0,
      name: 'Income Now',
      icon: Shield,
      color: 'blue',
      years: 'Years 1-2',
      description: 'Core living expenses secured',
      details: 'Housing, food, utilities, healthcare, transportation - all the essentials your family needs.',
      allocation: '15-25%',
      examples: ['Emergency fund', 'High-yield savings', 'Short-term CDs']
    },
    {
      id: 1,
      name: 'Income Later',
      icon: TrendingUp,
      color: 'green',
      years: 'Years 3-12',
      description: 'Discretionary spending planned & protected',
      details: 'Travel, hobbies, grandchildren, and lifestyle expenses with steady income streams.',
      allocation: '30-40%',
      examples: ['Dividend stocks', 'Bond ladders', 'Real estate income']
    },
    {
      id: 2,
      name: 'Growth',
      icon: Target,
      color: 'purple',
      years: '12+ Years',
      description: 'Long-term investment strategies',
      details: 'Wealth building for the long haul, protecting against inflation and growing your legacy.',
      allocation: '25-35%',
      examples: ['Growth stocks', 'Private equity', 'International funds']
    },
    {
      id: 3,
      name: 'Legacy',
      icon: Gift,
      color: 'amber',
      years: 'Ongoing',
      description: 'Estate & legacy planning',
      details: 'Protecting and transferring wealth to your children, grandchildren, and favorite causes.',
      allocation: '10-20%',
      examples: ['Life insurance', 'Trust planning', 'Charitable giving']
    }
  ];

  const getColorClasses = (color: string) => ({
    blue: 'text-blue-500 border-blue-200 bg-blue-50',
    green: 'text-green-500 border-green-200 bg-green-50',
    purple: 'text-purple-500 border-purple-200 bg-purple-50',
    amber: 'text-amber-500 border-amber-200 bg-amber-50'
  }[color]);

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-blue-50 via-background to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800">
            Your Family's Financial Roadmap
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-blue-600">SWAG™</span> Retirement Roadmap
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A clear, four-phase strategy that ensures your family has what they need, 
            when they need it — from today's expenses to tomorrow's legacy.
          </p>
        </motion.div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-amber-500 rounded-full" />
            
            {/* Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
                      selectedPhase === phase.id ? 'ring-2 ring-blue-500 scale-105' : ''
                    }`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  >
                    {/* Timeline Connector */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full" />
                    
                    <CardContent className="p-6 text-center pt-8">
                      <div className={`mx-auto p-3 rounded-full w-fit mb-4 ${getColorClasses(phase.color)}`}>
                        <phase.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{phase.name}</h3>
                      <Badge variant="outline" className="mb-3">
                        {phase.years}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-4">
                        {phase.description}
                      </p>
                      <div className="text-xs text-blue-600 font-medium">
                        {phase.allocation} of portfolio
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Phase Information */}
        {selectedPhase !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-800">
                      {phases[selectedPhase].name} Phase
                    </h3>
                    <p className="text-lg mb-6 text-blue-700">
                      {phases[selectedPhase].details}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span><strong>Timeline:</strong> {phases[selectedPhase].years}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-800">Common Investment Types:</h4>
                    <ul className="space-y-2">
                      {phases[selectedPhase].examples.map((example, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                          {example}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {phases[selectedPhase].allocation}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Recommended allocation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Family-Focused Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">
                Every Dollar Has a Purpose. Every Phase Has a Plan.
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                This isn't just about money — it's about giving your family peace of mind. 
                From today's security to tomorrow's dreams, we'll help you build a roadmap 
                that adapts as your life changes.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Build Your Family's Roadmap
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};