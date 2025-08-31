import React from 'react';
import AdvisorCard from '@/components/marketplace/AdvisorCard';

const DATA = [
  { id: '1', name: 'Sarah Johnson', title: 'Senior Financial Advisor', rating: 4.9, tags: ['Retirement', 'Estate'], location: 'New York, NY', years: '15+ years' },
  { id: '2', name: 'Michael Chen', title: 'Wealth Mgmt Specialist', rating: 4.8, tags: ['Investment', 'Tax'], location: 'San Francisco, CA', years: '12+ years' },
  { id: '3', name: 'Olivia Rodriguez', title: 'Family Wealth Advisor', rating: 4.7, tags: ['Family Office', 'Inheritance'], location: 'Chicago, IL', years: '10+ years' },
];

const TAGS = ['All', 'Retirement', 'Estate', 'Investment', 'Tax', 'Family Office', 'Inheritance'];

export default function MarketplaceAdvisors() {
  const [tag, setTag] = React.useState('All');
  const filtered = tag === 'All' ? DATA : DATA.filter(a => a.tags.includes(tag));

  return (
    <div className="px-6 md:px-10 py-10">
      <h2 className="text-3xl text-white font-semibold mb-6">
        Meet Our <span className="text-teal-300">Expert Advisors</span>
      </h2>
      <div className="flex gap-2 flex-wrap mb-6">
        {TAGS.map(t => (
          <button 
            key={t} 
            onClick={() => setTag(t)} 
            className={`px-3 py-1 rounded ${
              t === tag 
                ? 'bg-[var(--bfo-gold)] text-black' 
                : 'border border-[var(--bfo-gold)] text-[var(--bfo-gold)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(a => <AdvisorCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}