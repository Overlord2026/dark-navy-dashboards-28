import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Home, AlertCircle } from 'lucide-react';
import { canUseDeed, getAvailableDeedTypes, type DeedType } from './stateDeedRules';
import { analytics } from '@/lib/analytics';

interface FamilyDeedRequestProps {
  className?: string;
}

export const FamilyDeedRequest: React.FC<FamilyDeedRequestProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    state: 'CA',
    county: '',
    propertyAddress: '',
    currentTitleHolder: '',
    targetOwner: '',
    deedType: '' as DeedType | '',
    concierge: true
  });

  const availableDeeds = getAvailableDeedTypes(formData.state);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Record Settlement-RDS for concierge fee
      if (formData.concierge) {
        const settlementReceipt = {
          type: 'Settlement-RDS',
          purpose: 'deed_concierge',
          amount: 299,
          currency: 'USD',
          timestamp: new Date().toISOString()
        };
        console.log('Settlement-RDS recorded:', settlementReceipt);
      }

      // Record Decision-RDS for deed request
      const decisionReceipt = {
        type: 'Decision-RDS',
        action: 'deed.requested',
        reasons: [
          formData.state,
          formData.deedType,
          formData.concierge ? 'CONCIERGE' : 'DIY_REFER'
        ],
        inputs_hash: btoa(JSON.stringify(formData)),
        timestamp: new Date().toISOString()
      };
      console.log('Decision-RDS recorded:', decisionReceipt);

      // Track analytics
      analytics.track('deed.request.submitted', {
        state: formData.state,
        deed_type: formData.deedType,
        concierge: formData.concierge
      });

      // Close modal and reset form
      setIsOpen(false);
      setFormData({
        state: 'CA',
        county: '',
        propertyAddress: '',
        currentTitleHolder: '',
        targetOwner: '',
        deedType: '',
        concierge: true
      });

    } catch (error) {
      console.error('Error submitting deed request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {/* UPL Compliance Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">UPL Notice</p>
            <p>
              Deeds are prepared by licensed attorneys only. Your request will be routed to a 
              state-licensed attorney for preparation and execution.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Request a Deed
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Property Deed Request</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => setFormData({...formData, state: value, deedType: ''})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="county">County (Optional)</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                  placeholder="County name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                placeholder="123 Main Street, City, State ZIP"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentTitleHolder">Current Title Holder</Label>
                <Input
                  id="currentTitleHolder"
                  value={formData.currentTitleHolder}
                  onChange={(e) => setFormData({...formData, currentTitleHolder: e.target.value})}
                  placeholder="Current owner name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="targetOwner">New Owner/Trust</Label>
                <Input
                  id="targetOwner"
                  value={formData.targetOwner}
                  onChange={(e) => setFormData({...formData, targetOwner: e.target.value})}
                  placeholder="Trust name or new owner"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deedType">Deed Type</Label>
              <Select 
                value={formData.deedType} 
                onValueChange={(value) => setFormData({...formData, deedType: value as DeedType})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deed type" />
                </SelectTrigger>
                <SelectContent>
                  {availableDeeds.map((deed) => (
                    <SelectItem key={deed} value={deed}>
                      {deed} Deed
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Available deed types for {formData.state}
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Service Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="service"
                    checked={formData.concierge}
                    onChange={() => setFormData({...formData, concierge: true})}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">
                    <strong>Full Concierge Service ($299)</strong> - Attorney preparation, execution guidance, and recording
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="service"
                    checked={!formData.concierge}
                    onChange={() => setFormData({...formData, concierge: false})}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">
                    Attorney Referral Only - We'll connect you with a licensed attorney
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};