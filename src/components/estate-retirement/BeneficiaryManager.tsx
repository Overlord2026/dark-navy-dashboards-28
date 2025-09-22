import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Heart,
  DollarSign,
  Calculator
} from 'lucide-react';
import { useEstateRetirementIntegration, BeneficiaryInfo } from '@/contexts/EstateRetirementIntegrationContext';
import { toast } from 'sonner';

export function BeneficiaryManager() {
  const { 
    beneficiaries, 
    addBeneficiary, 
    updateBeneficiary, 
    removeBeneficiary 
  } = useEstateRetirementIntegration();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<BeneficiaryInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    age: '',
    taxBracket: '',
    dependsOnInheritance: false
  });

  const relationships = [
    'Spouse',
    'Child',
    'Grandchild', 
    'Parent',
    'Sibling',
    'Other Family',
    'Friend',
    'Charity',
    'Trust'
  ];

  const taxBrackets = [
    { label: '10%', value: 10 },
    { label: '12%', value: 12 },
    { label: '22%', value: 22 },
    { label: '24%', value: 24 },
    { label: '32%', value: 32 },
    { label: '35%', value: 35 },
    { label: '37%', value: 37 }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      age: '',
      taxBracket: '',
      dependsOnInheritance: false
    });
    setEditingBeneficiary(null);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.relationship || !formData.age || !formData.taxBracket) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBeneficiary: BeneficiaryInfo = {
      id: Date.now().toString(),
      name: formData.name,
      relationship: formData.relationship,
      age: parseInt(formData.age),
      taxBracket: parseInt(formData.taxBracket),
      dependsOnInheritance: formData.dependsOnInheritance
    };

    addBeneficiary(newBeneficiary);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Beneficiary added successfully');
  };

  const handleEdit = (beneficiary: BeneficiaryInfo) => {
    setEditingBeneficiary(beneficiary);
    setFormData({
      name: beneficiary.name,
      relationship: beneficiary.relationship,
      age: beneficiary.age.toString(),
      taxBracket: beneficiary.taxBracket.toString(),
      dependsOnInheritance: beneficiary.dependsOnInheritance
    });
  };

  const handleUpdate = () => {
    if (!editingBeneficiary) return;

    if (!formData.name || !formData.relationship || !formData.age || !formData.taxBracket) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateBeneficiary(editingBeneficiary.id, {
      name: formData.name,
      relationship: formData.relationship,
      age: parseInt(formData.age),
      taxBracket: parseInt(formData.taxBracket),
      dependsOnInheritance: formData.dependsOnInheritance
    });

    resetForm();
    toast.success('Beneficiary updated successfully');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} as a beneficiary?`)) {
      removeBeneficiary(id);
      toast.success('Beneficiary removed successfully');
    }
  };

  const getTaxBracketColor = (bracket: number) => {
    if (bracket <= 12) return 'text-green-600 bg-green-50 border-green-200';
    if (bracket <= 24) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'spouse': return <Heart className="h-4 w-4" />;
      case 'child':
      case 'grandchild': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Beneficiaries ({beneficiaries.length})
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Beneficiary
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Beneficiary</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Beneficiary name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((rel) => (
                          <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Current age"
                      min="0"
                      max="120"
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxBracket">Tax Bracket *</Label>
                    <Select
                      value={formData.taxBracket}
                      onValueChange={(value) => setFormData({ ...formData, taxBracket: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax bracket" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxBrackets.map((bracket) => (
                          <SelectItem key={bracket.value} value={bracket.value.toString()}>
                            {bracket.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dependsOnInheritance"
                      checked={formData.dependsOnInheritance}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, dependsOnInheritance: !!checked })
                      }
                    />
                    <Label htmlFor="dependsOnInheritance" className="text-sm">
                      Financially depends on inheritance
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>Add Beneficiary</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {beneficiaries.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Beneficiaries Added</h3>
              <p className="text-muted-foreground mb-4">
                Add beneficiaries to analyze estate settlement and tax optimization strategies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getRelationshipIcon(beneficiary.relationship)}
                        <div>
                          <h4 className="font-semibold">{beneficiary.name}</h4>
                          <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(beneficiary)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(beneficiary.id, beneficiary.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Age:</span>
                        <Badge variant="outline">{beneficiary.age}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tax Bracket:</span>
                        <Badge 
                          variant="outline" 
                          className={getTaxBracketColor(beneficiary.taxBracket)}
                        >
                          {beneficiary.taxBracket}%
                        </Badge>
                      </div>
                      {beneficiary.dependsOnInheritance && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-600">Depends on inheritance</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingBeneficiary} onOpenChange={() => setEditingBeneficiary(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Beneficiary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Beneficiary name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-relationship">Relationship *</Label>
              <Select
                value={formData.relationship}
                onValueChange={(value) => setFormData({ ...formData, relationship: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-age">Age *</Label>
              <Input
                id="edit-age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Current age"
                min="0"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="edit-taxBracket">Tax Bracket *</Label>
              <Select
                value={formData.taxBracket}
                onValueChange={(value) => setFormData({ ...formData, taxBracket: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax bracket" />
                </SelectTrigger>
                <SelectContent>
                  {taxBrackets.map((bracket) => (
                    <SelectItem key={bracket.value} value={bracket.value.toString()}>
                      {bracket.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-dependsOnInheritance"
                checked={formData.dependsOnInheritance}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, dependsOnInheritance: !!checked })
                }
              />
              <Label htmlFor="edit-dependsOnInheritance" className="text-sm">
                Financially depends on inheritance
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBeneficiary(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Beneficiary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Beneficiary Statistics */}
      {beneficiaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Beneficiary Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">{beneficiaries.length}</p>
                <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  {(beneficiaries.reduce((sum, b) => sum + b.age, 0) / beneficiaries.length).toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">Average Age</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">
                  {(beneficiaries.reduce((sum, b) => sum + b.taxBracket, 0) / beneficiaries.length).toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Tax Bracket</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {beneficiaries.filter(b => b.dependsOnInheritance).length}
                </p>
                <p className="text-sm text-muted-foreground">Financially Dependent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}