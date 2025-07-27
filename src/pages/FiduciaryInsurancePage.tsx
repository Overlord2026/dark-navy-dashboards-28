import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { ProductEducationCard } from '@/components/insurance/ProductEducationCard';
import { DecisionToolDialog } from '@/components/insurance/DecisionToolDialog';
import { QuoteRequestDialog } from '@/components/insurance/QuoteRequestDialog';
import { useFiduciaryInsurance } from '@/hooks/useFiduciaryInsurance';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Shield, Calculator } from 'lucide-react';
import { FiduciaryProductType } from '@/types/fiduciary-insurance';

export default function FiduciaryInsurancePage() {
  const { productType } = useParams<{ productType: FiduciaryProductType }>();
  const navigate = useNavigate();
  const { 
    getProductEducation, 
    getDecisionTool, 
    submitQuoteRequest,
    loading 
  } = useFiduciaryInsurance();

  const [showDecisionTool, setShowDecisionTool] = useState(false);
  const [showQuoteRequest, setShowQuoteRequest] = useState(false);

  if (!productType || !['ltc', 'medicare', 'iul'].includes(productType)) {
    return (
      <ThreeColumnLayout title="Insurance Education">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The insurance product you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/insurance')}>
              Back to Insurance
            </Button>
          </CardContent>
        </Card>
      </ThreeColumnLayout>
    );
  }

  const education = getProductEducation(productType);
  const decisionTool = getDecisionTool(productType);

  if (loading || !education || !decisionTool) {
    return (
      <ThreeColumnLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product information...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  const handleQuoteRequest = (requestData: any) => {
    submitQuoteRequest(requestData);
    setShowQuoteRequest(false);
  };

  const handleDecisionToolComplete = (results: any) => {
    // Could automatically open quote request with pre-filled data
    setShowDecisionTool(false);
    setShowQuoteRequest(true);
  };

  const getProductIcon = () => {
    switch (productType) {
      case 'ltc': return <Heart className="h-5 w-5" />;
      case 'medicare': return <Shield className="h-5 w-5" />;
      case 'iul': return <Calculator className="h-5 w-5" />;
    }
  };

  const getBreadcrumbLabel = () => {
    switch (productType) {
      case 'ltc': return 'Long-Term Care';
      case 'medicare': return 'Medicare Supplement';
      case 'iul': return 'Indexed Universal Life';
    }
  };

  return (
    <ThreeColumnLayout 
      title={education.title}
      breadcrumbs={[
        { name: 'Insurance', href: '/insurance' },
        { name: 'Fiduciary Education', href: '/insurance/education' },
        { name: getBreadcrumbLabel() || '', href: '#' }
      ]}
    >
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/insurance')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Insurance</span>
          </Button>

          <div className="flex items-center space-x-2">
            {getProductIcon()}
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Fiduciary Education
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <ProductEducationCard
          education={education}
          onRequestQuote={() => setShowQuoteRequest(true)}
          onUseCalculator={() => setShowDecisionTool(true)}
        />

        {/* Decision Tool Dialog */}
        {showDecisionTool && (
          <DecisionToolDialog
            tool={decisionTool}
            open={showDecisionTool}
            onClose={() => setShowDecisionTool(false)}
            onComplete={handleDecisionToolComplete}
          />
        )}

        {/* Quote Request Dialog */}
        {showQuoteRequest && (
          <QuoteRequestDialog
            productType={productType}
            open={showQuoteRequest}
            onClose={() => setShowQuoteRequest(false)}
            onSubmit={handleQuoteRequest}
          />
        )}
      </div>
    </ThreeColumnLayout>
  );
}