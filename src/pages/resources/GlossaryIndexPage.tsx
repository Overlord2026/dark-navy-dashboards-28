import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const GlossaryIndexPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const glossaryTerms = [
    {
      term: 'Asset Allocation',
      definition: 'The distribution of investments across various asset classes to balance risk and return.'
    },
    {
      term: 'Diversification',
      definition: 'The practice of spreading investments across various financial instruments to reduce risk.'
    },
    {
      term: 'Estate Planning',
      definition: 'The process of arranging the management and disposal of a person\'s estate during their life and after death.'
    },
    {
      term: 'Fiduciary',
      definition: 'A person who acts on behalf of another person, putting their client\'s interests ahead of their own.'
    },
    {
      term: 'Liquidity',
      definition: 'The ease with which an asset can be converted into cash without affecting its market price.'
    },
    {
      term: 'Portfolio',
      definition: 'A collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents.'
    },
    {
      term: 'Risk Tolerance',
      definition: 'The degree of variability in investment returns that an investor is willing to withstand.'
    },
    {
      term: 'Volatility',
      definition: 'The degree of variation of a trading price series over time, measured by the standard deviation of returns.'
    }
  ];

  const filteredTerms = glossaryTerms.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Financial Glossary
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Clear definitions of financial terms and concepts to help you understand wealth management better.
              </p>
            </header>
            
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search terms and definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredTerms.map((item) => (
                <Card key={item.term} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-primary">{item.term}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      {item.definition}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTerms.length === 0 && searchTerm && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No terms found matching "{searchTerm}". Try a different search.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GlossaryIndexPage;