// CSV export utility functions

export interface CSVExportOptions {
  filename?: string;
  delimiter?: string;
  includeHeaders?: boolean;
  dateFormat?: 'iso' | 'locale' | 'custom';
  customDateFormat?: (date: Date) => string;
}

/**
 * Export data to CSV format and trigger download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv',
  options: CSVExportOptions = {}
): void {
  const {
    delimiter = ',',
    includeHeaders = true,
    dateFormat = 'locale'
  } = options;

  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [];

  // Add headers if requested
  if (includeHeaders) {
    csvContent.push(headers.map(header => escapeCSVField(header)).join(delimiter));
  }

  // Add data rows
  data.forEach(row => {
    const csvRow = headers.map(header => {
      const value = row[header];
      return escapeCSVField(formatCSVValue(value, dateFormat, options.customDateFormat));
    }).join(delimiter);
    csvContent.push(csvRow);
  });

  // Create and trigger download
  const csvString = csvContent.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Escape CSV field values to handle commas, quotes, and newlines
 */
function escapeCSVField(field: string): string {
  if (field == null) return '';
  
  const stringField = String(field);
  
  // If field contains delimiter, quotes, or newlines, wrap in quotes and escape internal quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n') || stringField.includes('\r')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

/**
 * Format values for CSV export
 */
function formatCSVValue(
  value: any, 
  dateFormat: 'iso' | 'locale' | 'custom',
  customDateFormat?: (date: Date) => string
): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle dates
  if (value instanceof Date) {
    switch (dateFormat) {
      case 'iso':
        return value.toISOString();
      case 'locale':
        return value.toLocaleDateString();
      case 'custom':
        return customDateFormat ? customDateFormat(value) : value.toLocaleDateString();
      default:
        return value.toLocaleDateString();
    }
  }

  // Handle date strings
  if (typeof value === 'string' && isValidDateString(value)) {
    const date = new Date(value);
    switch (dateFormat) {
      case 'iso':
        return date.toISOString();
      case 'locale':
        return date.toLocaleDateString();
      case 'custom':
        return customDateFormat ? customDateFormat(date) : date.toLocaleDateString();
      default:
        return date.toLocaleDateString();
    }
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.join('; ');
  }

  // Handle objects
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  // Handle numbers
  if (typeof value === 'number') {
    return value.toString();
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

/**
 * Check if a string represents a valid date
 */
function isValidDateString(value: string): boolean {
  // Common date patterns
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}/, // MM-DD-YYYY
    /^\d{4}\/\d{2}\/\d{2}/, // YYYY/MM/DD
  ];

  const hasDatePattern = datePatterns.some(pattern => pattern.test(value));
  if (!hasDatePattern) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Convert array of objects to CSV string (for use without download)
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  options: CSVExportOptions = {}
): string {
  const {
    delimiter = ',',
    includeHeaders = true,
    dateFormat = 'locale'
  } = options;

  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csvContent = [];

  // Add headers if requested
  if (includeHeaders) {
    csvContent.push(headers.map(header => escapeCSVField(header)).join(delimiter));
  }

  // Add data rows
  data.forEach(row => {
    const csvRow = headers.map(header => {
      const value = row[header];
      return escapeCSVField(formatCSVValue(value, dateFormat, options.customDateFormat));
    }).join(delimiter);
    csvContent.push(csvRow);
  });

  return csvContent.join('\n');
}

/**
 * Export large datasets in chunks to prevent memory issues
 */
export function exportLargeDatasetToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'large_export.csv',
  chunkSize: number = 1000,
  options: CSVExportOptions = {}
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const {
    delimiter = ',',
    includeHeaders = true
  } = options;

  const headers = Object.keys(data[0]);
  let csvContent = '';

  // Add headers if requested
  if (includeHeaders) {
    csvContent += headers.map(header => escapeCSVField(header)).join(delimiter) + '\n';
  }

  // Process data in chunks
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    
    chunk.forEach(row => {
      const csvRow = headers.map(header => {
        const value = row[header];
        return escapeCSVField(formatCSVValue(value, options.dateFormat || 'locale', options.customDateFormat));
      }).join(delimiter);
      csvContent += csvRow + '\n';
    });
  }

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Parse CSV string into array of objects
 */
export function parseCSV(csvContent: string, options: { hasHeaders?: boolean; delimiter?: string } = {}): Record<string, string>[] {
  const { hasHeaders = true, delimiter = ',' } = options;
  
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const result: Record<string, string>[] = [];
  let headers: string[] = [];

  // Parse headers
  if (hasHeaders && lines.length > 0) {
    headers = parseCSVLine(lines[0], delimiter);
    lines.shift(); // Remove header line
  }

  // Parse data lines
  lines.forEach((line, index) => {
    const values = parseCSVLine(line, delimiter);
    
    if (hasHeaders) {
      const rowObj: Record<string, string> = {};
      headers.forEach((header, i) => {
        rowObj[header] = values[i] || '';
      });
      result.push(rowObj);
    } else {
      const rowObj: Record<string, string> = {};
      values.forEach((value, i) => {
        rowObj[`column_${i}`] = value;
      });
      result.push(rowObj);
    }
  });

  return result;
}

/**
 * Parse a single CSV line handling quotes and escaped characters
 */
function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = false;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
    
    i++;
  }

  result.push(current);
  return result;
}