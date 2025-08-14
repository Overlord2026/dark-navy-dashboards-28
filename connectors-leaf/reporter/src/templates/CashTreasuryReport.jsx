import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { format, parseISO } from 'date-fns'
import numeral from 'numeral'

const styles = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 10, padding: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  table: { border: '1px solid #e5e7eb' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9fafb', padding: 12 },
  tableRow: { flexDirection: 'row', padding: 12 },
  tableCell: { flex: 1, fontSize: 9 },
  tableCellRight: { flex: 1, fontSize: 9, textAlign: 'right' }
})

export const CashTreasuryReport = ({ data, persona_scope, period }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Cash & Treasury Report</Text>
        <Text>Period: {format(parseISO(period.start), 'MMM dd, yyyy')} - {format(parseISO(period.end), 'MMM dd, yyyy')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cash Summary</Text>
        <Text>Total Cash: {numeral(data.total_cash).format('$0,0.00')} ({numeral(data.cash_percentage / 100).format('0.0%')} of portfolio)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cash by Account</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Account</Text>
            <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>Cash Balance</Text>
            <Text style={[styles.tableCellRight, { fontWeight: 'bold' }]}>% of Account</Text>
          </View>
          {data.cash_by_account?.map((account, index) => (
            <View key={account.account_id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{account.custodian} - {account.account_number_masked}</Text>
              <Text style={styles.tableCellRight}>{numeral(account.cash_balance).format('$0,0.00')}</Text>
              <Text style={styles.tableCellRight}>{numeral(account.cash_percentage / 100).format('0.0%')}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
)