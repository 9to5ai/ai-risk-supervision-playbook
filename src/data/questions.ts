export type RiskDimension =
  | 'institutionalImpact'
  | 'aiComplexityAutonomy'
  | 'governanceInventory'
  | 'controlEffectiveness'
  | 'thirdPartyOperationalResilience';

export type QuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'q8'
  | 'q9'
  | 'q10'
  | 'q11'
  | 'q12'
  | 'q13'
  | 'q14'
  | 'q15';

export interface Option {
  value: number;
  label: string;
}

export interface Question {
  id: QuestionId;
  section: string;
  prompt: string;
  riskLogic: string;
  riskDirection: 'direct' | 'inverse' | 'neutral';
  dimensions: RiskDimension[];
  options: Option[];
}

export const dimensionLabels: Record<RiskDimension, string> = {
  institutionalImpact: 'Institutional Impact',
  aiComplexityAutonomy: 'AI Complexity and Autonomy',
  governanceInventory: 'Governance and Inventory',
  controlEffectiveness: 'Control Effectiveness',
  thirdPartyOperationalResilience: 'Third-Party and Operational Resilience',
};

export const questions: Question[] = [
  {
    id: 'q1',
    section: 'Institution and Use Case Context',
    prompt: 'What type of institution is being reviewed?',
    riskLogic: 'Higher systemic footprint increases supervisory intensity.',
    riskDirection: 'direct',
    dimensions: ['institutionalImpact'],
    options: [
      { value: 1, label: 'Small fintech or payment firm' },
      { value: 2, label: 'Mid-sized financial institution' },
      { value: 3, label: 'Large bank, insurer, or capital markets institution' },
      { value: 4, label: 'Systemically important or cross-border institution' },
    ],
  },
  {
    id: 'q2',
    section: 'Institution and Use Case Context',
    prompt: 'What is the primary AI use case?',
    riskLogic: 'Customer-facing and material decisioning uses increase supervisory concern.',
    riskDirection: 'direct',
    dimensions: ['institutionalImpact'],
    options: [
      { value: 1, label: 'Internal productivity or knowledge search' },
      { value: 2, label: 'Risk, compliance, or operational decision support' },
      { value: 3, label: 'Customer-facing advice, service, or content generation' },
      { value: 4, label: 'Credit, underwriting, trading, fraud, AML, claims, or other material decisioning' },
    ],
  },
  {
    id: 'q3',
    section: 'Institution and Use Case Context',
    prompt: 'Who is affected by the AI output?',
    riskLogic: 'Direct customer, market, or counterparty impact increases conduct and prudential risk.',
    riskDirection: 'direct',
    dimensions: ['institutionalImpact'],
    options: [
      { value: 1, label: 'Internal staff only' },
      { value: 2, label: 'Operations or control teams' },
      { value: 3, label: 'Customers or counterparties indirectly' },
      { value: 4, label: 'Customers, counterparties, or markets directly' },
    ],
  },
  {
    id: 'q4',
    section: 'AI System Type',
    prompt: 'What kind of AI system is involved?',
    riskLogic: 'LLM and agentic systems require additional controls.',
    riskDirection: 'direct',
    dimensions: ['aiComplexityAutonomy'],
    options: [
      { value: 1, label: 'Traditional statistical or rules-assisted model' },
      { value: 2, label: 'Machine learning or deep learning model' },
      { value: 3, label: 'Generative AI / LLM application' },
      { value: 4, label: 'Agentic AI system with tool access or autonomous actions' },
    ],
  },
  {
    id: 'q5',
    section: 'AI System Type',
    prompt: 'How much autonomy does the system have?',
    riskLogic: 'Higher autonomy sharply increases risk. Autonomous live-system action triggers deep-dive controls.',
    riskDirection: 'direct',
    dimensions: ['aiComplexityAutonomy'],
    options: [
      { value: 1, label: 'Human drafts or decides; AI only assists' },
      { value: 2, label: 'AI recommends; human approves before action' },
      { value: 3, label: 'AI acts within limits, with sampling or post-review' },
      { value: 4, label: 'AI can act autonomously in live systems' },
    ],
  },
  {
    id: 'q6',
    section: 'AI System Type',
    prompt: 'What systems or tools can the AI access?',
    riskLogic: 'Tool access and privileged access increase excessive-agency, data leakage, and cyber risk.',
    riskDirection: 'direct',
    dimensions: ['aiComplexityAutonomy', 'thirdPartyOperationalResilience'],
    options: [
      { value: 1, label: 'Static public or internal documents only' },
      { value: 2, label: 'Internal data repositories or retrieval systems' },
      { value: 3, label: 'Business systems, customer records, or workflow tools' },
      { value: 4, label: 'Transactional systems, code execution, external communications, or privileged tools' },
    ],
  },
  {
    id: 'q7',
    section: 'Materiality and Risk Management',
    prompt: 'Has the institution identified and inventoried this AI use case?',
    riskLogic: 'Lack of identification or inventory is a major supervisory red flag.',
    riskDirection: 'inverse',
    dimensions: ['governanceInventory'],
    options: [
      { value: 1, label: 'No inventory exists' },
      { value: 2, label: 'Informal list exists' },
      { value: 3, label: 'Inventory exists but materiality is unclear' },
      { value: 4, label: 'Inventory includes owner, risk rating, purpose, model/system details, and review date' },
    ],
  },
  {
    id: 'q8',
    section: 'Materiality and Risk Management',
    prompt: 'Has the institution assessed risk materiality?',
    riskLogic: 'Materiality assessment is foundational.',
    riskDirection: 'inverse',
    dimensions: ['governanceInventory'],
    options: [
      { value: 1, label: 'No materiality assessment' },
      { value: 2, label: 'Basic qualitative assessment' },
      { value: 3, label: 'Documented assessment using consistent criteria' },
      { value: 4, label: 'Documented assessment with board/senior-management visibility for material AI' },
    ],
  },
  {
    id: 'q9',
    section: 'Materiality and Risk Management',
    prompt: 'Are governance and accountability clear?',
    riskLogic: 'Weak accountability increases supervisory concern.',
    riskDirection: 'inverse',
    dimensions: ['governanceInventory'],
    options: [
      { value: 1, label: 'No clear owner' },
      { value: 2, label: 'Business owner exists but controls are unclear' },
      { value: 3, label: 'First-line and second-line roles are documented' },
      { value: 4, label: 'Board/senior management oversight, business ownership, and independent challenge are clear' },
    ],
  },
  {
    id: 'q10',
    section: 'Controls',
    prompt: 'How strong are testing and validation controls?',
    riskLogic: 'Weak testing increases model risk, GenAI risk, and operational risk.',
    riskDirection: 'inverse',
    dimensions: ['controlEffectiveness'],
    options: [
      { value: 1, label: 'No documented testing' },
      { value: 2, label: 'Basic functional testing only' },
      { value: 3, label: 'Pre-deployment validation and documented limitations' },
      { value: 4, label: 'Independent validation, scenario testing, adversarial testing, and ongoing monitoring' },
    ],
  },
  {
    id: 'q11',
    section: 'Controls',
    prompt: 'Are explainability and transparency controls fit for the use case?',
    riskLogic: 'Transparency must be useful to users, reviewers, and supervisors.',
    riskDirection: 'inverse',
    dimensions: ['controlEffectiveness'],
    options: [
      { value: 1, label: 'No explainability or disclosure approach' },
      { value: 2, label: 'Generic disclosure only' },
      { value: 3, label: 'Explanations designed for users, reviewers, or supervisors' },
      { value: 4, label: 'Explanations are tested, role-specific, and connected to review/override processes' },
    ],
  },
  {
    id: 'q12',
    section: 'Controls',
    prompt: 'Is human oversight designed, not merely asserted?',
    riskLogic: 'Human in the loop without design is control theatre.',
    riskDirection: 'inverse',
    dimensions: ['controlEffectiveness'],
    options: [
      { value: 1, label: 'No human oversight' },
      { value: 2, label: 'Human in the loop exists but role is unclear' },
      { value: 3, label: 'Human review points are documented' },
      { value: 4, label: 'Reviewers have usable explanations, authority to override, escalation paths, and capacity' },
    ],
  },
  {
    id: 'q13',
    section: 'Controls',
    prompt: 'Are third-party and foundation-model dependencies managed?',
    riskLogic: 'Third-party opacity and concentration risk are key AI supervision concerns.',
    riskDirection: 'inverse',
    dimensions: ['thirdPartyOperationalResilience'],
    options: [
      { value: 1, label: 'Unknown or unmanaged dependencies' },
      { value: 2, label: 'Vendor identified but due diligence is limited' },
      { value: 3, label: 'Vendor risk, data, and contractual controls documented' },
      { value: 4, label: 'Concentration, fallback, audit rights, model changes, and exit plans are considered' },
    ],
  },
  {
    id: 'q14',
    section: 'Controls',
    prompt: 'Are monitoring, change management, and incident response in place?',
    riskLogic: 'Weak monitoring increases post-deployment risk.',
    riskDirection: 'inverse',
    dimensions: ['controlEffectiveness', 'thirdPartyOperationalResilience'],
    options: [
      { value: 1, label: 'No monitoring or incident process' },
      { value: 2, label: 'Informal monitoring' },
      { value: 3, label: 'Documented monitoring and change process' },
      { value: 4, label: 'Live monitoring, drift/quality thresholds, incident escalation, and periodic review' },
    ],
  },
  {
    id: 'q15',
    section: 'Review Objective',
    prompt: 'What is the supervisor’s current review objective?',
    riskLogic: 'The objective shapes output language and next steps, but does not change the risk score.',
    riskDirection: 'neutral',
    dimensions: [],
    options: [
      { value: 1, label: 'Initial market scan or exploratory review' },
      { value: 2, label: 'Off-site supervisory review' },
      { value: 3, label: 'Thematic review across firms' },
      { value: 4, label: 'On-site inspection or deep-dive examination' },
    ],
  },
];

export const questionById = Object.fromEntries(questions.map((question) => [question.id, question])) as Record<QuestionId, Question>;

export function getAnswerLabel(questionId: QuestionId, value: number | undefined): string {
  const question = questionById[questionId];
  return question.options.find((option) => option.value === value)?.label ?? 'Not answered';
}
