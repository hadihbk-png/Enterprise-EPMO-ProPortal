import { requireSupabase } from './supabase.js'

export function mapProgram(row) {
  return {
    id: row.id,
    name: row.name,
    sponsor: row.sponsor,
    strategicObjective: row.strategic_objective,
    startDate: row.start_date,
    endDate: row.end_date,
    budgetAllocated: Number(row.budget_allocated ?? 0),
    budgetSpent: Number(row.budget_spent ?? 0),
    priority: row.priority,
    rag: row.rag_status,
    strategicValue: row.strategic_value ?? 5,
    strategicAlignment: row.strategic_value ?? 5,
    deliveryConfidence: row.delivery_confidence ?? 5,
    percentComplete: row.percent_complete ?? 0,
    portfolioColor: row.portfolio_color ?? '#6366f1',
    linkedProjects: row.linked_projects ?? [],
    stageGates: row.stage_gates ?? [],
    benefits: row.benefits ?? [],
    raid: row.raid ?? { risks: [], assumptions: [], issues: [], dependencies: [] },
  }
}

function toProgramRow(program) {
  return {
    name: program.name,
    sponsor: program.sponsor,
    strategic_objective: program.strategicObjective,
    start_date: program.startDate,
    end_date: program.endDate,
    budget_allocated: program.budgetAllocated,
    priority: program.priority,
    rag_status: program.rag,
    strategic_value: program.strategicValue ?? program.strategicAlignment,
    delivery_confidence: program.deliveryConfidence,
  }
}

export async function getPrograms() {
  const db = requireSupabase()
  const { data, error } = await db.from('programs').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapProgram)
}

export async function getProgramById(id) {
  const db = requireSupabase()
  const { data, error } = await db.from('programs').select('*').eq('id', id).single()
  if (error) throw error
  return mapProgram(data)
}

export async function createProgram(program) {
  const db = requireSupabase()
  const { data: userData, error: userError } = await db.auth.getUser()
  if (userError) throw userError
  const { data, error } = await db.from('programs').insert({ ...toProgramRow(program), user_id: userData.user.id }).select('*').single()
  if (error) throw error
  return mapProgram(data)
}

export async function updateProgram(id, program) {
  const db = requireSupabase()
  const { data, error } = await db.from('programs').update(toProgramRow(program)).eq('id', id).select('*').single()
  if (error) throw error
  return mapProgram(data)
}

export async function deleteProgram(id) {
  const db = requireSupabase()
  const { error } = await db.from('programs').delete().eq('id', id)
  if (error) throw error
}
