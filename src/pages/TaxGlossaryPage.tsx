
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'agi',
    term: 'Adjusted Gross Income (AGI)',
    definition: 'Your total gross income minus specific deductions, such as student loan interest, retirement account contributions, and health savings account contributions. AGI is calculated before standard or itemized deductions and is used to determine eligibility for certain tax credits and deductions.',
    category: 'Income',
    relatedTerms: ['magi', 'itemized_deduction', 'tax_credit']
  },
  {
    id: 'magi',
    term: 'Modified Adjusted Gross Income (MAGI)',
    definition: 'Your AGI with certain deductions added back, such as student loan interest, IRA contributions, and foreign income. MAGI is used to determine eligibility for certain tax benefits like Roth IRA contributions and premium tax credits for health insurance.',
    category: 'Income',
    relatedTerms: ['agi', 'roth_ira']
  },
  {
    id: 'tax_bracket',
    term: 'Tax Bracket',
    definition: 'The range of income subject to a specific tax rate in a progressive tax system. The U.S. federal income tax system has seven brackets with rates ranging from 10% to 37% (as of 2025). Your marginal tax rate is the rate applied to the last dollar of your taxable income.',
    category: 'Income Taxation',
    relatedTerms: ['marginal_tax_rate', 'effective_tax_rate']
  },
  {
    id: 'marginal_tax_rate',
    term: 'Marginal Tax Rate',
    definition: 'The tax rate that applies to the last dollar of your taxable income. This is determined by which tax bracket your highest income falls into. Important for planning additional income or deductions, as it shows the tax impact of each additional dollar earned.',
    category: 'Income Taxation',
    relatedTerms: ['tax_bracket', 'effective_tax_rate']
  },
  {
    id: 'effective_tax_rate',
    term: 'Effective Tax Rate',
    definition: 'The average tax rate paid on all of your income, calculated by dividing total tax by total taxable income. This rate is typically lower than your marginal tax rate due to the progressive nature of tax brackets.',
    category: 'Income Taxation',
    relatedTerms: ['tax_bracket', 'marginal_tax_rate']
  },
  {
    id: 'standard_deduction',
    term: 'Standard Deduction',
    definition: "A flat-dollar reduction in taxable income available to all taxpayers who don't itemize deductions. The amount varies based on filing status and is adjusted annually for inflation. In 2025, the standard deduction is $13,850 for single filers and $27,700 for married filing jointly.",
    category: 'Deductions',
    relatedTerms: ['itemized_deduction', 'tax_credit']
  },
  {
    id: 'itemized_deduction',
    term: 'Itemized Deductions',
    definition: 'Expenses that can be deducted from your adjusted gross income if you choose not to take the standard deduction. Common itemized deductions include mortgage interest, state and local taxes (up to $10,000), charitable contributions, and medical expenses exceeding 7.5% of AGI.',
    category: 'Deductions',
    relatedTerms: ['standard_deduction', 'agi', 'salt_deduction']
  },
  {
    id: 'tax_credit',
    term: 'Tax Credit',
    definition: 'A dollar-for-dollar reduction in the tax you owe, as opposed to a deduction which only reduces taxable income. Credits are more valuable than deductions of the same amount. Common credits include the Child Tax Credit, Earned Income Credit, and education credits.',
    category: 'Credits',
    relatedTerms: ['refundable_credit', 'nonrefundable_credit']
  },
  {
    id: 'refundable_credit',
    term: 'Refundable Tax Credit',
    definition: 'A tax credit that can reduce your tax liability below zero, resulting in a tax refund. Even if you owe no tax, you can receive the full amount of a refundable credit. Examples include the Earned Income Tax Credit and the Additional Child Tax Credit.',
    category: 'Credits',
    relatedTerms: ['tax_credit', 'nonrefundable_credit']
  },
  {
    id: 'capital_gain',
    term: 'Capital Gain',
    definition: 'The profit realized when you sell a capital asset (like stocks, bonds, real estate) for more than you paid for it. Capital gains are classified as short-term (held for one year or less) or long-term (held for more than one year) and are taxed at different rates.',
    category: 'Investment',
    relatedTerms: ['long_term_capital_gain', 'short_term_capital_gain']
  },
  {
    id: 'roth_ira',
    term: 'Roth IRA',
    definition: 'An individual retirement account funded with after-tax dollars. Qualified distributions in retirement are completely tax-free. Unlike Traditional IRAs, Roth IRAs have no required minimum distributions during the account owner's lifetime.',
    category: 'Retirement',
    relatedTerms: ['traditional_ira', 'roth_conversion', 'rmd']
  },
  {
    id: 'traditional_ira',
    term: 'Traditional IRA',
    definition: 'An individual retirement account that allows tax-deductible contributions (subject to income limits). Investments grow tax-deferred, but withdrawals in retirement are taxed as ordinary income. Required minimum distributions (RMDs) must begin at age 73 (as of 2025).',
    category: 'Retirement',
    relatedTerms: ['roth_ira', 'roth_conversion', 'rmd']
  },
  {
    id: 'roth_conversion',
    term: 'Roth Conversion',
    definition: 'The process of transferring funds from a Traditional IRA or 401(k) to a Roth IRA. The converted amount is subject to ordinary income tax in the year of conversion but will grow tax-free thereafter with tax-free qualified withdrawals in retirement.',
    category: 'Retirement',
    relatedTerms: ['traditional_ira', 'roth_ira', 'tax_bracket']
  },
  {
    id: 'rmd',
    term: 'Required Minimum Distribution (RMD)',
    definition: 'The minimum amount you must withdraw annually from tax-advantaged retirement accounts starting at age 73 (as of 2025). RMDs apply to Traditional IRAs, 401(k)s, and other employer plans, but not to Roth IRAs during the owner's lifetime.',
    category: 'Retirement',
    relatedTerms: ['traditional_ira', 'qcd']
  },
  {
    id: 'qcd',
    term: 'Qualified Charitable Distribution (QCD)',
    definition: 'A direct transfer from an IRA to a qualified charity, available to IRA owners aged 70½ or older. QCDs count toward satisfying RMDs and are excluded from taxable income (up to $100,000 annually), making them more tax-efficient than taking a distribution and then donating.',
    category: 'Charitable Giving',
    relatedTerms: ['rmd', 'charitable_contribution']
  },
  {
    id: 'salt_deduction',
    term: 'State and Local Tax (SALT) Deduction',
    definition: 'An itemized deduction for state and local income, sales, and property taxes. Since 2018, the SALT deduction has been limited to $10,000 per tax return. This cap is scheduled to expire after 2025 unless extended by legislation.',
    category: 'Deductions',
    relatedTerms: ['itemized_deduction']
  }
];

const TaxGlossaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(glossaryTerms.map(term => term.category)))];
  
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Tax Glossary</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive definitions of tax terms to help you understand tax planning concepts.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search terms or definitions..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {filteredTerms.length > 0 ? (
            <div className="space-y-4">
              {filteredTerms.map(term => (
                <Card key={term.id} className="bg-card border-primary/20 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold neptune-gold" id={term.id}>{term.term}</h3>
                      <div className="flex items-center">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-xs">{term.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{term.definition}</p>
                      
                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground">Related Terms:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {term.relatedTerms.map(relatedTermId => {
                              const relatedTerm = glossaryTerms.find(t => t.id === relatedTermId);
                              return relatedTerm ? (
                                <a 
                                  key={relatedTermId}
                                  href={`#${relatedTermId}`}
                                  className="text-xs text-primary hover:underline"
                                >
                                  {relatedTerm.term}
                                </a>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-md">
              <p className="text-muted-foreground">No matching terms found. Try a different search term.</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Card className="bg-[#1A1F2C] border-[#353e52] sticky top-4">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-white">Tax Education Resources</h3>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/tax-planning/basic-education" 
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <span>Basic Tax Education</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/tax-planning/advanced-tax-education" 
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <span>Advanced Tax Concepts</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/tax-planning/recommended-reading" 
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <span>Recommended Reading</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a 
                  href="https://www.irs.gov/tax-topics" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <span>IRS Tax Topics</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              
              <div className="border-t border-primary/10 pt-3 mt-3">
                <p className="text-xs text-muted-foreground">
                  This glossary is for informational purposes only and should not be considered tax or legal advice. 
                  For specific guidance, consult with a qualified tax professional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
};

export default TaxGlossaryPage;
