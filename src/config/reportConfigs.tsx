
import { BarChart3, FileText, FileSpreadsheet, PieChart, ListFilter } from "lucide-react";
import { ReportConfig } from "@/types/reports";

export const reportConfigs: ReportConfig[] = [
  {
    id: 'assets-report',
    name: 'Assets Report',
    description: 'Comprehensive breakdown of all assets including properties, investments, cash, and valuables',
    type: 'assets',
    icon: <BarChart3 className="h-5 w-5 text-blue-500" />
  },
  {
    id: 'liabilities-report',
    name: 'Liabilities Report',
    description: 'Summary of all debts, mortgages, loans and financial obligations',
    type: 'liabilities',
    icon: <FileText className="h-5 w-5 text-red-500" />
  },
  {
    id: 'cashflow-report',
    name: 'Cash Flow Report',
    description: 'Analysis of income and expenses over selected time periods',
    type: 'cashflow',
    icon: <FileSpreadsheet className="h-5 w-5 text-green-500" />
  },
  {
    id: 'networth-report',
    name: 'Net Worth Report',
    description: 'Complete financial position including historical trends and projections',
    type: 'networth',
    icon: <PieChart className="h-5 w-5 text-purple-500" />
  },
  {
    id: 'custom-report',
    name: 'Custom Report',
    description: 'Create a tailored report with selected data points and categories',
    type: 'custom',
    icon: <ListFilter className="h-5 w-5 text-amber-500" />
  }
];
