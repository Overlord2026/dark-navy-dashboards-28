import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ArrowRight, Star } from 'lucide-react';
import { solutionsData } from '@/data/solutionsData';

export default function SolutionsPage() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug || !solutionsData[slug]) {
    return <Navigate to="/404" replace />;
  }

  const solution = solutionsData[slug];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-luxury-navy/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {solution.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {solution.description}
          </p>
        </div>
      </section>

      {/* What It Is Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                {solution.whatItIs.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {solution.whatItIs.content}
              </p>
              <div className="space-y-3">
                {solution.whatItIs.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-brand-gold flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg p-8">
              <div className="text-center">
                <Star className="h-16 w-16 text-brand-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Premium Service</h3>
                <p className="text-muted-foreground">
                  Join thousands of families who trust our platform for their {solution.title.toLowerCase()} needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Choose Your Access Level
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {solution.pricing.free.title}
                  <Badge variant="secondary">Free</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {solution.pricing.free.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-brand-gold mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold/10">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="border-brand-gold ring-2 ring-brand-gold/20 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brand-gold text-brand-black">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {solution.pricing.premium.title}
                  <Badge className="bg-brand-gold text-brand-black">{solution.pricing.premium.price}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {solution.pricing.premium.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-brand-gold mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
                  Choose Premium
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {solution.pricing.pro.title}
                  <Badge variant="outline">{solution.pricing.pro.price}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {solution.pricing.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-brand-gold mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold/10">
                  Choose Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mini-Onboarding Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-brand-gold/30 bg-gradient-to-r from-background to-brand-gold/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">
                {solution.onboarding.title}
              </CardTitle>
              <p className="text-muted-foreground">
                Get started in just 4 simple steps
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {solution.onboarding.steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-brand-gold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
                  {solution.onboarding.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {solution.faq.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-brand-gold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the family office marketplace and access premium {solution.title.toLowerCase()} solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-brand-gold text-brand-gold hover:bg-brand-gold/10">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}