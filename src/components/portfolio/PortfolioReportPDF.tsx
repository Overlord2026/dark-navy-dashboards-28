import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

// Register fonts (optional - can use default fonts)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    borderBottom: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  column: {
    flex: 1,
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottom: 1,
    borderBottomColor: '#dddddd',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: 0.5,
    borderBottomColor: '#eeeeee',
  },
  headerCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  cell: {
    flex: 1,
    fontSize: 9,
    color: '#333333',
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  summaryItem: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  notes: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 4,
    marginTop: 10,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e40af',
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#374151',
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fef3cd',
    borderRadius: 4,
  },
  disclaimerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#92400e',
  },
  disclaimerText: {
    fontSize: 9,
    lineHeight: 1.3,
    color: '#92400e',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
});

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
}

export default function PortfolioReportPDF({
  portfolio,
  proposal,
  sections,
  advisorNotes,
  previewMode = false,
  currentMetrics,
  proposedMetrics,
  marketData,
  clientName
}: PortfolioReportPDFProps) {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (previewMode) {
    // Return HTML preview for live preview
    return (
      <div className="bg-white p-8 text-black font-sans">
        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <h1 className="text-2xl font-bold">{clientName}</h1>
          <p className="text-gray-600">{reportDate}</p>
          <h2 className="text-xl font-semibold mt-2">Portfolio Analysis & Review</h2>
        </div>

        {sections.includes('summary') && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">Executive Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Total Value</p>
                <p className="text-lg font-bold">{formatCurrency(portfolio.totalValue)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Portfolio Beta</p>
                <p className="text-lg font-bold">{currentMetrics.beta.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Portfolio Yield</p>
                <p className="text-lg font-bold">{formatPercentage(currentMetrics.yield)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600">Risk Score</p>
                <p className="text-lg font-bold">{currentMetrics.riskScore}</p>
              </div>
            </div>
          </div>
        )}

        {sections.includes('holdings') && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">Holdings Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Symbol</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-right p-2">Allocation</th>
                    <th className="text-right p-2">Value</th>
                    <th className="text-right p-2">Beta</th>
                    <th className="text-right p-2">Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding, index) => {
                    const data = marketData[holding.symbol] || {};
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{holding.symbol}</td>
                        <td className="p-2">{holding.name}</td>
                        <td className="p-2 text-right">{formatPercentage(holding.allocation)}</td>
                        <td className="p-2 text-right">{formatCurrency(holding.value)}</td>
                        <td className="p-2 text-right">{data.beta ? data.beta.toFixed(2) : 'N/A'}</td>
                        <td className="p-2 text-right">{data.yield ? formatPercentage(data.yield) : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sections.includes('risk') && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">Risk & Return Analysis</h3>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm">
                Portfolio beta of {currentMetrics.beta.toFixed(2)} indicates{' '}
                {currentMetrics.beta > 1.0 ? 'higher' : currentMetrics.beta < 1.0 ? 'lower' : 'similar'} systematic risk 
                compared to the S&P 500, with {formatPercentage(currentMetrics.volatility)} annualized volatility.
                Risk score of {currentMetrics.riskScore} on a 0-100 scale.
              </p>
            </div>
          </div>
        )}

        {sections.includes('notes') && advisorNotes && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 border-b border-gray-300 pb-2">Advisor Notes</h3>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm whitespace-pre-wrap">{advisorNotes}</p>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded border border-yellow-200">
          <h4 className="font-bold text-yellow-800 mb-2">Important Disclosure</h4>
          <p className="text-xs text-yellow-700">
            This report is generated for informational purposes only and does not constitute investment advice. 
            Past performance does not guarantee future results. All data sources are clearly attributed. 
            Market data provided by Finnhub API. Benchmark comparisons use SPY (S&P 500) and AGG (US Aggregate Bonds) as applicable.
          </p>
        </div>
      </div>
    );
  }

  // Return PDF Document for actual PDF generation
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{clientName}</Text>
          <Text style={styles.subtitle}>{reportDate}</Text>
          <Text style={styles.subtitle}>Portfolio Analysis & Review</Text>
        </View>

        {/* Executive Summary */}
        {sections.includes('summary') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Value</Text>
                <Text style={styles.summaryValue}>{formatCurrency(portfolio.totalValue)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Portfolio Beta</Text>
                <Text style={styles.summaryValue}>{currentMetrics.beta.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Portfolio Yield</Text>
                <Text style={styles.summaryValue}>{formatPercentage(currentMetrics.yield)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Risk Score</Text>
                <Text style={styles.summaryValue}>{currentMetrics.riskScore}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Holdings Table */}
        {sections.includes('holdings') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Holdings Analysis</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 1.2 }]}>Symbol</Text>
              <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
              <Text style={styles.headerCell}>Allocation</Text>
              <Text style={styles.headerCell}>Value</Text>
              <Text style={styles.headerCell}>Beta</Text>
              <Text style={styles.headerCell}>Yield</Text>
            </View>
            {portfolio.holdings.map((holding, index) => {
              const data = marketData[holding.symbol] || {};
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell, { flex: 1.2 }]}>{holding.symbol}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{holding.name}</Text>
                  <Text style={styles.cell}>{formatPercentage(holding.allocation)}</Text>
                  <Text style={styles.cell}>{formatCurrency(holding.value)}</Text>
                  <Text style={styles.cell}>{data.beta ? data.beta.toFixed(2) : 'N/A'}</Text>
                  <Text style={styles.cell}>{data.yield ? formatPercentage(data.yield) : 'N/A'}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Risk Analysis */}
        {sections.includes('risk') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk & Return Analysis</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
              Portfolio beta of {currentMetrics.beta.toFixed(2)} indicates{' '}
              {currentMetrics.beta > 1.0 ? 'higher' : currentMetrics.beta < 1.0 ? 'lower' : 'similar'} systematic risk 
              compared to the S&P 500, with {formatPercentage(currentMetrics.volatility)} annualized volatility.
              Risk score of {currentMetrics.riskScore} on a 0-100 scale.
            </Text>
          </View>
        )}

        {/* Advisor Notes */}
        {sections.includes('notes') && advisorNotes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Advisor Notes</Text>
            <Text style={styles.notesText}>{advisorNotes}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Important Disclosure</Text>
          <Text style={styles.disclaimerText}>
            This report is generated for informational purposes only and does not constitute investment advice. 
            Past performance does not guarantee future results. All data sources are clearly attributed. 
            Market data provided by Finnhub API. Benchmark comparisons use SPY (S&P 500) and AGG (US Aggregate Bonds) as applicable.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {reportDate} | Confidential & Proprietary
        </Text>
      </Page>
    </Document>
  );
}