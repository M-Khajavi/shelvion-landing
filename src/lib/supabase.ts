import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''
const configuredAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean)

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const adminEmails = configuredAdminEmails

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return adminEmails.includes(normalized)
}
