import express from 'express'
import { z } from 'zod'
import { generateReport } from '../services/reportGenerator.js'
import { getReportsList } from '../services/reportService.js'
import { validateRequest } from '../middleware/validation.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

// Request schemas
const renderReportSchema = z.object({
  portfolio_id: z.string().uuid(),
  period: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  }),
  kind: z.enum(['consolidated', 'performance', 'fees', 'cash_treasury', 'tax_summary']),
  persona_scope: z.enum(['client', 'advisor', 'cpa', 'attorney', 'admin']),
  format: z.enum(['pdf']).default('pdf'),
  delivery_method: z.enum(['download', 'storage']).default('storage')
})

const listReportsSchema = z.object({
  portfolio_id: z.string().uuid().optional(),
  persona: z.enum(['client', 'advisor', 'cpa', 'attorney', 'admin']).optional(),
  kind: z.enum(['consolidated', 'performance', 'fees', 'cash_treasury', 'tax_summary']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
})

// GET /api/reports - List available reports with RLS enforcement
router.get('/', 
  authenticateUser,
  validateRequest({ query: listReportsSchema }),
  async (req, res, next) => {
    try {
      const { portfolio_id, persona, kind, limit, offset } = req.query
      const user = req.user

      const reports = await getReportsList({
        portfolio_id,
        persona: persona || user.persona,
        kind,
        limit,
        offset,
        user_id: user.id
      })

      res.json({
        data: reports.data,
        pagination: {
          limit,
          offset,
          total: reports.total,
          has_more: reports.total > offset + limit
        }
      })
    } catch (error) {
      next(error)
    }
  }
)

// POST /api/reports/render - Generate report on demand
router.post('/render',
  authenticateUser,
  validateRequest({ body: renderReportSchema }),
  async (req, res, next) => {
    try {
      const { portfolio_id, period, kind, persona_scope, format, delivery_method } = req.body
      const user = req.user

      // Validate user has access to the portfolio and persona scope
      if (!canAccessPortfolio(user, portfolio_id) || !canUsePersonaScope(user, persona_scope)) {
        return res.status(403).json({
          error: 'Insufficient permissions for portfolio or persona scope'
        })
      }

      const report = await generateReport({
        portfolio_id,
        period,
        kind,
        persona_scope,
        format,
        delivery_method,
        requested_by: user.id
      })

      if (delivery_method === 'download') {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${report.filename}"`,
          'Content-Length': report.buffer.length
        })
        res.send(report.buffer)
      } else {
        res.json({
          report_id: report.id,
          storage_url: report.storage_url,
          filename: report.filename,
          generated_at: report.created_at
        })
      }
    } catch (error) {
      next(error)
    }
  }
)

// GET /api/reports/:id - Get specific report details
router.get('/:id',
  authenticateUser,
  async (req, res, next) => {
    try {
      const { id } = req.params
      const user = req.user

      const report = await getReportById(id, user.id)
      
      if (!report) {
        return res.status(404).json({ error: 'Report not found' })
      }

      res.json(report)
    } catch (error) {
      next(error)
    }
  }
)

// Helper functions
function canAccessPortfolio(user, portfolio_id) {
  // Implement portfolio access validation based on user roles and assignments
  // This should check against the canonical schema entities/portfolios
  return true // Simplified for now
}

function canUsePersonaScope(user, persona_scope) {
  // Users can only request reports for their own persona or lower privilege levels
  const personaHierarchy = {
    'admin': ['admin', 'attorney', 'cpa', 'advisor', 'client'],
    'attorney': ['attorney', 'client'],
    'cpa': ['cpa', 'client'],
    'advisor': ['advisor', 'client'],
    'client': ['client']
  }
  
  const allowedScopes = personaHierarchy[user.persona] || ['client']
  return allowedScopes.includes(persona_scope)
}

async function getReportById(reportId, userId) {
  // Implement report retrieval with RLS enforcement
  // This should query the reports table with proper access controls
  return null // Simplified for now
}

export { router as reportsRouter }