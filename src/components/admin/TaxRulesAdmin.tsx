import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calculator,
  FileText,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TaxBracket, TaxDeduction, TaxRule, FilingStatus } from '@/types/tax-rules';
import { useTaxRules } from '@/hooks/useTaxRules';

export const TaxRulesAdmin: React.FC = () => {
  const { brackets, deductions, rules, loading, error, refetch } = useTaxRules();
  const [editingBracket, setEditingBracket] = useState<Partial<TaxBracket> | null>(null);
  const [editingDeduction, setEditingDeduction] = useState<Partial<TaxDeduction> | null>(null);
  const [editingRule, setEditingRule] = useState<Partial<TaxRule> | null>(null);
  const [showAddDialog, setShowAddDialog] = useState<'bracket' | 'deduction' | 'rule' | null>(null);

  const filingStatuses: FilingStatus[] = ['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household'];
  const currentYear = new Date().getFullYear();

  const handleSaveBracket = async (bracket: Partial<TaxBracket>) => {
    try {
      if (bracket.id) {
        // Update existing
        const { error } = await supabase
          .from('tax_brackets')
          .update({
            tax_year: bracket.tax_year,
            filing_status: bracket.filing_status,
            min_income: bracket.min_income,
            max_income: bracket.max_income,
            rate: bracket.rate,
            bracket_order: bracket.bracket_order,
            is_active: bracket.is_active
          })
          .eq('id', bracket.id);
        
        if (error) throw error;
        toast.success('Tax bracket updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('tax_brackets')
          .insert([{
            tax_year: bracket.tax_year!,
            filing_status: bracket.filing_status!,
            min_income: bracket.min_income!,
            max_income: bracket.max_income,
            rate: bracket.rate!,
            bracket_order: bracket.bracket_order!,
            is_active: bracket.is_active ?? true
          }]);
        
        if (error) throw error;
        toast.success('Tax bracket created successfully');
      }
      
      setEditingBracket(null);
      setShowAddDialog(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tax bracket');
    }
  };

  const handleSaveDeduction = async (deduction: Partial<TaxDeduction>) => {
    try {
      if (deduction.id) {
        // Update existing
        const { error } = await supabase
          .from('tax_deductions')
          .update({
            tax_year: deduction.tax_year,
            deduction_type: deduction.deduction_type,
            filing_status: deduction.filing_status,
            amount: deduction.amount,
            description: deduction.description,
            is_active: deduction.is_active
          })
          .eq('id', deduction.id);
        
        if (error) throw error;
        toast.success('Tax deduction updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('tax_deductions')
          .insert([{
            tax_year: deduction.tax_year!,
            deduction_type: deduction.deduction_type!,
            filing_status: deduction.filing_status!,
            amount: deduction.amount!,
            description: deduction.description,
            is_active: deduction.is_active ?? true
          }]);
        
        if (error) throw error;
        toast.success('Tax deduction created successfully');
      }
      
      setEditingDeduction(null);
      setShowAddDialog(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tax deduction');
    }
  };

  const handleSaveRule = async (rule: Partial<TaxRule>) => {
    try {
      if (rule.id) {
        // Update existing
        const { error } = await supabase
          .from('tax_rules')
          .update({
            rule_type: rule.rule_type,
            rule_name: rule.rule_name,
            rule_value: rule.rule_value,
            effective_year: rule.effective_year,
            expires_year: rule.expires_year,
            description: rule.description,
            is_active: rule.is_active
          })
          .eq('id', rule.id);
        
        if (error) throw error;
        toast.success('Tax rule updated successfully');
      } else {
        // Create new
        const { error } = await supabase
          .from('tax_rules')
          .insert([{
            rule_type: rule.rule_type!,
            rule_name: rule.rule_name!,
            rule_value: rule.rule_value!,
            effective_year: rule.effective_year!,
            expires_year: rule.expires_year,
            description: rule.description,
            is_active: rule.is_active ?? true
          }]);
        
        if (error) throw error;
        toast.success('Tax rule created successfully');
      }
      
      setEditingRule(null);
      setShowAddDialog(null);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tax rule');
    }
  };

  const handleDeleteItem = async (table: string, id: string) => {
    try {
      let error;
      if (table === 'tax_brackets') {
        const result = await supabase.from('tax_brackets').delete().eq('id', id);
        error = result.error;
      } else if (table === 'tax_deductions') {
        const result = await supabase.from('tax_deductions').delete().eq('id', id);
        error = result.error;
      } else if (table === 'tax_rules') {
        const result = await supabase.from('tax_rules').delete().eq('id', id);
        error = result.error;
      }
      
      if (error) throw error;
      toast.success('Item deleted successfully');
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading tax rules: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tax Rules Administration</h2>
          <p className="text-muted-foreground">
            Manage tax brackets, deductions, and rules that power the tax calculators
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Admin Access Required
        </Badge>
      </div>

      <Tabs defaultValue="brackets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brackets" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Tax Brackets
          </TabsTrigger>
          <TabsTrigger value="deductions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Deductions
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Tax Rules
          </TabsTrigger>
        </TabsList>

        {/* Tax Brackets Tab */}
        <TabsContent value="brackets">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Brackets</CardTitle>
                  <CardDescription>
                    Manage tax bracket rates and income ranges for different filing statuses
                  </CardDescription>
                </div>
                <Dialog open={showAddDialog === 'bracket'} onOpenChange={(open) => setShowAddDialog(open ? 'bracket' : null)}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bracket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Tax Bracket</DialogTitle>
                    </DialogHeader>
                    <BracketForm
                      bracket={{
                        tax_year: currentYear,
                        filing_status: 'single',
                        min_income: 0,
                        max_income: null,
                        rate: 10,
                        bracket_order: 1,
                        is_active: true
                      }}
                      onSave={handleSaveBracket}
                      onCancel={() => setShowAddDialog(null)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Filing Status</TableHead>
                    <TableHead>Income Range</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brackets.map((bracket) => (
                    <TableRow key={bracket.id}>
                      <TableCell>{bracket.tax_year}</TableCell>
                      <TableCell className="capitalize">
                        {bracket.filing_status.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        ${bracket.min_income.toLocaleString()} - {
                          bracket.max_income ? `$${bracket.max_income.toLocaleString()}` : 'No limit'
                        }
                      </TableCell>
                      <TableCell>{bracket.rate}%</TableCell>
                      <TableCell>{bracket.bracket_order}</TableCell>
                      <TableCell>
                        <Badge variant={bracket.is_active ? 'default' : 'secondary'}>
                          {bracket.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBracket(bracket)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem('tax_brackets', bracket.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar structure for deductions and rules tabs */}
        <TabsContent value="deductions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Deductions</CardTitle>
                  <CardDescription>
                    Manage standard deductions and other deduction limits
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog('deduction')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deduction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Filing Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deductions.map((deduction) => (
                    <TableRow key={deduction.id}>
                      <TableCell>{deduction.tax_year}</TableCell>
                      <TableCell className="capitalize">{deduction.deduction_type}</TableCell>
                      <TableCell className="capitalize">
                        {deduction.filing_status.replace('_', ' ')}
                      </TableCell>
                      <TableCell>${deduction.amount.toLocaleString()}</TableCell>
                      <TableCell>{deduction.description}</TableCell>
                      <TableCell>
                        <Badge variant={deduction.is_active ? 'default' : 'secondary'}>
                          {deduction.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingDeduction(deduction)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem('tax_deductions', deduction.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Rules</CardTitle>
                  <CardDescription>
                    Manage RMD ages, SECURE Act rules, contribution limits, and other tax regulations
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog('rule')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Effective Year</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="capitalize">{rule.rule_type.replace('_', ' ')}</TableCell>
                      <TableCell>{rule.rule_name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {JSON.stringify(rule.rule_value)}
                      </TableCell>
                      <TableCell>{rule.effective_year}</TableCell>
                      <TableCell>{rule.expires_year || 'Never'}</TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRule(rule)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem('tax_rules', rule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit dialogs would go here */}
      {editingBracket && (
        <Dialog open={true} onOpenChange={() => setEditingBracket(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tax Bracket</DialogTitle>
            </DialogHeader>
            <BracketForm
              bracket={editingBracket}
              onSave={handleSaveBracket}
              onCancel={() => setEditingBracket(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Helper component for editing brackets
const BracketForm: React.FC<{
  bracket: Partial<TaxBracket>;
  onSave: (bracket: Partial<TaxBracket>) => void;
  onCancel: () => void;
}> = ({ bracket, onSave, onCancel }) => {
  const [formData, setFormData] = useState(bracket);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tax_year">Tax Year</Label>
          <Input
            id="tax_year"
            type="number"
            value={formData.tax_year || ''}
            onChange={(e) => setFormData({...formData, tax_year: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="filing_status">Filing Status</Label>
          <Select 
            value={formData.filing_status || 'single'} 
            onValueChange={(value) => setFormData({...formData, filing_status: value as FilingStatus})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
              <SelectItem value="married_filing_separately">Married Filing Separately</SelectItem>
              <SelectItem value="head_of_household">Head of Household</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min_income">Min Income</Label>
          <Input
            id="min_income"
            type="number"
            value={formData.min_income || ''}
            onChange={(e) => setFormData({...formData, min_income: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="max_income">Max Income (leave empty for highest bracket)</Label>
          <Input
            id="max_income"
            type="number"
            value={formData.max_income || ''}
            onChange={(e) => setFormData({...formData, max_income: e.target.value ? parseFloat(e.target.value) : null})}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rate">Tax Rate (%)</Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            value={formData.rate || ''}
            onChange={(e) => setFormData({...formData, rate: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="bracket_order">Order</Label>
          <Input
            id="bracket_order"
            type="number"
            value={formData.bracket_order || ''}
            onChange={(e) => setFormData({...formData, bracket_order: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active ?? true}
          onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
        />
        <Label>Active</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};