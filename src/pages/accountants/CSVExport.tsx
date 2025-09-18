import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';

// Mock export data
const exportOptions = [
  { id: 'client_info', label: 'Client Information', description: 'Names, addresses, contact details' },
  { id: 'tax_returns', label: 'Tax Return Status', description: 'Filing status, completion dates' },
  { id: 'deadlines', label: 'Upcoming Deadlines', description: 'Due dates and priority levels' },
  { id: 'billing', label: 'Billing Information', description: 'Hours, rates, payment status' },
  { id: 'documents', label: 'Document Status', description: 'Upload dates, review status' },
  { id: 'communications', label: 'Client Communications', description: 'Email logs, meeting notes' }
];

const clientData = [
  { client: 'Smith Family Trust', year: '2023', status: 'Completed', deadline: '2024-04-15', hours: 12.5, rate: 350 },
  { client: 'Johnson LLC', year: '2023', status: 'In Progress', deadline: '2024-03-15', hours: 8.0, rate: 400 },
  { client: 'Brown Estate', year: '2023', status: 'Pending', deadline: '2024-04-15', hours: 15.0, rate: 450 },
  { client: 'Davis Corporation', year: '2023', status: 'Completed', deadline: '2024-03-15', hours: 22.0, rate: 375 },
  { client: 'Miller Partnership', year: '2023', status: 'In Review', deadline: '2024-03-15', hours: 6.5, rate: 350 }
];

export function CSVExport() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['client_info', 'tax_returns']);
  const [dateRange, setDateRange] = useState('ytd');
  const [exportFormat, setExportFormat] = useState('csv');

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const generateCSV = () => {
    // Simple CSV generation for demo
    const headers = ['Client', 'Year', 'Status', 'Deadline', 'Hours', 'Rate', 'Total'];
    const rows = clientData.map(item => [
      item.client,
      item.year,
      item.status,
      item.deadline,
      item.hours.toString(),
      `$${item.rate}`,
      `$${(item.hours * item.rate).toFixed(2)}`
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accountant_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('CSV export downloaded successfully');
  };

  const exportSummary = {
    totalClients: clientData.length,
    totalHours: clientData.reduce((sum, item) => sum + item.hours, 0),
    totalRevenue: clientData.reduce((sum, item) => sum + (item.hours * item.rate), 0),
    completedReturns: clientData.filter(item => item.status === 'Completed').length
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/pros/accountants">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">CSV Export</h1>
            <p className="text-muted-foreground">
              Export client data and reports for external analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Select Data to Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {option.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Export Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Button 
                    onClick={generateCSV}
                    disabled={selectedOptions.length === 0}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Export
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Export
                  </Button>
                </div>
                
                {selectedOptions.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please select at least one data type to export
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Export Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Export Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Clients</span>
                  <span className="font-medium">{exportSummary.totalClients}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Hours</span>
                  <span className="font-medium">{exportSummary.totalHours}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-medium">${exportSummary.totalRevenue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Returns</span>
                  <span className="font-medium">{exportSummary.completedReturns}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Exports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Client_Data_2024.csv</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Tax_Returns_Q1.xlsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Billing_Report_Jan.pdf</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}