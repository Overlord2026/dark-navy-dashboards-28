import React from 'react';

const EducationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Education Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about wealth management, tax planning, estate planning, and financial strategies.
            </p>
          </header>
          
          <div className="text-center text-muted-foreground">
            <p>Education content coming soon...</p>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationPage;