
import React from "react";
import { CheckCircle } from "lucide-react";

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      title: "Personalized Service",
      description: "Our advisors provide dedicated attention to your unique financial situation."
    },
    {
      title: "Expertise & Experience",
      description: "Our team brings decades of experience in wealth management and financial planning."
    },
    {
      title: "Fiduciary Responsibility",
      description: "We always act in your best interest, providing objective advice and solutions."
    },
    {
      title: "Comprehensive Approach",
      description: "We address all aspects of your financial life for a holistic wealth strategy."
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-[#1B1B32] text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-1 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Boutique Family Office</h2>
          <div className="space-y-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-1">{point.title}</h3>
                  <p className="text-gray-300">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
