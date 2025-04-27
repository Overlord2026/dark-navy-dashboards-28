
export type ReportType = 'assets' | 'liabilities' | 'cashflow' | 'networth' | 'custom';

export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  icon: React.ReactNode;
}
