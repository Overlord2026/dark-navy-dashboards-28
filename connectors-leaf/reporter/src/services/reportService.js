import { supabase } from '../index.js'

export async function getReportsList({ portfolio_id, persona, kind, limit, offset, user_id }) {
  let query = supabase
    .from('v_reports_persona')
    .select('*', { count: 'exact' })

  // Apply filters
  if (portfolio_id) {
    query = query.eq('portfolio_id', portfolio_id)
  }

  if (persona) {
    query = query.contains('persona_scope', [persona])
  }

  if (kind) {
    query = query.eq('kind', kind)
  }

  // Apply RLS - this will be enforced by the persona views
  // The v_reports_persona view already filters based on user access

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to fetch reports: ${error.message}`)
  }

  return {
    data: data || [],
    total: count || 0
  }
}

export async function getReportById(reportId, userId) {
  const { data, error } = await supabase
    .from('v_reports_persona')
    .select('*')
    .eq('id', reportId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to fetch report: ${error.message}`)
  }

  return data
}

export async function deleteReport(reportId, userId) {
  // Check if user has permission to delete this report
  const report = await getReportById(reportId, userId)
  if (!report) {
    throw new Error('Report not found')
  }

  // Delete from storage first
  if (report.storage_url) {
    const path = report.storage_url.split('/').slice(-2).join('/')
    await supabase.storage.from('reports').remove([path])
  }

  // Delete from database
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)

  if (error) {
    throw new Error(`Failed to delete report: ${error.message}`)
  }

  return true
}