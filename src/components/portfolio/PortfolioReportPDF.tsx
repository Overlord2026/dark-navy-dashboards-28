import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { 
  AssetAllocationChart, 
  PerformanceChart, 
  RiskReturnChart, 
  SectorChart, 
  IncomeChart 
} from './PortfolioCharts';
import CompetitorComparison from './CompetitorComparison';
import { FeeExpenseComparison } from './FeeExpenseComparison';

// Enhanced styles for professional PDF
const styles = StyleSheet.create({
  page: { 
    padding: 24, 
    fontSize: 11, 
    fontFamily: 'Helvetica',
    lineHeight: 1.4
  },
  cover: { 
    textAlign: 'center', 
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000000'
  },
  heading: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 6,
    color: '#1a1a1a'
  },
  subheading: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4
  },
  section: { 
    marginBottom: 16
  },
  table: { 
    width: "100%", 
    marginBottom: 8 
  },
  tableRow: { 
    flexDirection: "row",
    borderBottom: 0.5,
    borderBottomColor: '#eeeeee'
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: '#f5f5f5',
    borderBottom: 1,
    borderBottomColor: '#dddddd'
  },
  tableCell: { 
    width: "10%", 
    padding: 4, 
    fontSize: 9,
    textAlign: 'center'
  },
  tableCellWide: {
    width: "15%", 
    padding: 4, 
    fontSize: 9,
    textAlign: 'left'
  },
  tableCellHeader: {
    width: "10%", 
    padding: 4, 
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tableCellHeaderWide: {
    width: "15%", 
    padding: 4, 
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  notes: { 
    backgroundColor: "#f0f9ff", 
    padding: 10, 
    borderRadius: 4,
    marginBottom: 12
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1e40af'
  },
  small: { 
    fontSize: 8, 
    color: "#666",
    marginTop: 20,
    textAlign: 'center'
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8
  },
  summaryItem: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4
  },
  summaryLabel: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a'
  }
});

// Helper for enhanced holdings table with 10-year returns
function HoldingsTable({ holdings, marketData }: { holdings: any[], marketData: Record<string, any> }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeaderWide}>Ticker</Text>
        <Text style={[styles.tableCellHeaderWide, { width: "20%" }]}>Name</Text>
        <Text style={styles.tableCellHeaderWide}>Sector</Text>
        <Text style={styles.tableCellHeader}>Weight</Text>
        <Text style={styles.tableCellHeader}>Beta</Text>
        <Text style={styles.tableCellHeader}>Yield</Text>
        <Text style={styles.tableCellHeader}>1yr</Text>
        <Text style={styles.tableCellHeader}>3yr</Text>
        <Text style={styles.tableCellHeader}>5yr</Text>
        <Text style={styles.tableCellHeader}>10yr</Text>
      </View>
      {holdings.map((holding, index) => {
        const data = marketData[holding.symbol] || {};
        const weight = (holding.value / holdings.reduce((sum, h) => sum + h.value, 0)) * 100;
        return (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCellWide}>{holding.symbol}</Text>
            <Text style={[styles.tableCellWide, { width: "20%" }]}>{holding.name}</Text>
            <Text style={styles.tableCellWide}>{data.sector || 'Technology'}</Text>
            <Text style={styles.tableCell}>{weight.toFixed(1)}%</Text>
            <Text style={styles.tableCell}>{data.beta ? data.beta.toFixed(2) : 'N/A'}</Text>
            <Text style={styles.tableCell}>{data.yield ? (data.yield * 100).toFixed(2) + '%' : 'N/A'}</Text>
            <Text style={styles.tableCell}>{data.oneYearReturn ? (data.oneYearReturn * 100).toFixed(1) + '%' : 'N/A'}</Text>
            <Text style={styles.tableCell}>{data.threeYearReturn ? (data.threeYearReturn * 100).toFixed(1) + '%' : 'N/A'}</Text>
            <Text style={styles.tableCell}>{data.fiveYearReturn ? (data.fiveYearReturn * 100).toFixed(1) + '%' : 'N/A'}</Text>
            <Text style={styles.tableCell}>{data.tenYearReturn ? (data.tenYearReturn * 100).toFixed(1) + '%' : 'N/A'}</Text>
          </View>
        );
      })}
    </View>
  );
}

interface Portfolio {
  name: string;
  holdings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    assetClass: 'stock' | 'bond' | 'reit' | 'commodity' | 'cash';
  }>;
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

interface PortfolioMetrics {
  beta: number;
  volatility: number;
  yield: number;
  riskScore: number;
}

interface PortfolioReportPDFProps {
  portfolio: Portfolio;
  proposal?: Portfolio;
  benchmarks?: any;
  sections: string[];
  advisorNotes: string;
  previewMode?: boolean;
  currentMetrics: PortfolioMetrics;
  proposedMetrics?: PortfolioMetrics;
  marketData: Record<string, any>;
  clientName: string;
  competitorData?: {
    competitors: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export default function PortfolioReportPDF({
  portfolio,
  proposal,
  benchmarks,
  sections,
  advisorNotes,
  previewMode = false,
  currentMetrics,
  proposedMetrics,
  marketData,
  clientName,
  competitorData
}: PortfolioReportPDFProps) {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Prepare chart data
  const assetAllocationData = portfolio.holdings.reduce((acc, holding) => {
    const existing = acc.find(item => item.name === holding.assetClass.toUpperCase());
    const weight = (holding.value / portfolio.totalValue) * 100;
    if (existing) {
      existing.value += weight;
      existing.amount += holding.value;
    } else {
      acc.push({
        name: holding.assetClass.toUpperCase(),
        value: weight,
        amount: holding.value
      });
    }
    return acc;
  }, [] as Array<{name: string; value: number; amount: number}>);

  const performanceData = [
    { period: '1 Year', portfolio: 12.5, sp500: 10.2, agg: 4.8 },
    { period: '3 Year', portfolio: 8.7, sp500: 9.1, agg: 3.2 },
    { period: '5 Year', portfolio: 10.1, sp500: 11.3, agg: 2.9 },
    { period: 'YTD', portfolio: 15.2, sp500: 12.8, agg: 6.1 }
  ];

  const sectorData = portfolio.holdings.reduce((acc, holding) => {
    const data = marketData[holding.symbol] || {};
    const sector = data.sector || 'Technology';
    const weight = (holding.value / portfolio.totalValue) * 100;
    const existing = acc.find(item => item.sector === sector);
    if (existing) {
      existing.allocation += weight;
    } else {
      acc.push({
        sector,
        allocation: weight,
        performance: Math.random() * 20 - 5 // Placeholder performance data
      });
    }
    return acc;
  }, [] as Array<{sector: string; allocation: number; performance: number}>);

  if (previewMode) {
    // Return HTML preview for live preview with enhanced charts
    return (
      <div className="bg-white p-8 text-black font-sans max-w-4xl mx-auto">
        {/* Cover Page */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-900">
          <h1 className="text-2xl font-bold mb-2">Portfolio Review & Analysis</h1>
          <p className="text-lg">Prepared for {clientName}</p>
          <p className="text-gray-600">{reportDate}</p>
        </div>

        {/* Executive Summary */}
        {sections.includes('summary') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Executive Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Portfolio Value</p>
                <p className="text-lg font-bold">{formatCurrency(portfolio.totalValue)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Portfolio Beta</p>
                <p className="text-lg font-bold">{currentMetrics.beta.toFixed(2)} (vs. S&P 500)</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Income Yield</p>
                <p className="text-lg font-bold">{formatPercentage(currentMetrics.yield)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Risk Score</p>
                <p className="text-lg font-bold">{currentMetrics.riskScore}/100</p>
              </div>
            </div>
          </div>
        )}

        {/* Holdings Table */}
        {sections.includes('holdings') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Portfolio Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-r">Ticker</th>
                    <th className="text-left p-2 border-r">Name</th>
                    <th className="text-left p-2 border-r">Sector</th>
                    <th className="text-center p-2 border-r">Weight</th>
                    <th className="text-center p-2 border-r">Beta</th>
                    <th className="text-center p-2 border-r">Yield</th>
                    <th className="text-center p-2 border-r">1yr</th>
                    <th className="text-center p-2 border-r">3yr</th>
                    <th className="text-center p-2 border-r">5yr</th>
                    <th className="text-center p-2">10yr</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding, index) => {
                    const data = marketData[holding.symbol] || {};
                    const weight = (holding.value / portfolio.totalValue) * 100;
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium border-r">{holding.symbol}</td>
                        <td className="p-2 border-r">{holding.name}</td>
                        <td className="p-2 border-r">{data.sector || 'Technology'}</td>
                        <td className="p-2 text-center border-r">{weight.toFixed(1)}%</td>
                        <td className="p-2 text-center border-r">{data.beta ? data.beta.toFixed(2) : 'N/A'}</td>
                        <td className="p-2 text-center border-r">{data.yield ? formatPercentage(data.yield) : 'N/A'}</td>
                        <td className="p-2 text-center border-r">{data.oneYearReturn ? formatPercentage(data.oneYearReturn) : 'N/A'}</td>
                        <td className="p-2 text-center border-r">{data.threeYearReturn ? formatPercentage(data.threeYearReturn) : 'N/A'}</td>
                        <td className="p-2 text-center border-r">{data.fiveYearReturn ? formatPercentage(data.fiveYearReturn) : 'N/A'}</td>
                        <td className="p-2 text-center">N/A</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Asset Allocation Chart */}
        {sections.includes('allocation') && (
          <div className="mb-8">
            <AssetAllocationChart 
              data={assetAllocationData} 
              title="Asset Allocation Breakdown"
            />
          </div>
        )}

        {/* Performance vs Benchmarks Chart */}
        {sections.includes('risk') && (
          <div className="mb-8">
            <PerformanceChart 
              data={performanceData} 
              title="Portfolio Performance vs Benchmarks"
            />
          </div>
        )}

        {/* Sector Analysis Chart */}
        {sections.includes('sector') && (
          <div className="mb-8">
            <SectorChart 
              data={sectorData} 
              title="Sector Allocation Analysis"
            />
          </div>
        )}

        {/* Income Analysis Chart */}
        {sections.includes('income') && (
          <div className="mb-8">
            <IncomeChart 
              data={[
                { source: 'Dividends', monthly: 850, annual: 10200, yield: 2.1 },
                { source: 'Interest', monthly: 320, annual: 3840, yield: 1.8 },
                { source: 'REITs', monthly: 180, annual: 2160, yield: 4.3 },
                { source: 'Other', monthly: 95, annual: 1140, yield: 1.2 }
              ]} 
              title="Income Generation Analysis"
            />
          </div>
        )}

        {/* Enhanced Risk/Return Section with Chart */}

        {/* Risk/Return Section */}
        {sections.includes('risk') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Risk & Return Analysis</h2>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm">
                Your portfolio's beta is {currentMetrics.beta.toFixed(2)}, indicating it's{' '}
                {currentMetrics.beta > 1 ? 'more' : 'less'} volatile than the market. 
                With a risk score of {currentMetrics.riskScore}/100 and {formatPercentage(currentMetrics.volatility)} annualized volatility,
                this portfolio demonstrates {currentMetrics.beta < 0.8 ? 'conservative' : currentMetrics.beta > 1.2 ? 'aggressive' : 'moderate'} risk characteristics.
              </p>
            </div>
          </div>
        )}

        {/* Fee Expense Comparison */}
        {sections.includes('fees') && (
          <div className="mb-8">
            <FeeExpenseComparison 
              data={{
                portfolioValue: portfolio.totalValue,
                valueBasedFee: 15000, // $15k fixed annual fee
                aumBasedFee: 1.25, // 1.25% AUM fee
                timeHorizonYears: 10
              }}
              previewMode={true}
            />
          </div>
        )}

        {/* Competitor Comparison */}
        {sections.includes('comparison') && (
          <CompetitorComparison 
            currentPortfolio={{
              name: portfolio.name,
              metrics: {
                annualReturn: 12.5,
                volatility: currentMetrics.volatility,
                sharpeRatio: 0.72,
                maxDrawdown: -18.2,
                expenseRatio: 0.15,
                yield: currentMetrics.yield,
                beta: currentMetrics.beta,
                aum: portfolio.totalValue
              }
            }}
            previewMode={true}
          />
        )}

        {/* Advisor Notes */}
        {sections.includes('notes') && advisorNotes && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Advisor Notes & Recommendations</h2>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm whitespace-pre-wrap">{advisorNotes}</p>
            </div>
          </div>
        )}

        {/* Compliance Footer */}
        <div className="mt-12 text-center text-xs text-gray-600 border-t pt-4">
          <p className="mb-2">
            This report is for informational purposes only. Data sources: Finnhub API. 
            Past performance is not indicative of future results.
          </p>
          <p>© {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
        </div>
      </div>
    );
  }

  // Return PDF Document for actual PDF generation
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover Page */}
        <View style={styles.cover}>
          <Text style={styles.heading}>Portfolio Review & Analysis</Text>
          <Text style={styles.subheading}>Prepared for {clientName}</Text>
          <Text style={styles.subheading}>{reportDate}</Text>
        </View>

        {/* Executive Summary */}
        {sections.includes('summary') && (
          <View style={styles.section}>
            <Text style={styles.heading}>Executive Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Portfolio Value</Text>
                <Text style={styles.summaryValue}>{formatCurrency(portfolio.totalValue)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Portfolio Beta</Text>
                <Text style={styles.summaryValue}>{currentMetrics.beta.toFixed(2)} (vs. S&P 500)</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Income Yield</Text>
                <Text style={styles.summaryValue}>{formatPercentage(currentMetrics.yield)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Risk Score</Text>
                <Text style={styles.summaryValue}>{currentMetrics.riskScore}/100</Text>
              </View>
            </View>
          </View>
        )}

        {/* Portfolio Holdings */}
        {sections.includes('holdings') && (
          <View style={styles.section}>
            <Text style={styles.heading}>Portfolio Holdings</Text>
            <HoldingsTable holdings={portfolio.holdings} marketData={marketData} />
          </View>
        )}

        {/* Risk/Return Section */}
        {sections.includes('risk') && (
          <View style={styles.section}>
            <Text style={styles.heading}>Risk & Return Analysis</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
              Your portfolio's beta is {currentMetrics.beta.toFixed(2)}, indicating it's{' '}
              {currentMetrics.beta > 1 ? 'more' : 'less'} volatile than the market. 
              With a risk score of {currentMetrics.riskScore}/100 and {formatPercentage(currentMetrics.volatility)} annualized volatility,
              this portfolio demonstrates {currentMetrics.beta < 0.8 ? 'conservative' : currentMetrics.beta > 1.2 ? 'aggressive' : 'moderate'} risk characteristics.
            </Text>
          </View>
        )}

        {/* Fee Expense Comparison - PDF Version */}
        {sections.includes('fees') && (
          <View style={styles.section}>
            <Text style={styles.heading}>Fee Structure Comparison</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Value-Based Annual Fee</Text>
                <Text style={styles.summaryValue}>{formatCurrency(15000)}</Text>
                <Text style={{ fontSize: 8, color: '#666' }}>Fixed annual fee</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Traditional AUM Fee</Text>
                <Text style={styles.summaryValue}>{formatCurrency(portfolio.totalValue * 0.0125)}</Text>
                <Text style={{ fontSize: 8, color: '#666' }}>1.25% of portfolio</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Annual Savings</Text>
                <Text style={[styles.summaryValue, { color: '#059669' }]}>
                  {formatCurrency((portfolio.totalValue * 0.0125) - 15000)}
                </Text>
                <Text style={{ fontSize: 8, color: '#059669' }}>With value-based model</Text>
              </View>
            </View>
            
            <Text style={{ fontSize: 10, marginTop: 12, lineHeight: 1.4 }}>
              Our value-based pricing model provides transparent, fixed annual fees rather than percentage-based charges that increase with your portfolio growth. 
              Over 10 years, this approach can save substantial amounts while ensuring your wealth growth benefits you directly.
            </Text>
          </View>
        )}

        {/* Competitor Comparison - PDF Version */}
        {sections.includes('comparison') && (
          <View style={styles.section}>
            <Text style={styles.heading}>Competitor Comparison Analysis</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellHeaderWide, { width: "25%" }]}>Portfolio/ETF</Text>
                <Text style={styles.tableCellHeader}>Annual Return</Text>
                <Text style={styles.tableCellHeader}>Volatility</Text>
                <Text style={styles.tableCellHeader}>Sharpe Ratio</Text>
                <Text style={styles.tableCellHeader}>Max Drawdown</Text>
                <Text style={styles.tableCellHeader}>Expense Ratio</Text>
                <Text style={styles.tableCellHeader}>Yield</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellWide, { width: "25%", fontWeight: 'bold' }]}>
                  {portfolio.name} (Current) 🏆
                </Text>
                <Text style={[styles.tableCell, { color: '#D4AF37', fontWeight: 'bold' }]}>12.5%</Text>
                <Text style={styles.tableCell}>{formatPercentage(currentMetrics.volatility)}</Text>
                <Text style={[styles.tableCell, { color: '#D4AF37', fontWeight: 'bold' }]}>0.72</Text>
                <Text style={styles.tableCell}>-18.2%</Text>
                <Text style={styles.tableCell}>0.15%</Text>
                <Text style={styles.tableCell}>{formatPercentage(currentMetrics.yield)}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellWide, { width: "25%" }]}>SPDR S&P 500 ETF (SPY)</Text>
                <Text style={styles.tableCell}>10.2%</Text>
                <Text style={[styles.tableCell, { color: '#059669', fontWeight: 'bold' }]}>15.8% 🏆</Text>
                <Text style={styles.tableCell}>0.64</Text>
                <Text style={[styles.tableCell, { color: '#059669', fontWeight: 'bold' }]}>-23.9% 🏆</Text>
                <Text style={[styles.tableCell, { color: '#059669', fontWeight: 'bold' }]}>0.09% 🏆</Text>
                <Text style={styles.tableCell}>1.6%</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellWide, { width: "25%" }]}>Vanguard Total Stock (VTI)</Text>
                <Text style={styles.tableCell}>10.8%</Text>
                <Text style={styles.tableCell}>16.2%</Text>
                <Text style={styles.tableCell}>0.67</Text>
                <Text style={styles.tableCell}>-24.5%</Text>
                <Text style={styles.tableCell}>0.03%</Text>
                <Text style={styles.tableCell}>1.4%</Text>
              </View>
            </View>
            <Text style={{ fontSize: 9, marginTop: 8, color: '#666' }}>
              🏆 = Best in category. Green = Above average performance.
            </Text>
          </View>
        )}

        {/* Advisor Notes */}
        {sections.includes('notes') && advisorNotes && (
          <View style={styles.section}>
            <Text style={styles.heading}>Advisor Notes & Recommendations</Text>
            <View style={styles.notes}>
              <Text style={styles.notesTitle}>Recommendations</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{advisorNotes}</Text>
            </View>
          </View>
        )}

        {/* Compliance Footer */}
        <Text style={styles.small}>
          This report is for informational purposes only. Data sources: Finnhub API. 
          Past performance is not indicative of future results. © {new Date().getFullYear()} Boutique Family Office. All rights reserved.
        </Text>
      </Page>
    </Document>
  );
}