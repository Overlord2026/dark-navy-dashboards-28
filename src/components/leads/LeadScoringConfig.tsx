import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Save, Clock, Mail, MessageSquare } from 'lucide-react';
import { useLeadScoring, PipelineStageConfig } from '@/hooks/useLeadScoring';

export function LeadScoringConfig() {
  const { 
    loading, 
    getPipelineConfigs, 
    updatePipelineConfig, 
    createPipelineConfig 
  } = useLeadScoring();
  
  const [configs, setConfigs] = useState<PipelineStageConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<PipelineStageConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const data = await getPipelineConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Error loading configs:', error);
    }
  };

  const handleSave = async (config: Partial<PipelineStageConfig>) => {
    try {
      if (editingConfig) {
        await updatePipelineConfig(editingConfig.id, config);
      } else {
        await createPipelineConfig(config as Omit<PipelineStageConfig, 'id'>);
      }
      setEditingConfig(null);
      setIsCreating(false);
      loadConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const defaultStages = [
    { name: 'new', label: 'New Lead', defaultDelay: 1 },
    { name: 'contacted', label: 'Contacted', defaultDelay: 24 },
    { name: 'qualified', label: 'Qualified', defaultDelay: 72 },
    { name: 'scheduled', label: 'Scheduled', defaultDelay: 168 },
    { name: 'closed_won', label: 'Closed Won', defaultDelay: 0 },
    { name: 'closed_lost', label: 'Closed Lost', defaultDelay: 0 }
  ];

  const createDefaultConfigs = async () => {
    for (const stage of defaultStages) {
      const existingConfig = configs.find(c => c.stage_name === stage.name);
      if (!existingConfig) {
        await createPipelineConfig({
          stage_name: stage.name,
          follow_up_delay_hours: stage.defaultDelay,
          email_template: `Hi {{name}}, following up on your inquiry regarding financial planning. Let me know if you have any questions about our ${stage.label.toLowerCase()} discussion.`,
          sms_template: `Hi {{name}}, checking in about your financial planning needs. Reply YES to schedule a call.`,
          is_active: true
        });
      }
    }
    loadConfigs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Pipeline Configuration
          </h2>
          <p className="text-muted-foreground">Configure automated follow-ups for each pipeline stage</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createDefaultConfigs} variant="outline">
            Create Default Stages
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </div>
      </div>

      {configs.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pipeline Configuration</h3>
            <p className="text-muted-foreground mb-4">
              Create your first pipeline stage configuration to enable automated follow-ups.
            </p>
            <Button onClick={createDefaultConfigs}>
              Create Default Configuration
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Configuration List */}
      <div className="grid gap-4">
        {configs.map((config) => (
          <PipelineStageCard
            key={config.id}
            config={config}
            onEdit={() => setEditingConfig(config)}
            onSave={handleSave}
            isEditing={editingConfig?.id === config.id}
            loading={loading}
          />
        ))}

        {/* Create New Config */}
        {isCreating && (
          <PipelineStageCard
            config={{
              id: '',
              stage_name: '',
              follow_up_delay_hours: 24,
              email_template: '',
              sms_template: '',
              is_active: true
            }}
            onEdit={() => {}}
            onSave={handleSave}
            isEditing={true}
            loading={loading}
            onCancel={() => setIsCreating(false)}
          />
        )}
      </div>
    </div>
  );
}

interface PipelineStageCardProps {
  config: PipelineStageConfig;
  onEdit: () => void;
  onSave: (config: Partial<PipelineStageConfig>) => void;
  isEditing: boolean;
  loading: boolean;
  onCancel?: () => void;
}

function PipelineStageCard({ 
  config, 
  onEdit, 
  onSave, 
  isEditing, 
  loading, 
  onCancel 
}: PipelineStageCardProps) {
  const [formData, setFormData] = useState(config);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {config.stage_name.replace('_', ' ')} Stage
              </h3>
              <p className="text-sm text-muted-foreground">
                Follow-up delay: {config.follow_up_delay_hours} hours
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={config.is_active} disabled />
              <Button onClick={onEdit} variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email Template
              </Label>
              <div className="bg-muted p-3 rounded text-sm max-h-32 overflow-y-auto">
                {config.email_template || 'No template set'}
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                SMS Template
              </Label>
              <div className="bg-muted p-3 rounded text-sm max-h-32 overflow-y-auto">
                {config.sms_template || 'No template set'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {config.id ? 'Edit' : 'Create'} Pipeline Stage Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage_name">Stage Name</Label>
              <Input
                id="stage_name"
                value={formData.stage_name}
                onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
                placeholder="e.g., new, contacted, qualified"
                required
              />
            </div>
            <div>
              <Label htmlFor="delay" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Follow-up Delay (hours)
              </Label>
              <Input
                id="delay"
                type="number"
                value={formData.follow_up_delay_hours}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  follow_up_delay_hours: parseInt(e.target.value) || 0 
                })}
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email_template" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Template
            </Label>
            <Textarea
              id="email_template"
              value={formData.email_template || ''}
              onChange={(e) => setFormData({ ...formData, email_template: e.target.value })}
              placeholder="Hi {{name}}, following up on your inquiry..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use {'{name}'} for lead name, {'{value}'} for lead value
            </p>
          </div>

          <div>
            <Label htmlFor="sms_template" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS Template
            </Label>
            <Textarea
              id="sms_template"
              value={formData.sms_template || ''}
              onChange={(e) => setFormData({ ...formData, sms_template: e.target.value })}
              placeholder="Hi {{name}}, checking in about your financial planning needs..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Keep SMS messages under 160 characters for best delivery
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Active</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel || (() => {})}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}