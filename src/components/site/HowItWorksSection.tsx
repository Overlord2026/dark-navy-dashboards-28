import { Link } from "react-router-dom";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our proven 3-step process helps families organize, optimize, and orchestrate their wealth across generations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Capture</h3>
            <p className="text-muted-foreground">
              We gather your complete financial picture—assets, goals, concerns, and family dynamics—to understand what matters most.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Meet</h3>
            <p className="text-muted-foreground">
              Your dedicated advisor reviews everything, identifies opportunities, and presents a customized strategy that fits your family's unique needs.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Plan</h3>
            <p className="text-muted-foreground">
              We coordinate implementation across investments, tax, estate, insurance, and healthcare—with ongoing monitoring and adjustments.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Ready to experience the difference of a truly coordinated family office?
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </section>
  );
}