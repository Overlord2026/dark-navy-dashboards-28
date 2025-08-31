import React from 'react';
import { Link } from 'react-router-dom';

export default function RetireeGoals(){
  const [goals,setGoals]=React.useState([
    { id:'g1', title:'Bucket-list trip to Tuscany', status:'Planned' },
    { id:'g2', title:'Fund 10 yrs of healthcare gap', status:'In progress' },
    { id:'g3', title:'Legacy gifts to grandchildren', status:'Planned' },
  ]);
  return (
    <div className="px-6 md:px-10 py-8 text-white">
      <h1 className="text-2xl font-semibold mb-4">Retiree Goals</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="bfo-card p-5">
          <h2 className="text-[var(--bfo-gold)] font-semibold mb-3">Your Goals</h2>
          <ul className="grid gap-3">
            {goals.map(g=>(
              <li key={g.id} className="flex items-center justify-between bg-black/30 rounded px-3 py-2 border border-white/5">
                <span>{g.title}</span>
                <span className="bfo-chip text-xs">{g.status}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-2 border border-[var(--bfo-gold)] text-[var(--bfo-gold)] rounded hover:bg-[var(--bfo-gold)] hover:text-black">Add Goal</button>
            <Link to="/tools/retirement-roadmap" className="px-3 py-2 bg-[var(--bfo-gold)] text-black rounded hover:opacity-90">Open Retirement Roadmap</Link>
          </div>
        </section>

        <section className="bfo-card p-5">
          <h2 className="text-[var(--bfo-gold)] font-semibold mb-3">Next best actions</h2>
          <ol className="list-decimal ml-5 grid gap-2 text-gray-200">
            <li>Upload last 12 months 401(k)/IRA statements.</li>
            <li>Connect Social Security estimate (SSA PDF).</li>
            <li>Answer 5-min spending/longevity prompts.</li>
          </ol>
          <div className="mt-4 text-sm text-gray-400">Every step auto-creates a content-free receipt.</div>
        </section>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="bfo-stat"><div className="text-3xl text-[var(--bfo-gold)]">500+</div><div>Family Advisors</div></div>
        <div className="bfo-stat"><div className="text-3xl text-[var(--bfo-gold)]">$4B+</div><div>Assets Protected</div></div>
        <div className="bfo-stat"><div className="text-3xl text-[var(--bfo-gold)]">100%</div><div>U.S. Based</div></div>
        <div className="bfo-stat"><div className="text-3xl text-[var(--bfo-gold)]">40+</div><div>Years Experience</div></div>
      </div>
    </div>
  );
}