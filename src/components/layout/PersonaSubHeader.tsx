import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode; // e.g., Voice button / CTA
};

export function PersonaSubHeader({ title, subtitle, right }: Props) {
  return (
    <section className="sticky top-[var(--header-h)] z-40 bfo-subheader bfo-no-blur w-full">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="opacity-90 text-sm">{subtitle}</p>}
        </div>
        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </div>
    </section>
  );
}