import { supabase } from '../index.js'

export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7)

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Get user profile with persona information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, tenant_id, metadata')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Failed to fetch user profile:', profileError)
      return res.status(401).json({ error: 'User profile not found' })
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      persona: profile.role || 'client',
      tenant_id: profile.tenant_id,
      metadata: profile.metadata || {}
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({ error: 'Authentication service error' })
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!allowedRoles.includes(req.user.persona)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required_roles: allowedRoles,
        user_role: req.user.persona
      })
    }

    next()
  }
}