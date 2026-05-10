import { supabase } from './supabase.js'

export async function fetchPrograms() {
  if (!supabase) return []
  const { data, error } = await supabase.from('programs').select('*')
  if (error) throw error
  return data
}

export async function fetchRisks() {
  if (!supabase) return []
  const { data, error } = await supabase.from('risks').select('*')
  if (error) throw error
  return data
}

export async function fetchStakeholders() {
  if (!supabase) return []
  const { data, error } = await supabase.from('stakeholders').select('*')
  if (error) throw error
  return data
}
