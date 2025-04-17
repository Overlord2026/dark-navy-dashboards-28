
import { useState, useEffect } from 'react';

export interface CustomReportField {
  id: string;
  name: string;
  enabled: boolean;
  value?: number | string;
}

export function useCustomReport() {
  const [fields, setFields] = useState<CustomReportField[]>(() => {
    const saved = localStorage.getItem('custom-report-fields');
    return saved 
      ? JSON.parse(saved) 
      : [
          { id: 'assets', name: 'Assets', enabled: true },
          { id: 'liabilities', name: 'Liabilities', enabled: true },
          { id: 'income', name: 'Income', enabled: true },
          { id: 'expenses', name: 'Expenses', enabled: true },
          { id: 'networth', name: 'Net Worth', enabled: true },
          { id: 'cashflow', name: 'Cash Flow', enabled: true }
        ];
  });

  const [customFields, setCustomFields] = useState<CustomReportField[]>(() => {
    const saved = localStorage.getItem('custom-report-custom-fields');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('custom-report-fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('custom-report-custom-fields', JSON.stringify(customFields));
  }, [customFields]);

  const toggleField = (id: string) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, enabled: !field.enabled } : field
      )
    );
  };

  const addCustomField = () => {
    const newField: CustomReportField = {
      id: `custom-${Date.now()}`,
      name: '',
      enabled: true,
      value: ''
    };
    setCustomFields([...customFields, newField]);
  };

  const updateCustomField = (id: string, updates: Partial<CustomReportField>) => {
    setCustomFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const deleteCustomField = (id: string) => {
    setCustomFields(prevFields => prevFields.filter(field => field.id !== id));
  };

  return {
    fields,
    customFields,
    toggleField,
    addCustomField,
    updateCustomField,
    deleteCustomField
  };
}
