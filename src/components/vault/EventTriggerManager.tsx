import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VaultWatermark } from './VaultWatermark';
import { PatentPendingBadge } from './PatentPendingBadge';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  Heart, 
  UserX, 
  Users, 
  Settings, 
  Bell, 
  Mail, 
  MessageSquare,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface EventTrigger {
  id: string;
  triggerType: 'age' | 'date' | 'death' | 'incapacity' | 'marriage' | 'custom';
  condition: any;
  documentIds: string[];
  recipientEmail: string;
  message: string;
  isActive: boolean;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    reminderDays: number[];
  };
}

interface EventTriggerManagerProps {
  vaultId: string;
  documents: Array<{ id: string; name: string }>;
  onTriggersChange?: (triggers: EventTrigger[]) => void;
}

const triggerTypes = [
  { value: 'age', label: 'Age-based', icon: Clock, description: 'Trigger when recipient reaches specific age' },
  { value: 'date', label: 'Specific Date', icon: Calendar, description: 'Trigger on a specific calendar date' },
  { value: 'death', label: 'Upon Death', icon: Heart, description: 'Trigger upon death confirmation' },
  { value: 'incapacity', label: 'Incapacity', icon: UserX, description: 'Trigger if declared incapacitated' },
  { value: 'marriage', label: 'Marriage Event', icon: Users, description: 'Trigger upon marriage' },
  { value: 'custom', label: 'Custom Event', icon: Settings, description: 'Custom trigger condition' },
];

export const EventTriggerManager: React.FC<EventTriggerManagerProps> = ({
  vaultId,
  documents,
  onTriggersChange
}) => {
  const { t } = useTranslation();
  const [triggers, setTriggers] = useState<EventTrigger[]>([]);
  const [editingTrigger, setEditingTrigger] = useState<EventTrigger | null>(null);
  const [showForm, setShowForm] = useState(false);

  const defaultTrigger: Omit<EventTrigger, 'id'> = {
    triggerType: 'age',
    condition: {},
    documentIds: [],
    recipientEmail: '',
    message: '',
    isActive: true,
    notificationSettings: {
      email: true,
      sms: false,
      inApp: true,
      reminderDays: [7, 1]
    }
  };

  const createTrigger = () => {
    const newTrigger: EventTrigger = {
      ...defaultTrigger,
      id: Math.random().toString(36).substring(7)
    };
    setEditingTrigger(newTrigger);
    setShowForm(true);
  };

  const editTrigger = (trigger: EventTrigger) => {
    setEditingTrigger({ ...trigger });
    setShowForm(true);
  };

  const saveTrigger = () => {
    if (!editingTrigger) return;

    const isNew = !triggers.find(t => t.id === editingTrigger.id);
    
    let updatedTriggers;
    if (isNew) {
      updatedTriggers = [...triggers, editingTrigger];
    } else {
      updatedTriggers = triggers.map(t => 
        t.id === editingTrigger.id ? editingTrigger : t
      );
    }
    
    setTriggers(updatedTriggers);
    onTriggersChange?.(updatedTriggers);
    setShowForm(false);
    setEditingTrigger(null);
  };

  const deleteTrigger = (id: string) => {
    const updatedTriggers = triggers.filter(t => t.id !== id);
    setTriggers(updatedTriggers);
    onTriggersChange?.(updatedTriggers);
  };

  const renderConditionForm = () => {
    if (!editingTrigger) return null;

    switch (editingTrigger.triggerType) {
      case 'age':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAge">Target Age</Label>
                <Input
                  id="targetAge"
                  type="number"
                  min="1"
                  max="120"
                  value={editingTrigger.condition.age || ''}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    condition: { ...editingTrigger.condition, age: parseInt(e.target.value) }
                  })}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="birthDate">Recipient Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={editingTrigger.condition.birthDate || ''}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    condition: { ...editingTrigger.condition, birthDate: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="triggerDate">Trigger Date</Label>
              <Input
                id="triggerDate"
                type="datetime-local"
                value={editingTrigger.condition.date || ''}
                onChange={(e) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, date: e.target.value }
                })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editingTrigger.condition.recurring || false}
                onCheckedChange={(checked) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, recurring: checked }
                })}
              />
              <Label>Recurring annual trigger</Label>
            </div>
          </div>
        );

      case 'death':
        return (
          <div className="space-y-4">
            <div>
              <Label>Death Verification Required</Label>
              <Select
                value={editingTrigger.condition.verificationMethod || 'manual'}
                onValueChange={(value) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, verificationMethod: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual verification by family</SelectItem>
                  <SelectItem value="certificate">Death certificate required</SelectItem>
                  <SelectItem value="attorney">Attorney confirmation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="delayDays">Delay Period (days)</Label>
              <Input
                id="delayDays"
                type="number"
                min="0"
                max="365"
                value={editingTrigger.condition.delayDays || 0}
                onChange={(e) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, delayDays: parseInt(e.target.value) }
                })}
                placeholder="30"
              />
            </div>
          </div>
        );

      case 'incapacity':
        return (
          <div className="space-y-4">
            <div>
              <Label>Incapacity Determination</Label>
              <Select
                value={editingTrigger.condition.determinationMethod || 'medical'}
                onValueChange={(value) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, determinationMethod: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical professional certification</SelectItem>
                  <SelectItem value="legal">Legal guardianship decree</SelectItem>
                  <SelectItem value="family">Family consensus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'marriage':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="marriageDate">Expected Marriage Date (optional)</Label>
              <Input
                id="marriageDate"
                type="date"
                value={editingTrigger.condition.expectedDate || ''}
                onChange={(e) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, expectedDate: e.target.value }
                })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editingTrigger.condition.requiresCertificate || false}
                onCheckedChange={(checked) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, requiresCertificate: checked }
                })}
              />
              <Label>Requires marriage certificate</Label>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customCondition">Custom Condition Description</Label>
              <Textarea
                id="customCondition"
                value={editingTrigger.condition.description || ''}
                onChange={(e) => setEditingTrigger({
                  ...editingTrigger,
                  condition: { ...editingTrigger.condition, description: e.target.value }
                })}
                placeholder="Describe the specific condition that should trigger delivery..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 relative">
      <VaultWatermark />
      <PatentPendingBadge />
      
      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t('vault.triggers.title', 'Event-Based Delivery Triggers')}
            </CardTitle>
            <Button onClick={createTrigger} className="touch-target">
              <Plus className="h-4 w-4 mr-2" />
              {t('vault.triggers.create', 'Create Trigger')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {triggers.length === 0 && !showForm ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {t('vault.triggers.empty', 'No delivery triggers configured')}
              </p>
              <p className="text-sm">
                {t('vault.triggers.emptyDescription', 'Create triggers to automatically deliver documents when specific events occur')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {triggers.map((trigger) => {
                const triggerType = triggerTypes.find(t => t.value === trigger.triggerType);
                const TriggerIcon = triggerType?.icon || Clock;
                
                return (
                  <Card key={trigger.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <TriggerIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{triggerType?.label}</h3>
                            <Badge variant={trigger.isActive ? 'default' : 'secondary'}>
                              {trigger.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {triggerType?.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>To: {trigger.recipientEmail}</span>
                            <span>Documents: {trigger.documentIds.length}</span>
                            <div className="flex items-center gap-1">
                              {trigger.notificationSettings.email && <Mail className="h-3 w-3" />}
                              {trigger.notificationSettings.sms && <MessageSquare className="h-3 w-3" />}
                              {trigger.notificationSettings.inApp && <Bell className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editTrigger(trigger)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTrigger(trigger.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Form */}
      {showForm && editingTrigger && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle>
              {triggers.find(t => t.id === editingTrigger.id) 
                ? t('vault.triggers.edit', 'Edit Trigger') 
                : t('vault.triggers.create', 'Create Trigger')
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trigger Type Selection */}
            <div>
              <Label>Trigger Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {triggerTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        editingTrigger.triggerType === type.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setEditingTrigger({
                        ...editingTrigger,
                        triggerType: type.value as any
                      })}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{type.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Condition Configuration */}
            <div>
              <Label className="text-base font-medium">Trigger Conditions</Label>
              {renderConditionForm()}
            </div>

            <Separator />

            {/* Recipient and Message */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={editingTrigger.recipientEmail}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    recipientEmail: e.target.value
                  })}
                  placeholder="recipient@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Personal Message</Label>
                <Textarea
                  id="message"
                  value={editingTrigger.message}
                  onChange={(e) => setEditingTrigger({
                    ...editingTrigger,
                    message: e.target.value
                  })}
                  placeholder="A personal message to accompany the document delivery..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Notification Settings */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Notification Settings</Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label>Email notifications</Label>
                  </div>
                  <Switch
                    checked={editingTrigger.notificationSettings.email}
                    onCheckedChange={(checked) => setEditingTrigger({
                      ...editingTrigger,
                      notificationSettings: {
                        ...editingTrigger.notificationSettings,
                        email: checked
                      }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label>SMS notifications</Label>
                  </div>
                  <Switch
                    checked={editingTrigger.notificationSettings.sms}
                    onCheckedChange={(checked) => setEditingTrigger({
                      ...editingTrigger,
                      notificationSettings: {
                        ...editingTrigger.notificationSettings,
                        sms: checked
                      }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label>In-app notifications</Label>
                  </div>
                  <Switch
                    checked={editingTrigger.notificationSettings.inApp}
                    onCheckedChange={(checked) => setEditingTrigger({
                      ...editingTrigger,
                      notificationSettings: {
                        ...editingTrigger.notificationSettings,
                        inApp: checked
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingTrigger(null);
                }}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={saveTrigger}>
                {t('common.save', 'Save Trigger')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};