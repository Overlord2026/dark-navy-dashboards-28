// TODO: flesh out per /out/Advisor_UX_Wireframes.md
import React from 'react';
import { useParams } from 'react-router-dom';

export default function AdvisorProfile() {
  const { id } = useParams();
  
  return (
    <div className="px-6 md:px-10 py-10 text-white">
      <div className="bfo-card p-6 max-w-3xl">
        {/* Hero section with advisor info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-[#2b3b4e] overflow-hidden">
            {/* Placeholder for advisor avatar */}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Advisor Profile</h1>
            <p className="text-gray-400">Senior Financial Advisor</p>
          </div>
          <div className="ml-auto text-[var(--bfo-gold)]">★ 4.9</div>
        </div>
        
        <div className="text-gray-300 mb-4">
          <p>Experience: 15+ years</p>
          <p>Location: New York, NY</p>
        </div>
        
        <div className="flex gap-2 flex-wrap mb-6">
          <span className="bfo-chip text-xs">Retirement</span>
          <span className="bfo-chip text-xs">Estate Planning</span>
        </div>
        
        {/* Contact form */}
        <div className="mt-6 space-y-3">
          <button className="px-4 py-2 border border-[var(--bfo-gold)] text-[var(--bfo-gold)] rounded hover:bg-[var(--bfo-gold)] hover:text-black transition">
            Contact This Advisor
          </button>
          <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-[#152234] ml-2">
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}