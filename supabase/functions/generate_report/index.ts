import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  report_type: string;
  format: 'pdf' | 'csv';
  filters?: Record<string, any>;
}

interface UserProfile {
  id: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Report generation request received');
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get user from JWT token
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Invalid authentication token');
    }

    console.log('User authenticated:', user.id);

    // Get user profile for role information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      throw new Error('User profile not found');
    }

    // Parse request body
    const { report_type, format, filters = {} }: ReportRequest = await req.json();

    // Validate input
    if (!report_type || !format) {
      throw new Error('Missing required fields: report_type, format');
    }

    if (!['pdf', 'csv'].includes(format)) {
      throw new Error('Format must be either "pdf" or "csv"');
    }

    console.log('Report request validated:', { report_type, format, user_id: user.id });

    // Generate report data based on type
    let reportData: any;
    let reportTitle = '';

    // Validate role-based access to report types
    const allowedReports = getRoleAllowedReports(profile.role);
    if (!allowedReports.includes(report_type)) {
      throw new Error(`Unauthorized: Role "${profile.role}" cannot access report type "${report_type}"`);
    }

    switch (report_type) {
      // Client reports
      case 'net_worth':
        reportData = await generateNetWorthReport(supabase, user.id);
        reportTitle = 'Net Worth Report';
        break;
      case 'income_roadmap':
        reportData = await generateIncomeRoadmapReport(supabase, user.id);
        reportTitle = 'Income Roadmap Report';
        break;
      case 'vault_activity':
        reportData = await generateVaultActivityReport(supabase, user.id, filters);
        reportTitle = 'Vault Activity Report';
        break;
      
      // Advisor reports
      case 'client_summary':
        reportData = await generateClientSummaryReport(supabase, user.id);
        reportTitle = 'Client Summary Report';
        break;
      case 'deliverables_due':
        reportData = await generateDeliverablesDueReport(supabase, user.id);
        reportTitle = 'Deliverables Due Report';
        break;
      case 'vault_analytics':
        reportData = await generateVaultAnalyticsReport(supabase, user.id);
        reportTitle = 'Vault Analytics Report';
        break;
      
      // Accountant reports
      case 'tax_uploads':
        reportData = await generateTaxUploadsReport(supabase, user.id, filters);
        reportTitle = 'Tax Uploads Report';
        break;
      case 'report_export':
        reportData = await generateReportExportReport(supabase, user.id);
        reportTitle = 'Report Export';
        break;
      
      // Attorney reports
      case 'estate_docs':
        reportData = await generateEstateDocsReport(supabase, user.id);
        reportTitle = 'Estate Documents Report';
        break;
      case 'legal_history':
        reportData = await generateLegalHistoryReport(supabase, user.id);
        reportTitle = 'Legal History Report';
        break;
      
      // Admin reports
      case 'audit_log':
        reportData = await generateAuditLogReport(supabase, user.id);
        reportTitle = 'Audit Log Report';
        break;
      case 'subscription_summary':
        reportData = await generateSubscriptionSummaryReport(supabase, user.id);
        reportTitle = 'Subscription Summary Report';
        break;
      case 'system_snapshot':
        reportData = await generateSystemSnapshotReport(supabase, user.id);
        reportTitle = 'System Snapshot Report';
        break;
      
      default:
        throw new Error(`Unsupported report type: ${report_type}`);
    }

    console.log('Report data generated for type:', report_type);

    // Generate file based on format
    let fileContent: Uint8Array;
    let fileName: string;
    let contentType: string;

    if (format === 'pdf') {
      fileContent = await generatePDFReport(reportData, reportTitle, profile);
      fileName = `${report_type}_${Date.now()}.pdf`;
      contentType = 'application/pdf';
    } else {
      fileContent = new TextEncoder().encode(generateCSVReport(reportData, report_type));
      fileName = `${report_type}_${Date.now()}.csv`;
      contentType = 'text/csv';
    }

    console.log('File generated:', fileName);

    // Upload to storage
    const storagePath = `${user.id}/${fileName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(storagePath, fileContent, {
        contentType,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload report to storage');
    }

    console.log('File uploaded to storage:', storagePath);

    // Generate signed URL (valid for 7 days)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('reports')
      .createSignedUrl(storagePath, 604800); // 7 days

    if (urlError || !signedUrlData.signedUrl) {
      console.error('Signed URL error:', urlError);
      throw new Error('Failed to generate download URL');
    }

    console.log('Signed URL generated');

    // Create report record in database
    const { data: reportRecord, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        role: profile.role,
        report_type,
        format,
        download_url: signedUrlData.signedUrl,
        metadata: {
          filters,
          file_name: fileName,
          file_size: fileContent.length,
          generation_timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (reportError) {
      console.error('Database insert error:', reportError);
      throw new Error('Failed to create report record');
    }

    console.log('Report record created:', reportRecord.id);

    return new Response(
      JSON.stringify({
        success: true,
        report_id: reportRecord.id,
        download_url: signedUrlData.signedUrl,
        message: 'Report generated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Report generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

// Role-based report access control
function getRoleAllowedReports(role: string): string[] {
  const roleReportMap: Record<string, string[]> = {
    client: ['net_worth', 'income_roadmap', 'vault_activity'],
    advisor: ['client_summary', 'deliverables_due', 'vault_analytics'],
    accountant: ['tax_uploads', 'report_export'],
    attorney: ['estate_docs', 'legal_history'],
    admin: ['audit_log', 'subscription_summary', 'system_snapshot'],
    tenant_admin: ['audit_log', 'subscription_summary', 'system_snapshot'],
    system_administrator: ['audit_log', 'subscription_summary', 'system_snapshot']
  };
  
  return roleReportMap[role] || [];
}

// Helper function to generate net worth report data
async function generateNetWorthReport(supabase: any, userId: string) {
  const [accounts, goals, assets] = await Promise.all([
    // Bank accounts
    supabase
      .from('bank_accounts')
      .select('name, account_type, balance, institution_name')
      .eq('user_id', userId),
    
    // Budget goals
    supabase
      .from('budget_goals')
      .select('title, target_amount, current_amount, target_date, category')
      .eq('user_id', userId),
    
    // Credit cards for liabilities
    supabase
      .from('credit_cards')
      .select('name, current_balance, credit_limit, issuer')
      .eq('user_id', userId)
  ]);

  const totalAssets = accounts.data?.reduce((sum: number, acc: any) => sum + acc.balance, 0) || 0;
  const totalLiabilities = assets.data?.reduce((sum: number, cc: any) => sum + cc.current_balance, 0) || 0;
  const netWorth = totalAssets - totalLiabilities;

  return {
    summary: {
      total_assets: totalAssets,
      total_liabilities: totalLiabilities,
      net_worth: netWorth
    },
    accounts: accounts.data || [],
    goals: goals.data || [],
    credit_cards: assets.data || []
  };
}

// Helper function to generate vault activity report data
async function generateVaultActivityReport(supabase: any, userId: string, filters: any) {
  const dateFilter = filters.date_range ? new Date(filters.date_range.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  // Note: This assumes you have audit logs or document access logs
  // Adjust table names based on your actual schema
  const { data: activities } = await supabase
    .from('audit_logs')
    .select('event_type, table_name, created_at, details')
    .eq('user_id', userId)
    .gte('created_at', dateFilter.toISOString())
    .order('created_at', { ascending: false })
    .limit(100);

  return {
    activities: activities || [],
    summary: {
      total_activities: activities?.length || 0,
      date_range: {
        start: dateFilter.toISOString(),
        end: new Date().toISOString()
      }
    }
  };
}

// Helper function to generate tax activity report data
async function generateTaxActivityReport(supabase: any, userId: string, filters: any) {
  const year = filters.tax_year || new Date().getFullYear();
  
  // Note: Adjust based on your actual tax document schema
  const { data: taxDocs } = await supabase
    .from('tax_documents')
    .select('document_type, file_name, upload_date, tax_year')
    .eq('user_id', userId)
    .eq('tax_year', year)
    .order('upload_date', { ascending: false });

  return {
    tax_year: year,
    documents: taxDocs || [],
    summary: {
      total_documents: taxDocs?.length || 0,
      document_types: [...new Set(taxDocs?.map((doc: any) => doc.document_type) || [])]
    }
  };
}

// Client report generators
async function generateIncomeRoadmapReport(supabase: any, userId: string) {
  const { data: goals } = await supabase
    .from('budget_goals')
    .select('*')
    .eq('user_id', userId)
    .order('target_date', { ascending: true });

  return {
    income_projections: goals?.map((goal: any) => ({
      goal: goal.title,
      target_amount: goal.target_amount,
      current_progress: goal.current_amount,
      target_date: goal.target_date
    })) || [],
    summary: {
      total_income_goals: goals?.length || 0,
      projected_annual_income: goals?.reduce((sum: number, goal: any) => sum + goal.target_amount, 0) || 0
    }
  };
}

// Advisor report generators
async function generateClientSummaryReport(supabase: any, advisorId: string) {
  const { data: assignments } = await supabase
    .from('client_assignments')
    .select(`
      client_user_id,
      profiles!client_user_id(first_name, last_name)
    `)
    .eq('professional_user_id', advisorId);

  return {
    clients: assignments?.map((assignment: any) => ({
      client_name: `${assignment.profiles?.first_name || ''} ${assignment.profiles?.last_name || ''}`.trim(),
      client_id: assignment.client_user_id
    })) || [],
    summary: {
      total_clients: assignments?.length || 0
    }
  };
}

async function generateDeliverablesDueReport(supabase: any, advisorId: string) {
  // Mock data - replace with actual deliverables table
  return {
    deliverables: [
      { client: 'Sample Client', deliverable: 'Portfolio Review', due_date: new Date().toISOString() }
    ],
    summary: {
      total_deliverables: 1,
      overdue: 0
    }
  };
}

async function generateVaultAnalyticsReport(supabase: any, advisorId: string) {
  const { data: activities } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', advisorId)
    .order('created_at', { ascending: false })
    .limit(50);

  return {
    activities: activities || [],
    summary: {
      total_activities: activities?.length || 0
    }
  };
}

// Accountant report generators
async function generateTaxUploadsReport(supabase: any, userId: string, filters: any) {
  const year = filters.tax_year || new Date().getFullYear();
  
  // Mock data - replace with actual tax documents table
  return {
    tax_year: year,
    uploads: [
      { document: 'W-2 Form', upload_date: new Date().toISOString(), status: 'processed' }
    ],
    summary: {
      total_uploads: 1
    }
  };
}

async function generateReportExportReport(supabase: any, userId: string) {
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false });

  return {
    reports: reports || [],
    summary: {
      total_reports: reports?.length || 0
    }
  };
}

// Attorney report generators
async function generateEstateDocsReport(supabase: any, userId: string) {
  // Mock data - replace with actual estate documents table
  return {
    estate_documents: [
      { document_type: 'Will', last_updated: new Date().toISOString(), status: 'current' }
    ],
    summary: {
      total_documents: 1
    }
  };
}

async function generateLegalHistoryReport(supabase: any, userId: string) {
  const { data: activities } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .ilike('table_name', '%legal%')
    .order('created_at', { ascending: false });

  return {
    legal_activities: activities || [],
    summary: {
      total_activities: activities?.length || 0
    }
  };
}

// Admin report generators
async function generateAuditLogReport(supabase: any, userId: string) {
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return {
    audit_logs: logs || [],
    summary: {
      total_logs: logs?.length || 0
    }
  };
}

async function generateSubscriptionSummaryReport(supabase: any, userId: string) {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('role, created_at')
    .order('created_at', { ascending: false });

  return {
    subscriptions: profiles?.map((profile: any) => ({
      role: profile.role,
      created_at: profile.created_at
    })) || [],
    summary: {
      total_users: profiles?.length || 0
    }
  };
}

async function generateSystemSnapshotReport(supabase: any, userId: string) {
  const [users, reports, activities] = await Promise.all([
    supabase.from('profiles').select('role').order('created_at', { ascending: false }),
    supabase.from('reports').select('report_type').order('generated_at', { ascending: false }),
    supabase.from('audit_logs').select('event_type').order('created_at', { ascending: false }).limit(50)
  ]);

  return {
    system_overview: {
      total_users: users.data?.length || 0,
      total_reports: reports.data?.length || 0,
      recent_activities: activities.data?.length || 0
    },
    user_breakdown: users.data || [],
    recent_reports: reports.data || [],
    recent_activities: activities.data || []
  };
}

// Helper function to generate PDF report
async function generatePDFReport(data: any, title: string, profile: UserProfile): Promise<Uint8Array> {
  const doc = new jsPDF();
  let yPosition = 20;

  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, yPosition);
  yPosition += 15;

  // Add user info
  doc.setFontSize(12);
  doc.text(`Generated for: ${profile.first_name || ''} ${profile.last_name || ''}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Role: ${profile.role}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 20;

  // Add summary if available
  if (data.summary) {
    doc.setFontSize(14);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    Object.entries(data.summary).forEach(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const formattedValue = typeof value === 'number' ? 
        (key.includes('amount') || key.includes('worth') ? `$${value.toLocaleString()}` : value.toString()) :
        value;
      doc.text(`${formattedKey}: ${formattedValue}`, 20, yPosition);
      yPosition += 8;
    });
    yPosition += 10;
  }

  // Add data sections
  Object.entries(data).forEach(([section, items]) => {
    if (section !== 'summary' && Array.isArray(items) && items.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      const sectionTitle = section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      doc.text(sectionTitle, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      items.slice(0, 10).forEach((item: any) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const itemText = Object.entries(item)
          .slice(0, 3)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        doc.text(itemText.substring(0, 80), 20, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }
  });

  return new Uint8Array(doc.output('arraybuffer'));
}

// Helper function to generate CSV report
function generateCSVReport(data: any, reportType: string): string {
  let csv = `Report Type: ${reportType}\n`;
  csv += `Generated: ${new Date().toISOString()}\n\n`;

  // Add summary
  if (data.summary) {
    csv += 'SUMMARY\n';
    Object.entries(data.summary).forEach(([key, value]) => {
      csv += `${key},${value}\n`;
    });
    csv += '\n';
  }

  // Add data sections
  Object.entries(data).forEach(([section, items]) => {
    if (section !== 'summary' && Array.isArray(items) && items.length > 0) {
      csv += `${section.toUpperCase()}\n`;
      
      // Add headers
      const headers = Object.keys(items[0] || {});
      csv += headers.join(',') + '\n';
      
      // Add data rows
      items.forEach((item: any) => {
        const values = headers.map(header => {
          const value = item[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        });
        csv += values.join(',') + '\n';
      });
      csv += '\n';
    }
  });

  return csv;
}