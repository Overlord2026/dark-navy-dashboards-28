import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { processFNOL, bandDamageEstimate } from '@/services/fnol';
import { inputs_hash } from '@/lib/canonical';
import { AlertTriangle, Phone, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function FNOLPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policy_number: '',
    loss_date: '',
    loss_type: '',
    loss_cause: '',
    estimated_damage: '',
    zip_code: '',
    description: '',
    reporter_relationship: 'policyholder',
    reporter_contact: '',
    injuries_reported: false,
    police_report_filed: false,
    photos_count: 0
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const damageAmount = parseFloat(formData.estimated_damage) || 0;
      const damageBand = bandDamageEstimate(damageAmount);
      
      const intake = {
        policy_number: formData.policy_number,
        loss_date: formData.loss_date,
        loss_type: formData.loss_type,
        loss_cause: formData.loss_cause,
        estimated_damage_band: damageBand,
        location: {
          zip_first3: formData.zip_code.substring(0, 3)
        },
        description: formData.description,
        reporter: {
          relationship: formData.reporter_relationship,
          contact_hash: await inputs_hash({ contact: formData.reporter_contact })
        },
        injuries_reported: formData.injuries_reported,
        police_report_filed: formData.police_report_filed,
        photos_uploaded: formData.photos_count
      };

      const claimId = await processFNOL(intake);
      toast.success('Claim reported successfully');
      
      // Reset form
      setFormData({
        policy_number: '', loss_date: '', loss_type: '', loss_cause: '',
        estimated_damage: '', zip_code: '', description: '', reporter_relationship: 'policyholder',
        reporter_contact: '', injuries_reported: false, police_report_filed: false, photos_count: 0
      });
    } catch (error) {
      console.error('FNOL submission failed:', error);
      toast.error('Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold">First Notice of Loss</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="policy_number">Policy Number</Label>
              <Input id="policy_number" value={formData.policy_number} 
                onChange={(e) => setFormData(prev => ({ ...prev, policy_number: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="loss_date">Date of Loss</Label>
              <Input id="loss_date" type="date" value={formData.loss_date}
                onChange={(e) => setFormData(prev => ({ ...prev, loss_date: e.target.value }))} />
            </div>
            <div>
              <Label>Loss Type</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, loss_type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto_collision">Auto Collision</SelectItem>
                  <SelectItem value="auto_comprehensive">Auto Comprehensive</SelectItem>
                  <SelectItem value="property_fire">Property Fire</SelectItem>
                  <SelectItem value="property_water">Property Water</SelectItem>
                  <SelectItem value="property_theft">Property Theft</SelectItem>
                  <SelectItem value="property_wind">Property Wind</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Damage ($)</Label>
              <Input value={formData.estimated_damage} 
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_damage: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description of Loss</Label>
            <Textarea id="description" value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="injuries" checked={formData.injuries_reported}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, injuries_reported: !!checked }))} />
              <Label htmlFor="injuries">Injuries reported</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="police" checked={formData.police_report_filed}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, police_report_filed: !!checked }))} />
              <Label htmlFor="police">Police report filed</Label>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export { FNOLPage };
export default FNOLPage;