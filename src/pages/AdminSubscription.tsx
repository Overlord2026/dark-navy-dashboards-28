
import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Check, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSubscription() {
  const [tiers, setTiers] = useState([
    {
      id: 'core',
      name: 'Core White-Labeled Advizon',
      price: 299,
      description: 'Essential platform features for financial advisors',
      features: [
        { id: 'dashboard', name: 'Client Dashboard', included: true },
        { id: 'planning', name: 'Financial Planning Tools', included: true },
        { id: 'documents', name: 'Document Management', included: true },
        { id: 'billing', name: 'Billing Integration', included: true },
      ],
      active: true
    },
    {
      id: 'catchlight',
      name: 'Catchlight Integration',
      price: 149,
      description: 'AI-powered client prospecting',
      features: [
        { id: 'prospecting', name: 'Prospect Scoring', included: true },
        { id: 'insights', name: 'Client Insights', included: true },
        { id: 'targeting', name: 'Targeted Marketing', included: true },
      ],
      active: true
    },
    {
      id: 'emoney',
      name: 'eMoney Integration',
      price: 199,
      description: 'Enhanced financial planning capabilities',
      features: [
        { id: 'advanced-planning', name: 'Advanced Planning Tools', included: true },
        { id: 'scenario', name: 'Scenario Analysis', included: true },
        { id: 'reporting', name: 'Client Reporting', included: true },
      ],
      active: true
    }
  ]);
  
  const [discounts, setDiscounts] = useState([
    { id: 'bundle', name: 'Bundle Discount', percentage: 15, active: true },
    { id: 'annual', name: 'Annual Payment', percentage: 10, active: true }
  ]);
  
  const [editingTier, setEditingTier] = useState(null);
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: '',
    features: [{ id: Date.now().toString(), name: '', included: true }]
  });
  
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    percentage: '',
  });
  
  const handleSaveSettings = () => {
    // Here you would normally save to your backend
    console.log('Saving subscription settings:', { tiers, discounts });
    toast.success('Subscription settings saved successfully');
  };
  
  const handleAddFeature = (tierId) => {
    if (editingTier) {
      setEditingTier({
        ...editingTier,
        features: [
          ...editingTier.features, 
          { id: Date.now().toString(), name: '', included: true }
        ]
      });
    } else {
      setNewTier({
        ...newTier,
        features: [
          ...newTier.features, 
          { id: Date.now().toString(), name: '', included: true }
        ]
      });
    }
  };
  
  const handleRemoveFeature = (featureId) => {
    if (editingTier) {
      setEditingTier({
        ...editingTier,
        features: editingTier.features.filter(feature => feature.id !== featureId)
      });
    } else {
      setNewTier({
        ...newTier,
        features: newTier.features.filter(feature => feature.id !== featureId)
      });
    }
  };
  
  const handleEditTier = (tier) => {
    setEditingTier(tier);
    setNewTier({
      name: '',
      price: '',
      description: '',
      features: [{ id: Date.now().toString(), name: '', included: true }]
    });
  };
  
  const handleUpdateTier = () => {
    setTiers(tiers.map(tier => tier.id === editingTier.id ? editingTier : tier));
    setEditingTier(null);
    toast.success('Tier updated successfully');
  };
  
  const handleAddTier = () => {
    if (!newTier.name || !newTier.price || !newTier.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const tierWithId = {
      ...newTier,
      id: Date.now().toString(),
      price: parseFloat(newTier.price),
      active: true
    };
    
    setTiers([...tiers, tierWithId]);
    setNewTier({
      name: '',
      price: '',
      description: '',
      features: [{ id: Date.now().toString(), name: '', included: true }]
    });
    toast.success('New tier added successfully');
  };
  
  const handleToggleTier = (tierId) => {
    setTiers(tiers.map(tier => {
      if (tier.id === tierId) {
        return { ...tier, active: !tier.active };
      }
      return tier;
    }));
  };
  
  const handleAddDiscount = () => {
    if (!newDiscount.name || !newDiscount.percentage) {
      toast.error('Please fill in all discount fields');
      return;
    }
    
    const discountWithId = {
      ...newDiscount,
      id: Date.now().toString(),
      percentage: parseFloat(newDiscount.percentage),
      active: true
    };
    
    setDiscounts([...discounts, discountWithId]);
    setNewDiscount({ name: '', percentage: '' });
    toast.success('New discount added successfully');
  };
  
  const handleToggleDiscount = (discountId) => {
    setDiscounts(discounts.map(discount => {
      if (discount.id === discountId) {
        return { ...discount, active: !discount.active };
      }
      return discount;
    }));
  };
  
  const handleDeleteDiscount = (discountId) => {
    setDiscounts(discounts.filter(discount => discount.id !== discountId));
    toast.success('Discount removed successfully');
  };

  return (
    <ThreeColumnLayout activeMainItem="admin" title="Admin - Subscription Tiers">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Advisor Subscription Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Subscription Settings
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="tiers">
          <TabsList className="mb-4">
            <TabsTrigger value="tiers">Subscription Tiers</TabsTrigger>
            <TabsTrigger value="addons">Add-On Modules</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tiers">
            <Card>
              <CardHeader>
                <CardTitle>Core Subscription Tiers</CardTitle>
                <CardDescription>
                  Configure the basic subscription options for advisors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.filter(tier => tier.id === 'core').map(tier => (
                    <div key={tier.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">{tier.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={tier.active} 
                              onCheckedChange={() => handleToggleTier(tier.id)} 
                            />
                            <span className="text-sm">{tier.active ? 'Active' : 'Inactive'}</span>
                          </div>
                          <div>
                            <span className="text-lg font-semibold">${tier.price}</span>
                            <span className="text-muted-foreground">/month</span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleEditTier(tier)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tier.features.map(feature => (
                            <div key={feature.id} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="addons">
            <Card>
              <CardHeader>
                <CardTitle>Add-On Modules</CardTitle>
                <CardDescription>
                  Configure additional modules that advisors can add to their subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.filter(tier => tier.id !== 'core').map(tier => (
                    <div key={tier.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">{tier.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={tier.active} 
                              onCheckedChange={() => handleToggleTier(tier.id)} 
                            />
                            <span className="text-sm">{tier.active ? 'Active' : 'Inactive'}</span>
                          </div>
                          <div>
                            <span className="text-lg font-semibold">${tier.price}</span>
                            <span className="text-muted-foreground">/month</span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleEditTier(tier)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tier.features.map(feature => (
                            <div key={feature.id} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Add New Module</h3>
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-tier-name">Module Name</Label>
                          <Input 
                            id="new-tier-name" 
                            value={newTier.name}
                            onChange={(e) => setNewTier({...newTier, name: e.target.value})}
                            placeholder="e.g., Risk Analysis Module"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-tier-price">Monthly Price ($)</Label>
                          <Input 
                            id="new-tier-price" 
                            type="number"
                            value={newTier.price}
                            onChange={(e) => setNewTier({...newTier, price: e.target.value})}
                            placeholder="99"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-tier-description">Description</Label>
                        <Input 
                          id="new-tier-description" 
                          value={newTier.description}
                          onChange={(e) => setNewTier({...newTier, description: e.target.value})}
                          placeholder="Describe what this module offers"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Features</Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={handleAddFeature}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Feature
                          </Button>
                        </div>
                        
                        {newTier.features.map((feature, index) => (
                          <div key={feature.id} className="flex items-center gap-2">
                            <Input 
                              value={feature.name}
                              onChange={(e) => {
                                const updatedFeatures = [...newTier.features];
                                updatedFeatures[index] = {
                                  ...feature,
                                  name: e.target.value
                                };
                                setNewTier({...newTier, features: updatedFeatures});
                              }}
                              placeholder="Feature name"
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRemoveFeature(feature.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={handleAddTier}
                        className="mt-4"
                      >
                        Add Module
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {editingTier && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Edit {editingTier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-tier-name">Module Name</Label>
                        <Input 
                          id="edit-tier-name" 
                          value={editingTier.name}
                          onChange={(e) => setEditingTier({...editingTier, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-tier-price">Monthly Price ($)</Label>
                        <Input 
                          id="edit-tier-price" 
                          type="number"
                          value={editingTier.price}
                          onChange={(e) => setEditingTier({...editingTier, price: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-tier-description">Description</Label>
                      <Input 
                        id="edit-tier-description" 
                        value={editingTier.description}
                        onChange={(e) => setEditingTier({...editingTier, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Features</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddFeature(editingTier.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Feature
                        </Button>
                      </div>
                      
                      {editingTier.features.map((feature, index) => (
                        <div key={feature.id} className="flex items-center gap-2">
                          <Input 
                            value={feature.name}
                            onChange={(e) => {
                              const updatedFeatures = [...editingTier.features];
                              updatedFeatures[index] = {
                                ...feature,
                                name: e.target.value
                              };
                              setEditingTier({...editingTier, features: updatedFeatures});
                            }}
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveFeature(feature.id)}
                            disabled={editingTier.features.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setEditingTier(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleUpdateTier}
                      >
                        Update Module
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="discounts">
            <Card>
              <CardHeader>
                <CardTitle>Discount Settings</CardTitle>
                <CardDescription>
                  Configure discounts for advisor subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-3 text-left text-sm font-medium">Discount Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Percentage</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {discounts.map(discount => (
                          <tr key={discount.id}>
                            <td className="px-4 py-3 text-sm">{discount.name}</td>
                            <td className="px-4 py-3 text-sm">{discount.percentage}%</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Switch 
                                  checked={discount.active} 
                                  onCheckedChange={() => handleToggleDiscount(discount.id)} 
                                />
                                <span className="text-sm">{discount.active ? 'Active' : 'Inactive'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteDiscount(discount.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Add New Discount</h3>
                    <div className="flex gap-4 items-end">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="new-discount-name">Discount Name</Label>
                        <Input 
                          id="new-discount-name" 
                          value={newDiscount.name}
                          onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
                          placeholder="e.g., Early Adopter Discount"
                        />
                      </div>
                      <div className="space-y-2 w-32">
                        <Label htmlFor="new-discount-percentage">Percentage (%)</Label>
                        <Input 
                          id="new-discount-percentage" 
                          type="number"
                          value={newDiscount.percentage}
                          onChange={(e) => setNewDiscount({...newDiscount, percentage: e.target.value})}
                          placeholder="10"
                        />
                      </div>
                      <Button 
                        type="button" 
                        onClick={handleAddDiscount}
                      >
                        Add Discount
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
