import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';

interface CustomField {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'url' | 'list';
}

interface CustomFieldsEditorProps {
  customFields: Record<string, any>;
  onChange: (fields: Record<string, any>) => void;
  editable?: boolean;
}

export const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({
  customFields = {},
  onChange,
  editable = true
}) => {
  const [fields, setFields] = useState<CustomField[]>(() => {
    return Object.entries(customFields).map(([key, value]) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: Array.isArray(value) ? value.join(', ') : String(value || ''),
      type: Array.isArray(value) ? 'list' : (key.includes('url') ? 'url' : (key.includes('bio') || key.includes('description') ? 'textarea' : 'text'))
    }));
  });

  const updateFields = (newFields: CustomField[]) => {
    setFields(newFields);
    const fieldsObject = newFields.reduce((acc, field) => {
      if (field.key && field.value) {
        acc[field.key] = field.type === 'list' 
          ? field.value.split(',').map(s => s.trim()).filter(Boolean)
          : field.value;
      }
      return acc;
    }, {} as Record<string, any>);
    onChange(fieldsObject);
  };

  const addField = () => {
    const newFields = [...fields, { key: '', label: '', value: '', type: 'text' as const }];
    updateFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    updateFields(newFields);
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    
    // Auto-generate key from label
    if (updates.label) {
      newFields[index].key = updates.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    
    updateFields(newFields);
  };

  if (!editable && fields.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            {editable ? (
              <>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Label htmlFor={`label-${index}`}>Field Label</Label>
                    <Input
                      id={`label-${index}`}
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="e.g., Languages, Designations, Video URL"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeField(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor={`value-${index}`}>Value</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={`value-${index}`}
                      value={field.value}
                      onChange={(e) => updateField(index, { value: e.target.value })}
                      placeholder={
                        field.key.includes('url') ? 'https://example.com' :
                        field.key.includes('bio') || field.key.includes('description') ? 'Enter detailed description' :
                        field.label.toLowerCase().includes('language') ? 'Enter comma-separated values' :
                        'Enter value'
                      }
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={`value-${index}`}
                      value={field.value}
                      onChange={(e) => updateField(index, { value: e.target.value })}
                      placeholder={
                        field.key.includes('url') ? 'https://example.com' :
                        field.key.includes('bio') || field.key.includes('description') ? 'Enter detailed description' :
                        field.label.toLowerCase().includes('language') ? 'Enter comma-separated values' :
                        'Enter value'
                      }
                    />
                  )}
                </div>
              </>
            ) : (
              <div>
                <Label className="font-medium">{field.label}</Label>
                {field.type === 'url' ? (
                  <div>
                    <a 
                      href={field.value} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {field.value}
                    </a>
                  </div>
                ) : field.type === 'list' ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {field.value.split(',').map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mt-1">
                    {field.value}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {editable && (
          <Button
            type="button"
            variant="outline"
            onClick={addField}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Field
          </Button>
        )}
      </CardContent>
    </Card>
  );
};