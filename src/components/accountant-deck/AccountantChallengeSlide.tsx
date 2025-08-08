import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccountantChallengeSlideProps {
  presentationMode?: boolean;
}

export const AccountantChallengeSlide: React.FC<AccountantChallengeSlideProps> = ({
  presentationMode
}) => {
  const challenges = [
    {
      title: 'Fee Compression',
      stat: '23%',
      description: 'Average fee reduction over past 5 years',
      icon: TrendingDown,
      color: 'text-red-500',
      detail: 'Technology and competition driving down traditional accounting fees'
    },
    {
      title: 'Client Attrition',
      stat: '31%',
      description: 'Clients switch accountants within 3 years',
      icon: Users,
      color: 'text-orange-500',
      detail: 'Lack of value-added services beyond compliance'
    },
    {
      title: 'Limited Differentiation',
      stat: '67%',
      description: 'Of accounting firms offer identical services',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      detail: 'Commoditized services with no competitive advantage'
    },
    {
      title: 'Compliance Burden',
      stat: '40%',
      description: 'Of time spent on regulatory requirements',
      icon: DollarSign,
      color: 'text-blue-500',
      detail: 'Administrative overhead reducing billable hours'
    }
  ];

  const painPoints = [
    'Clients viewing accounting as a commodity service',
    'Difficulty justifying premium pricing',
    'Seasonal revenue fluctuations',
    'Limited growth opportunities beyond compliance',
    'Younger clients seeking digital-first solutions',
    'Competition from online tax preparation services'
  ];

  return (
    <div className="min-h-[600px] p-8 md:p-16 bg-gradient-to-br from-background to-red-50/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-red-600 border-red-200">
            Industry Challenges
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-red-600">Challenge</span> Facing Accountants
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The accounting industry is under pressure. Traditional services are being commoditized, 
            fees are declining, and clients are demanding more value.
          </p>
        </motion.div>

        {/* Challenge Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {challenges.map((challenge, index) => (
            <Card key={index} className="text-center border-red-100 bg-red-50/50">
              <CardContent className="p-6">
                <challenge.icon className={`h-12 w-12 mx-auto mb-4 ${challenge.color}`} />
                <div className={`text-4xl font-bold mb-2 ${challenge.color}`}>
                  {challenge.stat}
                </div>
                <h3 className="font-semibold mb-2">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {challenge.description}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  {challenge.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Pain Points Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-red-800 text-center">
                Common Pain Points Across the Industry
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {painPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* The Dilemma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Current State */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-red-800">Current Reality</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm">Reactive compliance work only</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm">Annual touchpoints with clients</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm">Limited visibility into client needs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span className="text-sm">Competing on price not value</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What Clients Want */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-green-800">What Clients Want</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Proactive financial guidance</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Year-round strategic planning</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Holistic wealth management</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm">Technology-enabled solutions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Solution Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-green-800">
                The Gap is Your Opportunity
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Clients need comprehensive financial guidance, but most accountants only provide compliance. 
                Bridge this gap and transform your practice into a trusted advisory relationship.
              </p>
              <Badge className="bg-green-600 text-white px-6 py-2 text-base">
                Introducing the Solution
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};