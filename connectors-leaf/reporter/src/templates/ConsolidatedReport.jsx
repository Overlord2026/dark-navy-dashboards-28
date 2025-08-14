import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import numeral from 'numeral'

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZs.ttf' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhjp8.ttf', fontWeight: 'bold' }
  ]
})

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
  headerLeft: {
    flex: 1
  },
  headerRight: {
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  table: {
    border: '1px solid #e5e7eb',
    borderRadius: 8
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  tableRowLast: {
    flexDirection: 'row',
    padding: 12
  },
  tableCell: {
    flex: 1,
    fontSize: 9
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151'
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right'
  },
  tableCellCenter: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center'
  },
  summary: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center'
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af'
  },
  redacted: {
    backgroundColor: '#fef3c7',
    padding: 2,
    borderRadius: 2,
    color: '#92400e'
  },
  confidential: {
    backgroundColor: '#fee2e2',
    padding: 2,
    borderRadius: 2,
    color: '#991b1b'
  }
})

export const ConsolidatedReport = ({ data, persona_scope, period }) => {
  const formatCurrency = (value) => numeral(value).format('$0,0.00')
  const formatPercent = (value) => numeral(value / 100).format('0.00%')
  const formatDate = (date) => format(parseISO(date), 'MMM dd, yyyy')

  // Persona-specific redactions
  const shouldRedactDetail = (field) => {
    const redactionRules = {
      client: ['cost_basis', 'realized_gains', 'tax_lots'],
      advisor: [],
      cpa: [],
      attorney: ['cost_basis'],
      admin: []
    }
    return redactionRules[persona_scope]?.includes(field) || false
  }

  const redactValue = (value, field) => {
    if (shouldRedactDetail(field)) {
      return '[REDACTED]'
    }
    return value
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Portfolio Consolidated Report</Text>
            <Text style={styles.subtitle}>{data.portfolio_name}</Text>
            <Text style={styles.subtitle}>
              Period: {formatDate(period.start)} - {formatDate(period.end)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.subtitle}>Generated: {format(new Date(), 'MMM dd, yyyy')}</Text>
            <Text style={styles.subtitle}>Persona: {persona_scope.toUpperCase()}</Text>
            {persona_scope === 'client' && (
              <Text style={[styles.subtitle, styles.confidential]}>CONFIDENTIAL</Text>
            )}
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Summary</Text>
          <View style={styles.summary}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{formatCurrency(data.total_value)}</Text>
                <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{formatPercent(data.total_return)}</Text>
                <Text style={styles.summaryLabel}>Total Return</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{data.accounts_count}</Text>
                <Text style={styles.summaryLabel}>Active Accounts</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Asset Allocation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asset Allocation</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Asset Class</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Market Value</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Allocation %</Text>
              {!shouldRedactDetail('cost_basis') && (
                <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Cost Basis</Text>
              )}
            </View>
            {data.asset_allocation.map((allocation, index) => (
              <View 
                key={allocation.asset_class} 
                style={index === data.asset_allocation.length - 1 ? styles.tableRowLast : styles.tableRow}
              >
                <Text style={styles.tableCell}>{allocation.asset_class}</Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatCurrency(allocation.market_value)}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatPercent(allocation.percentage)}
                </Text>
                {!shouldRedactDetail('cost_basis') && (
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    {redactValue(formatCurrency(allocation.cost_basis), 'cost_basis')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Top Holdings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Holdings</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Security</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellCenter]}>Quantity</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Market Value</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>% of Portfolio</Text>
            </View>
            {data.top_holdings.slice(0, 10).map((holding, index) => (
              <View 
                key={holding.symbol} 
                style={index === Math.min(9, data.top_holdings.length - 1) ? styles.tableRowLast : styles.tableRow}
              >
                <Text style={styles.tableCell}>
                  {holding.symbol} - {holding.name}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellCenter]}>
                  {numeral(holding.quantity).format('0,0.00')}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatCurrency(holding.market_value)}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatPercent(holding.portfolio_percentage)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCellHeader}>Account</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellCenter]}>Type</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Market Value</Text>
              <Text style={[styles.tableCellHeader, styles.tableCellRight]}>Cash Balance</Text>
            </View>
            {data.accounts.map((account, index) => (
              <View 
                key={account.account_id} 
                style={index === data.accounts.length - 1 ? styles.tableRowLast : styles.tableRow}
              >
                <Text style={styles.tableCell}>
                  {account.custodian} - {account.account_number_masked}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellCenter]}>
                  {account.account_type}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatCurrency(account.market_value)}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellRight]}>
                  {formatCurrency(account.cash_balance)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This report is confidential and prepared solely for the named recipient. 
          Data as of {formatDate(period.end)} • Generated by Connector & Evidence Platform
        </Text>
      </Page>
    </Document>
  )
}