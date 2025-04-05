
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePortfolioDialog: React.FC<CreatePortfolioDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioType, setPortfolioType] = useState("model");
  
  const handleCreate = () => {
    if (!portfolioName.trim()) {
      toast.error("Please enter a portfolio name");
      return;
    }
    
    toast.success(`Created new ${portfolioType}: ${portfolioName}`);
    onOpenChange(false);
    setPortfolioName("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogDescription>
            Create a new investment portfolio model or sleeve
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="portfolio-name">Portfolio Name</Label>
            <Input
              id="portfolio-name"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="e.g., Growth Strategy 60/40"
            />
          </div>
          
          <div>
            <Label htmlFor="portfolio-type">Portfolio Type</Label>
            <Select value={portfolioType} onValueChange={setPortfolioType}>
              <SelectTrigger id="portfolio-type">
                <SelectValue placeholder="Select portfolio type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model">Model</SelectItem>
                <SelectItem value="sleeve">Sleeve</SelectItem>
                <SelectItem value="model-of-models">Model of Models</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
