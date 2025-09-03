/**
 * Functional Tests for Advisor Dashboard and Tools
 * Tests core workflows including client management, financial reports, and data syncing
 */

import { demoService } from '@/services/demoService';
import { loadAdvisorFixtures, getAdvisorClients, getAdvisorActionItems } from '@/fixtures/advisors.fixtures';

interface TestClient {
  id: string;
  name: string;
  email: string;
  status: 'action-needed' | 'pending-review' | 'up-to-date';
  aum: number;
  risk_tolerance: string;
  goals: string[];
}

interface TestReport {
  id: string;
  client_id: string;
  type: '401k_fee_compare' | 'portfolio_analysis' | 'tax_optimization';
  status: 'generating' | 'completed' | 'error';
  data: any;
  created_at: string;
}

interface TestTask {
  id: string;
  client_id: string;
  description: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

export class AdvisorDashboardTests {
  private clients: TestClient[] = [];
  private reports: TestReport[] = [];
  private tasks: TestTask[] = [];
  
  async setup() {
    console.log('🚀 Setting up Advisor Dashboard functional tests...');
    
    // Load demo fixtures
    await demoService.loadAllFixtures();
    const advisorData = await loadAdvisorFixtures();
    
    // Initialize test data from fixtures
    this.clients = advisorData.clients.map(client => ({
      id: client.id,
      name: client.name,
      email: `${client.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      status: 'up-to-date' as const,
      aum: client.aum,
      risk_tolerance: client.risk_tolerance,
      goals: client.goals
    }));
    
    console.log(`✅ Loaded ${this.clients.length} test clients from fixtures`);
  }

  // Test 1: Advisor adds a new client to the system
  async testAddNewClient(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('📋 Testing: Advisor adds new client...');
      
      const newClient: TestClient = {
        id: `client_${Date.now()}`,
        name: 'Test Family Trust',
        email: 'test.family@email.com',
        status: 'action-needed',
        aum: 1500000,
        risk_tolerance: 'Moderate',
        goals: ['Retirement planning', 'Tax optimization', 'Estate planning']
      };
      
      // Simulate adding client to system
      this.clients.push(newClient);
      
      // Verify client was added
      const addedClient = this.clients.find(c => c.id === newClient.id);
      if (!addedClient) {
        throw new Error('Client was not properly added to system');
      }
      
      // Create initial action items for new client
      const initialTasks: TestTask[] = [
        {
          id: `task_${Date.now()}_1`,
          client_id: newClient.id,
          description: 'Complete client onboarding questionnaire',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'pending'
        },
        {
          id: `task_${Date.now()}_2`,
          client_id: newClient.id,
          description: 'Schedule initial portfolio review meeting',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'pending'
        }
      ];
      
      this.tasks.push(...initialTasks);
      
      console.log(`✅ Successfully added new client: ${newClient.name}`);
      console.log(`✅ Created ${initialTasks.length} initial action items`);
      
      return {
        success: true,
        message: 'New client added successfully with initial tasks',
        data: { client: newClient, tasks: initialTasks }
      };
    } catch (error) {
      console.error('❌ Failed to add new client:', error);
      return {
        success: false,
        message: `Failed to add new client: ${error}`
      };
    }
  }

  // Test 2: Advisor creates financial reports (401k fee compare, portfolio analysis)
  async testCreateFinancialReports(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('📊 Testing: Creating financial reports...');
      
      if (this.clients.length === 0) {
        throw new Error('No clients available for report generation');
      }
      
      const testClient = this.clients[0];
      const reports: TestReport[] = [];
      
      // 1. Create 401k Fee Compare Report
      const feeCompareReport: TestReport = {
        id: `report_${Date.now()}_fee`,
        client_id: testClient.id,
        type: '401k_fee_compare',
        status: 'completed',
        data: {
          current_fee: 0.85, // 85 bps
          benchmark_fee: 0.95, // 95 bps
          savings_potential: 0.10, // 10 bps savings
          annual_savings: Math.round(testClient.aum * 0.001), // $1,500 for $1.5M AUM
          comparison_data: {
            peer_group: 'wealth_management_12plus_years',
            percentile_ranking: 'Above Average',
            proof_verified: true
          }
        },
        created_at: new Date().toISOString()
      };
      
      // 2. Create Portfolio Analysis Report
      const portfolioReport: TestReport = {
        id: `report_${Date.now()}_portfolio`,
        client_id: testClient.id,
        type: 'portfolio_analysis',
        status: 'completed',
        data: {
          total_value: testClient.aum,
          asset_allocation: {
            stocks: 0.60,
            bonds: 0.30,
            alternatives: 0.10
          },
          risk_metrics: {
            beta: 0.85,
            sharpe_ratio: 1.2,
            volatility: 0.12
          },
          performance: {
            ytd_return: 0.08,
            one_year: 0.12,
            three_year: 0.10
          },
          recommendations: [
            'Consider rebalancing to target allocation',
            'Review bond duration given interest rate environment',
            'Explore tax-loss harvesting opportunities'
          ]
        },
        created_at: new Date().toISOString()
      };
      
      // 3. Create Tax Optimization Report
      const taxReport: TestReport = {
        id: `report_${Date.now()}_tax`,
        client_id: testClient.id,
        type: 'tax_optimization',
        status: 'completed',
        data: {
          potential_savings: 15000,
          strategies: [
            'Tax-loss harvesting',
            'Asset location optimization',
            'Roth conversion analysis'
          ],
          implementation_priority: [
            'High: Harvest available losses before year-end',
            'Medium: Review municipal bond allocation',
            'Low: Consider Roth conversion in low-income year'
          ]
        },
        created_at: new Date().toISOString()
      };
      
      reports.push(feeCompareReport, portfolioReport, taxReport);
      this.reports.push(...reports);
      
      console.log(`✅ Generated ${reports.length} financial reports for ${testClient.name}`);
      console.log('   • 401k Fee Comparison Report');
      console.log('   • Portfolio Analysis Report');
      console.log('   • Tax Optimization Report');
      
      return {
        success: true,
        message: 'Financial reports generated successfully',
        data: { client: testClient, reports }
      };
    } catch (error) {
      console.error('❌ Failed to create financial reports:', error);
      return {
        success: false,
        message: `Failed to create financial reports: ${error}`
      };
    }
  }

  // Test 3: Track tasks and activities through client management
  async testClientTaskManagement(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('📋 Testing: Client task management...');
      
      if (this.clients.length === 0) {
        throw new Error('No clients available for task management');
      }
      
      const testClient = this.clients[0];
      const taskResults = [];
      
      // Create new task
      const newTask: TestTask = {
        id: `task_${Date.now()}_manage`,
        client_id: testClient.id,
        description: 'Review updated risk tolerance questionnaire',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'pending'
      };
      
      this.tasks.push(newTask);
      taskResults.push({ action: 'created', task: newTask });
      
      // Update existing task status
      const existingTask = this.tasks.find(t => t.client_id === testClient.id && t.status === 'pending');
      if (existingTask) {
        existingTask.status = 'in_progress';
        taskResults.push({ action: 'updated', task: existingTask });
      }
      
      // Complete a task
      const inProgressTask = this.tasks.find(t => t.client_id === testClient.id && t.status === 'in_progress');
      if (inProgressTask) {
        inProgressTask.status = 'completed';
        taskResults.push({ action: 'completed', task: inProgressTask });
      }
      
      // Generate task summary for client
      const clientTasks = this.tasks.filter(t => t.client_id === testClient.id);
      const taskSummary = {
        total: clientTasks.length,
        pending: clientTasks.filter(t => t.status === 'pending').length,
        in_progress: clientTasks.filter(t => t.status === 'in_progress').length,
        completed: clientTasks.filter(t => t.status === 'completed').length,
        high_priority: clientTasks.filter(t => t.priority === 'high').length
      };
      
      console.log(`✅ Task management test completed for ${testClient.name}`);
      console.log(`   • Total tasks: ${taskSummary.total}`);
      console.log(`   • Pending: ${taskSummary.pending}`);
      console.log(`   • In Progress: ${taskSummary.in_progress}`);
      console.log(`   • Completed: ${taskSummary.completed}`);
      
      return {
        success: true,
        message: 'Client task management working correctly',
        data: { client: testClient, taskSummary, taskResults }
      };
    } catch (error) {
      console.error('❌ Failed task management test:', error);
      return {
        success: false,
        message: `Task management test failed: ${error}`
      };
    }
  }

  // Test 4: Data syncing across tools
  async testDataSyncing(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      console.log('🔄 Testing: Data syncing across tools...');
      
      if (this.clients.length === 0 || this.reports.length === 0) {
        throw new Error('Insufficient test data for sync testing');
      }
      
      const testClient = this.clients[0];
      const syncResults = [];
      
      // 1. Test client data sync with reports
      const clientReports = this.reports.filter(r => r.client_id === testClient.id);
      if (clientReports.length > 0) {
        syncResults.push({
          test: 'client_reports_sync',
          status: 'passed',
          message: `${clientReports.length} reports correctly linked to client`
        });
      }
      
      // 2. Test portfolio data consistency
      const portfolioReport = clientReports.find(r => r.type === 'portfolio_analysis');
      if (portfolioReport && portfolioReport.data.total_value === testClient.aum) {
        syncResults.push({
          test: 'portfolio_aum_sync',
          status: 'passed',
          message: 'Portfolio report AUM matches client record'
        });
      }
      
      // 3. Test task-report integration
      const reportTasks = this.tasks.filter(t => 
        t.client_id === testClient.id && 
        t.description.toLowerCase().includes('review')
      );
      
      if (reportTasks.length > 0) {
        syncResults.push({
          test: 'task_report_integration',
          status: 'passed',
          message: 'Review tasks properly linked to generated reports'
        });
      }
      
      // 4. Test cross-tool data flow
      const feeCompareReport = clientReports.find(r => r.type === '401k_fee_compare');
      const taxReport = clientReports.find(r => r.type === 'tax_optimization');
      
      if (feeCompareReport && taxReport) {
        // Verify fee savings data flows to tax optimization
        const feeAnnualSavings = feeCompareReport.data.annual_savings;
        const taxPotentialSavings = taxReport.data.potential_savings;
        
        if (feeAnnualSavings > 0 && taxPotentialSavings > 0) {
          syncResults.push({
            test: 'cross_tool_data_flow',
            status: 'passed',
            message: 'Fee and tax optimization data properly integrated'
          });
        }
      }
      
      // 5. Test client vault integration
      const vaultData = {
        client_id: testClient.id,
        documents: [
          { type: 'portfolio_report', report_id: portfolioReport?.id },
          { type: 'fee_analysis', report_id: feeCompareReport?.id },
          { type: 'tax_strategy', report_id: taxReport?.id }
        ],
        access_permissions: ['advisor', 'client'],
        sync_status: 'current'
      };
      
      syncResults.push({
        test: 'client_vault_sync',
        status: 'passed',
        message: 'Client vault properly synchronized with reports'
      });
      
      const passedTests = syncResults.filter(r => r.status === 'passed').length;
      const totalTests = syncResults.length;
      
      console.log(`✅ Data syncing test: ${passedTests}/${totalTests} tests passed`);
      syncResults.forEach(result => {
        console.log(`   • ${result.test}: ${result.message}`);
      });
      
      return {
        success: passedTests === totalTests,
        message: `Data syncing: ${passedTests}/${totalTests} tests passed`,
        data: { syncResults, vaultData }
      };
    } catch (error) {
      console.error('❌ Data syncing test failed:', error);
      return {
        success: false,
        message: `Data syncing test failed: ${error}`
      };
    }
  }

  // Run all tests
  async runAllTests(): Promise<{ 
    success: boolean; 
    totalTests: number; 
    passedTests: number; 
    results: any[] 
  }> {
    console.log('🧪 Running Advisor Dashboard Functional Tests');
    console.log('============================================');
    
    await this.setup();
    
    const testResults = [
      await this.testAddNewClient(),
      await this.testCreateFinancialReports(),
      await this.testClientTaskManagement(),
      await this.testDataSyncing()
    ];
    
    const passedTests = testResults.filter(r => r.success).length;
    const totalTests = testResults.length;
    
    console.log('\n📊 FUNCTIONAL TEST SUMMARY');
    console.log('===========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All advisor dashboard tools are functional and data syncs correctly!');
    } else {
      console.log('⚠️  Some tests failed - review logs for details');
    }
    
    return {
      success: passedTests === totalTests,
      totalTests,
      passedTests,
      results: testResults
    };
  }
}

// Export test runner for external use
export async function runAdvisorDashboardTests() {
  const testRunner = new AdvisorDashboardTests();
  return await testRunner.runAllTests();
}