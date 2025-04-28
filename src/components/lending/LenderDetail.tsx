
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Calendar, Phone, Mail } from "lucide-react";
import { Lender } from "./types";

interface LenderDetailProps {
  lender: Lender;
  isOpen: boolean;
  onClose: () => void;
}

const LenderDetail: React.FC<LenderDetailProps> = ({ lender, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{lender.name}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3">
            {lender.logo ? (
              <img 
                src={lender.logo} 
                alt={lender.name} 
                className="h-10 w-auto" 
              />
            ) : (
              <div className="h-10 w-10 bg-muted rounded-full"></div>
            )}
            <div>
              <h2 className="font-medium">{lender.name}</h2>
              <p className="text-sm text-muted-foreground">{lender.category}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-muted-foreground">{lender.description}</p>
          </div>
          
          {lender.features && lender.features.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                {lender.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {lender.eligibility && (
            <div>
              <h3 className="text-lg font-medium mb-2">Eligibility</h3>
              <p className="text-muted-foreground">{lender.eligibility}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Consultation
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </Button>
          </div>
          
          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {lender.contactPhone || "Contact through advisor"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {lender.contactEmail || "Contact through advisor"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LenderDetail;
