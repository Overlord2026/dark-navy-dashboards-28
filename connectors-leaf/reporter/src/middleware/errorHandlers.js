export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  // Default error response
  let status = 500
  let message = 'Internal server error'
  let details = null

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400
    message = 'Validation failed'
    details = err.details
  } else if (err.name === 'UnauthorizedError') {
    status = 401
    message = 'Unauthorized'
  } else if (err.name === 'ForbiddenError') {
    status = 403
    message = 'Forbidden'
  } else if (err.message.includes('not found')) {
    status = 404
    message = 'Resource not found'
  } else if (err.message.includes('duplicate') || err.message.includes('unique')) {
    status = 409
    message = 'Resource already exists'
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Internal server error'
    details = null
  } else if (status === 500) {
    details = err.message
  }

  res.status(status).json({
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
    path: req.path
  })
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  })
}