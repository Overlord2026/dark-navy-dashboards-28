
import React from "react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Printer, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentReceiptViewProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    transactionId: string;
    billName: string;
    billId: number;
    amount: number;
    date: Date;
    paymentMethod: string;
    status: string;
    paymentType?: string; // one-time or recurring
    scheduledDate?: Date;
    account?: string;
  } | null;
}

export function PaymentReceiptView({ isOpen, onClose, receiptData }: PaymentReceiptViewProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Receipt downloaded",
      description: `Receipt ${receiptData?.transactionId} has been downloaded as PDF.`,
    });
  };

  const handlePrint = () => {
    // In a real app, this would trigger the browser's print dialog
    toast({
      title: "Printing receipt",
      description: `Preparing receipt ${receiptData?.transactionId} for printing.`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share receipt",
      description: `Preparing to share receipt ${receiptData?.transactionId}.`,
    });
  };

  if (!receiptData) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex justify-between items-center">
            <AlertDialogTitle>Payment Receipt</AlertDialogTitle>
            <div className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {receiptData.status}
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6 mt-2">
          {/* Company Logo and Info */}
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-lg">AccuWealth</h3>
              <p className="text-sm text-muted-foreground">Financial Management Platform</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Receipt #</p>
              <p className="text-sm font-medium">{receiptData.transactionId}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Payment Details */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">PAYMENT DETAILS</h3>
            
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Biller</p>
                <p className="font-medium">{receiptData.billName}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-medium text-lg">${receiptData.amount.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{format(receiptData.date, "PPP")}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="font-medium">{receiptData.paymentMethod}</p>
              </div>
              
              {receiptData.account && (
                <div>
                  <p className="text-xs text-muted-foreground">Account</p>
                  <p className="font-medium">{receiptData.account}</p>
                </div>
              )}
              
              {receiptData.paymentType && (
                <div>
                  <p className="text-xs text-muted-foreground">Payment Type</p>
                  <p className="font-medium capitalize">{receiptData.paymentType}</p>
                </div>
              )}
              
              {receiptData.scheduledDate && (
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled Date</p>
                  <p className="font-medium">{format(receiptData.scheduledDate, "PPP")}</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Reference Number */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-md">
            <div>
              <p className="text-xs text-muted-foreground">Transaction Reference</p>
              <p className="font-mono font-medium">{receiptData.transactionId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Processed on</p>
              <p className="text-right">{format(receiptData.date, "PPP 'at' p")}</p>
            </div>
          </div>
          
          {/* Receipt Actions */}
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex gap-1">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex gap-1">
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="flex gap-1">
              <Share className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <AlertDialogFooter>
          <Button onClick={onClose} className="w-full">Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
