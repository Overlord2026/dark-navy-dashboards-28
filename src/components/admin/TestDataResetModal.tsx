
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Database, Shield, Clock } from 'lucide-react';

interface TestDataResetModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function TestDataResetModal({ open, onClose, onConfirm, isLoading }: TestDataResetModalProps) {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [acknowledgeWarning, setAcknowledgeWarning] = useState(false);
  const [acknowledgeBackup, setAcknowledgeBackup] = useState(false);
  const [acknowledgeLoss, setAcknowledgeLoss] = useState(false);

  const resetModal = () => {
    setStep(1);
    setConfirmText('');
    setAcknowledgeWarning(false);
    setAcknowledgeBackup(false);
    setAcknowledgeLoss(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetModal();
      onClose();
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    onConfirm();
    resetModal();
  };

  const canProceedStep1 = acknowledgeWarning && acknowledgeBackup && acknowledgeLoss;
  const canProceedStep3 = confirmText.toUpperCase() === 'RESET';

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-red-800">Critical Operation Warning</h4>
          <p className="text-sm text-red-700 mt-1">
            This operation will permanently delete all current test data and cannot be undone.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          What will happen:
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start space-x-2">
            <span className="text-red-500 mt-1">•</span>
            <span>All user accounts except system admins will be reset</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-500 mt-1">•</span>
            <span>All documents, appointments, and user data will be deleted</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-500 mt-1">•</span>
            <span>Test seed data will be restored to initial state</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">•</span>
            <span>Automatic backup will be created before reset</span>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acknowledge-warning"
            checked={acknowledgeWarning}
            onCheckedChange={setAcknowledgeWarning}
          />
          <Label htmlFor="acknowledge-warning" className="text-sm">
            I understand this will permanently delete current test data
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acknowledge-backup"
            checked={acknowledgeBackup}
            onCheckedChange={setAcknowledgeBackup}
          />
          <Label htmlFor="acknowledge-backup" className="text-sm">
            I acknowledge that a backup will be created automatically
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acknowledge-loss"
            checked={acknowledgeLoss}
            onCheckedChange={setAcknowledgeLoss}
          />
          <Label htmlFor="acknowledge-loss" className="text-sm">
            I accept responsibility for any data loss
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Database className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-800">Reset Process</h4>
          <p className="text-sm text-blue-700 mt-1">
            The following steps will be executed in sequence:
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-semibold text-blue-600">1</div>
          <span className="text-sm">Create backup of current data</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-semibold text-blue-600">2</div>
          <span className="text-sm">Clean existing test data</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-semibold text-blue-600">3</div>
          <span className="text-sm">Restore seed data</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-semibold text-blue-600">4</div>
          <span className="text-sm">Verify data integrity</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-amber-600">
        <Clock className="h-4 w-4" />
        <span className="text-sm">Estimated completion time: 2-5 minutes</span>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-red-800">Final Confirmation Required</h4>
          <p className="text-sm text-red-700 mt-1">
            This is your last chance to cancel before the reset begins.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="confirm-text" className="text-sm font-medium">
            Type "RESET" to confirm this operation:
          </Label>
          <Input
            id="confirm-text"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type RESET here"
            className="mt-2"
          />
        </div>

        {confirmText && !canProceedStep3 && (
          <p className="text-sm text-red-600">
            Please type "RESET" exactly as shown to confirm.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => isLoading && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-red-600" />
            <span>Reset Test Data - Step {step} of 3</span>
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Review the warnings and acknowledge the risks"}
            {step === 2 && "Review the reset process and timeline"}
            {step === 3 && "Final confirmation required to proceed"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button 
                onClick={handleNextStep} 
                disabled={step === 1 ? !canProceedStep1 : false}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleConfirm} 
                disabled={!canProceedStep3 || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Resetting...
                  </>
                ) : (
                  'Execute Reset'
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
