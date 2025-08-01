import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePlatformConnectors } from '@/hooks/usePlatformConnectors';
import { X, Save, ArrowRight } from 'lucide-react';

interface FieldMappingReviewProps {
  connectorId: string;
  onClose: () => void;
}

export function FieldMappingReview({ connectorId, onClose }: FieldMappingReviewProps) {
  const { loadFieldMappings, fieldMappings, updateConnector, loading } = usePlatformConnectors();
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [customMappings, setCustomMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFieldMappings();
  }, [loadFieldMappings]);

  const handleMappingChange = (sourceField: string, targetField: string) => {
    setCustomMappings(prev => ({
      ...prev,
      [sourceField]: targetField
    }));
  };

  const handleSave = async () => {
    try {
      await updateConnector(connectorId, {
        field_mappings: customMappings
      });
      onClose();
    } catch (error) {
      console.error('Failed to save mappings:', error);
    }
  };

  if (!selectedMapping) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Field Mapping Configuration</CardTitle>
              <CardDescription>Choose a template or create custom field mappings</CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {fieldMappings.map((mapping) => (
              <Card key={mapping.platform_name + mapping.data_type} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">
                      {mapping.platform_name} - {mapping.data_type}
                    </CardTitle>
                    <Badge variant="outline">
                      {Object.keys(mapping.default_mapping).length} fields
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Maps {mapping.platform_name} {mapping.data_type} to internal format
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedMapping(mapping);
                        setCustomMappings(mapping.default_mapping);
                      }}
                    >
                      Use Template
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Field Mapping: {selectedMapping.platform_name} - {selectedMapping.data_type}</CardTitle>
            <CardDescription>Map source fields to target fields</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedMapping(null)}>
              Back
            </Button>
            <Button onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
            <div>Source Field ({selectedMapping.platform_name})</div>
            <div className="text-center">Mapping</div>
            <div>Target Field (Internal)</div>
          </div>

          <div className="space-y-3">
            {Object.entries(selectedMapping.source_fields).map(([sourceField, sourceType]) => (
              <div key={sourceField} className="grid grid-cols-3 gap-4 items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{sourceField}</div>
                  <div className="text-sm text-muted-foreground">{sourceType as string}</div>
                </div>
                
                <div className="text-center">
                  <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                </div>
                
                <div>
                  <Select 
                    value={customMappings[sourceField] || ''} 
                    onValueChange={(value) => handleMappingChange(sourceField, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target field" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(selectedMapping.target_fields).map(([targetField, targetType]) => (
                        <SelectItem key={targetField} value={targetField}>
                          <div className="flex flex-col">
                            <span>{targetField}</span>
                            <span className="text-xs text-muted-foreground">{targetType as string}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setSelectedMapping(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Mappings'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}