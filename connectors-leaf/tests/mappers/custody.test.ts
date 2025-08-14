import { assertEquals, assertThrows } from "https://deno.land/std@0.168.0/testing/asserts.ts"
import { 
  SymbolNormalizer, 
  BridgeFTMapper, 
  PlaidMapper, 
  CustodyMapperFactory,
  DataValidationUtils
} from "../../shared/mappers/custody.ts"

// Test fixtures
const bridgeFTAccountFixture = {
  id: "bridgeft_123",
  accountNumber: "ACCT-987654321",
  accountType: "brokerage",
  custodian: "Charles Schwab",
  baseCurrency: "USD",
  status: "open"
}

const bridgeFTPositionFixture = {
  symbol: "AAPL",
  name: "Apple Inc.",
  quantity: "100.50",
  costBasis: "15000.00",
  marketValue: "17500.00",
  asOf: "2024-01-15T00:00:00Z",
  identifiers: {
    cusip: "037833100",
    isin: "US0378331005"
  }
}

const bridgeFTTransactionFixture = {
  type: "buy",
  symbol: "AAPL",
  quantity: "10",
  amount: "1750.00",
  tradeDate: "2024-01-15",
  settleDate: "2024-01-17",
  description: "Purchase of Apple Inc."
}

const plaidAccountFixture = {
  account_id: "plaid_abc123",
  type: "investment",
  subtype: "brokerage",
  institution_name: "Fidelity",
  currency_code: "USD"
}

const plaidHoldingFixture = {
  security: {
    ticker_symbol: "MSFT",
    name: "Microsoft Corporation",
    cusip: "594918104",
    isin: "US5949181045"
  },
  quantity: "50.25",
  institution_value: "12500.75",
  cost_basis: "10000.00"
}

const plaidTransactionFixture = {
  type: "buy",
  subtype: "purchase",
  amount: "2500.00",
  date: "2024-01-15",
  name: "Stock Purchase",
  security: {
    ticker_symbol: "MSFT",
    cusip: "594918104"
  },
  quantity: "10"
}

// Symbol Normalizer Tests
Deno.test("SymbolNormalizer - normalizeSymbol", () => {
  assertEquals(SymbolNormalizer.normalizeSymbol("aapl"), "AAPL")
  assertEquals(SymbolNormalizer.normalizeSymbol("BRK.B"), "BRK.B")
  assertEquals(SymbolNormalizer.normalizeSymbol("BRK-B"), "BRK-B")
  assertEquals(SymbolNormalizer.normalizeSymbol("  aapl  "), "AAPL")
  assertEquals(SymbolNormalizer.normalizeSymbol("A@#$BCD"), "ABCD")
})

Deno.test("SymbolNormalizer - extractCUSIP", () => {
  assertEquals(SymbolNormalizer.extractCUSIP({ cusip: "037833100" }), "037833100")
  assertEquals(SymbolNormalizer.extractCUSIP({ CUSIP: "037833100" }), "037833100")
  assertEquals(SymbolNormalizer.extractCUSIP({ cusip_id: "037833100" }), "037833100")
  assertEquals(SymbolNormalizer.extractCUSIP({ invalid: "123" }), null)
  assertEquals(SymbolNormalizer.extractCUSIP({}), null)
})

Deno.test("SymbolNormalizer - extractISIN", () => {
  assertEquals(SymbolNormalizer.extractISIN({ isin: "US0378331005" }), "US0378331005")
  assertEquals(SymbolNormalizer.extractISIN({ ISIN: "us0378331005" }), "US0378331005")
  assertEquals(SymbolNormalizer.extractISIN({ invalid: "123" }), null)
})

Deno.test("SymbolNormalizer - isValidCUSIP", () => {
  assertEquals(SymbolNormalizer.isValidCUSIP("037833100"), true)
  assertEquals(SymbolNormalizer.isValidCUSIP("037833ABC"), true)
  assertEquals(SymbolNormalizer.isValidCUSIP("03783310"), false) // Too short
  assertEquals(SymbolNormalizer.isValidCUSIP("0378331000"), false) // Too long
  assertEquals(SymbolNormalizer.isValidCUSIP("037833-10"), false) // Invalid character
})

Deno.test("SymbolNormalizer - isValidISIN", () => {
  assertEquals(SymbolNormalizer.isValidISIN("US0378331005"), true)
  assertEquals(SymbolNormalizer.isValidISIN("GB0002162385"), true)
  assertEquals(SymbolNormalizer.isValidISIN("US037833100"), false) // Too short
  assertEquals(SymbolNormalizer.isValidISIN("0S0378331005"), false) // Invalid country code
})

Deno.test("SymbolNormalizer - createIdentifiers", () => {
  const result = SymbolNormalizer.createIdentifiers("AAPL", {
    cusip: "037833100",
    isin: "US0378331005",
    sedol: "2046251",
    custom_id: "12345"
  })

  assertEquals(result.symbol, "AAPL")
  assertEquals(result.cusip, "037833100")
  assertEquals(result.isin, "US0378331005")
  assertEquals(result.custom_id, "12345")
})

// BridgeFT Mapper Tests
Deno.test("BridgeFTMapper - mapAccount", () => {
  const result = BridgeFTMapper.mapAccount(bridgeFTAccountFixture)
  
  assertEquals(result.account_id, "bridgeft_123")
  assertEquals(result.account_number, "ACCT-987654321")
  assertEquals(result.account_type, "investment")
  assertEquals(result.custodian, "Charles Schwab")
  assertEquals(result.base_currency, "USD")
  assertEquals(result.status, "active")
  assertEquals(result.metadata?.vendor, "bridgeft")
})

Deno.test("BridgeFTMapper - mapPosition", () => {
  const result = BridgeFTMapper.mapPosition(bridgeFTPositionFixture, "account_123")
  
  assertEquals(result.account_id, "account_123")
  assertEquals(result.symbol, "AAPL")
  assertEquals(result.name, "Apple Inc.")
  assertEquals(result.quantity, 100.50)
  assertEquals(result.cost_basis, 15000.00)
  assertEquals(result.market_value, 17500.00)
  assertEquals(result.as_of, "2024-01-15T00:00:00Z")
  assertEquals(result.identifiers?.cusip, "037833100")
  assertEquals(result.identifiers?.isin, "US0378331005")
})

Deno.test("BridgeFTMapper - mapTransaction", () => {
  const result = BridgeFTMapper.mapTransaction(bridgeFTTransactionFixture, "account_123")
  
  assertEquals(result.account_id, "account_123")
  assertEquals(result.symbol, "AAPL")
  assertEquals(result.type, "purchase")
  assertEquals(result.quantity, 10)
  assertEquals(result.amount, 1750.00)
  assertEquals(result.trade_date, "2024-01-15")
  assertEquals(result.settle_date, "2024-01-17")
  assertEquals(result.description, "Purchase of Apple Inc.")
})

// Plaid Mapper Tests
Deno.test("PlaidMapper - mapAccount", () => {
  const result = PlaidMapper.mapAccount(plaidAccountFixture)
  
  assertEquals(result.account_id, "plaid_abc123")
  assertEquals(result.account_number, "plaid_abc123")
  assertEquals(result.account_type, "investment")
  assertEquals(result.custodian, "Fidelity")
  assertEquals(result.base_currency, "USD")
  assertEquals(result.status, "active")
  assertEquals(result.metadata?.vendor, "plaid")
})

Deno.test("PlaidMapper - mapPosition", () => {
  const result = PlaidMapper.mapPosition(plaidHoldingFixture, "account_456")
  
  assertEquals(result.account_id, "account_456")
  assertEquals(result.symbol, "MSFT")
  assertEquals(result.name, "Microsoft Corporation")
  assertEquals(result.quantity, 50.25)
  assertEquals(result.cost_basis, 10000.00)
  assertEquals(result.market_value, 12500.75)
  assertEquals(result.identifiers?.cusip, "594918104")
  assertEquals(result.identifiers?.isin, "US5949181045")
})

Deno.test("PlaidMapper - mapTransaction", () => {
  const result = PlaidMapper.mapTransaction(plaidTransactionFixture, "account_456")
  
  assertEquals(result.account_id, "account_456")
  assertEquals(result.symbol, "MSFT")
  assertEquals(result.type, "purchase")
  assertEquals(result.quantity, 10)
  assertEquals(result.amount, 2500.00)
  assertEquals(result.trade_date, "2024-01-15")
  assertEquals(result.description, "Stock Purchase")
})

// Mapper Factory Tests
Deno.test("CustodyMapperFactory - getMapper", () => {
  assertEquals(CustodyMapperFactory.getMapper("bridgeft"), BridgeFTMapper)
  assertEquals(CustodyMapperFactory.getMapper("plaid"), PlaidMapper)
  assertThrows(() => CustodyMapperFactory.getMapper("unknown"))
})

Deno.test("CustodyMapperFactory - mapAccount", () => {
  const result = CustodyMapperFactory.mapAccount("bridgeft", bridgeFTAccountFixture)
  assertEquals(result.account_id, "bridgeft_123")
  assertEquals(result.custodian, "Charles Schwab")
})

Deno.test("CustodyMapperFactory - mapPosition", () => {
  const result = CustodyMapperFactory.mapPosition("plaid", plaidHoldingFixture, "account_456")
  assertEquals(result.symbol, "MSFT")
  assertEquals(result.quantity, 50.25)
})

Deno.test("CustodyMapperFactory - mapTransaction", () => {
  const result = CustodyMapperFactory.mapTransaction("bridgeft", bridgeFTTransactionFixture, "account_123")
  assertEquals(result.type, "purchase")
  assertEquals(result.amount, 1750.00)
})

// Data Validation Utils Tests
Deno.test("DataValidationUtils - validateAndCleanAmount", () => {
  assertEquals(DataValidationUtils.validateAndCleanAmount("1,250.50"), 1250.50)
  assertEquals(DataValidationUtils.validateAndCleanAmount("$1,250.50"), 1250.50)
  assertEquals(DataValidationUtils.validateAndCleanAmount(1250.505), 1250.51) // Rounding
  assertThrows(() => DataValidationUtils.validateAndCleanAmount("invalid"))
})

Deno.test("DataValidationUtils - validateAndCleanQuantity", () => {
  assertEquals(DataValidationUtils.validateAndCleanQuantity("1,250.505"), 1250.505)
  assertEquals(DataValidationUtils.validateAndCleanQuantity(1250), 1250)
  assertThrows(() => DataValidationUtils.validateAndCleanQuantity("invalid"))
})

Deno.test("DataValidationUtils - validateDate", () => {
  assertEquals(DataValidationUtils.validateDate("2024-01-15"), "2024-01-15")
  assertEquals(DataValidationUtils.validateDate("2024-01-15T10:30:00Z"), "2024-01-15")
  assertThrows(() => DataValidationUtils.validateDate("invalid-date"))
})

Deno.test("DataValidationUtils - sanitizeString", () => {
  assertEquals(DataValidationUtils.sanitizeString("  hello world  "), "hello world")
  assertEquals(DataValidationUtils.sanitizeString(null), "")
  assertEquals(DataValidationUtils.sanitizeString(undefined), "")
  
  // Test length limit
  const longString = "a".repeat(300)
  const result = DataValidationUtils.sanitizeString(longString)
  assertEquals(result.length, 255)
})

// Integration Tests
Deno.test("Integration - BridgeFT full workflow", () => {
  const account = CustodyMapperFactory.mapAccount("bridgeft", bridgeFTAccountFixture)
  const position = CustodyMapperFactory.mapPosition("bridgeft", bridgeFTPositionFixture, account.account_id)
  const transaction = CustodyMapperFactory.mapTransaction("bridgeft", bridgeFTTransactionFixture, account.account_id)
  
  // Verify all data is properly mapped and validated
  assertEquals(account.account_type, "investment")
  assertEquals(position.symbol, "AAPL")
  assertEquals(transaction.type, "purchase")
  
  // Verify identifiers are properly normalized
  assertEquals(position.identifiers?.symbol, "AAPL")
  assertEquals(position.identifiers?.cusip, "037833100")
  assertEquals(position.identifiers?.isin, "US0378331005")
})

Deno.test("Integration - Plaid full workflow", () => {
  const account = CustodyMapperFactory.mapAccount("plaid", plaidAccountFixture)
  const position = CustodyMapperFactory.mapPosition("plaid", plaidHoldingFixture, account.account_id)
  const transaction = CustodyMapperFactory.mapTransaction("plaid", plaidTransactionFixture, account.account_id)
  
  // Verify all data is properly mapped and validated
  assertEquals(account.account_type, "investment")
  assertEquals(position.symbol, "MSFT")
  assertEquals(transaction.type, "purchase")
  
  // Verify identifiers are properly normalized
  assertEquals(position.identifiers?.symbol, "MSFT")
  assertEquals(position.identifiers?.cusip, "594918104")
  assertEquals(position.identifiers?.isin, "US5949181045")
})