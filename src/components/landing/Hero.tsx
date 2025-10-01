import { ButtonPrimary, ButtonSecondary } from "@/components/ui/ButtonLink";

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
            <ButtonPrimary to="/families">Get started (Family)</ButtonPrimary>
            <ButtonSecondary to="/pros">For Professionals</ButtonSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
