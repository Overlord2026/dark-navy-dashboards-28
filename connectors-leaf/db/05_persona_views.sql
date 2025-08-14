-- Persona-Aware Views
-- Views that provide role-based projections with appropriate redactions

-- =============================================================================
-- POSITION VIEWS WITH PERSONA AWARENESS
-- =============================================================================

-- Client view: Full detail for own positions
CREATE VIEW v_positions_client AS
SELECT 
  p.position_id,
  p.account_id,
  a.account_name,
  a.custodian,
  p.instrument_id,
  i.symbol,
  i.name as instrument_name,
  i.asset_class,
  p.quantity,
  p.cost_basis,
  p.market_value,
  p.unrealized_gain_loss,
  p.as_of,
  p.created_at,
  p.updated_at
FROM positions p
JOIN accounts a ON p.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id  
JOIN instruments i ON p.instrument_id = i.instrument_id
WHERE get_user_role() = 'client' 
  AND can_access_entity(po.entity_id);

-- Advisor view: Full detail with performance metrics
CREATE VIEW v_positions_advisor AS
SELECT 
  p.position_id,
  p.account_id,
  a.account_name,
  a.custodian,
  a.account_number, -- Advisors can see account numbers
  p.instrument_id,
  i.symbol,
  i.name as instrument_name,
  i.asset_class,
  i.sector,
  i.industry,
  p.quantity,
  p.cost_basis,
  p.market_value,
  p.unrealized_gain_loss,
  CASE 
    WHEN p.cost_basis > 0 THEN 
      ((p.market_value - p.cost_basis) / p.cost_basis) * 100
    ELSE NULL 
  END as return_percentage,
  p.as_of,
  p.created_at,
  p.updated_at,
  -- Additional advisor fields
  po.entity_id,
  e.legal_name as entity_name
FROM positions p
JOIN accounts a ON p.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
JOIN entities e ON po.entity_id = e.entity_id
JOIN instruments i ON p.instrument_id = i.instrument_id
WHERE get_user_role() IN ('advisor', 'admin')
  AND can_access_entity(po.entity_id);

-- CPA view: Tax-focused position data
CREATE VIEW v_positions_cpa AS
SELECT 
  p.position_id,
  p.account_id,
  a.account_name,
  a.account_type,
  LEFT(a.account_number, 4) || '****' || RIGHT(a.account_number, 4) as account_number_masked,
  p.instrument_id,
  i.symbol,
  i.name as instrument_name,
  i.asset_class,
  p.quantity,
  p.cost_basis,
  p.market_value,
  p.unrealized_gain_loss,
  -- Tax-specific calculations
  CASE 
    WHEN p.unrealized_gain_loss > 0 THEN 'unrealized_gain'
    WHEN p.unrealized_gain_loss < 0 THEN 'unrealized_loss'
    ELSE 'neutral'
  END as tax_status,
  p.as_of,
  po.entity_id,
  e.legal_name as entity_name,
  e.tax_id
FROM positions p
JOIN accounts a ON p.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
JOIN entities e ON po.entity_id = e.entity_id
JOIN instruments i ON p.instrument_id = i.instrument_id
WHERE get_user_role() IN ('cpa', 'advisor', 'admin')
  AND can_access_entity(po.entity_id);

-- Attorney view: Limited position data for estate planning
CREATE VIEW v_positions_attorney AS
SELECT 
  p.position_id,
  p.account_id,
  a.account_name,
  a.account_type,
  '****' as account_number_masked, -- Heavily masked for attorneys
  i.asset_class,
  p.market_value, -- Value only, no cost basis
  p.as_of,
  po.entity_id,
  e.legal_name as entity_name,
  e.entity_type
FROM positions p
JOIN accounts a ON p.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
JOIN entities e ON po.entity_id = e.entity_id
JOIN instruments i ON p.instrument_id = i.instrument_id
WHERE get_user_role() IN ('attorney', 'advisor', 'admin')
  AND can_access_entity(po.entity_id);

-- Unified persona-aware positions view
CREATE VIEW v_positions_persona AS
SELECT * FROM v_positions_client WHERE get_user_role() = 'client'
UNION ALL
SELECT 
  position_id, account_id, account_name, custodian, 
  account_number as account_number, instrument_id, symbol, 
  instrument_name, asset_class, quantity, cost_basis, 
  market_value, unrealized_gain_loss, as_of, created_at, updated_at
FROM v_positions_advisor WHERE get_user_role() IN ('advisor', 'admin')
UNION ALL
SELECT 
  position_id, account_id, account_name, NULL as custodian,
  account_number_masked as account_number, instrument_id, symbol,
  instrument_name, asset_class, quantity, cost_basis,
  market_value, unrealized_gain_loss, as_of, NULL as created_at, NULL as updated_at
FROM v_positions_cpa WHERE get_user_role() = 'cpa'
UNION ALL
SELECT 
  position_id, account_id, account_name, NULL as custodian,
  account_number_masked as account_number, NULL as instrument_id, NULL as symbol,
  NULL as instrument_name, asset_class, NULL as quantity, NULL as cost_basis,
  market_value, NULL as unrealized_gain_loss, as_of, NULL as created_at, NULL as updated_at
FROM v_positions_attorney WHERE get_user_role() = 'attorney';

-- =============================================================================
-- TRANSACTION VIEWS WITH PERSONA AWARENESS
-- =============================================================================

-- Client view: All transaction details
CREATE VIEW v_transactions_client AS
SELECT 
  t.txn_id,
  t.account_id,
  a.account_name,
  t.instrument_id,
  i.symbol,
  i.name as instrument_name,
  t.transaction_type,
  t.quantity,
  t.price,
  t.amount,
  t.gross_amount,
  t.net_amount,
  t.fees,
  t.trade_date,
  t.settle_date,
  t.description,
  t.created_at
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
LEFT JOIN instruments i ON t.instrument_id = i.instrument_id
WHERE get_user_role() = 'client'
  AND can_access_entity(po.entity_id);

-- Advisor view: Full transaction details with performance analysis
CREATE VIEW v_transactions_advisor AS
SELECT 
  t.txn_id,
  t.account_id,
  a.account_name,
  a.account_number,
  t.instrument_id,
  i.symbol,
  i.name as instrument_name,
  i.asset_class,
  t.transaction_type,
  t.quantity,
  t.price,
  t.amount,
  t.gross_amount,
  t.net_amount,
  t.fees,
  t.trade_date,
  t.settle_date,
  t.description,
  t.reference_id,
  t.created_at,
  po.entity_id,
  e.legal_name as entity_name
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
JOIN entities e ON po.entity_id = e.entity_id
LEFT JOIN instruments i ON t.instrument_id = i.instrument_id
WHERE get_user_role() IN ('advisor', 'admin')
  AND can_access_entity(po.entity_id);

-- CPA view: Tax-focused transaction data
CREATE VIEW v_transactions_cpa AS
SELECT 
  t.txn_id,
  t.account_id,
  a.account_name,
  a.account_type,
  t.transaction_type,
  t.amount,
  t.fees,
  t.trade_date,
  t.settle_date,
  -- Tax year calculation
  EXTRACT(YEAR FROM t.trade_date) as tax_year,
  -- Realized gain/loss for sales
  CASE 
    WHEN t.transaction_type = 'sell' THEN 
      t.amount - (t.quantity * COALESCE(avg_cost.avg_cost_basis, 0))
    ELSE NULL
  END as realized_gain_loss,
  po.entity_id,
  e.legal_name as entity_name,
  e.tax_id
FROM transactions t
JOIN accounts a ON t.account_id = a.account_id
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
JOIN entities e ON po.entity_id = e.entity_id
LEFT JOIN (
  -- Calculate average cost basis for realized gains
  SELECT 
    account_id, 
    instrument_id, 
    AVG(cost_basis / NULLIF(quantity, 0)) as avg_cost_basis
  FROM positions 
  GROUP BY account_id, instrument_id
) avg_cost ON t.account_id = avg_cost.account_id 
  AND t.instrument_id = avg_cost.instrument_id
WHERE get_user_role() IN ('cpa', 'advisor', 'admin')
  AND can_access_entity(po.entity_id);

-- =============================================================================
-- REPORT VIEWS WITH PERSONA AWARENESS  
-- =============================================================================

-- Reports accessible by current user based on persona scope
CREATE VIEW v_reports_persona AS
SELECT 
  r.report_id,
  r.portfolio_id,
  r.entity_id,
  r.report_type,
  r.report_name,
  r.period_start,
  r.period_end,
  r.storage_url,
  r.file_format,
  r.status,
  r.persona_scope,
  r.generated_at,
  r.expires_at,
  r.download_count,
  r.created_at,
  -- Entity info if accessible
  CASE 
    WHEN r.entity_id IS NOT NULL THEN e.legal_name
    WHEN r.portfolio_id IS NOT NULL THEN pe.legal_name
    ELSE NULL
  END as entity_name,
  -- Portfolio info if applicable
  p.portfolio_name,
  -- User access level
  get_user_role() as user_role,
  has_persona_access(r.persona_scope) as has_access
FROM reports r
LEFT JOIN entities e ON r.entity_id = e.entity_id
LEFT JOIN portfolios p ON r.portfolio_id = p.portfolio_id
LEFT JOIN entities pe ON p.entity_id = pe.entity_id
WHERE has_persona_access(r.persona_scope)
  AND (
    (r.entity_id IS NOT NULL AND can_access_entity(r.entity_id))
    OR
    (r.portfolio_id IS NOT NULL AND r.portfolio_id IN (
      SELECT portfolio_id FROM portfolios WHERE can_access_entity(entity_id)
    ))
  );

-- =============================================================================
-- AGGREGATE VIEWS FOR DASHBOARDS
-- =============================================================================

-- Portfolio summary by persona
CREATE VIEW v_portfolio_summary_persona AS
SELECT 
  po.portfolio_id,
  po.entity_id,
  po.portfolio_name,
  e.legal_name as entity_name,
  po.base_currency,
  COUNT(DISTINCT a.account_id) as account_count,
  COUNT(DISTINCT p.instrument_id) as position_count,
  SUM(p.market_value) as total_market_value,
  SUM(p.cost_basis) as total_cost_basis,
  SUM(p.unrealized_gain_loss) as total_unrealized_gain_loss,
  CASE 
    WHEN SUM(p.cost_basis) > 0 THEN 
      (SUM(p.unrealized_gain_loss) / SUM(p.cost_basis)) * 100
    ELSE 0 
  END as total_return_percentage,
  MAX(p.as_of) as as_of_date,
  get_user_role() as user_role
FROM portfolios po
JOIN entities e ON po.entity_id = e.entity_id
LEFT JOIN accounts a ON po.portfolio_id = a.portfolio_id
LEFT JOIN positions p ON a.account_id = p.account_id
WHERE can_access_entity(po.entity_id)
GROUP BY po.portfolio_id, po.entity_id, po.portfolio_name, e.legal_name, po.base_currency;

-- Account summary with persona-appropriate details
CREATE VIEW v_account_summary_persona AS
SELECT 
  a.account_id,
  a.portfolio_id,
  po.entity_id,
  a.account_name,
  a.custodian,
  a.account_type,
  -- Account number based on user role
  CASE 
    WHEN get_user_role() IN ('client', 'advisor', 'admin') THEN a.account_number
    WHEN get_user_role() = 'cpa' THEN a.account_number_masked
    ELSE '****'
  END as account_number_display,
  a.status,
  COUNT(p.position_id) as position_count,
  SUM(p.market_value) as total_market_value,
  SUM(p.cost_basis) as total_cost_basis,
  SUM(p.unrealized_gain_loss) as total_unrealized_gain_loss,
  MAX(p.as_of) as as_of_date
FROM accounts a
JOIN portfolios po ON a.portfolio_id = po.portfolio_id
LEFT JOIN positions p ON a.account_id = p.account_id
WHERE can_access_entity(po.entity_id)
GROUP BY a.account_id, a.portfolio_id, po.entity_id, a.account_name, 
         a.custodian, a.account_type, a.account_number, 
         a.account_number_masked, a.status;