import { requireSupabase } from './supabase.js'

export function mapStakeholder(row) {
  return {
    id: row.id,
    programId: row.program_id,
    program: row.programs?.name ?? row.program ?? '',
    name: row.name,
    role: row.role,
    organization: row.organization,
    influence: row.influence,
    interest: row.interest,
    attitude: row.attitude,
    engagementMethod: row.preferred_contact,
    lastContact: row.last_contact_date,
    notes: row.notes,
  }
}

function toStakeholderRow(item) {
  return {
    program_id: item.programId,
    name: item.name,
    role: item.role,
    organization: item.organization,
    influence: item.influence,
    interest: item.interest,
    attitude: item.attitude,
    preferred_contact: item.engagementMethod,
    last_contact_date: item.lastContact,
    notes: item.notes,
  }
}

export async function getStakeholders() {
  const db = requireSupabase()
  const { data, error } = await db.from('stakeholders').select('*, programs(name)').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapStakeholder)
}

export async function createStakeholder(item) {
  const db = requireSupabase()
  const { data, error } = await db.from('stakeholders').insert(toStakeholderRow(item)).select('*, programs(name)').single()
  if (error) throw error
  return mapStakeholder(data)
}

export async function updateStakeholder(id, item) {
  const db = requireSupabase()
  const { data, error } = await db.from('stakeholders').update(toStakeholderRow(item)).eq('id', id).select('*, programs(name)').single()
  if (error) throw error
  return mapStakeholder(data)
}

export async function deleteStakeholder(id) {
  const db = requireSupabase()
  const { error } = await db.from('stakeholders').delete().eq('id', id)
  if (error) throw error
}
