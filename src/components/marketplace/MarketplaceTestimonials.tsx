import React from 'react';
import { Star, Quote } from 'lucide-react';

export const MarketplaceTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Financial Advisor, RIA',
      company: 'Mitchell Wealth Management',
      quote: 'This platform transformed my practice. The lead generation tools alone increased my qualified prospects by 300% in the first quarter.',
      rating: 5,
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Dr. James Chen',
      role: 'Estate Planning Attorney',
      company: 'Chen Legal Group',
      quote: 'The compliance automation saves me 15 hours per week. I can focus on high-value client work instead of paperwork.',
      rating: 5,
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Maria Rodriguez',
      role: 'CPA & Tax Strategist',
      company: 'Rodriguez Tax Advisors',
      quote: 'Having all my clients\' documents in one secure vault with automatic compliance tracking is a game-changer for my practice.',
      rating: 5,
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Michael Thompson',
      role: 'Insurance Specialist',
      company: 'Thompson Benefits Group',
      quote: 'The Medicare compliance tools and call recording features have completely streamlined my workflow while keeping me compliant.',
      rating: 5,
      image: '/api/placeholder/64/64'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h3 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Trusted by Elite Professionals
        </h3>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See how leading advisors, attorneys, and consultants are transforming their practices with our platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <Quote className="w-8 h-8 text-gold" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-emerald rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-gold">{testimonial.company}</p>
                </div>
              </div>
            </div>

            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/10 to-emerald/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-gold/20 to-emerald/20 backdrop-blur-sm border border-gold/30 rounded-2xl p-12 max-w-4xl mx-auto">
          <h4 className="font-serif text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Practice?
          </h4>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using our platform to grow their practices and serve their clients better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-gold to-gold/90 text-navy font-bold px-8 py-4 rounded-lg hover:from-gold/90 hover:to-gold hover:shadow-lg transition-all duration-300">
              Start Free Trial
            </button>
            <button className="border-2 border-emerald text-emerald font-semibold px-8 py-4 rounded-lg hover:bg-emerald hover:text-white transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};