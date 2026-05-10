import { requireSupabase } from './supabase.js'

export function mapMilestone(row) {
  return {
    id: row.id,
    programId: row.program_id,
    name: row.name,
    program: row.programs?.name ?? row.program ?? '',
    owner: row.owner,
    plannedDate: row.planned_date,
    actualDate: row.actual_date,
    dueDate: row.planned_date,
    status: row.status,
    percentComplete: row.percent_complete ?? 0,
  }
}

function toMilestoneRow(item) {
  return {
    program_id: item.programId,
    name: item.name,
    owner: item.owner,
    planned_date: item.plannedDate ?? item.dueDate,
    actual_date: item.actualDate || null,
    status: item.status,
    percent_complete: item.percentComplete,
  }
}

export async function getMilestones() {
  const db = requireSupabase()
  const { data, error } = await db.from('milestones').select('*, programs(name)').order('planned_date')
  if (error) throw error
  return data.map(mapMilestone)
}

export async function createMilestone(item) {
  const db = requireSupabase()
  const { data, error } = await db.from('milestones').insert(toMilestoneRow(item)).select('*, programs(name)').single()
  if (error) throw error
  return mapMilestone(data)
}

export async function updateMilestone(id, item) {
  const db = requireSupabase()
  const { data, error } = await db.from('milestones').update(toMilestoneRow(item)).eq('id', id).select('*, programs(name)').single()
  if (error) throw error
  return mapMilestone(data)
}
