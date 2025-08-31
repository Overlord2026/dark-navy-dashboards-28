import React from 'react';

type Advisor = {
  id: string;
  name: string;
  title: string;
  rating: number;
  tags: string[];
  location: string;
  years: string;
  avatar?: string;
};

export default function AdvisorCard({ a }: { a: Advisor }) {
  return (
    <div className="bfo-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-[#2b3b4e] overflow-hidden">
          {a.avatar && <img src={a.avatar} alt={a.name} />}
        </div>
        <div>
          <div className="text-white font-semibold">{a.name}</div>
          <div className="text-gray-400 text-sm">{a.title}</div>
        </div>
        <div className="ml-auto text-[var(--bfo-gold)]">★ {a.rating.toFixed(1)}</div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {a.tags.map(t => <span key={t} className="bfo-chip text-xs">{t}</span>)}
      </div>
      <div className="text-gray-400 text-sm">Experience: {a.years}</div>
      <div className="text-gray-400 text-sm">Location: {a.location}</div>
      <button className="mt-2 px-4 py-2 border border-[var(--bfo-gold)] text-[var(--bfo-gold)] rounded hover:bg-[var(--bfo-gold)] hover:text-black transition">
        View Profile
      </button>
    </div>
  );
}