
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GraduationCap, Landmark, Diamond } from 'lucide-react';
import { useAudience } from '@/context/AudienceContext';

export default function Landing() {
  const navigate = useNavigate();
  const { setCurrentSegment } = useAudience();

  const handleSegmentSelect = (segment: 'aspiring' | 'retiree' | 'uhnw') => {
    setCurrentSegment(segment);
    navigate('/dashboard');
  };

  const segments = [
    {
      id: 'aspiring',
      title: "Aspiring Wealthy",
      subtitle: "Building and growing wealth for a prosperous future",
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      imagePath: "/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png",
      color: "bg-blue-500/10 border-blue-500/30",
      badgeText: "Growth-Focused"
    },
    {
      id: 'retiree',
      title: "Pre-Retirees & Retirees",
      subtitle: "Securing and optimizing retirement wealth",
      icon: <Landmark className="h-8 w-8 text-amber-500" />,
      imagePath: "/lovable-uploads/1721322800607-8c38375eef04.png",
      color: "bg-amber-500/10 border-amber-500/30",
      badgeText: "Income & Preservation"
    },
    {
      id: 'uhnw',
      title: "Ultra High Net Worth",
      subtitle: "Sophisticated wealth management & legacy planning",
      icon: <Diamond className="h-8 w-8 text-indigo-500" />,
      imagePath: "/lovable-uploads/b6a65d03-05d7-4aa4-b33b-e433f9f06314.png",
      color: "bg-indigo-500/10 border-indigo-500/30",
      badgeText: "Legacy-Focused"
    }
  ];

  return (
    <ThreeColumnLayout 
      hideLeftSidebar
      hideRightSidebar
      hideHeader
    >
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#0A1F44] to-[#121221] text-white">
        <div className="w-full max-w-7xl px-4 py-12 md:py-24">
          <div className="text-center mb-16">
            <img 
              src="/lovable-uploads/5d3bcbf7-9c7e-4071-8db1-b7011ac1a630.png" 
              alt="Boutique Family Office Logo" 
              className="h-20 w-auto mx-auto mb-8"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Boutique Family Office</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Personalized wealth management solutions tailored to your financial journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {segments.map((segment) => (
              <Card 
                key={segment.id} 
                className={`border ${segment.color} transition-shadow hover:shadow-lg hover:shadow-${segment.color.split('-')[1]}/10 cursor-pointer bg-black/20 backdrop-blur-sm overflow-hidden`}
                onClick={() => handleSegmentSelect(segment.id as 'aspiring' | 'retiree' | 'uhnw')}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
                  style={{ backgroundImage: `url(${segment.imagePath})` }}
                />
                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm">
                      {segment.icon}
                    </div>
                    <Badge variant="outline" className="backdrop-blur-sm bg-black/30">
                      {segment.badgeText}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mt-4">{segment.title}</CardTitle>
                  <CardDescription className="text-gray-300">{segment.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-2 text-sm">
                    {segment.id === 'aspiring' && (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Building investment portfolio
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Growth-focused investment strategies
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Financial education resources
                        </li>
                      </>
                    )}
                    
                    {segment.id === 'retiree' && (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Retirement income planning
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Tax-efficient withdrawal strategies
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Healthcare cost planning
                        </li>
                      </>
                    )}
                    
                    {segment.id === 'uhnw' && (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          Multi-generational wealth transfer
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          Family governance structures
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          Private investment opportunities
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="relative z-10">
                  <Button className="w-full flex items-center justify-center gap-2">
                    Enter {segment.title} Portal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Are you a financial advisor?</p>
            <Button variant="outline" onClick={() => navigate('/advisor/login')}>
              Access Advisor Portal
            </Button>
          </div>
        </div>
        
        <footer className="w-full py-8 text-center border-t border-white/10">
          <p className="text-gray-400">© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </footer>
      </div>
    </ThreeColumnLayout>
  );
}
