CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sponsor TEXT,
  strategic_objective TEXT,
  start_date DATE,
  end_date DATE,
  budget_allocated NUMERIC,
  priority TEXT CHECK (priority IN ('Critical','High','Medium','Low')),
  rag_status TEXT CHECK (rag_status IN ('Red','Amber','Green')),
  strategic_value INT CHECK (strategic_value BETWEEN 1 AND 10),
  delivery_confidence INT CHECK (delivery_confidence BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner TEXT,
  planned_date DATE,
  actual_date DATE,
  status TEXT CHECK (status IN ('Not Started','In Progress','Complete','At Risk','Delayed')),
  percent_complete INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE risks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  probability INT CHECK (probability BETWEEN 1 AND 5),
  impact INT CHECK (impact BETWEEN 1 AND 5),
  score INT GENERATED ALWAYS AS (probability * impact) STORED,
  owner TEXT,
  mitigation TEXT,
  status TEXT CHECK (status IN ('Open','In Progress','Closed','Accepted')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE stakeholders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  influence TEXT CHECK (influence IN ('High','Medium','Low')),
  interest TEXT CHECK (interest IN ('High','Medium','Low')),
  attitude TEXT CHECK (attitude IN ('Champion','Neutral','Resistant')),
  preferred_contact TEXT,
  last_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE budget_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  month DATE,
  planned_amount NUMERIC,
  actual_amount NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own data only" ON programs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own milestones only" ON milestones
  FOR ALL USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = milestones.program_id AND programs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM programs WHERE programs.id = milestones.program_id AND programs.user_id = auth.uid()));

CREATE POLICY "own risks only" ON risks
  FOR ALL USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = risks.program_id AND programs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM programs WHERE programs.id = risks.program_id AND programs.user_id = auth.uid()));

CREATE POLICY "own stakeholders only" ON stakeholders
  FOR ALL USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = stakeholders.program_id AND programs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM programs WHERE programs.id = stakeholders.program_id AND programs.user_id = auth.uid()));

CREATE POLICY "own budget only" ON budget_records
  FOR ALL USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = budget_records.program_id AND programs.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM programs WHERE programs.id = budget_records.program_id AND programs.user_id = auth.uid()));
