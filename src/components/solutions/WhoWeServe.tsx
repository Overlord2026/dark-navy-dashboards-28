import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Building, Briefcase, Trophy } from "lucide-react";

interface ClientSegment {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
}

const clientSegments: ClientSegment[] = [
  {
    id: 'retirees-pre-retirees',
    title: 'Retirees & Pre-Retirees',
    description: 'Comprehensive retirement planning and income strategies for your golden years.',
    icon: Users,
    benefits: [
      'Retirement income planning',
      'Social Security optimization',
      'Healthcare cost management',
      'Legacy planning'
    ]
  },
  {
    id: 'business-owners',
    title: 'Business Owners',
    description: 'Strategic planning for business succession, tax optimization, and wealth preservation.',
    icon: Building,
    benefits: [
      'Business succession planning',
      'Tax-efficient exit strategies',
      'Key person insurance',
      'Retirement plan design'
    ]
  },
  {
    id: 'executives-professionals',
    title: 'Executives & Professionals',
    description: 'Advanced strategies for high-income earners and corporate executives.',
    icon: Briefcase,
    benefits: [
      'Executive compensation planning',
      'Stock option strategies',
      'Deferred compensation',
      'Advanced tax planning'
    ]
  },
  {
    id: 'athletes-entertainers',
    title: 'Athletes & Entertainers',
    description: 'Specialized planning for irregular income and unique financial challenges.',
    icon: Trophy,
    benefits: [
      'Irregular income management',
      'Career transition planning',
      'Asset protection strategies',
      'Tax optimization'
    ]
  }
];

export const WhoWeServe: React.FC = () => {
  const navigate = useNavigate();

  const handleLearnMore = (segment: ClientSegment) => {
    // Navigate to a dedicated page or contact with pre-filled information
    navigate(`/contact?segment=${segment.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">Who We Serve</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our family office services are tailored to meet the unique needs of different client segments.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientSegments.map((segment) => {
          const IconComponent = segment.icon;
          
          return (
            <Card key={segment.id} className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{segment.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {segment.description}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {segment.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLearnMore(segment)}
                className="w-full"
              >
                Learn More
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};