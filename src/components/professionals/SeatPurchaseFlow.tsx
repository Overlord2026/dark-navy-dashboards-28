import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  CreditCard, 
  Gift, 
  Building2, 
  Shield,
  Star,
  Check,
  Plus,
  Minus,
  Mail,
  Calendar,
  DollarSign,
  Target,
  Heart,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SeatPurchaseData {
  purchaseType: 'individual' | 'bulk' | 'gift' | 'enterprise';
  seatTier: 'basic' | 'premium' | 'enterprise';
  quantity: number;
  recipients: Array<{
    email: string;
    name: string;
    relationship: string;
    customMessage?: string;
  }>;
  billingInfo: {
    companyName?: string;
    department?: string;
    poNumber?: string;
    billingContact?: string;
  };
  scheduledDelivery?: string;
  corporateBranding?: boolean;
}

interface SeatPurchaseFlowProps {
  isOpen: boolean;
  onClose: () => void;
  professionalType: string;
  onPurchaseComplete?: (data: SeatPurchaseData) => void;
}

const SEAT_TIERS = {
  basic: {
    name: 'Basic',
    price: 19,
    features: ['Client Dashboard', 'Document Sharing', 'Basic Reporting', 'Email Support'],
    color: 'bg-blue-500'
  },
  premium: {
    name: 'Premium',
    price: 49,
    features: ['Everything in Basic', 'Advanced Analytics', 'Custom Branding', 'Priority Support', 'API Access'],
    color: 'bg-purple-500'
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Premium', 'White-label Solution', 'Dedicated Support', 'Custom Integrations', 'Compliance Tools'],
    color: 'bg-gold-500'
  }
};

const RELATIONSHIP_OPTIONS = [
  'Client',
  'Team Member',
  'Associate',
  'Partner',
  'Family Member',
  'Colleague',
  'Referral Partner',
  'Other'
];

export function SeatPurchaseFlow({ isOpen, onClose, professionalType, onPurchaseComplete }: SeatPurchaseFlowProps) {
  const { userProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseData, setPurchaseData] = useState<SeatPurchaseData>({
    purchaseType: 'individual',
    seatTier: 'basic',
    quantity: 1,
    recipients: [{ email: '', name: '', relationship: 'Client' }],
    billingInfo: {},
    corporateBranding: false
  });
  const [loading, setLoading] = useState(false);

  const updateRecipient = (index: number, field: string, value: string) => {
    const newRecipients = [...purchaseData.recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setPurchaseData({ ...purchaseData, recipients: newRecipients });
  };

  const addRecipient = () => {
    setPurchaseData({
      ...purchaseData,
      recipients: [...purchaseData.recipients, { email: '', name: '', relationship: 'Client' }]
    });
  };

  const removeRecipient = (index: number) => {
    if (purchaseData.recipients.length > 1) {
      setPurchaseData({
        ...purchaseData,
        recipients: purchaseData.recipients.filter((_, i) => i !== index)
      });
    }
  };

  const calculateTotal = () => {
    const basePrice = SEAT_TIERS[purchaseData.seatTier].price;
    let total = basePrice * purchaseData.quantity;
    
    // Volume discounts
    if (purchaseData.quantity >= 10) total *= 0.9; // 10% discount
    if (purchaseData.quantity >= 25) total *= 0.85; // 15% total discount
    if (purchaseData.quantity >= 50) total *= 0.8; // 20% total discount
    
    return total;
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // Create seats and invitations
      for (const recipient of purchaseData.recipients) {
        if (recipient.email && recipient.name) {
          // Create family group seat
          const { error: seatError } = await supabase
            .from('family_group_members')
            .insert({
              invited_by: userProfile?.id,
              email: recipient.email,
              name: recipient.name,
              relationship: recipient.relationship,
              seat_tier: purchaseData.seatTier,
              status: 'invited',
              custom_message: recipient.customMessage,
              professional_id: userProfile?.id
            });

          if (seatError) throw seatError;
        }
      }

      // Create payment record (simplified for now)
      const { error: paymentError } = await supabase
        .from('seat_purchases')
        .insert({
          purchaser_id: userProfile?.id,
          purchase_type: purchaseData.purchaseType,
          seat_tier: purchaseData.seatTier,
          quantity: purchaseData.quantity,
          total_amount: calculateTotal(),
          billing_info: purchaseData.billingInfo,
          status: 'completed'
        });

      if (paymentError) throw paymentError;

      toast.success(`Successfully purchased ${purchaseData.quantity} seat(s)! Invitations will be sent shortly.`);
      onPurchaseComplete?.(purchaseData);
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPurchaseTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Purchase Type</h3>
        <p className="text-muted-foreground">
          How would you like to purchase seats for the Family Office platform?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            purchaseData.purchaseType === 'individual' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
          }`}
          onClick={() => setPurchaseData({ ...purchaseData, purchaseType: 'individual' })}
        >
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Individual Clients</h4>
            <p className="text-sm text-muted-foreground">
              Purchase seats for specific clients or team members
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            purchaseData.purchaseType === 'bulk' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
          }`}
          onClick={() => setPurchaseData({ ...purchaseData, purchaseType: 'bulk' })}
        >
          <CardContent className="p-6 text-center">
            <Building2 className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Bulk Purchase</h4>
            <p className="text-sm text-muted-foreground">
              Buy multiple seats with volume discounts
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            purchaseData.purchaseType === 'gift' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
          }`}
          onClick={() => setPurchaseData({ ...purchaseData, purchaseType: 'gift' })}
        >
          <CardContent className="p-6 text-center">
            <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Gift Subscriptions</h4>
            <p className="text-sm text-muted-foreground">
              Give the gift of financial empowerment
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            purchaseData.purchaseType === 'enterprise' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
          }`}
          onClick={() => setPurchaseData({ ...purchaseData, purchaseType: 'enterprise' })}
        >
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Enterprise Benefits</h4>
            <p className="text-sm text-muted-foreground">
              Corporate subscriptions and employee benefits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSeatConfiguration = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select Seat Configuration</h3>
        <p className="text-muted-foreground">
          Choose the tier and quantity that best fits your needs
        </p>
      </div>

      {/* Seat Tier Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Seat Tier</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(SEAT_TIERS).map(([key, tier]) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all ${
                purchaseData.seatTier === key ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => setPurchaseData({ ...purchaseData, seatTier: key as any })}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`w-4 h-4 rounded-full ${tier.color} mx-auto mb-2`} />
                  <h4 className="font-semibold">{tier.name}</h4>
                  <div className="text-2xl font-bold mt-2">${tier.price}</div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
                <div className="mt-4 space-y-1">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Quantity</Label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPurchaseData({ 
              ...purchaseData, 
              quantity: Math.max(1, purchaseData.quantity - 1) 
            })}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="text-center min-w-16">
            <div className="text-2xl font-bold">{purchaseData.quantity}</div>
            <div className="text-xs text-muted-foreground">seats</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPurchaseData({ 
              ...purchaseData, 
              quantity: purchaseData.quantity + 1 
            })}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Discount Indicator */}
        {purchaseData.quantity >= 10 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Volume Discount Applied!</span>
            </div>
            <div className="text-sm text-green-600 mt-1">
              {purchaseData.quantity >= 50 ? '20% discount on all seats' :
               purchaseData.quantity >= 25 ? '15% discount on all seats' :
               '10% discount on all seats'}
            </div>
          </div>
        )}
      </div>

      {/* Total Calculation */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Monthly Cost:</span>
          <div className="text-right">
            <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              ${(calculateTotal() / purchaseData.quantity).toFixed(2)} per seat
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecipientDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Recipient Information</h3>
        <p className="text-muted-foreground">
          Enter details for each person who will receive access
        </p>
      </div>

      <div className="space-y-4">
        {purchaseData.recipients.map((recipient, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">Recipient {index + 1}</h4>
              {purchaseData.recipients.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRecipient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Full Name</Label>
                <Input
                  id={`name-${index}`}
                  value={recipient.name}
                  onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email Address</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={recipient.email}
                  onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`relationship-${index}`}>Relationship</Label>
                <Select 
                  value={recipient.relationship} 
                  onValueChange={(value) => updateRecipient(index, 'relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {purchaseData.purchaseType === 'gift' && (
                <div className="space-y-2">
                  <Label htmlFor={`message-${index}`}>Personal Message (Optional)</Label>
                  <Textarea
                    id={`message-${index}`}
                    value={recipient.customMessage || ''}
                    onChange={(e) => updateRecipient(index, 'customMessage', e.target.value)}
                    placeholder="Add a personal message to your gift..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addRecipient}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Recipient
        </Button>
      </div>

      {/* Gift Scheduling */}
      {purchaseData.purchaseType === 'gift' && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Gift Delivery Options</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled-delivery">Schedule Delivery (Optional)</Label>
              <Input
                id="scheduled-delivery"
                type="datetime-local"
                value={purchaseData.scheduledDelivery || ''}
                onChange={(e) => setPurchaseData({ 
                  ...purchaseData, 
                  scheduledDelivery: e.target.value 
                })}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to send immediately
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderBillingInformation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Billing Information</h3>
        <p className="text-muted-foreground">
          Complete your purchase details
        </p>
      </div>

      {purchaseData.purchaseType === 'enterprise' && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Enterprise Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={purchaseData.billingInfo.companyName || ''}
                onChange={(e) => setPurchaseData({
                  ...purchaseData,
                  billingInfo: { ...purchaseData.billingInfo, companyName: e.target.value }
                })}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={purchaseData.billingInfo.department || ''}
                onChange={(e) => setPurchaseData({
                  ...purchaseData,
                  billingInfo: { ...purchaseData.billingInfo, department: e.target.value }
                })}
                placeholder="HR, Benefits, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="po-number">PO Number (Optional)</Label>
              <Input
                id="po-number"
                value={purchaseData.billingInfo.poNumber || ''}
                onChange={(e) => setPurchaseData({
                  ...purchaseData,
                  billingInfo: { ...purchaseData.billingInfo, poNumber: e.target.value }
                })}
                placeholder="Purchase order number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-contact">Billing Contact</Label>
              <Input
                id="billing-contact"
                value={purchaseData.billingInfo.billingContact || ''}
                onChange={(e) => setPurchaseData({
                  ...purchaseData,
                  billingInfo: { ...purchaseData.billingInfo, billingContact: e.target.value }
                })}
                placeholder="Billing contact email"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Purchase Summary */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Purchase Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Seat Tier:</span>
            <Badge variant="outline">{SEAT_TIERS[purchaseData.seatTier].name}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span>{purchaseData.quantity} seats</span>
          </div>
          <div className="flex justify-between">
            <span>Purchase Type:</span>
            <span className="capitalize">{purchaseData.purchaseType}</span>
          </div>
          {purchaseData.quantity >= 10 && (
            <div className="flex justify-between text-green-600">
              <span>Volume Discount:</span>
              <span>
                {purchaseData.quantity >= 50 ? '-20%' :
                 purchaseData.quantity >= 25 ? '-15%' :
                 '-10%'}
              </span>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Monthly:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Button */}
      <Button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full gap-2 h-12 text-lg"
      >
        <CreditCard className="w-5 h-5" />
        {loading ? 'Processing...' : `Complete Purchase - $${calculateTotal().toFixed(2)}/month`}
      </Button>
    </div>
  );

  const steps = [
    { id: 1, title: 'Purchase Type', component: renderPurchaseTypeSelection },
    { id: 2, title: 'Configuration', component: renderSeatConfiguration },
    { id: 3, title: 'Recipients', component: renderRecipientDetails },
    { id: 4, title: 'Billing', component: renderBillingInformation }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Purchase Family Office Seats
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep - 1].component()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < steps.length && (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}