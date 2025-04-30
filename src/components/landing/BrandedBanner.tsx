
import React from 'react';

export const BrandedBanner = () => {
  return (
    <div className="w-full">
      {/* Top banner with the gold triangle logo and BOUTIQUE FAMILY OFFICE text */}
      <div className="bg-[#0A1429] text-white px-4 py-3 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="text-[#FFC700]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 21h22L12 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-wide">BOUTIQUE FAMILY OFFICE</h1>
          </div>
          <p className="text-[#FFC700] mt-1">ORGANIZE & MAXIMIZE</p>
        </div>
      </div>

      {/* Larger banner with full logo and slogan */}
      <div className="bg-[#0F1E3A] text-white px-4 py-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-1">
          <img 
            src="/lovable-uploads/662c8baf-d7bf-48cb-bf88-064f96589714.png" 
            alt="Boutique Family Office Full Logo"
            className="h-32 w-auto"
          />
        </div>
        <p className="text-white text-sm mt-2 uppercase tracking-wider">
          YOUR PERSONALIZED PATH TO LASTING PROSPERITY
        </p>
      </div>
    </div>
  );
};
