import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { createClient } from '@supabase/supabase-js'
import { reportsRouter } from './routes/reports.js'
import { scheduledReportJob } from './services/scheduler.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandlers.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}))

app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'connector-reporter'
  })
})

// API routes
app.use('/api/reports', reportsRouter)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Scheduled jobs
if (process.env.ENABLE_SCHEDULER === 'true') {
  // Run monthly reports on the 1st of each month at 2 AM
  cron.schedule('0 2 1 * *', async () => {
    console.log('Running monthly scheduled reports...')
    await scheduledReportJob('monthly')
  })

  // Run quarterly reports on the 1st of January, April, July, October at 3 AM
  cron.schedule('0 3 1 1,4,7,10 *', async () => {
    console.log('Running quarterly scheduled reports...')
    await scheduledReportJob('quarterly')
  })

  console.log('Scheduled report jobs initialized')
}

app.listen(PORT, () => {
  console.log(`Report service running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Scheduler enabled: ${process.env.ENABLE_SCHEDULER === 'true'}`)
})