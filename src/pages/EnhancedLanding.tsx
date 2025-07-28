import React from 'react';
import { EnhancedLandingPage } from '@/components/landing/EnhancedLandingPage';
import { TestimonialRotator } from '@/components/testimonials/TestimonialRotator';

export default function EnhancedLanding() {
  return (
    <div className="min-h-screen">
      <EnhancedLandingPage />
      
      {/* Additional Sections */}
      <section className="py-16 bg-white/80">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories from Our Community
          </h2>
          <TestimonialRotator variant="featured" />
        </div>
      </section>
    </div>
  );
}