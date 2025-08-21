import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, FileText, Download, PlusCircle, Receipt } from 'lucide-react';
import { planContribution, recordClaim, exportHsaReceipts, HsaPlan } from '@/features/health/hsa/api';

interface HsaActionsProps {
  plan: HsaPlan;
  onRefresh: () => void;
}

export function HsaActions({ plan, onRefresh }: HsaActionsProps) {
  const [contributionAmount, setContributionAmount] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePlanContribution = async () => {
    const amount = parseFloat(contributionAmount);
    if (!amount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount."
      });
      return;
    }

    setIsProcessing(true);
    try {
      const receipt = planContribution(amount);
      
      toast({
        title: "Contribution Planned",
        description: `Health-RDS receipt generated for $${amount.toLocaleString()} contribution.`,
        variant: receipt.result === 'allow' ? 'default' : 'destructive'
      });
      
      setContributionAmount('');
      onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to plan contribution. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordClaim = async () => {
    const amount = parseFloat(claimAmount);
    if (!amount || amount <= 0 || !claimDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Claim",
        description: "Please enter a valid amount and description."
      });
      return;
    }

    setIsProcessing(true);
    try {
      const receipt = recordClaim(amount, claimDescription);
      
      toast({
        title: "Claim Recorded",
        description: `Health-RDS receipt generated for $${amount.toLocaleString()} claim.`
      });
      
      setClaimAmount('');
      setClaimDescription('');
      onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record claim. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportReceipts = async () => {
    setIsProcessing(true);
    try {
      exportHsaReceipts();
      
      toast({
        title: "Receipts Exported",
        description: "HSA receipts have been downloaded as JSON file."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export receipts. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Plan Contribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Plan Contribution
          </CardTitle>
          <CardDescription>
            Plan an HSA contribution and generate a Health-RDS receipt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contribution-amount">Contribution Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="contribution-amount"
                type="number"
                placeholder="0.00"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <Button 
            onClick={handlePlanContribution}
            disabled={isProcessing || !contributionAmount}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Plan Contribution"}
          </Button>
        </CardContent>
      </Card>

      {/* Record Claim */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Record Claim
          </CardTitle>
          <CardDescription>
            Record an HSA medical expense claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claim-amount">Claim Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="claim-amount"
                type="number"
                placeholder="0.00"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="claim-description">Description</Label>
            <Textarea
              id="claim-description"
              placeholder="Brief description of medical expense"
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <Button 
            onClick={handleRecordClaim}
            disabled={isProcessing || !claimAmount || !claimDescription.trim()}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Record Claim"}
          </Button>
        </CardContent>
      </Card>

      {/* Export Receipts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export HSA Receipts
          </CardTitle>
          <CardDescription>
            Download HSA receipts and Health-RDS records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Export all HSA-related Health-RDS receipts as a JSON file for record keeping and compliance.
          </div>
          
          <Button 
            onClick={handleExportReceipts}
            disabled={isProcessing}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isProcessing ? "Exporting..." : "Export Receipts"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}