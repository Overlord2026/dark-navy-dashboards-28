import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Plus, Pill, Clock, User, Building2, Edit, Trash2, UserPlus, Phone, Mail } from 'lucide-react';
import { useHealthcare, Prescription } from '@/hooks/useHealthcare';
import { format, isAfter, isBefore, addDays } from 'date-fns';

export const PrescriptionManager: React.FC = () => {
  const { prescriptions, loading, createPrescription, updatePrescription, deletePrescription } = useHealthcare();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    next_refill: '',
    doctor: '',
    pharmacy: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      next_refill: '',
      doctor: '',
      pharmacy: '',
      notes: ''
    });
  };

  const handleAddPrescription = async () => {
    if (!formData.name || !formData.dosage || !formData.frequency) {
      return;
    }

    await createPrescription(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditPrescription = async () => {
    if (!editingPrescription || !formData.name || !formData.dosage || !formData.frequency || !formData.next_refill) {
      return;
    }

    await updatePrescription(editingPrescription.id, formData);
    setIsEditDialogOpen(false);
    setEditingPrescription(null);
    resetForm();
  };

  const handleDeletePrescription = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      await deletePrescription(id);
    }
  };

  const openEditDialog = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      name: prescription.name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      next_refill: prescription.next_refill,
      doctor: prescription.doctor || '',
      pharmacy: prescription.pharmacy || '',
      notes: prescription.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const getRefillStatus = (nextRefillDate: string) => {
    const refillDate = new Date(nextRefillDate);
    const today = new Date();
    const weekFromNow = addDays(today, 7);

    if (isBefore(refillDate, today)) {
      return { status: 'overdue', label: 'Overdue', variant: 'destructive' as const };
    } else if (isBefore(refillDate, weekFromNow)) {
      return { status: 'due-soon', label: 'Due Soon', variant: 'secondary' as const };
    } else {
      return { status: 'good', label: 'Good', variant: 'default' as const };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading prescriptions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Healthcare Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="physicians" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Physicians & Contacts
              </TabsTrigger>
            </TabsList>
            
            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Prescription Manager</h3>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prescription
                </Button>
              </div>
              
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Pill className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Prescriptions</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add your first prescription to start tracking your medications.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prescriptions.map((prescription) => {
                    const refillStatus = getRefillStatus(prescription.next_refill);
                    
                    return (
                      <div key={prescription.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{prescription.name}</h4>
                            <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                          </div>
                          <Badge variant={refillStatus.variant}>
                            {refillStatus.label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{prescription.frequency}</span>
                          </div>
                          
                          {prescription.next_refill && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Refill by {format(new Date(prescription.next_refill), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                          
                          {prescription.doctor && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Dr. {prescription.doctor}</span>
                            </div>
                          )}
                          
                          {prescription.pharmacy && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{prescription.pharmacy}</span>
                            </div>
                          )}
                        </div>
                        
                        {prescription.notes && (
                          <p className="text-xs text-muted-foreground">{prescription.notes}</p>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(prescription)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePrescription(prescription.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            {/* Physicians & Contacts Tab */}
            <TabsContent value="physicians" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Physicians & Contacts</h3>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              
              <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Contacts</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add your healthcare providers and emergency contacts.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Prescription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Prescription</DialogTitle>
            <DialogDescription>
              Add a new prescription to track your medication schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="medication">Medication *</Label>
              <Input
                id="medication"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter medication name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 10mg, 1 tablet"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="e.g., Once daily, Twice a day"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="next_refill">Next refill</Label>
              <Input
                id="next_refill"
                type="date"
                value={formData.next_refill}
                onChange={(e) => setFormData({ ...formData, next_refill: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="prescribed_by">Prescribed by</Label>
              <Input
                id="prescribed_by"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                placeholder="Doctor's name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pharmacy">Pharmacy</Label>
              <Input
                id="pharmacy"
                value={formData.pharmacy}
                onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                placeholder="Pharmacy name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddPrescription}
              disabled={!formData.name || !formData.dosage || !formData.frequency}
            >
              Add Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prescription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
            <DialogDescription>
              Update your prescription information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-medication">Medication *</Label>
              <Input
                id="edit-medication"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter medication name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-dosage">Dosage *</Label>
              <Input
                id="edit-dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 10mg, 1 tablet"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-frequency">Frequency *</Label>
              <Input
                id="edit-frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="e.g., Once daily, Twice a day"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-next_refill">Next refill</Label>
              <Input
                id="edit-next_refill"
                type="date"
                value={formData.next_refill}
                onChange={(e) => setFormData({ ...formData, next_refill: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-prescribed_by">Prescribed by</Label>
              <Input
                id="edit-prescribed_by"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                placeholder="Doctor's name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-pharmacy">Pharmacy</Label>
              <Input
                id="edit-pharmacy"
                value={formData.pharmacy}
                onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                placeholder="Pharmacy name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditPrescription}
              disabled={!formData.name || !formData.dosage || !formData.frequency}
            >
              Update Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
