
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, Users, BarChart3, ShieldCheck } from "lucide-react";
import { BrandedHeader } from '@/components/layout/BrandedHeader';

export default function AdvisorLanding() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Client Management",
      description: "Manage your client relationships and access tools designed for high-net-worth individuals.",
      icon: <Users size={24} className="text-[#FFC700]" />,
    },
    {
      title: "Portfolio Analytics",
      description: "Access advanced portfolio analytics and insights tailored for sophisticated investors.",
      icon: <BarChart3 size={24} className="text-[#FFC700]" />,
    },
    {
      title: "Wealth Strategies",
      description: "Exclusive wealth management strategies and planning tools for ultra-high net worth clients.",
      icon: <BriefcaseIcon size={24} className="text-[#FFC700]" />,
    },
    {
      title: "Data Security",
      description: "Bank-level security and privacy protocols to protect sensitive client information.",
      icon: <ShieldCheck size={24} className="text-[#FFC700]" />,
    }
  ];

  const handleLogin = () => {
    navigate('/advisor/login');
  };

  const handleDashboard = () => {
    navigate('/advisor/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1E3A] text-white">
      <BrandedHeader />
      
      <main className="flex-grow pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#FFC700]">Advisor Portal</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Access powerful tools and resources to better serve your high-net-worth clientele
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDashboard}
                className="bg-[#FFC700] text-[#0F1E3A] hover:bg-[#E0B000] font-medium px-8 py-6 text-lg"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={handleLogin}
                variant="outline" 
                className="border-[#FFC700] text-[#FFC700] hover:bg-[#FFC700]/10"
              >
                Advisor Login
              </Button>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-[#162B4D] border-[#2A3E5C] shadow-lg">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="bg-[#162B4D] border border-[#2A3E5C] rounded-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#FFC700]">Ready to elevate your advisory practice?</h2>
            <p className="mb-6 text-gray-300 max-w-3xl mx-auto">
              Our family office platform provides you with the tools and resources you need to deliver exceptional service to your high-value clients.
            </p>
            <Button 
              onClick={handleDashboard}
              className="bg-[#FFC700] text-[#0F1E3A] hover:bg-[#E0B000] font-medium"
            >
              Access Advisor Dashboard
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-8 bg-[#0A1429] text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
