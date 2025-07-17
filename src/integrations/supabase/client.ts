import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://xcmqjkvyvuhoslbzmlgi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})