import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSubmission } from '@/services/insuranceIntake';
import { generateQuote, getQuote } from '@/services/ratingStub';
import { replayVerify } from '@/services/receipts';
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [quote, setQuote] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (id) {
      loadQuoteData();
    }
  }, [id]);

  const loadQuoteData = async () => {
    setLoading(true);
    try {
      const submissionData = await getSubmission(id);
      if (!submissionData) {
        toast.error('Submission not found');
        navigate('/insurance/intake');
        return;
      }

      setSubmission(submissionData);

      // Check if quote exists
      let quoteData = await getQuote(id); // Try using submission ID
      
      if (!quoteData && submissionData.status === 'submitted') {
        // Generate quote if it doesn't exist
        const risk = submissionData.risk_profile;
        quoteData = await generateQuote(id, risk);
      }

      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to load quote:', error);
      toast.error('Failed to load quote data');
    } finally {
      setLoading(false);
    }
  };

  const handleReplayVerify = async () => {
    if (!quote) return;
    
    setVerifying(true);
    try {
      const result = await replayVerify('quote', quote.id);
      setVerificationResult(result);
      toast.success(result ? 'Quote verification passed' : 'Quote verification failed');
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed');
      setVerificationResult(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleProceedToBind = () => {
    if (quote) {
      navigate(`/insurance/bind/${quote.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading quote...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Quote Not Available</h2>
          <p className="text-muted-foreground mb-4">We couldn't generate a quote for this submission.</p>
          <Button onClick={() => navigate('/insurance/intake')}>Start New Quote</Button>
        </div>
      </div>
    );
  }

  const getPremiumBandDisplay = (band: string) => {
    const displays = {
      'under_600': 'Under $600/year',
      '600_1000': '$600-$1,000/year',
      '1000_1500': '$1,000-$1,500/year',
      '1500_2500': '$1,500-$2,500/year',
      'over_2500': 'Over $2,500/year'
    };
    return displays[band] || band;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Insurance Quote</h1>
          <Badge variant="secondary">Worksheet</Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReplayVerify}
            disabled={verifying}
          >
            {verifying ? 'Verifying...' : 'Verify Quote'}
            {verificationResult === true && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
            {verificationResult === false && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
          </Button>
          <Button onClick={handleProceedToBind}>
            Proceed to Bind
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quote Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <div>
                <h3 className="font-semibold">Annual Premium</h3>
                <p className="text-sm text-muted-foreground">Estimated range</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {getPremiumBandDisplay(quote.premium_band)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Coverage Summary</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Limit/Selection</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(quote.coverage_summary).map(([coverage, limit]) => (
                    <TableRow key={coverage}>
                      <TableCell className="font-medium capitalize">
                        {coverage.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell>{limit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Rating Factors</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Age Factor:</span>
                    <span>{quote.rating_factors.age_factor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Credit Factor:</span>
                    <span>{quote.rating_factors.credit_factor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Location Factor:</span>
                    <span>{quote.rating_factors.location_factor.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {quote.rating_factors.property_factor && (
                    <div className="flex justify-between text-sm">
                      <span>Property Factor:</span>
                      <span>{quote.rating_factors.property_factor.toFixed(2)}</span>
                    </div>
                  )}
                  {quote.rating_factors.vehicle_factor && (
                    <div className="flex justify-between text-sm">
                      <span>Vehicle Factor:</span>
                      <span>{quote.rating_factors.vehicle_factor.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium">
                    <span>Base Premium Band:</span>
                    <span>{quote.rating_factors.base_premium_band}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Quote ID</label>
              <p className="text-sm font-mono">{quote.id.slice(0, 8)}...</p>
            </div>
            <div>
              <label className="text-sm font-medium">Effective Date</label>
              <p className="text-sm">{new Date(quote.effective_date).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Quote Date</label>
              <p className="text-sm">{new Date(quote.quoted_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Valid Until</label>
              <p className="text-sm">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            {verificationResult !== null && (
              <div>
                <label className="text-sm font-medium">Verification Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {verificationResult ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Failed</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Important Information</h3>
            <p className="text-sm text-muted-foreground">
              This is a rating worksheet only. Final premium may vary based on underwriting review.
              Premium bands are used to protect individual privacy while providing transparent pricing.
            </p>
            <div className="flex justify-center">
              <Button onClick={handleProceedToBind} size="lg">
                Accept Quote & Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Quote creates Quote-RDS receipt • Replay verification available • Premium bands protect privacy
      </div>
    </div>
  );
}