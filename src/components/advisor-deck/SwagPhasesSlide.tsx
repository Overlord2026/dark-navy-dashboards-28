import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Target, Gift, Clock, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwagPhasesSlideProps {
  liveDemoMode?: boolean;
  whiteLabelEnabled?: boolean;
  presentationMode?: boolean;
}

export const SwagPhasesSlide: React.FC<SwagPhasesSlideProps> = ({
  liveDemoMode,
  whiteLabelEnabled,
  presentationMode
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const phases = [
    {
      id: 0,
      name: 'Income Now',
      icon: Shield,
      color: 'emerald',
      years: 'Years 1-2',
      description: 'Core necessities covered with emergency liquidity',
      details: {
        focus: 'Core living expenses, emergency fund',
        investments: ['High-yield savings', 'Money market', 'CDs', 'Treasury bills'],
        clientConcern: 'Will I have enough cash if something unexpected happens?',
        allocation: '15-25%'
      }
    },
    {
      id: 1,
      name: 'Income Later',
      icon: TrendingUp,
      color: 'blue',
      years: 'Years 3-12',
      description: 'Discretionary spending and low-volatility income',
      details: {
        focus: 'Lifestyle spending, travel, RMDs',
        investments: ['Private credit', 'Income REITs', 'Dividend stocks', 'Bond ladders'],
        clientConcern: 'How do I maintain my lifestyle without market risk?',
        allocation: '30-40%'
      }
    },
    {
      id: 2,
      name: 'Growth',
      icon: Target,
      color: 'purple',
      years: '12+ Years',
      description: 'Long-term wealth creation and growth',
      details: {
        focus: 'Capital appreciation, inflation protection',
        investments: ['Growth equities', 'Private equity', 'Blockchain/crypto', 'International stocks'],
        clientConcern: 'Will my money last and grow enough for the long term?',
        allocation: '25-35%'
      }
    },
    {
      id: 3,
      name: 'Legacy',
      icon: Gift,
      color: 'amber',
      years: 'Ongoing',
      description: 'Estate planning and multi-generational wealth',
      details: {
        focus: 'Family protection, charitable giving',
        investments: ['Life insurance', 'Trust structures', 'Charitable funds', 'Business interests'],
        clientConcern: 'How do I protect and transfer wealth to the next generation?',
        allocation: '10-20%'
      }
    }
  ];

  const getColorClasses = (color: string) => ({
    emerald: 'text-emerald-500 border-emerald-200 bg-emerald-50',
    blue: 'text-blue-500 border-blue-200 bg-blue-50',
    purple: 'text-purple-500 border-purple-200 bg-purple-50',
    amber: 'text-amber-500 border-amber-200 bg-amber-50'
  }[color]);

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            The SWAG™ Framework
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Four <span className="text-primary">SWAG™</span> Phases
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We break retirement into four clear phases. This segmentation helps clients 
            visualize how each dollar is working for them — today, tomorrow, and for generations to come.
          </p>
        </motion.div>

        {/* Timeline Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-amber-500 rounded-full" />
            
            {/* Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedPhase === phase.id ? 'ring-2 ring-primary scale-105' : ''
                    }`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  >
                    <CardHeader className="text-center pb-3">
                      <div className={`mx-auto p-3 rounded-full w-fit ${getColorClasses(phase.color)}`}>
                        <phase.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <Badge variant="outline" className="w-fit mx-auto">
                        {phase.years}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {phase.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Expanded Phase Details */}
        <AnimatePresence>
          {selectedPhase !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <Target className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-semibold">Focus</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {phases[selectedPhase].details.focus}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <Briefcase className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-semibold">Investments</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {phases[selectedPhase].details.investments.map((inv, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                            {inv}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <DollarSign className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-semibold">Allocation</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {phases[selectedPhase].details.allocation}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-semibold">Client Question</h4>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{phases[selectedPhase].details.clientConcern}"
                      </p>
                    </div>
                  </div>
                  
                  {liveDemoMode && (
                    <div className="mt-6 flex justify-center">
                      <Button>
                        View {phases[selectedPhase].name} in Live Demo
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Script Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3">Advisor Script:</h4>
              <p className="text-sm leading-relaxed italic">
                "We break retirement into four clear phases. This segmentation helps clients visualize 
                how each dollar is working for them — today, tomorrow, and for generations to come. 
                Each phase has specific investment strategies and time horizons that align with your 
                changing needs throughout retirement."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};