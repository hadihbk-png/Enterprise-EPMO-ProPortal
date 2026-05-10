import { requireSupabase } from './supabase.js'

export function mapBudgetRecord(row) {
  return {
    id: row.id,
    programId: row.program_id,
    program: row.programs?.name ?? row.program ?? '',
    month: row.month,
    planned: Number(row.planned_amount ?? 0),
    actual: Number(row.actual_amount ?? 0),
    forecast: Number(row.actual_amount ?? 0),
    notes: row.notes,
  }
}

function toBudgetRow(record) {
  return {
    program_id: record.programId,
    month: record.month,
    planned_amount: record.planned ?? record.plannedAmount,
    actual_amount: record.actual ?? record.actualAmount,
    notes: record.notes,
  }
}

export async function getBudgetRecords() {
  const db = requireSupabase()
  const { data, error } = await db.from('budget_records').select('*, programs(name)').order('month')
  if (error) throw error
  return data.map(mapBudgetRecord)
}

export async function createBudgetRecord(record) {
  const db = requireSupabase()
  const { data, error } = await db.from('budget_records').insert(toBudgetRow(record)).select('*, programs(name)').single()
  if (error) throw error
  return mapBudgetRecord(data)
}

export async function updateBudgetRecord(id, record) {
  const db = requireSupabase()
  const { data, error } = await db.from('budget_records').update(toBudgetRow(record)).eq('id', id).select('*, programs(name)').single()
  if (error) throw error
  return mapBudgetRecord(data)
}
