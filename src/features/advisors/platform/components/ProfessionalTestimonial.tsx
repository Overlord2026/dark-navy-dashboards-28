/**
 * Professional Testimonial Component
 * Premium testimonial display matching Advisor Platform design
 */

import React from 'react';
import { Quote } from 'lucide-react';

interface ProfessionalTestimonialProps {
  quote: string;
  author: string;
  title: string;
  company: string;
  className?: string;
}

export function ProfessionalTestimonial({
  quote,
  author,
  title,
  company,
  className = "",
}: ProfessionalTestimonialProps) {
  return (
    <div className={`bfo-card ${className}`}>
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="bfo-icon-container">
            <Quote className="w-6 h-6" />
          </div>
        </div>
        
        <blockquote className="text-white text-lg leading-relaxed mb-6 font-light">
          "{quote}"
        </blockquote>
        
        <footer className="text-center">
          <p className="text-bfo-gold font-semibold text-base">{author}, {title}</p>
          <p className="text-white/70 text-sm mt-1">{company}</p>
        </footer>
      </div>
    </div>
  );
}