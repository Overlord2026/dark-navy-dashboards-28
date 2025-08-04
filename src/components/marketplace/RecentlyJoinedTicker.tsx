import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecentlyJoinedProfessional {
  id: string;
  name: string;
  title: string;
  company?: string;
  profile_photo_url?: string;
  created_at: string;
}

const RecentlyJoinedTicker: React.FC = () => {
  const [professionals, setProfessionals] = useState<RecentlyJoinedProfessional[]>([]);

  useEffect(() => {
    const fetchRecentProfessionals = async () => {
      try {
        // Use advisor_profiles table instead of professional_profiles
        const { data, error } = await supabase
          .from('advisor_profiles')
          .select('id, name, expertise_areas, firm_name, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // Add some mock data if no real data exists
        const mockData = data?.length ? data.map(item => ({
          id: item.id,
          name: item.name,
          title: item.expertise_areas?.[0] || 'Financial Professional',
          company: item.firm_name || 'Independent',
          created_at: item.created_at
        })) : [
          { id: '1', name: 'Sarah Chen', title: 'Wealth Advisor', company: 'Goldman Sachs', created_at: new Date().toISOString() },
          { id: '2', name: 'Michael Rodriguez', title: 'Estate Attorney', company: 'Baker McKenzie', created_at: new Date().toISOString() },
          { id: '3', name: 'Jennifer Park', title: 'Tax Strategist', company: 'KPMG', created_at: new Date().toISOString() },
          { id: '4', name: 'David Thompson', title: 'Private Banker', company: 'JP Morgan', created_at: new Date().toISOString() },
          { id: '5', name: 'Lisa Wang', title: 'Financial Planner', company: 'Morgan Stanley', created_at: new Date().toISOString() },
        ];

        setProfessionals(mockData as RecentlyJoinedProfessional[]);
      } catch (error) {
        console.error('Error fetching recent professionals:', error);
      }
    };

    fetchRecentProfessionals();
  }, []);

  if (professionals.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-y border-border/50">
      <div className="relative flex">
        <motion.div
          className="flex space-x-8 py-4"
          animate={{
            x: [-1000, 0]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...professionals, ...professionals].map((professional, index) => (
            <div
              key={`${professional.id}-${index}`}
              className="flex items-center space-x-3 whitespace-nowrap min-w-max"
            >
              <Avatar className="w-8 h-8 border-2 border-primary/20">
                <AvatarImage src={professional.profile_photo_url} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <span className="font-semibold text-foreground">{professional.name}</span>
                <span className="text-muted-foreground ml-2">
                  {professional.title} {professional.company && `at ${professional.company}`}
                </span>
                <span className="text-primary ml-2 font-medium">joined recently</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RecentlyJoinedTicker;