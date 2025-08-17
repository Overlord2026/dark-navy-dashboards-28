import React from 'react';
import { Routes, Route } from 'react-router-dom';

const ResourcesLanding = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Resources & Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial planning tools, calculators, and educational resources.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Financial Planning</h2>
            <div className="space-y-4">
              {[
                { title: 'Investment Planning', href: '/resources/investment-planning', description: 'Portfolio construction and investment strategies' },
                { title: 'Retirement Planning', href: '/resources/retirement-planning', description: 'Retirement income and savings strategies' },
                { title: 'Estate Planning', href: '/resources/estate-planning', description: 'Wealth transfer and legacy planning' }
              ].map((resource) => (
                <div key={resource.href} className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{resource.description}</p>
                  <a href={resource.href} className="text-primary font-medium hover:underline">
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Tools & Calculators</h2>
            <div className="space-y-4">
              {[
                { title: 'Retirement Calculator', href: '/resources/retirement-calculator', description: 'Calculate retirement savings needs' },
                { title: 'Estate Tax Calculator', href: '/resources/estate-tax-calculator', description: 'Estimate estate tax liability' },
                { title: 'Investment Returns', href: '/resources/investment-returns', description: 'Project investment growth scenarios' }
              ].map((tool) => (
                <div key={tool.href} className="p-4 bg-card border border-border rounded-lg">
                  <h3 className="text-lg font-medium text-foreground mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{tool.description}</p>
                  <a href={tool.href} className="text-primary font-medium hover:underline">
                    Use Calculator →
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

const ResourcePage = ({ title, content }: { title: string; content: string }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-muted-foreground">{content}</p>
      </div>
    </div>
  </div>
);

export const ResourcesPage = () => {
  return (
    <Routes>
      <Route index element={<ResourcesLanding />} />
      <Route path="investment-planning" element={<ResourcePage title="Investment Planning" content="Comprehensive investment planning resources and strategies." />} />
      <Route path="retirement-planning" element={<ResourcePage title="Retirement Planning" content="Retirement planning tools and guidance." />} />
      <Route path="estate-planning" element={<ResourcePage title="Estate Planning" content="Estate planning resources and strategies." />} />
      <Route path="retirement-calculator" element={<ResourcePage title="Retirement Calculator" content="Calculate your retirement savings needs." />} />
      <Route path="estate-tax-calculator" element={<ResourcePage title="Estate Tax Calculator" content="Estimate your estate tax liability." />} />
      <Route path="investment-returns" element={<ResourcePage title="Investment Returns Calculator" content="Project investment growth scenarios." />} />
    </Routes>
  );
};