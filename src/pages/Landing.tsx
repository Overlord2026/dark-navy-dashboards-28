
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const segments = [
    { id: "aspiring", label: "Aspiring Wealthy" },
    { id: "preretirees", label: "Pre-Retirees & Retirees" },
    { id: "ultrahnw", label: "Ultra-High Net Worth" },
  ];

  return (
    <ThreeColumnLayout 
      hideLeftSidebar
      hideRightSidebar
      hideHeader
    >
      <div className="flex flex-col items-center min-h-screen bg-[#0A1F44] text-white">
        <div className="w-full max-w-7xl px-4 py-12 md:py-24">
          <div className="landing-header text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Organize & Maximize</h1>
            <img 
              src="/lovable-uploads/5d3bcbf7-9c7e-4071-8db1-b7011ac1a630.png" 
              alt="Boutique Family Office" 
              className="h-20 w-auto mx-auto mb-8" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="p-6 rounded-lg bg-black/20 hover:bg-black/30 border border-[#D4AF37]/20 cursor-pointer transition flex flex-col"
                onClick={() => navigate(`/dashboard?segment=${seg.id}`)}
              >
                <h2 className="text-2xl font-semibold text-[#D4AF37] mb-2">{seg.label}</h2>
                <p className="text-gray-300 mb-4">Click to enter your customized experience</p>
                <div className="mt-auto self-end text-[#D4AF37]">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Are you a financial advisor?</p>
            <button 
              onClick={() => navigate('/advisor/login')}
              className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#D4AF37]/10"
            >
              Access Advisor Portal
            </button>
          </div>
        </div>
        
        <footer className="w-full py-8 text-center border-t border-white/10">
          <p className="text-gray-400">© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </footer>
      </div>
    </ThreeColumnLayout>
  );
}
