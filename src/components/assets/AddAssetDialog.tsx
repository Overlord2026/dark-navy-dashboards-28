
import React, { useState } from "react";
import { useNetWorth, Asset } from "@/context/NetWorthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAssetDialog: React.FC<AddAssetDialogProps> = ({ open, onOpenChange }) => {
  const { addAsset } = useNetWorth();
  const [activeTab, setActiveTab] = useState("general");
  
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState<Asset["type"]>("other");
  const [assetValue, setAssetValue] = useState("");
  const [assetOwner, setAssetOwner] = useState("Tom Brady");
  
  // Vehicle/Boat specific details
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  
  // Art/Collectible specific details
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  const resetForm = () => {
    setAssetName("");
    setAssetType("other");
    setAssetValue("");
    setAssetOwner("Tom Brady");
    setYear("");
    setMake("");
    setModel("");
    setDescription("");
    setLocation("");
    setActiveTab("general");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assetName || !assetValue) {
      toast.error("Please provide a name and value for the asset");
      return;
    }
    
    // Create details object based on asset type
    let details = {};
    
    if (assetType === 'vehicle' || assetType === 'boat') {
      details = {
        year,
        make,
        model
      };
    } else if (['art', 'antique', 'collectible', 'jewelry'].includes(assetType)) {
      details = {
        description,
        location
      };
    }
    
    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      name: assetName,
      type: assetType,
      value: parseFloat(assetValue),
      owner: assetOwner,
      lastUpdated: new Date().toISOString().split('T')[0],
      details: Object.keys(details).length > 0 ? details : undefined
    };
    
    addAsset(newAsset);
    toast.success("Asset added successfully");
    resetForm();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="details">Asset Details</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div>
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g., Family Car, Summer Home, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="assetType">Asset Type</Label>
                <Select value={assetType} onValueChange={(value: Asset["type"]) => setAssetType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property">Real Estate</SelectItem>
                    <SelectItem value="vehicle">Vehicle (Car, RV, Camper)</SelectItem>
                    <SelectItem value="boat">Boat/Watercraft</SelectItem>
                    <SelectItem value="cash">Cash & Equivalents</SelectItem>
                    <SelectItem value="investment">Investments</SelectItem>
                    <SelectItem value="retirement">Retirement Accounts</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="antique">Antiques</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="collectible">Collectibles</SelectItem>
                    <SelectItem value="digital">Digital Assets</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="assetOwner">Owner</Label>
                <Input
                  id="assetOwner"
                  value={assetOwner}
                  onChange={(e) => setAssetOwner(e.target.value)}
                  placeholder="e.g., John Smith, Family Trust, etc."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              {(assetType === 'vehicle' || assetType === 'boat') && (
                <>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g., 2023"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      placeholder="e.g., Tesla, Ford, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g., Model 3, F-150, etc."
                    />
                  </div>
                </>
              )}
              
              {['art', 'antique', 'collectible', 'jewelry'].includes(assetType) && (
                <>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the item"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where the item is stored/displayed"
                    />
                  </div>
                </>
              )}
              
              {!['vehicle', 'boat', 'art', 'antique', 'collectible', 'jewelry'].includes(assetType) && (
                <div className="text-center py-8 text-muted-foreground">
                  No additional details needed for this asset type.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="valuation" className="space-y-4">
              <div>
                <Label htmlFor="assetValue">Current Value ($)</Label>
                <Input
                  id="assetValue"
                  type="number"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  placeholder="e.g., 25000"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
