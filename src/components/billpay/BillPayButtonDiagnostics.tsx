
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { X } from "lucide-react";
import { testBillPayButtonClick, ButtonDiagnosticResult, diagnoseBillPayButtons } from "@/services/diagnostics/billPayDiagnostics";

interface BillPayButtonDiagnosticsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedButton?: string;
}

export function BillPayButtonDiagnostics({ 
  isOpen, 
  onClose,
  selectedButton 
}: BillPayButtonDiagnosticsProps) {
  const [activeTab, setActiveTab] = useState<'selected' | 'all'>(selectedButton ? 'selected' : 'all');
  
  const selectedButtonResult = selectedButton ? testBillPayButtonClick(selectedButton) : null;
  const allResults = diagnoseBillPayButtons();
  
  const displayResults = activeTab === 'selected' && selectedButtonResult 
    ? [selectedButtonResult] 
    : allResults;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-500';
      case 'partial': return 'text-amber-500';
      case 'missing': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>
              {selectedButton ? `Diagnostics: ${selectedButton} Button` : 'Bill Pay Button Diagnostics'}
            </DialogTitle>
            <DialogDescription>
              Detailed analysis of button event handlers and functionality
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {selectedButton && (
          <div className="flex gap-2 mb-4">
            <Button 
              variant={activeTab === 'selected' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveTab('selected')}
            >
              Selected Button
            </Button>
            <Button 
              variant={activeTab === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveTab('all')}
            >
              All Buttons
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Button</TableHead>
              <TableHead>Has Handler</TableHead>
              <TableHead>Handler Name</TableHead>
              <TableHead>Changes State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[300px]">Issue Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayResults.map((result) => (
              <TableRow key={result.buttonName}>
                <TableCell className="font-medium">{result.buttonName}</TableCell>
                <TableCell>{result.hasEventHandler ? '✅' : '❌'}</TableCell>
                <TableCell>{result.eventHandlerFunction}</TableCell>
                <TableCell>{result.triggersStateChange ? '✅' : '❌'}</TableCell>
                <TableCell className={getStatusColor(result.implementationStatus)}>
                  {result.implementationStatus.charAt(0).toUpperCase() + result.implementationStatus.slice(1)}
                </TableCell>
                <TableCell className="text-sm">{result.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogFooter className="mt-6">
          <div className="text-sm text-muted-foreground">
            <p><strong>Note:</strong> Buttons with 'partial' implementation only display notifications without completing the expected action.</p>
            <p className="mt-1">To fully implement these buttons, you'll need to add proper navigation, state management, or form handling components.</p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
