
import React from 'react';

export const BrandedBanner = () => {
  return (
    <div className="w-full">
      {/* Top banner with the gold triangle logo and BOUTIQUE FAMILY OFFICE text */}
      <div className="bg-[#0A1429] text-white px-4 py-3 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="text-[#FFC700]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 21h22L12 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-wide">BOUTIQUE FAMILY OFFICE</h1>
        </div>
        <p className="text-[#FFC700] mx-auto uppercase">ORGANIZE & MAXIMIZE</p>
      </div>

      {/* Main banner with tree logo, office name and slogan */}
      <div className="bg-[#000817] text-white px-4 py-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/1c331436-5c36-4643-8043-7d9fe86693a1.png" 
            alt="Boutique Family Office Tree Logo"
            className="h-20 w-auto"
          />
          <div className="text-left">
            <h1 className="text-4xl font-bold tracking-wider text-white">BOUTIQUE</h1>
            <h1 className="text-4xl font-bold tracking-wider text-white">FAMILY OFFICE<span className="text-sm align-top">TM</span></h1>
            <p className="text-[#FFC700] text-xl">Organize & Maximize</p>
          </div>
        </div>
        <p className="text-white text-sm mt-4 uppercase tracking-wider">
          YOUR PERSONALIZED PATH TO LASTING PROSPERITY
        </p>
      </div>
    </div>
  );
};
