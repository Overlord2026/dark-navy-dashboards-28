import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Search,
  MapPin,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NumberPortingWizardProps {
  onComplete: (phoneNumber: string) => void;
  onCancel: () => void;
}

export function NumberPortingWizard({ onComplete, onCancel }: NumberPortingWizardProps) {
  const [step, setStep] = useState(1);
  const [setupType, setSetupType] = useState<'port' | 'new'>('new');
  const [portingData, setPortingData] = useState({
    currentNumber: '',
    currentProvider: '',
    accountNumber: '',
    pin: '',
    authorizedName: '',
    billingAddress: ''
  });
  const [newNumberData, setNewNumberData] = useState({
    areaCode: '',
    selectedNumber: '',
    friendlyName: ''
  });
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const totalSteps = setupType === 'port' ? 4 : 3;
  const progress = (step / totalSteps) * 100;

  const searchNumbers = async () => {
    if (!newNumberData.areaCode) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-search-numbers', {
        body: { areaCode: newNumberData.areaCode }
      });

      if (error) throw error;
      setAvailableNumbers(data.numbers || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for available numbers.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const reserveNumber = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('twilio-phone-manager', {
        body: {
          advisorId: user.user.id,
          areaCode: newNumberData.areaCode,
          friendlyName: newNumberData.friendlyName || `BFO - ${user.user.email}`
        }
      });

      if (error) throw error;

      toast({
        title: "Number activated!",
        description: `Your new number ${phoneNumber} is ready to use.`
      });

      onComplete(phoneNumber);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate number. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitPortRequest = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('twilio-port-number', {
        body: {
          ...portingData,
          advisorId: user.user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Port request submitted",
        description: "We'll notify you when your number is ready (typically 2-5 business days)."
      });

      setStep(step + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit port request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Choose Your Setup Method</h3>
              <RadioGroup value={setupType} onValueChange={setSetupType as any}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="new" id="new" />
                  <label htmlFor="new" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Get a New Number</div>
                        <div className="text-sm text-muted-foreground">
                          Choose from available numbers in your area
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="port" id="port" />
                  <label htmlFor="port" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Port My Existing Number</div>
                        <div className="text-sm text-muted-foreground">
                          Keep your current business number
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        if (setupType === 'new') {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Choose Your New Number</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="areaCode">Area Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="areaCode"
                        placeholder="Enter area code (e.g., 555)"
                        value={newNumberData.areaCode}
                        onChange={(e) => setNewNumberData(prev => ({ ...prev, areaCode: e.target.value }))}
                        maxLength={3}
                      />
                      <Button onClick={searchNumbers} disabled={loading || !newNumberData.areaCode}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>

                  {availableNumbers.length > 0 && (
                    <div>
                      <Label>Available Numbers</Label>
                      <div className="grid gap-2 mt-2">
                        {availableNumbers.map((number) => (
                          <Card 
                            key={number} 
                            className={`cursor-pointer transition-colors hover:bg-accent ${
                              newNumberData.selectedNumber === number ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setNewNumberData(prev => ({ ...prev, selectedNumber: number }))}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-lg">{number}</span>
                                <Badge variant="secondary">Available</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="friendlyName">Display Name (Optional)</Label>
                    <Input
                      id="friendlyName"
                      placeholder="e.g., John Smith - Wealth Advisory"
                      value={newNumberData.friendlyName}
                      onChange={(e) => setNewNumberData(prev => ({ ...prev, friendlyName: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Current Number Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentNumber">Current Phone Number</Label>
                    <Input
                      id="currentNumber"
                      placeholder="+1 (555) 123-4567"
                      value={portingData.currentNumber}
                      onChange={(e) => setPortingData(prev => ({ ...prev, currentNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentProvider">Current Provider</Label>
                    <Select onValueChange={(value) => setPortingData(prev => ({ ...prev, currentProvider: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verizon">Verizon</SelectItem>
                        <SelectItem value="att">AT&T</SelectItem>
                        <SelectItem value="tmobile">T-Mobile</SelectItem>
                        <SelectItem value="sprint">Sprint</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={portingData.accountNumber}
                      onChange={(e) => setPortingData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pin">Account PIN/Password</Label>
                    <Input
                      id="pin"
                      type="password"
                      value={portingData.pin}
                      onChange={(e) => setPortingData(prev => ({ ...prev, pin: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }

      case 3:
        if (setupType === 'new') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Activate</h3>
                <p className="text-muted-foreground mb-6">
                  Your selected number will be activated instantly
                </p>
                
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Selected Number:</span>
                        <span className="font-mono text-lg">{newNumberData.selectedNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Display Name:</span>
                        <span>{newNumberData.friendlyName || 'Default'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Cost:</span>
                        <span>$15/month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Authorization Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="authorizedName">Authorized Person Name</Label>
                    <Input
                      id="authorizedName"
                      placeholder="Full name on the account"
                      value={portingData.authorizedName}
                      onChange={(e) => setPortingData(prev => ({ ...prev, authorizedName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Textarea
                      id="billingAddress"
                      placeholder="Enter complete billing address"
                      value={portingData.billingAddress}
                      onChange={(e) => setPortingData(prev => ({ ...prev, billingAddress: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Port Request Submitted</h3>
              <p className="text-muted-foreground mb-6">
                Your number port is being processed. This typically takes 2-5 business days.
              </p>
              
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Number:</span>
                      <span className="font-mono">{portingData.currentNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expected Completion:</span>
                      <span>2-5 business days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-sm text-muted-foreground mt-4">
                We'll send you updates via email and SMS throughout the process.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return setupType === 'port' || setupType === 'new';
      case 2:
        if (setupType === 'new') {
          return newNumberData.selectedNumber !== '';
        } else {
          return portingData.currentNumber && portingData.currentProvider && portingData.accountNumber && portingData.pin;
        }
      case 3:
        if (setupType === 'new') {
          return true;
        } else {
          return portingData.authorizedName && portingData.billingAddress;
        }
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (setupType === 'new' && step === 3) {
      reserveNumber(newNumberData.selectedNumber);
    } else if (setupType === 'port' && step === 3) {
      submitPortRequest();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {setupType === 'port' ? 'Port Your Number' : 'Get New Number'}
            </CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>

          {step < totalSteps && (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {step === totalSteps - 1 && setupType === 'new' ? 'Activate Number' : 
               step === totalSteps - 1 && setupType === 'port' ? 'Submit Port Request' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === totalSteps && (
            <Button onClick={() => onComplete(setupType === 'new' ? newNumberData.selectedNumber : portingData.currentNumber)}>
              Complete Setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}