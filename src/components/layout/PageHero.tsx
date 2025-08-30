import React from 'react';

type Props = { 
  title: string; 
  subtitle?: string; 
  children?: React.ReactNode; 
};

export function PageHero({ title, subtitle, children }: Props) {
  return (
    <section className="w-full bg-black text-white gold-border">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-2 text-white/80">{subtitle}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </section>
  );
}