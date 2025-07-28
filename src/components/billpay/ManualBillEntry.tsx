import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Building, 
  Bell, 
  Trash2, 
  Edit,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  frequency: string;
  reminders: boolean;
  notes?: string;
}

export const ManualBillEntry: React.FC = () => {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([
    {
      id: "1",
      name: "Electric Bill",
      category: "utilities",
      amount: 165.23,
      dueDate: "15",
      frequency: "monthly",
      reminders: true,
      notes: "Usually varies by season"
    }
  ]);

  const [isAddingBill, setIsAddingBill] = useState(false);
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    dueDate: "",
    frequency: "monthly",
    reminders: true,
    notes: ""
  });

  const categories = [
    { value: "utilities", label: "Utilities" },
    { value: "insurance", label: "Insurance" },
    { value: "loans", label: "Loans & Credit" },
    { value: "subscriptions", label: "Subscriptions" },
    { value: "housing", label: "Housing" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" }
  ];

  const frequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.amount || !formData.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newBill: Bill = {
      id: editingBill || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      frequency: formData.frequency,
      reminders: formData.reminders,
      notes: formData.notes
    };

    if (editingBill) {
      setBills(bills.map(bill => bill.id === editingBill ? newBill : bill));
      toast({
        title: "Bill Updated",
        description: `${newBill.name} has been updated successfully.`
      });
    } else {
      setBills([...bills, newBill]);
      toast({
        title: "Bill Added",
        description: `${newBill.name} has been added to your bills.`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      amount: "",
      dueDate: "",
      frequency: "monthly",
      reminders: true,
      notes: ""
    });
    setIsAddingBill(false);
    setEditingBill(null);
  };

  const handleEdit = (bill: Bill) => {
    setFormData({
      name: bill.name,
      category: bill.category,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      frequency: bill.frequency,
      reminders: bill.reminders,
      notes: bill.notes || ""
    });
    setEditingBill(bill.id);
    setIsAddingBill(true);
  };

  const handleDelete = (billId: string) => {
    setBills(bills.filter(bill => bill.id !== billId));
    toast({
      title: "Bill Deleted",
      description: "The bill has been removed from your list."
    });
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  const getFrequencyLabel = (value: string) => {
    return frequencies.find(freq => freq.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Bill Form */}
      {isAddingBill && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingBill ? "Edit Bill" : "Add New Bill"}
            </CardTitle>
            <CardDescription>
              {editingBill ? "Update bill information" : "Enter your bill details and set up reminders"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billName">Bill Name *</Label>
                  <Input
                    id="billName"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Electric Bill"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      placeholder="Day of month (e.g., 15)"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((frequency) => (
                        <SelectItem key={frequency.value} value={frequency.value}>
                          {frequency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminders" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Enable Reminders
                  </Label>
                  <Switch
                    id="reminders"
                    checked={formData.reminders}
                    onCheckedChange={(checked) => setFormData({...formData, reminders: checked})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes about this bill..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingBill ? "Update Bill" : "Add Bill"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bills List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Bills ({bills.length})</CardTitle>
            <CardDescription>Manage your manually entered bills</CardDescription>
          </div>
          {!isAddingBill && (
            <Button onClick={() => setIsAddingBill(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bills Added Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first bill to track payments and set up reminders.
              </p>
              <Button onClick={() => setIsAddingBill(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bill
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{bill.name}</h3>
                        <Badge variant="secondary">{getCategoryLabel(bill.category)}</Badge>
                        {bill.reminders && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Reminders
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${bill.amount.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {bill.dueDate}th
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getFrequencyLabel(bill.frequency)}
                        </span>
                      </div>
                      {bill.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{bill.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(bill)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(bill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};