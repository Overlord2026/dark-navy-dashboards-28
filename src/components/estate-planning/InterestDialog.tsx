
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InterestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    email: string;
    message: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  services: Array<{ title: string }>;
}

export const InterestDialog: React.FC<InterestDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  services
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Express Interest</DialogTitle>
          <DialogDescription>
            Let us know what estate planning services you're interested in.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="interest-name">Full Name</Label>
            <Input
              id="interest-name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest-email">Email</Label>
            <Input
              id="interest-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest-services">Services of Interest</Label>
            <div className="flex flex-wrap gap-2">
              {services.slice(0, 3).map((service) => (
                <Button
                  key={service.title}
                  variant="outline"
                >
                  {service.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={onInputChange}
              placeholder="Tell us about your estate planning needs..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
