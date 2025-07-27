import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Heart,
  Calculator,
  BookOpen
} from 'lucide-react';
import { ProductEducation } from '@/types/fiduciary-insurance';

interface ProductEducationCardProps {
  education: ProductEducation;
  onRequestQuote: () => void;
  onUseCalculator: () => void;
}

export function ProductEducationCard({ 
  education, 
  onRequestQuote, 
  onUseCalculator 
}: ProductEducationCardProps) {
  const getProductIcon = () => {
    switch (education.productType) {
      case 'ltc': return <Heart className="h-6 w-6" />;
      case 'medicare': return <Shield className="h-6 w-6" />;
      case 'iul': return <Calculator className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };

  const getProductColor = () => {
    switch (education.productType) {
      case 'ltc': return 'text-red-600 dark:text-red-400';
      case 'medicare': return 'text-blue-600 dark:text-blue-400';
      case 'iul': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-muted ${getProductColor()}`}>
                {getProductIcon()}
              </div>
              <div>
                <CardTitle className="text-2xl">{education.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{education.subtitle}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="h-3 w-3 mr-1" />
              Fiduciary Advice
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Fiduciary Notice */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>No commissions, no sales quotas.</strong> {education.fiduciaryNote}
        </AlertDescription>
      </Alert>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{education.overview}</p>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="how-it-works" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="pros">Pros</TabsTrigger>
              <TabsTrigger value="cons">Cons</TabsTrigger>
              <TabsTrigger value="risks">Hidden Risks</TabsTrigger>
            </TabsList>

            <TabsContent value="how-it-works" className="mt-6">
              <div className="space-y-3">
                {education.howItWorks.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pros" className="mt-6">
              <div className="space-y-3">
                {education.pros.map((pro, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{pro}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cons" className="mt-6">
              <div className="space-y-3">
                {education.cons.map((con, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{con}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="mt-6">
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 mb-4">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>What most agents won't tell you:</strong> These are the hidden risks and limitations you should understand before making a decision.
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                {education.hiddenRisks.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{risk}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onUseCalculator}>
          <CardContent className="p-6 text-center">
            <Calculator className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Use Decision Tool</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get personalized calculations and recommendations
            </p>
            <Button variant="outline" className="w-full">
              Start Calculator
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onRequestQuote}>
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Get Fiduciary Advice</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Speak with an unbiased, fee-only advisor
            </p>
            <Button className="w-full">
              Request Consultation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}