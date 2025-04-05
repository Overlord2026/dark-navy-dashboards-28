
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldCheck, Heart, HandCoins, Building, Car } from "lucide-react";

const Insurance = () => {
  return (
    <ThreeColumnLayout activeMainItem="education-solutions" title="Insurance Solutions">
      <div className="p-6 mx-auto max-w-7xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Insurance Solutions</h1>
        <p className="text-muted-foreground mb-6">
          Explore our comprehensive insurance products and services to protect what matters most.
        </p>

        <Tabs defaultValue="life" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            <TabsTrigger value="life">Life Insurance</TabsTrigger>
            <TabsTrigger value="annuities">Fiduciary Annuities</TabsTrigger>
            <TabsTrigger value="health">Health Insurance</TabsTrigger>
            <TabsTrigger value="property">Property & Casualty</TabsTrigger>
            <TabsTrigger value="business">Business Insurance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="life">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Term Life Insurance
                  </CardTitle>
                  <CardDescription>
                    Coverage for a specific term with affordable premiums
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Protect your loved ones during your working years with cost-effective term coverage.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Universal Life Insurance
                  </CardTitle>
                  <CardDescription>
                    Flexible premiums and death benefits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Permanent coverage with investment components and adjustable premium options.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Whole Life Insurance
                  </CardTitle>
                  <CardDescription>
                    Lifetime coverage with cash value accumulation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Build equity while ensuring lifelong protection for your beneficiaries.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="annuities">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Our Trusted Annuity Partners</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="text-primary">Pacific Life</CardTitle>
                    <CardDescription>Leading provider of fixed and variable annuities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Pacific Life has over 150 years of experience providing retirement solutions and financial security.</p>
                    <p className="text-sm text-muted-foreground">Key offerings include:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                      <li>Fixed and variable annuities</li>
                      <li>Indexed annuities with downside protection</li>
                      <li>Income-focused solutions for retirement</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="https://www.pacificlife.com" target="_blank" rel="noopener noreferrer">
                        Visit Pacific Life <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="text-primary">Lincoln Financial</CardTitle>
                    <CardDescription>Innovative annuity products for wealth accumulation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Lincoln Financial offers a wide range of annuity options designed for wealth accumulation and income strategies.</p>
                    <p className="text-sm text-muted-foreground">Key offerings include:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                      <li>Variable annuities with income guarantees</li>
                      <li>Fixed indexed annuities</li>
                      <li>Protected lifetime income solutions</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="https://www.lfg.com" target="_blank" rel="noopener noreferrer">
                        Visit Lincoln Financial <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Fixed Annuities
                    </CardTitle>
                    <CardDescription>
                      Guaranteed interest rates and principal protection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Secure and predictable growth without market volatility.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Variable Annuities
                    </CardTitle>
                    <CardDescription>
                      Investment opportunities with tax-deferred growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Market participation with long-term growth potential.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HandCoins className="h-5 w-5 mr-2" />
                      Indexed Annuities
                    </CardTitle>
                    <CardDescription>
                      Market-linked growth with downside protection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Participate in market gains while protecting your principal.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="health">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Medicare Supplement
                  </CardTitle>
                  <CardDescription>
                    Coverage for expenses not covered by Medicare
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Fill the gaps in your Medicare coverage with supplemental plans.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Long-Term Care
                  </CardTitle>
                  <CardDescription>
                    Coverage for extended care needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Protect your savings from the high costs of long-term care services.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Critical Illness
                  </CardTitle>
                  <CardDescription>
                    Lump-sum benefit for serious illnesses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Financial support when diagnosed with covered serious conditions.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="property">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Homeowners Insurance
                  </CardTitle>
                  <CardDescription>
                    Protection for your home and personal belongings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Comprehensive coverage for your primary residence and possessions.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Auto Insurance
                  </CardTitle>
                  <CardDescription>
                    Coverage for vehicles and liability protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Protect yourself financially against damage and legal claims.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Umbrella Insurance
                  </CardTitle>
                  <CardDescription>
                    Additional liability coverage beyond standard policies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Extended protection for high-net-worth individuals and families.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="business">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Commercial Property
                  </CardTitle>
                  <CardDescription>
                    Protection for business buildings and contents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Safeguard your business assets from fire, theft, and other perils.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    General Liability
                  </CardTitle>
                  <CardDescription>
                    Coverage for third-party claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Protect your business from lawsuits and liability claims.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" />
                    Professional Liability
                  </CardTitle>
                  <CardDescription>
                    Protection against errors and omissions claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Coverage for professional services and advice-related claims.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default Insurance;
