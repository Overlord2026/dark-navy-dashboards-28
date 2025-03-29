
import React from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface AdvisorWelcomeModalProps {
  onStartSetup: () => void;
  onSkipForNow: () => void;
}

export function AdvisorWelcomeModal({ onStartSetup, onSkipForNow }: AdvisorWelcomeModalProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px] bg-[#0F0F2D] text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Welcome to the White-Labeled Advizon Practice Management Platform!
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Complete your setup to start managing client relationships efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-green-500/20 p-1">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Configure your practice details</h3>
              <p className="text-sm text-gray-400">Upload your logo and enter firm information</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-green-500/20 p-1">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Select from available modules</h3>
              <p className="text-sm text-gray-400">Lead optimization, tax analysis, marketing engine and more</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-green-500/20 p-1">
              <Check className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Set up client portal branding</h3>
              <p className="text-sm text-gray-400">Customize the look and feel of your client portal</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onSkipForNow}
            className="w-full sm:w-auto border-gray-600 hover:bg-gray-800 text-white"
          >
            Skip For Now
          </Button>
          <Button 
            onClick={onStartSetup}
            className="w-full sm:w-auto bg-[#1EAEDB] hover:bg-[#33C3F0] text-white"
          >
            Start Setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
