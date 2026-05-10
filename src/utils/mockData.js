export const kpiTiles = [
  {
    label: 'Total Programs',
    value: '18',
    trend: 'up',
    trendValue: '+3',
    accent: '#6366f1',
    icon: 'BriefcaseBusiness',
  },
  {
    label: 'Active Projects',
    value: '64',
    trend: 'up',
    trendValue: '+8',
    accent: '#10b981',
    icon: 'Activity',
  },
  {
    label: 'Budget Utilisation',
    value: '72%',
    trend: 'up',
    trendValue: '+4%',
    accent: '#f43f5e',
    icon: 'WalletCards',
  },
  {
    label: 'Open Risks',
    value: '23',
    trend: 'down',
    trendValue: '-5',
    accent: '#f59e0b',
    icon: 'ShieldAlert',
  },
  {
    label: 'Milestones Due',
    value: '11',
    trend: 'up',
    trendValue: '+2',
    accent: '#06b6d4',
    icon: 'CalendarClock',
  },
]

export const ragSummary = [
  { status: 'Red', count: 4, color: '#f43f5e' },
  { status: 'Amber', count: 7, color: '#f59e0b' },
  { status: 'Green', count: 19, color: '#10b981' },
]

export const budgetBurnData = [
  { month: 'Jan', planned: 420, actual: 390 },
  { month: 'Feb', planned: 760, actual: 720 },
  { month: 'Mar', planned: 1080, actual: 1110 },
  { month: 'Apr', planned: 1410, actual: 1480 },
  { month: 'May', planned: 1780, actual: 1860 },
  { month: 'Jun', planned: 2160, actual: 2290 },
  { month: 'Jul', planned: 2580, actual: 2670 },
  { month: 'Aug', planned: 3020, actual: 3140 },
  { month: 'Sep', planned: 3440, actual: 3590 },
  { month: 'Oct', planned: 3880, actual: 4020 },
  { month: 'Nov', planned: 4300, actual: 4430 },
  { month: 'Dec', planned: 4800, actual: 4920 },
]

export const timelinePrograms = [
  {
    name: 'ERP Modernisation',
    start: 0.6,
    duration: 5.8,
    rag: 'Amber',
    milestones: [2.2, 4.8, 6.2],
  },
  {
    name: 'Digital Channels',
    start: 1.2,
    duration: 7.4,
    rag: 'Green',
    milestones: [3.3, 5.7, 8.1],
  },
  {
    name: 'Cloud Migration',
    start: 2.1,
    duration: 6.1,
    rag: 'Red',
    milestones: [4.1, 7.6],
  },
  {
    name: 'Data Platform',
    start: 4.0,
    duration: 6.8,
    rag: 'Green',
    milestones: [5.3, 9.6, 10.5],
  },
  {
    name: 'Operating Model',
    start: 5.5,
    duration: 4.9,
    rag: 'Amber',
    milestones: [7.2, 9.9],
  },
]

export const topRisks = [
  { title: 'Vendor delivery slippage', score: 21, owner: 'N. Patel', status: 'Mitigating' },
  { title: 'Data migration defects', score: 18, owner: 'A. Chen', status: 'Escalated' },
  { title: 'Funding approval delay', score: 13, owner: 'M. Evans', status: 'Watching' },
  { title: 'Resource contention', score: 11, owner: 'S. Omar', status: 'Mitigating' },
  { title: 'Adoption readiness gap', score: 6, owner: 'L. Brooks', status: 'On Track' },
]

export const upcomingMilestones = [
  {
    name: 'Steering committee gate',
    program: 'ERP Modernisation',
    dueDate: '2026-05-14',
    status: 'At Risk',
  },
  {
    name: 'Security architecture signoff',
    program: 'Cloud Migration',
    dueDate: '2026-05-18',
    status: 'Delayed',
  },
  {
    name: 'Benefits baseline approved',
    program: 'Digital Channels',
    dueDate: '2026-05-22',
    status: 'On Track',
  },
  {
    name: 'Pilot readiness review',
    program: 'Data Platform',
    dueDate: '2026-05-29',
    status: 'On Track',
  },
  {
    name: 'Target state workshop',
    program: 'Operating Model',
    dueDate: '2026-06-05',
    status: 'At Risk',
  },
].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

export const programs = [
  {
    id: 'erp-modernisation',
    name: 'ERP Modernisation',
    sponsor: 'Nadia Patel',
    strategicObjective: 'Standardise finance, procurement, and HR processes on a single enterprise platform.',
    startDate: '2026-01-12',
    endDate: '2026-10-30',
    budgetAllocated: 4200000,
    budgetSpent: 2840000,
    portfolioColor: '#6366f1',
    strategicValue: 9,
    strategicAlignment: 9,
    deliveryConfidence: 6,
    priority: 'Critical',
    rag: 'Amber',
    percentComplete: 58,
    linkedProjects: [
      { name: 'Finance Core Build', rag: 'Green' },
      { name: 'Procurement Migration', rag: 'Amber' },
      { name: 'HR Payroll Cutover', rag: 'Red' },
    ],
    milestones: [
      { name: 'Solution design approved', dueDate: '2026-05-18', owner: 'A. Chen', status: 'Complete', percentComplete: 100 },
      { name: 'Data migration cycle 2', dueDate: '2026-06-04', owner: 'L. Brooks', status: 'At Risk', percentComplete: 62 },
      { name: 'UAT entry gate', dueDate: '2026-07-15', owner: 'S. Omar', status: 'In Progress', percentComplete: 35 },
    ],
    stageGates: [
      { name: 'Initiation', status: 'Approved', signOffDate: '2026-01-20', approvedBy: 'Steering Committee' },
      { name: 'Design', status: 'Approved', signOffDate: '2026-04-10', approvedBy: 'Nadia Patel' },
      { name: 'Build', status: 'Pending', signOffDate: '-', approvedBy: '-' },
      { name: 'UAT', status: 'Pending', signOffDate: '-', approvedBy: '-' },
      { name: 'Go-Live', status: 'Pending', signOffDate: '-', approvedBy: '-' },
    ],
    benefits: [
      { description: 'Annual process efficiency saving', plannedValue: 1200000, achievedValue: 480000, unit: 'USD', realisationDate: '2026-12-31' },
      { description: 'Manual reconciliations reduced', plannedValue: 45, achievedValue: 18, unit: '%', realisationDate: '2026-11-15' },
    ],
    raid: {
      risks: [
        { title: 'Legacy data quality', category: 'Data', probability: 4, impact: 5, owner: 'A. Chen', mitigation: 'Run additional profiling and cleansing sprint.', status: 'Mitigating' },
        { title: 'SME availability', category: 'Resourcing', probability: 3, impact: 4, owner: 'S. Omar', mitigation: 'Secure named backups from each function.', status: 'Watching' },
      ],
      assumptions: [
        { title: 'Regional chart of accounts remains stable', category: 'Finance', owner: 'M. Evans', status: 'Validated' },
      ],
      issues: [
        { title: 'Interface defects in payroll feed', severity: 'High', owner: 'L. Brooks', raisedDate: '2026-05-01', targetResolution: '2026-05-20', status: 'Open' },
      ],
      dependencies: [
        { title: 'Identity management integration', category: 'Technology', owner: 'R. Singh', status: 'In Progress' },
      ],
    },
  },
  {
    id: 'digital-channels',
    name: 'Digital Channels',
    sponsor: 'Maya Evans',
    strategicObjective: 'Launch unified web and mobile journeys for priority customer segments.',
    startDate: '2026-02-01',
    endDate: '2026-12-15',
    budgetAllocated: 3100000,
    budgetSpent: 1540000,
    portfolioColor: '#10b981',
    strategicValue: 8,
    strategicAlignment: 8,
    deliveryConfidence: 8,
    priority: 'High',
    rag: 'Green',
    percentComplete: 46,
    linkedProjects: [
      { name: 'Mobile App Refresh', rag: 'Green' },
      { name: 'Customer Portal', rag: 'Green' },
      { name: 'Analytics Tagging', rag: 'Amber' },
    ],
    milestones: [
      { name: 'Journey prototypes approved', dueDate: '2026-05-22', owner: 'M. Evans', status: 'Complete', percentComplete: 100 },
      { name: 'Beta release', dueDate: '2026-06-28', owner: 'R. Singh', status: 'In Progress', percentComplete: 55 },
      { name: 'Public launch', dueDate: '2026-09-12', owner: 'N. Patel', status: 'Not Started', percentComplete: 0 },
    ],
    stageGates: [
      { name: 'Initiation', status: 'Approved', signOffDate: '2026-02-05', approvedBy: 'Maya Evans' },
      { name: 'Design', status: 'Approved', signOffDate: '2026-04-25', approvedBy: 'Product Council' },
      { name: 'Build', status: 'Pending', signOffDate: '-', approvedBy: '-' },
      { name: 'UAT', status: 'Pending', signOffDate: '-', approvedBy: '-' },
      { name: 'Go-Live', status: 'Pending', signOffDate: '-', approvedBy: '-' },
    ],
    benefits: [
      { description: 'Digital adoption uplift', plannedValue: 30, achievedValue: 12, unit: '%', realisationDate: '2026-12-31' },
      { description: 'Call centre demand reduction', plannedValue: 18, achievedValue: 4, unit: '%', realisationDate: '2026-10-30' },
    ],
    raid: {
      risks: [
        { title: 'App store approval delay', category: 'External', probability: 2, impact: 4, owner: 'R. Singh', mitigation: 'Submit early compliance package.', status: 'Watching' },
      ],
      assumptions: [
        { title: 'Marketing launch window holds', category: 'Commercial', owner: 'M. Evans', status: 'Open' },
      ],
      issues: [
        { title: 'Analytics taxonomy conflict', severity: 'Medium', owner: 'A. Chen', raisedDate: '2026-05-03', targetResolution: '2026-05-17', status: 'In Progress' },
      ],
      dependencies: [
        { title: 'CRM customer preference API', category: 'Technology', owner: 'L. Brooks', status: 'On Track' },
      ],
    },
  },
  {
    id: 'cloud-migration',
    name: 'Cloud Migration',
    sponsor: 'Omar Siddiq',
    strategicObjective: 'Move priority workloads to the cloud while improving resilience and operational controls.',
    startDate: '2026-03-04',
    endDate: '2026-11-20',
    budgetAllocated: 2750000,
    budgetSpent: 2030000,
    portfolioColor: '#f43f5e',
    strategicValue: 7,
    strategicAlignment: 7,
    deliveryConfidence: 4,
    priority: 'High',
    rag: 'Red',
    percentComplete: 39,
    linkedProjects: [
      { name: 'Landing Zone', rag: 'Green' },
      { name: 'Workload Wave 1', rag: 'Red' },
      { name: 'Security Controls', rag: 'Amber' },
    ],
    milestones: [
      { name: 'Landing zone ready', dueDate: '2026-05-18', owner: 'O. Siddiq', status: 'Delayed', percentComplete: 88 },
      { name: 'Security signoff', dueDate: '2026-06-10', owner: 'R. Singh', status: 'At Risk', percentComplete: 42 },
      { name: 'Wave 1 migration complete', dueDate: '2026-08-01', owner: 'L. Brooks', status: 'Not Started', percentComplete: 0 },
    ],
    stageGates: [
      { name: 'Initiation', status: 'Approved', signOffDate: '2026-03-12', approvedBy: 'Omar Siddiq' },
      { name: 'Design', status: 'Failed', signOffDate: '2026-05-02', approvedBy: 'Architecture Board' },
      { name: 'Build', status: 'Pending', signOffDate: '-', approvedBy: '-' },
      { name: 'UAT', status: 'Pending', signOffDate: '-', approvedBy: '-' },
      { name: 'Go-Live', status: 'Pending', signOffDate: '-', approvedBy: '-' },
    ],
    benefits: [
      { description: 'Infrastructure run-rate saving', plannedValue: 850000, achievedValue: 120000, unit: 'USD', realisationDate: '2027-01-31' },
      { description: 'Critical recovery time improvement', plannedValue: 60, achievedValue: 20, unit: '%', realisationDate: '2026-12-15' },
    ],
    raid: {
      risks: [
        { title: 'Security exception backlog', category: 'Security', probability: 5, impact: 4, owner: 'R. Singh', mitigation: 'Daily architecture triage until backlog clears.', status: 'Escalated' },
      ],
      assumptions: [
        { title: 'Network bandwidth upgrade completes by June', category: 'Infrastructure', owner: 'O. Siddiq', status: 'Open' },
      ],
      issues: [
        { title: 'Firewall rule approval blocked', severity: 'Critical', owner: 'R. Singh', raisedDate: '2026-05-06', targetResolution: '2026-05-13', status: 'Escalated' },
      ],
      dependencies: [
        { title: 'Data centre contract exit plan', category: 'Commercial', owner: 'M. Evans', status: 'At Risk' },
      ],
    },
  },
]

export const resourceCapacity = [
  { month: 'Jan', pm: 8, sme: 14, business: 10, limit: 42 },
  { month: 'Feb', pm: 9, sme: 16, business: 12, limit: 42 },
  { month: 'Mar', pm: 11, sme: 18, business: 14, limit: 42 },
  { month: 'Apr', pm: 12, sme: 20, business: 15, limit: 42 },
  { month: 'May', pm: 13, sme: 22, business: 17, limit: 42 },
  { month: 'Jun', pm: 12, sme: 21, business: 18, limit: 42 },
  { month: 'Jul', pm: 11, sme: 19, business: 16, limit: 42 },
  { month: 'Aug', pm: 10, sme: 18, business: 14, limit: 42 },
  { month: 'Sep', pm: 9, sme: 16, business: 13, limit: 42 },
  { month: 'Oct', pm: 8, sme: 15, business: 11, limit: 42 },
  { month: 'Nov', pm: 7, sme: 13, business: 10, limit: 42 },
  { month: 'Dec', pm: 6, sme: 11, business: 8, limit: 42 },
]

export const riskRegister = [
  {
    id: 'R-001',
    title: 'Security exception backlog',
    program: 'Cloud Migration',
    category: 'Technical',
    probability: 5,
    impact: 4,
    owner: 'R. Singh',
    mitigation: 'Daily architecture triage until backlog clears.',
    status: 'In Progress',
  },
  {
    id: 'R-002',
    title: 'Legacy data quality',
    program: 'ERP Modernisation',
    category: 'Operational',
    probability: 4,
    impact: 5,
    owner: 'A. Chen',
    mitigation: 'Run additional profiling and cleansing sprint.',
    status: 'Open',
  },
  {
    id: 'R-003',
    title: 'Funding approval delay',
    program: 'Digital Channels',
    category: 'Financial',
    probability: 3,
    impact: 4,
    owner: 'M. Evans',
    mitigation: 'Prepare alternate release scope.',
    status: 'Accepted',
  },
  {
    id: 'R-004',
    title: 'Regulatory consent changes',
    program: 'Digital Channels',
    category: 'Regulatory',
    probability: 2,
    impact: 5,
    owner: 'N. Patel',
    mitigation: 'Weekly legal review of consent journeys.',
    status: 'Open',
  },
  {
    id: 'R-005',
    title: 'SME availability',
    program: 'ERP Modernisation',
    category: 'Operational',
    probability: 3,
    impact: 3,
    owner: 'S. Omar',
    mitigation: 'Secure named backups from each function.',
    status: 'In Progress',
  },
  {
    id: 'R-006',
    title: 'Portfolio priority conflict',
    program: 'Cloud Migration',
    category: 'Strategic',
    probability: 2,
    impact: 3,
    owner: 'O. Siddiq',
    mitigation: 'Escalate sequencing options to steering group.',
    status: 'Closed',
  },
]

export const issueLog = [
  {
    id: 'I-001',
    title: 'Firewall rule approval blocked',
    program: 'Cloud Migration',
    severity: 'Critical',
    owner: 'R. Singh',
    raisedDate: '2026-05-06',
    targetResolution: '2026-05-09',
    status: 'Escalated',
    escalated: true,
  },
  {
    id: 'I-002',
    title: 'Interface defects in payroll feed',
    program: 'ERP Modernisation',
    severity: 'High',
    owner: 'L. Brooks',
    raisedDate: '2026-05-01',
    targetResolution: '2026-05-20',
    status: 'Open',
    escalated: false,
  },
  {
    id: 'I-003',
    title: 'Analytics taxonomy conflict',
    program: 'Digital Channels',
    severity: 'Medium',
    owner: 'A. Chen',
    raisedDate: '2026-05-03',
    targetResolution: '2026-05-17',
    status: 'In Progress',
    escalated: false,
  },
  {
    id: 'I-004',
    title: 'Vendor environment unavailable',
    program: 'ERP Modernisation',
    severity: 'Low',
    owner: 'S. Omar',
    raisedDate: '2026-04-28',
    targetResolution: '2026-05-08',
    status: 'Open',
    escalated: true,
  },
]

export const stakeholderRegister = [
  {
    id: 'SH-001',
    name: 'Nadia Patel',
    role: 'Executive Sponsor',
    organization: 'Corporate Services',
    program: 'ERP Modernisation',
    influence: 'High',
    interest: 'High',
    attitude: 'Champion',
    engagementMethod: 'Meeting',
    lastContact: '2026-05-06',
    notes: 'Strong advocate for process standardisation.',
  },
  {
    id: 'SH-002',
    name: 'Omar Siddiq',
    role: 'Technology Director',
    organization: 'IT Operations',
    program: 'Cloud Migration',
    influence: 'High',
    interest: 'Medium',
    attitude: 'Neutral',
    engagementMethod: 'Report',
    lastContact: '2026-04-29',
    notes: 'Needs concise security and resilience updates.',
  },
  {
    id: 'SH-003',
    name: 'Maya Evans',
    role: 'Digital Product Lead',
    organization: 'Customer Experience',
    program: 'Digital Channels',
    influence: 'Medium',
    interest: 'High',
    attitude: 'Champion',
    engagementMethod: 'Email',
    lastContact: '2026-05-08',
    notes: 'Owns customer launch messaging.',
  },
  {
    id: 'SH-004',
    name: 'Liam Brooks',
    role: 'Finance Controller',
    organization: 'Finance',
    program: 'ERP Modernisation',
    influence: 'Medium',
    interest: 'Medium',
    attitude: 'Neutral',
    engagementMethod: 'Call',
    lastContact: '2026-04-18',
    notes: 'Focused on reporting continuity.',
  },
  {
    id: 'SH-005',
    name: 'Sara Omar',
    role: 'Regional Operations Head',
    organization: 'Operations',
    program: 'ERP Modernisation',
    influence: 'High',
    interest: 'Low',
    attitude: 'Resistant',
    engagementMethod: 'Meeting',
    lastContact: '2026-04-10',
    notes: 'Concerned about SME capacity and operational disruption.',
  },
  {
    id: 'SH-006',
    name: 'Arun Chen',
    role: 'Data Governance Lead',
    organization: 'Data Office',
    program: 'Digital Channels',
    influence: 'Low',
    interest: 'High',
    attitude: 'Neutral',
    engagementMethod: 'Report',
    lastContact: '2026-05-01',
    notes: 'Reviews data taxonomy and migration readiness.',
  },
]

export const engagementActivities = {
  'SH-001': [
    { date: '2026-05-06', type: 'Meeting', summary: 'Steering pack walkthrough', outcome: 'Approved revised gate criteria', nextAction: 'Send risk appendix', loggedBy: 'PMO' },
    { date: '2026-04-24', type: 'Presentation', summary: 'ERP benefits review', outcome: 'Requested finance scenario split', nextAction: 'Update benefits model', loggedBy: 'M. Evans' },
  ],
  'SH-002': [
    { date: '2026-04-29', type: 'Report', summary: 'Cloud security status report', outcome: 'Asked for exception burn-down', nextAction: 'Share daily dashboard', loggedBy: 'R. Singh' },
  ],
  'SH-003': [
    { date: '2026-05-08', type: 'Email', summary: 'Beta launch readiness update', outcome: 'Confirmed product acceptance path', nextAction: 'Book customer demo', loggedBy: 'PMO' },
  ],
  'SH-004': [
    { date: '2026-04-18', type: 'Phone Call', summary: 'Close calendar impact', outcome: 'Flagged payroll interface concern', nextAction: 'Schedule defect triage', loggedBy: 'L. Brooks' },
  ],
  'SH-005': [
    { date: '2026-04-10', type: 'Workshop', summary: 'Operations impact workshop', outcome: 'Capacity concern escalated', nextAction: 'Agree SME backfill plan', loggedBy: 'S. Omar' },
  ],
  'SH-006': [
    { date: '2026-05-01', type: 'Meeting', summary: 'Analytics taxonomy review', outcome: 'Two conflicts identified', nextAction: 'Resolve naming standards', loggedBy: 'A. Chen' },
  ],
}

export const communicationPlan = [
  { stakeholderId: 'SH-001', tier: 1, frequency: 'Weekly', format: 'Meeting', keyMessage: 'Gate readiness, risk exposure, and decision asks.', owner: 'PMO' },
  { stakeholderId: 'SH-002', tier: 1, frequency: 'Weekly', format: 'Dashboard', keyMessage: 'Security exceptions and migration confidence.', owner: 'R. Singh' },
  { stakeholderId: 'SH-003', tier: 2, frequency: 'Fortnightly', format: 'Email', keyMessage: 'Launch readiness, customer impacts, and adoption metrics.', owner: 'M. Evans' },
  { stakeholderId: 'SH-004', tier: 2, frequency: 'Monthly', format: 'Report', keyMessage: 'Financial control readiness and reporting continuity.', owner: 'L. Brooks' },
  { stakeholderId: 'SH-005', tier: 1, frequency: 'Weekly', format: 'Meeting', keyMessage: 'Operational change impact and SME capacity plan.', owner: 'S. Omar' },
  { stakeholderId: 'SH-006', tier: 3, frequency: 'Monthly', format: 'Report', keyMessage: 'Data quality, taxonomy, and governance actions.', owner: 'A. Chen' },
]

export const budgetRecords = [
  {
    program: 'ERP Modernisation',
    allocated: 4200000,
    committed: 3350000,
    ftc: 1180000,
    eac: 4020000,
    monthly: [
      { month: 'Jan', planned: 220000, actual: 205000, forecast: 210000, notes: 'Mobilisation' },
      { month: 'Feb', planned: 360000, actual: 342000, forecast: 350000, notes: 'Design workshops' },
      { month: 'Mar', planned: 420000, actual: 455000, forecast: 448000, notes: 'Vendor acceleration' },
      { month: 'Apr', planned: 520000, actual: 545000, forecast: 540000, notes: 'Build team ramp' },
      { month: 'May', planned: 580000, actual: 612000, forecast: 605000, notes: 'Data migration cycle' },
      { month: 'Jun', planned: 610000, actual: 681000, forecast: 650000, notes: 'Forecast' },
    ],
  },
  {
    program: 'Digital Channels',
    allocated: 3100000,
    committed: 2200000,
    ftc: 1280000,
    eac: 2970000,
    monthly: [
      { month: 'Jan', planned: 140000, actual: 128000, forecast: 135000, notes: 'Discovery' },
      { month: 'Feb', planned: 240000, actual: 218000, forecast: 226000, notes: 'UX prototypes' },
      { month: 'Mar', planned: 310000, actual: 292000, forecast: 300000, notes: 'Build sprint 1' },
      { month: 'Apr', planned: 390000, actual: 374000, forecast: 382000, notes: 'Build sprint 2' },
      { month: 'May', planned: 430000, actual: 410000, forecast: 420000, notes: 'Beta readiness' },
      { month: 'Jun', planned: 470000, actual: 455000, forecast: 462000, notes: 'Forecast' },
    ],
  },
  {
    program: 'Cloud Migration',
    allocated: 2750000,
    committed: 2410000,
    ftc: 1040000,
    eac: 3070000,
    monthly: [
      { month: 'Jan', planned: 90000, actual: 86000, forecast: 88000, notes: 'Planning' },
      { month: 'Feb', planned: 180000, actual: 194000, forecast: 190000, notes: 'Landing zone' },
      { month: 'Mar', planned: 280000, actual: 326000, forecast: 310000, notes: 'Security controls' },
      { month: 'Apr', planned: 360000, actual: 421000, forecast: 405000, notes: 'Migration prep' },
      { month: 'May', planned: 420000, actual: 488000, forecast: 472000, notes: 'Exception backlog' },
      { month: 'Jun', planned: 460000, actual: 515000, forecast: 530000, notes: 'Forecast' },
    ],
  },
]

export const milestoneRegister = [
  { id: 'MS-001', name: 'Solution design approved', program: 'ERP Modernisation', owner: 'A. Chen', plannedDate: '2026-05-18', actualDate: '2026-05-16', status: 'Complete', percentComplete: 100 },
  { id: 'MS-002', name: 'Data migration cycle 2', program: 'ERP Modernisation', owner: 'L. Brooks', plannedDate: '2026-06-04', actualDate: '', status: 'At Risk', percentComplete: 62 },
  { id: 'MS-003', name: 'UAT entry gate', program: 'ERP Modernisation', owner: 'S. Omar', plannedDate: '2026-07-15', actualDate: '', status: 'In Progress', percentComplete: 35 },
  { id: 'MS-004', name: 'Journey prototypes approved', program: 'Digital Channels', owner: 'M. Evans', plannedDate: '2026-05-22', actualDate: '2026-05-20', status: 'Complete', percentComplete: 100 },
  { id: 'MS-005', name: 'Beta release', program: 'Digital Channels', owner: 'R. Singh', plannedDate: '2026-06-28', actualDate: '', status: 'In Progress', percentComplete: 55 },
  { id: 'MS-006', name: 'Public launch', program: 'Digital Channels', owner: 'N. Patel', plannedDate: '2026-09-12', actualDate: '', status: 'Not Started', percentComplete: 0 },
  { id: 'MS-007', name: 'Landing zone ready', program: 'Cloud Migration', owner: 'O. Siddiq', plannedDate: '2026-05-08', actualDate: '', status: 'Delayed', percentComplete: 88 },
  { id: 'MS-008', name: 'Security signoff', program: 'Cloud Migration', owner: 'R. Singh', plannedDate: '2026-06-10', actualDate: '', status: 'At Risk', percentComplete: 42 },
  { id: 'MS-009', name: 'Wave 1 migration complete', program: 'Cloud Migration', owner: 'L. Brooks', plannedDate: '2026-08-01', actualDate: '', status: 'Not Started', percentComplete: 0 },
]

export const reportHistorySeed = [
  { id: 'REP-001', title: 'April Portfolio Board Pack', date: '2026-04-30', preparedBy: 'PMO', sections: ['Executive Summary', 'Budget Summary', 'Top Risks'] },
  { id: 'REP-002', title: 'May Steering Snapshot', date: '2026-05-07', preparedBy: 'Nadia Patel', sections: ['Portfolio RAG Dashboard', 'Milestone Health', 'Actions & Decisions Log'] },
]

export const actionsLogSeed = [
  { id: 'ACT-001', action: 'Confirm ERP data migration recovery plan', owner: 'A. Chen', dueDate: '2026-05-20', status: 'Open', program: 'ERP Modernisation', raisedIn: 'Steering Committee' },
  { id: 'ACT-002', action: 'Approve cloud security exception backlog owner', owner: 'R. Singh', dueDate: '2026-05-14', status: 'Open', program: 'Cloud Migration', raisedIn: 'Risk Review' },
  { id: 'ACT-003', action: 'Publish digital beta launch comms', owner: 'M. Evans', dueDate: '2026-05-24', status: 'Closed', program: 'Digital Channels', raisedIn: 'Weekly Report' },
]
