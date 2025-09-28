import React from "react";
import content from "@/content/pricing_content.json";
import { FLAGS } from "@/config/flags";
import { Link } from "react-router-dom";

export default function LegacyBetaSection() {
  if (!FLAGS.legacyBeta) return null;

  const s = (content as any).legacy;
  if (!s) return null;

  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white/80">
      {children}
    </span>
  );

  const Line = ({ label, note, badges = [] as string[] }) => (
    <li className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2">
        {note ? <span className="text-xs text-white/70">{note}</span> : null}
        {badges.map((b) => (
          <Pill key={b}>{b}</Pill>
        ))}
      </span>
    </li>
  );

  return (
    <section id="legacy" className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">{s.headline}</h2>
          <p className="mt-2 text-white/70">{s.subhead}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Families */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Families</h3>
            <ul className="mt-2 divide-y divide-white/10">
              <Line label={s.families.basic.label} note={s.families.basic.note} badges={s.families.basic.badges} />
              <Line label={s.families.advanced.label} note={s.families.advanced.note} badges={s.families.advanced.badges} />
            </ul>
            <p className="mt-3 text-xs text-white/70">
              Advanced Legacy Vault is in active development and will be released after beta hardening.
            </p>
          </div>

          {/* Advisor */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Advisor — Solo</h3>
            <ul className="mt-2 divide-y divide-white/10">
              <Line label="Basic" note={s.advisor.solo_basic.note} badges={s.advisor.solo_basic.badges} />
              <Line label="Premium" note={s.advisor.solo_premium.note} badges={s.advisor.solo_premium.badges} />
            </ul>
            <p className="mt-3 text-xs text-white/70">
              During beta, Premium includes full Legacy to collect effectiveness data.
            </p>
          </div>

          {/* RIA */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">RIA Teams</h3>
            <ul className="mt-2 divide-y divide-white/10">
              <Line label="Under 20 seats" note={s.ria.under_20.note} badges={s.ria.under_20.badges} />
              <Line label="20+ seats" note={s.ria.over_20.note} badges={s.ria.over_20.badges} />
            </ul>
            <p className="mt-3 text-xs text-white/70">
              Seat-gated inclusion helps us measure firm-wide adoption before GA.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to={s.cta.learn_more_href}
            className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            {s.cta.learn_more_label}
          </Link>
        </div>
      </div>
    </section>
  );
}