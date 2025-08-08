import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Users, Mail, Phone, Plus, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useEstateRequests } from '../hooks/useEstateRequests';
import { getStateCompliance } from '../stateCompliance';

interface WitnessInviteProps {
  requestId: string;
  stateCode: string;
  className?: string;
}

interface Witness {
  fullName: string;
  email: string;
  phone: string;
}

export const WitnessInvite: React.FC<WitnessInviteProps> = ({
  requestId,
  stateCode,
  className = ''
}) => {
  const { inviteWitnesses } = useEstateRequests();
  const [witnesses, setWitnesses] = useState<Witness[]>([
    { fullName: '', email: '', phone: '' },
    { fullName: '', email: '', phone: '' }
  ]);
  const [useWitnessPool, setUseWitnessPool] = useState(false);
  const [loading, setLoading] = useState(false);

  const compliance = getStateCompliance(stateCode);
  const requiredWitnesses = compliance?.witnessesRequired || 2;

  const updateWitness = (index: number, field: keyof Witness, value: string) => {
    const updated = [...witnesses];
    updated[index] = { ...updated[index], [field]: value };
    setWitnesses(updated);
  };

  const addWitness = () => {
    setWitnesses([...witnesses, { fullName: '', email: '', phone: '' }]);
  };

  const removeWitness = (index: number) => {
    if (witnesses.length > requiredWitnesses) {
      setWitnesses(witnesses.filter((_, i) => i !== index));
    }
  };

  const handleInvite = async () => {
    if (useWitnessPool) {
      // Handle witness pool matching
      setLoading(true);
      try {
        // Mock witness pool assignment
        console.log('Matching witnesses from pool...');
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        setLoading(false);
      }
      return;
    }

    const validWitnesses = witnesses
      .filter(w => w.fullName.trim() && w.email.trim())
      .slice(0, requiredWitnesses);

    if (validWitnesses.length < requiredWitnesses) {
      return;
    }

    setLoading(true);
    try {
      await inviteWitnesses(requestId, validWitnesses);
    } finally {
      setLoading(false);
    }
  };

  const isValid = useWitnessPool || 
    witnesses.filter(w => w.fullName.trim() && w.email.trim()).length >= requiredWitnesses;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Invite Witnesses
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {requiredWitnesses} Required
          </Badge>
          <Badge variant="outline">
            {stateCode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Witness Pool Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <div className="font-medium">Use Professional Witness Pool</div>
            <div className="text-sm text-muted-foreground">
              We'll match you with verified professional witnesses
            </div>
          </div>
          <Switch
            checked={useWitnessPool}
            onCheckedChange={setUseWitnessPool}
          />
        </div>

        {!useWitnessPool ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Invite people you know to witness your document signing. They must be adults who are not beneficiaries.
            </div>

            {witnesses.map((witness, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Witness {index + 1}</h4>
                  {witnesses.length > requiredWitnesses && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWitness(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={witness.fullName}
                      onChange={(e) => updateWitness(index, 'fullName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={witness.email}
                      onChange={(e) => updateWitness(index, 'email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={witness.phone}
                      onChange={(e) => updateWitness(index, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {witnesses.length < 3 && (
              <Button
                variant="outline"
                onClick={addWitness}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Witness
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Professional Witness Pool</h4>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Background-checked professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Available within 24-48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>State-licensed and bonded</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Additional fee: $75 per witness</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              We'll match you with qualified witnesses in your area who can join your signing session.
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800 mb-1">Witness Requirements</div>
              <ul className="text-yellow-700 space-y-0.5">
                <li>• Must be 18+ years old</li>
                <li>• Cannot be beneficiaries of your will</li>
                <li>• Must have valid government-issued ID</li>
                <li>• Must be mentally competent</li>
                {compliance?.specialNotes?.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          onClick={handleInvite}
          disabled={!isValid || loading}
        >
          {loading ? 'Processing...' : 
           useWitnessPool ? 'Match Professional Witnesses' : 
           'Send Invitations'}
        </Button>

        {/* Status Messages */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Witnesses will receive email invitations with session details</p>
          <p>• They can join from any device with camera and microphone</p>
          <p>• Identity verification required before witnessing</p>
        </div>
      </CardContent>
    </Card>
  );
};