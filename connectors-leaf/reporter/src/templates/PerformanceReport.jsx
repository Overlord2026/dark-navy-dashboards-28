import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import numeral from 'numeral'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280'
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  performanceCard: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  performanceLabel: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center'
  },
  table: {
    border: '1px solid #e5e7eb',
    borderRadius: 8
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 12
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  tableCell: {
    flex: 1,
    fontSize: 9
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right'
  },
  positive: {
    color: '#059669'
  },
  negative: {
    color: '#dc2626'
  },
  benchmark: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20
  }
})

export const PerformanceReport = ({ data, persona_scope, period }) => {
  const formatCurrency = (value) => numeral(value).format('$0,0.00')
  const formatPercent = (value, colored = false) => {
    const formatted = numeral(value / 100).format('0.00%')
    return { text: formatted, positive: value > 0, negative: value < 0 }
  }
  const formatDate = (date) => format(parseISO(date), 'MMM dd, yyyy')

  // CPA gets detailed tax implications, others get summary
  const showTaxDetails = persona_scope === 'cpa' || persona_scope === 'admin'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Performance Report</Text>
            <Text style={styles.subtitle}>{data.portfolio_name}</Text>
            <Text style={styles.subtitle}>
              Period: {formatDate(period.start)} - {formatDate(period.end)}
            </Text>
          </View>
          <View>
            <Text style={styles.subtitle}>Generated: {format(new Date(), 'MMM dd, yyyy')}</Text>
            <Text style={styles.subtitle}>View: {persona_scope.toUpperCase()}</Text>
          </View>
        </View>

        {/* Performance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <Text style={[styles.performanceValue, data.period_return > 0 ? styles.positive : styles.negative]}>
                {formatPercent(data.period_return).text}
              </Text>
              <Text style={styles.performanceLabel}>Period Return</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={[styles.performanceValue, data.ytd_return > 0 ? styles.positive : styles.negative]}>
                {formatPercent(data.ytd_return).text}
              </Text>
              <Text style={styles.performanceLabel}>YTD Return</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={[styles.performanceValue, data.annualized_return > 0 ? styles.positive : styles.negative]}>
                {formatPercent(data.annualized_return).text}
              </Text>
              <Text style={styles.performanceLabel}>Annualized Return</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>
                {numeral(data.sharpe_ratio).format('0.00')}
              </Text>
              <Text style={styles.performanceLabel}>Sharpe Ratio</Text>
            </View>
          </View>
        </View>

        {/* Benchmark Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benchmark Comparison</Text>
          <View style={styles.benchmark}>
            <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>
              vs. {data.benchmark.name}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flex: 1}}>
                <Text style={styles.performanceLabel}>Portfolio</Text>
                <Text style={[{fontSize: 14, fontWeight: 'bold'}, data.period_return > 0 ? styles.positive : styles.negative]}>
                  {formatPercent(data.period_return).text}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.performanceLabel}>Benchmark</Text>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  {formatPercent(data.benchmark.period_return).text}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.performanceLabel}>Excess Return</Text>
                <Text style={[{fontSize: 14, fontWeight: 'bold'}, data.excess_return > 0 ? styles.positive : styles.negative]}>
                  {formatPercent(data.excess_return).text}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance by Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance by Account</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>Account</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Beginning Value</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Ending Value</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Return</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Contributions</Text>
            </View>
            {data.account_performance.map((account, index) => (
              <View key={account.account_id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {account.custodian} - {account.account_number_masked}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(account.beginning_value)}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(account.ending_value)}
                </Text>
                <Text style={[styles.tableCellRight, account.return > 0 ? styles.positive : styles.negative]}>
                  {formatPercent(account.return).text}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(account.net_contributions)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Asset Class Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asset Class Performance</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>Asset Class</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Period Return</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Contribution to Return</Text>
              <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Weight</Text>
            </View>
            {data.asset_class_performance.map((assetClass, index) => (
              <View key={assetClass.name} style={styles.tableRow}>
                <Text style={styles.tableCell}>{assetClass.name}</Text>
                <Text style={[styles.tableCellRight, assetClass.return > 0 ? styles.positive : styles.negative]}>
                  {formatPercent(assetClass.return).text}
                </Text>
                <Text style={[styles.tableCellRight, assetClass.contribution > 0 ? styles.positive : styles.negative]}>
                  {formatPercent(assetClass.contribution).text}
                </Text>
                <Text style={styles.tableCellRight}>
                  {formatPercent(assetClass.weight).text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tax Implications (CPA View) */}
        {showTaxDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tax Implications</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>Category</Text>
                <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Realized Gains</Text>
                <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Unrealized Gains</Text>
                <Text style={[styles.tableCellRight, {fontWeight: 'bold'}]}>Tax Efficiency</Text>
              </View>
              {data.tax_implications.map((tax, index) => (
                <View key={tax.category} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{tax.category}</Text>
                  <Text style={[styles.tableCellRight, tax.realized_gains > 0 ? styles.positive : styles.negative]}>
                    {formatCurrency(tax.realized_gains)}
                  </Text>
                  <Text style={[styles.tableCellRight, tax.unrealized_gains > 0 ? styles.positive : styles.negative]}>
                    {formatCurrency(tax.unrealized_gains)}
                  </Text>
                  <Text style={styles.tableCellRight}>
                    {formatPercent(tax.tax_efficiency).text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Risk Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Metrics</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>
                {formatPercent(data.risk_metrics.volatility).text}
              </Text>
              <Text style={styles.performanceLabel}>Volatility (Annualized)</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>
                {formatPercent(data.risk_metrics.max_drawdown).text}
              </Text>
              <Text style={styles.performanceLabel}>Max Drawdown</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>
                {numeral(data.risk_metrics.beta).format('0.00')}
              </Text>
              <Text style={styles.performanceLabel}>Beta</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={{
          position: 'absolute',
          bottom: 30,
          left: 40,
          right: 40,
          textAlign: 'center',
          fontSize: 8,
          color: '#9ca3af'
        }}>
          Performance data calculated using time-weighted returns. Past performance does not guarantee future results.
          Data as of {formatDate(period.end)} • Generated by Connector & Evidence Platform
        </Text>
      </Page>
    </Document>
  )
}