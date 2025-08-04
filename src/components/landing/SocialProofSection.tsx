import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SocialProofSection: React.FC = () => {
  const [weeklyJoiners, setWeeklyJoiners] = useState(189);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count } = await supabase
          .from('professional_profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());
        
        if (count !== null) {
          setWeeklyJoiners(count);
        }
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      }
    };

    fetchWeeklyStats();
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      title: "Wealth Advisor, Goldman Sachs",
      content: "This platform connected me with 3 new UHNW families in my first month. The LinkedIn integration made setup effortless.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      title: "Estate Attorney",
      content: "Finally, a marketplace that understands the family office ecosystem. My practice has grown 40% since joining.",
      rating: 5
    },
    {
      name: "Jennifer Park",
      title: "Tax Strategist, KPMG",
      content: "The quality of referrals is exceptional. These are exactly the type of sophisticated clients I want to work with.",
      rating: 5
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            <motion.span
              key={weeklyJoiners}
              initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
              animate={{ scale: 1, color: 'inherit' }}
              transition={{ duration: 0.3 }}
            >
              {weeklyJoiners} professionals joined this month!
            </motion.span>
          </Badge>
          
          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>2,500+ Elite Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current text-yellow-500" />
              <span>4.9/5 Average Rating</span>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
            <Star className="w-5 h-5 fill-current text-primary" />
            <span className="font-semibold text-primary">Trusted by Top Financial Professionals</span>
            <Badge variant="secondary" className="ml-2">Verified</Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialProofSection;