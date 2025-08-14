import { z } from 'zod'

// Zod schemas for validation
export const CustodyAccountSchema = z.object({
  account_id: z.string(),
  account_number: z.string(),
  account_type: z.string(),
  custodian: z.string(),
  base_currency: z.string().length(3),
  status: z.enum(['active', 'inactive', 'closed']),
  metadata: z.record(z.any()).optional()
})

export const CustodyPositionSchema = z.object({
  account_id: z.string(),
  symbol: z.string(),
  name: z.string(),
  quantity: z.number(),
  cost_basis: z.number().optional(),
  market_value: z.number(),
  as_of: z.string().datetime(),
  identifiers: z.record(z.string()).optional()
})

export const CustodyTransactionSchema = z.object({
  account_id: z.string(),
  symbol: z.string().optional(),
  type: z.string(),
  quantity: z.number().optional(),
  amount: z.number(),
  trade_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  settle_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  description: z.string().optional(),
  identifiers: z.record(z.string()).optional()
})

export type CustodyAccount = z.infer<typeof CustodyAccountSchema>
export type CustodyPosition = z.infer<typeof CustodyPositionSchema>
export type CustodyTransaction = z.infer<typeof CustodyTransactionSchema>

// Symbol normalization utilities
export class SymbolNormalizer {
  // Clean up symbol to standard format
  static normalizeSymbol(symbol: string): string {
    return symbol
      .replace(/[^A-Z0-9.-]/g, '') // Remove non-alphanumeric except . and -
      .toUpperCase()
      .trim()
  }

  // Extract CUSIP from various formats
  static extractCUSIP(identifiers: Record<string, string> = {}): string | null {
    const cusipKeys = ['cusip', 'CUSIP', 'cusip_id', 'cusip_number']
    for (const key of cusipKeys) {
      const value = identifiers[key]
      if (value && this.isValidCUSIP(value)) {
        return value.toUpperCase()
      }
    }
    return null
  }

  // Extract ISIN from various formats
  static extractISIN(identifiers: Record<string, string> = {}): string | null {
    const isinKeys = ['isin', 'ISIN', 'isin_id', 'isin_number']
    for (const key of isinKeys) {
      const value = identifiers[key]
      if (value && this.isValidISIN(value)) {
        return value.toUpperCase()
      }
    }
    return null
  }

  // Validate CUSIP format (9 characters, alphanumeric)
  static isValidCUSIP(cusip: string): boolean {
    return /^[A-Z0-9]{9}$/.test(cusip.toUpperCase())
  }

  // Validate ISIN format (12 characters, starts with 2 letters)
  static isValidISIN(isin: string): boolean {
    return /^[A-Z]{2}[A-Z0-9]{10}$/.test(isin.toUpperCase())
  }

  // Create standardized identifiers object
  static createIdentifiers(symbol: string, identifiers: Record<string, string> = {}): Record<string, string> {
    const normalized: Record<string, string> = {
      symbol: this.normalizeSymbol(symbol)
    }

    const cusip = this.extractCUSIP(identifiers)
    if (cusip) normalized.cusip = cusip

    const isin = this.extractISIN(identifiers)
    if (isin) normalized.isin = isin

    // Pass through other identifiers
    for (const [key, value] of Object.entries(identifiers)) {
      const lowerKey = key.toLowerCase()
      if (!['cusip', 'isin', 'symbol'].includes(lowerKey) && value) {
        normalized[lowerKey] = String(value)
      }
    }

    return normalized
  }
}

// Vendor-specific mappers
export class BridgeFTMapper {
  static mapAccount(rawAccount: any): CustodyAccount {
    return {
      account_id: rawAccount.id || rawAccount.account_id,
      account_number: rawAccount.accountNumber || rawAccount.account_number,
      account_type: this.mapAccountType(rawAccount.accountType || rawAccount.type),
      custodian: rawAccount.custodian || rawAccount.institution || 'BridgeFT',
      base_currency: rawAccount.baseCurrency || rawAccount.currency || 'USD',
      status: this.mapAccountStatus(rawAccount.status),
      metadata: {
        vendor: 'bridgeft',
        raw_type: rawAccount.accountType || rawAccount.type,
        last_sync: new Date().toISOString()
      }
    }
  }

  static mapPosition(rawPosition: any, account_id: string): CustodyPosition {
    const symbol = SymbolNormalizer.normalizeSymbol(rawPosition.symbol || rawPosition.ticker)
    
    return {
      account_id,
      symbol,
      name: rawPosition.name || rawPosition.description || symbol,
      quantity: parseFloat(rawPosition.quantity || rawPosition.shares || '0'),
      cost_basis: rawPosition.costBasis ? parseFloat(rawPosition.costBasis) : undefined,
      market_value: parseFloat(rawPosition.marketValue || rawPosition.value || '0'),
      as_of: rawPosition.asOf || rawPosition.as_of || new Date().toISOString(),
      identifiers: SymbolNormalizer.createIdentifiers(symbol, rawPosition.identifiers || {})
    }
  }

  static mapTransaction(rawTransaction: any, account_id: string): CustodyTransaction {
    const symbol = rawTransaction.symbol || rawTransaction.ticker
    
    return {
      account_id,
      symbol: symbol ? SymbolNormalizer.normalizeSymbol(symbol) : undefined,
      type: this.mapTransactionType(rawTransaction.type || rawTransaction.transactionType),
      quantity: rawTransaction.quantity ? parseFloat(rawTransaction.quantity) : undefined,
      amount: parseFloat(rawTransaction.amount || rawTransaction.netAmount || '0'),
      trade_date: this.formatDate(rawTransaction.tradeDate || rawTransaction.date),
      settle_date: rawTransaction.settleDate ? this.formatDate(rawTransaction.settleDate) : undefined,
      description: rawTransaction.description || rawTransaction.memo,
      identifiers: symbol ? SymbolNormalizer.createIdentifiers(symbol, rawTransaction.identifiers || {}) : undefined
    }
  }

  private static mapAccountType(type: string): string {
    const typeMap: Record<string, string> = {
      'checking': 'cash',
      'savings': 'cash',
      'brokerage': 'investment',
      'ira': 'retirement',
      'roth_ira': 'retirement',
      '401k': 'retirement',
      'trust': 'trust'
    }
    return typeMap[type?.toLowerCase()] || 'other'
  }

  private static mapAccountStatus(status: string): 'active' | 'inactive' | 'closed' {
    const statusMap: Record<string, 'active' | 'inactive' | 'closed'> = {
      'open': 'active',
      'active': 'active',
      'inactive': 'inactive',
      'closed': 'closed',
      'suspended': 'inactive'
    }
    return statusMap[status?.toLowerCase()] || 'active'
  }

  private static mapTransactionType(type: string): string {
    const typeMap: Record<string, string> = {
      'buy': 'purchase',
      'sell': 'sale',
      'deposit': 'cash_deposit',
      'withdrawal': 'cash_withdrawal',
      'dividend': 'dividend',
      'interest': 'interest',
      'fee': 'fee',
      'transfer_in': 'transfer_in',
      'transfer_out': 'transfer_out'
    }
    return typeMap[type?.toLowerCase()] || type?.toLowerCase() || 'other'
  }

  private static formatDate(date: string | Date): string {
    if (!date) return new Date().toISOString().split('T')[0]
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }
}

export class PlaidMapper {
  static mapAccount(rawAccount: any): CustodyAccount {
    return {
      account_id: rawAccount.account_id,
      account_number: rawAccount.account_id, // Plaid doesn't expose real account numbers
      account_type: this.mapAccountType(rawAccount.type, rawAccount.subtype),
      custodian: rawAccount.institution_name || 'Unknown',
      base_currency: rawAccount.currency_code || 'USD',
      status: 'active', // Plaid accounts are typically active if accessible
      metadata: {
        vendor: 'plaid',
        subtype: rawAccount.subtype,
        institution_id: rawAccount.institution_id,
        last_sync: new Date().toISOString()
      }
    }
  }

  static mapPosition(rawHolding: any, account_id: string): CustodyPosition {
    const symbol = SymbolNormalizer.normalizeSymbol(rawHolding.security?.ticker_symbol || 'UNKNOWN')
    
    return {
      account_id,
      symbol,
      name: rawHolding.security?.name || symbol,
      quantity: parseFloat(rawHolding.quantity || '0'),
      cost_basis: rawHolding.cost_basis ? parseFloat(rawHolding.cost_basis) : undefined,
      market_value: parseFloat(rawHolding.institution_value || rawHolding.value || '0'),
      as_of: new Date().toISOString(),
      identifiers: SymbolNormalizer.createIdentifiers(symbol, {
        cusip: rawHolding.security?.cusip,
        isin: rawHolding.security?.isin,
        sedol: rawHolding.security?.sedol
      })
    }
  }

  static mapTransaction(rawTransaction: any, account_id: string): CustodyTransaction {
    const symbol = rawTransaction.security?.ticker_symbol
    
    return {
      account_id,
      symbol: symbol ? SymbolNormalizer.normalizeSymbol(symbol) : undefined,
      type: this.mapTransactionType(rawTransaction.type, rawTransaction.subtype),
      quantity: rawTransaction.quantity ? parseFloat(rawTransaction.quantity) : undefined,
      amount: parseFloat(rawTransaction.amount || '0'),
      trade_date: rawTransaction.date,
      settle_date: rawTransaction.settlement_date,
      description: rawTransaction.name || rawTransaction.merchant_name,
      identifiers: symbol ? SymbolNormalizer.createIdentifiers(symbol, {
        cusip: rawTransaction.security?.cusip,
        isin: rawTransaction.security?.isin
      }) : undefined
    }
  }

  private static mapAccountType(type: string, subtype: string): string {
    if (type === 'investment') {
      const subtypeMap: Record<string, string> = {
        'brokerage': 'investment',
        'ira': 'retirement',
        'roth': 'retirement',
        '401k': 'retirement',
        '403b': 'retirement',
        'pension': 'retirement'
      }
      return subtypeMap[subtype?.toLowerCase()] || 'investment'
    }
    return type?.toLowerCase() || 'other'
  }

  private static mapTransactionType(type: string, subtype: string): string {
    const typeMap: Record<string, string> = {
      'buy': 'purchase',
      'sell': 'sale',
      'deposit': 'cash_deposit',
      'withdrawal': 'cash_withdrawal',
      'transfer': subtype === 'deposit' ? 'transfer_in' : 'transfer_out',
      'dividend': 'dividend',
      'fee': 'fee'
    }
    return typeMap[type?.toLowerCase()] || type?.toLowerCase() || 'other'
  }
}

// Generic mapper factory
export class CustodyMapperFactory {
  static getMapper(vendor: string) {
    switch (vendor.toLowerCase()) {
      case 'bridgeft':
        return BridgeFTMapper
      case 'plaid':
        return PlaidMapper
      default:
        throw new Error(`No mapper available for vendor: ${vendor}`)
    }
  }

  static mapAccount(vendor: string, rawAccount: any): CustodyAccount {
    const mapper = this.getMapper(vendor)
    const mapped = mapper.mapAccount(rawAccount)
    return CustodyAccountSchema.parse(mapped)
  }

  static mapPosition(vendor: string, rawPosition: any, account_id: string): CustodyPosition {
    const mapper = this.getMapper(vendor)
    const mapped = mapper.mapPosition(rawPosition, account_id)
    return CustodyPositionSchema.parse(mapped)
  }

  static mapTransaction(vendor: string, rawTransaction: any, account_id: string): CustodyTransaction {
    const mapper = this.getMapper(vendor)
    const mapped = mapper.mapTransaction(rawTransaction, account_id)
    return CustodyTransactionSchema.parse(mapped)
  }
}

// Utility functions for data validation and cleanup
export class DataValidationUtils {
  static validateAndCleanAmount(amount: any): number {
    const parsed = parseFloat(String(amount).replace(/[,$]/g, ''))
    if (isNaN(parsed)) {
      throw new Error(`Invalid amount: ${amount}`)
    }
    return Math.round(parsed * 100) / 100 // Round to 2 decimal places
  }

  static validateAndCleanQuantity(quantity: any): number {
    const parsed = parseFloat(String(quantity).replace(/[,]/g, ''))
    if (isNaN(parsed)) {
      throw new Error(`Invalid quantity: ${quantity}`)
    }
    return parsed
  }

  static validateDate(date: string): string {
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }
    return parsed.toISOString().split('T')[0]
  }

  static sanitizeString(str: string | null | undefined): string {
    if (!str) return ''
    return String(str).trim().substring(0, 255) // Limit length and trim
  }
}