import { Link } from "react-router-dom";

function PrimaryCTA({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-lg bg-bfo-gold text-bfo-black px-5 py-3 text-sm font-semibold hover:bg-bfo-gold/90 focus:outline-none focus:ring-2 focus:ring-bfo-gold/40"
    >
      {children}
    </Link>
  );
}
function SecondaryCTA({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm text-bfo-ivory hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-bfo-gold/40"
    >
      {children}
    </Link>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-bfo-navy text-bfo-ivory">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Your Boutique Family Office—one secure place for families and professionals to work together.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80">
            Bring your financial picture, documents, and trusted team into a single, compliant workspace—so decisions get made and life keeps moving.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryCTA to="/families">Get started (Family)</PrimaryCTA>
            <SecondaryCTA to="/pros">For Professionals</SecondaryCTA>
          </div>
        </div>
      </div>
    </section>
  );
}
