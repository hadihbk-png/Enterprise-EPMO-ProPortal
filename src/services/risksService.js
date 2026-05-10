import { requireSupabase } from './supabase.js'

export function mapRisk(row) {
  return {
    id: row.id,
    programId: row.program_id,
    program: row.programs?.name ?? row.program ?? '',
    title: row.title,
    category: row.category,
    probability: row.probability,
    impact: row.impact,
    score: row.score ?? row.probability * row.impact,
    owner: row.owner,
    mitigation: row.mitigation,
    status: row.status,
  }
}

function toRiskRow(risk) {
  return {
    program_id: risk.programId,
    title: risk.title,
    category: risk.category,
    probability: risk.probability,
    impact: risk.impact,
    owner: risk.owner,
    mitigation: risk.mitigation,
    status: risk.status,
  }
}

export async function getRisks() {
  const db = requireSupabase()
  const { data, error } = await db.from('risks').select('*, programs(name)').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapRisk)
}

export async function createRisk(risk) {
  const db = requireSupabase()
  const { data, error } = await db.from('risks').insert(toRiskRow(risk)).select('*, programs(name)').single()
  if (error) throw error
  return mapRisk(data)
}

export async function updateRisk(id, risk) {
  const db = requireSupabase()
  const { data, error } = await db.from('risks').update(toRiskRow(risk)).eq('id', id).select('*, programs(name)').single()
  if (error) throw error
  return mapRisk(data)
}

export async function deleteRisk(id) {
  const db = requireSupabase()
  const { error } = await db.from('risks').delete().eq('id', id)
  if (error) throw error
}
