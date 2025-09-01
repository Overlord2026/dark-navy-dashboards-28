import React from 'react';

export default function PersonaCard(
  { title, children, actions }: { title:string; children?:React.ReactNode; actions?:React.ReactNode }
){
  return (
    <section className="bfo-card p-6 md:p-7 lg:p-8">
      <h3 className="text-xl md:text-2xl font-semibold mb-2">{title}</h3>
      <div className="text-sm md:text-[15px] leading-relaxed opacity-90">{children}</div>
      {actions && <div className="mt-5 flex gap-3 flex-wrap">{actions}</div>}
    </section>
  );
}