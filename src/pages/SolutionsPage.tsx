import React from 'react';
import { Routes, Route } from 'react-router-dom';

const SolutionsLanding = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Platform Solutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technology solutions and integration partners to streamline your family office operations.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Platform Solutions</h2>
            <div className="space-y-4">
              {[
                { title: 'Family Office Platform', href: '/solutions/family-office', description: 'Complete family office management solution' },
                { title: 'Advisor Tools', href: '/solutions/advisor-tools', description: 'Professional tools for advisors and service providers' },
                { title: 'Compliance Suite', href: '/solutions/compliance', description: 'Regulatory compliance and reporting tools' }
              ].map((solution) => (
                <div key={solution.href} className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">{solution.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{solution.description}</p>
                  <a href={solution.href} className="text-primary font-medium hover:underline">
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Integration Partners</h2>
            <div className="space-y-4">
              {[
                { title: 'CRM Integration', href: '/solutions/crm-integration', description: 'Seamless CRM platform integrations' },
                { title: 'Portfolio Management', href: '/solutions/portfolio-management', description: 'Investment management system integrations' },
                { title: 'Document Management', href: '/solutions/document-management', description: 'Secure document storage and sharing' }
              ].map((integration) => (
                <div key={integration.href} className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">{integration.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{integration.description}</p>
                  <a href={integration.href} className="text-primary font-medium hover:underline">
                    View Integration →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SolutionPage = ({ title, content }: { title: string; content: string }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-muted-foreground">{content}</p>
      </div>
    </div>
  </div>
);

export const SolutionsPage = () => {
  return (
    <Routes>
      <Route index element={<SolutionsLanding />} />
      <Route path="family-office" element={<SolutionPage title="Family Office Platform" content="Comprehensive family office management solution with integrated tools and services." />} />
      <Route path="advisor-tools" element={<SolutionPage title="Advisor Tools" content="Professional tools and resources for financial advisors and service providers." />} />
      <Route path="compliance" element={<SolutionPage title="Compliance Suite" content="Complete regulatory compliance and reporting solution for family offices." />} />
      <Route path="crm-integration" element={<SolutionPage title="CRM Integration" content="Seamless integration with leading CRM platforms." />} />
      <Route path="portfolio-management" element={<SolutionPage title="Portfolio Management" content="Integration with top portfolio management systems." />} />
      <Route path="document-management" element={<SolutionPage title="Document Management" content="Secure document storage, sharing, and collaboration tools." />} />
    </Routes>
  );
};