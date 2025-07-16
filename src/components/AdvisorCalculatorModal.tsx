import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Share, Calendar, FileDown, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import CountUp from 'react-countup';
import { calculateValueDrivenSavings } from '@/hooks/useValueDrivenSavings';
import { Celebration } from '@/components/ConfettiAnimation';

interface AdvisorCalculatorModalProps {
  open: boolean;
  onClose: () => void;
  clientData?: {
    portfolioValue: number;
    currentFee: number;
    customFee: number;
  };
}

export const AdvisorCalculatorModal: React.FC<AdvisorCalculatorModalProps> = ({
  open,
  onClose,
  clientData
}) => {
  const [portfolioValue, setPortfolioValue] = useState(clientData?.portfolioValue || 2000000);
  const [currentFee, setCurrentFee] = useState(clientData?.currentFee || 1.25);
  const [bfoFee, setBfoFee] = useState(clientData?.customFee || 9500);
  const [showResults, setShowResults] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateResults = () => {
    return calculateValueDrivenSavings(
      portfolioValue,
      6, // 6% growth
      30, // 30 year horizon
      currentFee,
      bfoFee,
      'flat',
      75000 // annual withdrawal
    );
  };

  const handleCalculate = () => {
    setShowResults(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
  };

  const handleShare = () => {
    const results = calculateResults();
    const shareText = `Client Fee Analysis Results:\n• Previous annual fee: ${formatCurrency(portfolioValue * (currentFee / 100))}\n• BFO annual fee: ${formatCurrency(bfoFee)}\n• Total savings over 30 years: ${formatCurrency(results.totalFeeSavings)}\n• Additional wealth potential: ${formatCurrency(results.extraPortfolioGrowth)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Client Fee Analysis Results',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const results = showResults ? calculateResults() : null;

  const bfoServices = [
    'Investment management',
    'Proactive tax/retirement planning',
    'Family Legacy Box™',
    'Concierge support',
    'Secure digital vault',
    'Estate planning coordination',
    'Healthcare optimization',
    'Risk management analysis'
  ];

  return (
    <>
      <Celebration trigger={showCelebration} />
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {showResults ? 'Your Real Fee Savings & Added Value' : 'Client Fee Analysis'}
            </DialogTitle>
          </DialogHeader>

          {!showResults ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="portfolio">Portfolio Value</Label>
                  <Input
                    id="portfolio"
                    type="number"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentFee">Previous Fee (%)</Label>
                  <Input
                    id="currentFee"
                    type="number"
                    step="0.05"
                    value={currentFee}
                    onChange={(e) => setCurrentFee(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bfoFee">BFO Annual Fee ($)</Label>
                  <Input
                    id="bfoFee"
                    type="number"
                    value={bfoFee}
                    onChange={(e) => setBfoFee(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={handleCalculate} size="lg" className="w-full">
                <TrendingUp className="h-5 w-5 mr-2" />
                Calculate Real Savings
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="text-muted-foreground">Previous annual fee:</span>{' '}
                    <span className="font-bold text-red-600">{formatCurrency(portfolioValue * (currentFee / 100))}</span>
                  </p>
                  <p className="text-lg">
                    <span className="text-muted-foreground">BFO annual fee:</span>{' '}
                    <span className="font-bold text-green-600">{formatCurrency(bfoFee)}</span>
                  </p>
                </div>
              </div>

              {/* Savings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-6 bg-card rounded-lg border">
                  <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <div className="text-2xl font-bold text-green-500">
                    <CountUp
                      start={0}
                      end={results!.totalFeeSavings}
                      duration={2}
                      formattingFn={formatCurrency}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Total Savings (30 years)</p>
                </div>

                <div className="text-center p-6 bg-card rounded-lg border">
                  <TrendingUp className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <div className="text-2xl font-bold text-blue-500">
                    <CountUp
                      start={0}
                      end={results!.extraPortfolioGrowth}
                      duration={2}
                      formattingFn={formatCurrency}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Additional Wealth Potential</p>
                </div>
              </div>

              {/* Service Checklist */}
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your BFO relationship includes:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bfoServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleShare} variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
                <Button 
                  onClick={() => window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank')}
                  variant="outline" 
                  className="w-full"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Next Meeting
                </Button>
                <Button 
                  onClick={() => {
                    // Generate and download report
                    const reportContent = `BFO Fee Analysis Report\n\nClient Portfolio: ${formatCurrency(portfolioValue)}\nPrevious Fee: ${currentFee}% (${formatCurrency(portfolioValue * (currentFee / 100))} annually)\nBFO Fee: ${formatCurrency(bfoFee)} annually\n\n30-Year Projections:\nTotal Fee Savings: ${formatCurrency(results!.totalFeeSavings)}\nAdditional Wealth: ${formatCurrency(results!.extraPortfolioGrowth)}\n\nBFO Services Included:\n${bfoServices.map(s => `• ${s}`).join('\n')}`;
                    
                    const blob = new Blob([reportContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'bfo-fee-analysis-report.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download My Savings Report
                </Button>
              </div>

              {/* Celebration Message */}
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  🎉 Congratulations!
                </h4>
                <p className="text-muted-foreground">
                  You've unlocked significant savings and full-family-office service for your family's future.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};