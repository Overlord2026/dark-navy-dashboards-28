import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Your Boutique Family Office —
            <span className="text-bfo-gold"> plan better, learn faster,</span> work with trusted pros.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80">
            Explore our free catalog, take pro-led courses, and upgrade anytime to unlock advanced tools for
            families and service professionals.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center rounded-lg bg-bfo-gold text-bfo-black px-5 py-3 font-medium hover:bg-bfo-gold/90"
            >
              Explore the Catalog
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center rounded-lg border border-bfo-gold/40 px-5 py-3 font-medium hover:bg-white/5"
            >
              See Plans
            </Link>
            <Link
              to="/learn"
              className="inline-flex items-center rounded-lg border border-white/15 px-5 py-3 font-medium hover:bg-white/5"
            >
              Education Center
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/families"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:bg-white/10"
            >
              <div className="text-sm uppercase tracking-widest opacity-60">For Families</div>
              <div className="text-lg font-semibold">Choose your path: Aspiring or Retirees →</div>
            </Link>
            <Link
              to="/pros"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:bg-white/10"
            >
              <div className="text-sm uppercase tracking-widest opacity-60">For Service Professionals</div>
              <div className="text-lg font-semibold">Advisors, CPAs, Attorneys →</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}