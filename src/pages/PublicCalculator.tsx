import React, { useState } from 'react';
import { PublicValueCalculator } from '@/components/PublicValueCalculator';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, UserPlus } from 'lucide-react';

export default function PublicCalculator() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BFO Calculator</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="hidden sm:flex"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Client Login
            </Button>
            <Button 
              onClick={() => window.open('https://calendly.com/bfo-consultation', '_blank')}
              className="bg-primary hover:bg-primary/90"
            >
              Book Review
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PublicValueCalculator />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 BFO. Actual pricing and services vary by client. Calculator for illustration only.</p>
          <p className="mt-2">
            For a custom proposal, please{' '}
            <button 
              onClick={() => window.open('https://calendly.com/bfo-consultation', '_blank')}
              className="text-primary hover:underline"
            >
              schedule a review
            </button>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}