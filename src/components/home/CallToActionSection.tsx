
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CallToActionSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 px-4 bg-[#F9F7E8]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#222222]">Ready to Secure Your Financial Future?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Take the first step towards comprehensive wealth management with Boutique Family Office. Our advisors are ready to help you achieve your financial goals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-black text-white hover:bg-black/80" asChild>
            <Link to="/client-portal">Access Client Portal</Link>
          </Button>
          <Button size="lg" className="bg-black text-white hover:bg-black/80" asChild>
            <Link to="/contact">Contact an Advisor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
