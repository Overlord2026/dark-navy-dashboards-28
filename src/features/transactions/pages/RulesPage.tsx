import { useState } from 'react';
import { Rule, RuleCondition, RuleAction } from '../types';
import { useRules, useCreateRule, useUpdateRule, useCategories } from '../api/transactionsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Settings, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

export function RulesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  
  const { data: rules = [], isLoading } = useRules();
  const { data: categories = [] } = useCategories();
  const createRuleMutation = useCreateRule();
  const updateRuleMutation = useUpdateRule();

  const handleCreateRule = (data: Omit<Rule, 'id' | 'appliedCount' | 'createdAt' | 'updatedAt'>) => {
    createRuleMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Rule created successfully');
        setIsCreateOpen(false);
      }
    });
  };

  const handleUpdateRule = (id: string, data: Partial<Rule>) => {
    updateRuleMutation.mutate({ id, data }, {
      onSuccess: () => {
        toast.success('Rule updated successfully');
        setEditingRule(null);
      }
    });
  };

  const toggleRuleActive = (rule: Rule) => {
    handleUpdateRule(rule.id, { isActive: !rule.isActive });
  };

  if (isLoading) {
    return <div>Loading rules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction Rules</h1>
          <p className="text-muted-foreground">
            Automatically categorize and tag transactions based on conditions
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
            </DialogHeader>
            <RuleForm 
              onSubmit={handleCreateRule}
              categories={categories}
              isLoading={createRuleMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {rules.map(rule => (
          <RuleCard 
            key={rule.id}
            rule={rule}
            categories={categories}
            onToggleActive={() => toggleRuleActive(rule)}
            onEdit={() => setEditingRule(rule)}
          />
        ))}
        
        {rules.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No rules configured</p>
                <p className="text-sm">Create rules to automatically categorize transactions</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <RuleForm 
              rule={editingRule}
              onSubmit={(data) => handleUpdateRule(editingRule.id, data)}
              categories={categories}
              isLoading={updateRuleMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface RuleCardProps {
  rule: Rule;
  categories: any[];
  onToggleActive: () => void;
  onEdit: () => void;
}

function RuleCard({ rule, categories, onToggleActive, onEdit }: RuleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{rule.name}</CardTitle>
            <Badge variant={rule.isActive ? "default" : "secondary"}>
              {rule.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">
              Applied {rule.appliedCount} times
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              checked={rule.isActive}
              onCheckedChange={onToggleActive}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Conditions */}
          <div>
            <h4 className="font-medium mb-2">Conditions</h4>
            <div className="space-y-2">
              {rule.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{condition.field}</Badge>
                  <span>{condition.operator}</span>
                  <Badge variant="secondary">"{condition.value}"</Badge>
                </div>
              ))}
            </div>
          </div>

          <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />

          {/* Actions */}
          <div>
            <h4 className="font-medium mb-2">Actions</h4>
            <div className="space-y-2">
              {rule.actions.map((action, index) => {
                const category = categories.find(c => c.id === action.value);
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{action.type.replace('_', ' ')}</Badge>
                    <ArrowRight className="h-3 w-3" />
                    <Badge variant="secondary">
                      {action.type === 'set_category' && category 
                        ? `${category.emoji} ${category.name}`
                        : action.value
                      }
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RuleFormProps {
  rule?: Rule;
  onSubmit: (data: Omit<Rule, 'id' | 'appliedCount' | 'createdAt' | 'updatedAt'>) => void;
  categories: any[];
  isLoading: boolean;
}

function RuleForm({ rule, onSubmit, categories, isLoading }: RuleFormProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    isActive: rule?.isActive ?? true,
    priority: rule?.priority || 1,
    conditions: rule?.conditions || [{ field: 'description', operator: 'contains', value: '', caseSensitive: false }] as RuleCondition[],
    actions: rule?.actions || [{ type: 'set_category', value: '' }] as RuleAction[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: 'description', operator: 'contains', value: '', caseSensitive: false }]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, updates: Partial<RuleCondition>) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, ...updates } : condition
      )
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'set_category', value: '' }]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, updates: Partial<RuleAction>) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, ...updates } : action
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Rule Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
          />
        </div>
      </div>

      {/* Conditions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Conditions</Label>
          <Button type="button" size="sm" onClick={addCondition}>
            Add Condition
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.conditions.map((condition, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-4 gap-3 items-end">
                <div>
                  <Label>Field</Label>
                  <Select
                    value={condition.field}
                    onValueChange={(value) => updateCondition(index, { field: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="description">Description</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="merchant">Merchant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Operator</Label>
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(index, { operator: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="starts_with">Starts with</SelectItem>
                      <SelectItem value="ends_with">Ends with</SelectItem>
                      <SelectItem value="greater_than">Greater than</SelectItem>
                      <SelectItem value="less_than">Less than</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  <Input
                    value={condition.value}
                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                    type={condition.field === 'amount' ? 'number' : 'text'}
                  />
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCondition(index)}
                  disabled={formData.conditions.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Actions</Label>
          <Button type="button" size="sm" onClick={addAction}>
            Add Action
          </Button>
        </div>
        
        <div className="space-y-3">
          {formData.actions.map((action, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <Label>Action Type</Label>
                  <Select
                    value={action.type}
                    onValueChange={(value) => updateAction(index, { type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="set_category">Set Category</SelectItem>
                      <SelectItem value="add_tag">Add Tag</SelectItem>
                      <SelectItem value="set_description">Set Description</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  {action.type === 'set_category' ? (
                    <Select
                      value={action.value}
                      onValueChange={(value) => updateAction(index, { value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.emoji} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={action.value}
                      onChange={(e) => updateAction(index, { value: e.target.value })}
                    />
                  )}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAction(index)}
                  disabled={formData.actions.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {rule ? 'Update' : 'Create'} Rule
        </Button>
      </div>
    </form>
  );
}