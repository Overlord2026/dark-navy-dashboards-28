
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/animated-alert-dialog";
import { Mail, HelpCircle, Users } from "lucide-react";
import { sanitizeHtml } from '@/lib/sanitize';

interface LearnMoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => void;
  actionType?: 'learn_more' | 'request_assistance' | 'consultant_request';
}

export function LearnMoreDialog({ 
  open, 
  onOpenChange, 
  itemName, 
  onConfirm,
  actionType = 'learn_more'
}: LearnMoreDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (actionType) {
      case 'request_assistance':
        return <HelpCircle className="h-5 w-5 text-primary" />;
      case 'consultant_request':
        return <Users className="h-5 w-5 text-primary" />;
      default:
        return <Mail className="h-5 w-5 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case 'request_assistance':
        return 'Request Assistance';
      case 'consultant_request':
        return 'Request Consultant';
      default:
        return 'Request Information';
    }
  };

  const getDescription = () => {
    switch (actionType) {
      case 'request_assistance':
        return `Would you like to request assistance with <strong>${itemName}</strong>? We'll connect you with our support team who can provide hands-on help and guidance.`;
      case 'consultant_request':
        return `Would you like to request a consultant for <strong>${itemName}</strong>? We'll arrange for a specialist to work with you on this matter.`;
      default:
        return `Would you like to receive detailed information about <strong>${itemName}</strong>? We'll send your request to your advisor who will provide comprehensive details and answer any questions you may have.`;
    }
  };

  const getButtonText = () => {
    switch (actionType) {
      case 'request_assistance':
        return 'Request Assistance';
      case 'consultant_request':
        return 'Request Consultant';
      default:
        return 'Send Request';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              {getIcon()}
            </div>
            <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {getButtonText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
