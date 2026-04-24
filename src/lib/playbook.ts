import { dimensionLabels, getAnswerLabel, type RiskDimension } from '../data/questions';
import { intensityLabel, type Answers, type ScoreResult } from './scoring';

export interface Playbook {
  diagnosis: string;
  profileSummary: string[];
  evidenceRequests: string[];
  interviewQuestions: Record<string, string[]>;
  controlChecklist: Record<string, string[]>;
  redFlags: string[];
  nextSteps: string[];
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items));
}

function isGenAI(answers: Answers): boolean {
  return answers.q4 >= 3;
}

function isAgentic(answers: Answers): boolean {
  return answers.q4 === 4 || answers.q5 >= 3 || answers.q6 >= 3;
}

function weakestDimension(score: ScoreResult): RiskDimension {
  return (Object.keys(score.dimensions) as RiskDimension[]).sort(
    (a, b) => score.dimensions[b] - score.dimensions[a],
  )[0];
}

function diagnosisFor(answers: Answers, score: ScoreResult): string {
  const weakest = dimensionLabels[weakestDimension(score)];
  const label = intensityLabel(score.intensity);

  if (score.intensity === 'immediateAttention') {
    return `This profile warrants ${label}. The combination of material exposure, weak evidence, and critical red flags means the supervisor should first establish live exposure, control status, accountability, and whether temporary constraints or remediation commitments are needed.`;
  }

  if (score.intensity === 'deepDive') {
    return `This profile warrants a Deep Dive. The use case combines ${isAgentic(answers) ? 'agentic or tool-using AI' : isGenAI(answers) ? 'GenAI / LLM complexity' : 'model complexity'} with meaningful institutional or customer impact. The priority is to verify what is at risk, whether the use case has been classified correctly, and whether controls are real rather than asserted. The weakest dimension is ${weakest}.`;
  }

  if (score.intensity === 'targetedReview') {
    return `This profile warrants a Targeted Review. The use case is not necessarily urgent, but one or more controls, inventory, accountability, or operational-resilience elements require evidence-based challenge. Focus the review on ${weakest}.`;
  }

  return 'This profile is suitable for monitoring. The use case appears lower materiality and controls are mostly adequate. Supervisory work should confirm the inventory entry, classification, accountable owner, and next scheduled review date without overstating urgency.';
}

function profileSummary(answers: Answers): string[] {
  return [
    `Institution type: ${getAnswerLabel('q1', answers.q1)}`,
    `Use case: ${getAnswerLabel('q2', answers.q2)}`,
    `Affected parties: ${getAnswerLabel('q3', answers.q3)}`,
    `System type: ${getAnswerLabel('q4', answers.q4)}`,
    `Autonomy: ${getAnswerLabel('q5', answers.q5)}`,
    `Tool/system access: ${getAnswerLabel('q6', answers.q6)}`,
    `Inventory: ${getAnswerLabel('q7', answers.q7)}`,
    `Materiality assessment: ${getAnswerLabel('q8', answers.q8)}`,
    `Governance/accountability: ${getAnswerLabel('q9', answers.q9)}`,
    `Testing and validation: ${getAnswerLabel('q10', answers.q10)}`,
    `Explainability/transparency: ${getAnswerLabel('q11', answers.q11)}`,
    `Human oversight: ${getAnswerLabel('q12', answers.q12)}`,
    `Third-party dependency: ${getAnswerLabel('q13', answers.q13)}`,
    `Monitoring/change/incident response: ${getAnswerLabel('q14', answers.q14)}`,
    `Review objective: ${getAnswerLabel('q15', answers.q15)}`,
  ];
}

function evidenceRequestsFor(answers: Answers): string[] {
  const evidence = [
    'AI use case inventory entry including owner, purpose, model/system type, vendor, risk rating, deployment status, and review date.',
    'Risk materiality assessment and criteria used to classify the AI use case.',
    'Business owner and senior accountable owner record.',
    'Model/system documentation covering intended use, prohibited use, users, data, limitations, and known failure modes.',
    'Data sources, retrieval sources, data-quality assessment, and data lineage documentation.',
    'Testing and validation report, including scenario tests, performance limits, and acceptance criteria.',
    'Human oversight design showing review points, override rights, escalation paths, and capacity assumptions.',
    'Change management records for prompts, model versions, data sources, tools, and workflow changes.',
    'Monitoring metrics, thresholds, exception reports, and escalation evidence.',
    'Incident response process for AI failures, customer harm, cyber events, data leakage, and model/system degradation.',
    'Board or senior-management reporting pack for material AI, if applicable.',
    'Third-party or foundation-model vendor due diligence, contractual controls, audit rights, model-change process, and exit plan.',
  ];

  if (isGenAI(answers)) {
    evidence.push(
      'Prompt/instruction design documentation and prohibited prompt patterns.',
      'Hallucination and factuality evaluation results.',
      'Prompt injection and jailbreak testing results.',
      'Retrieval source controls and knowledge-base update process.',
      'Sensitive-data leakage controls for prompts, outputs, embeddings, and logs.',
      'Output quality monitoring and acceptable use policy.',
    );
  }

  if (isAgentic(answers)) {
    evidence.push(
      'Tool permission matrix covering data, systems, actions, approval thresholds, and privileged access.',
      'Autonomy boundaries, action approval thresholds, and prohibited actions.',
      'Logs of agent plans, prompts, tool calls, actions, approvals, errors, and overrides.',
      'Rollback or kill-switch procedure for unsafe or unintended agent actions.',
      'Escalation design for failed, ambiguous, or high-impact agent decisions.',
      'Adversarial testing of agent behaviour, excessive agency, and compounding-error scenarios.',
    );
  }

  if (answers.q10 <= 2) evidence.push('Evidence that pre-deployment validation extends beyond basic functional testing.');
  if (answers.q14 <= 2) evidence.push('Live monitoring design with thresholds, alert ownership, incident severity levels, and periodic review cadence.');

  return unique(evidence).slice(0, isAgentic(answers) ? 22 : isGenAI(answers) ? 19 : 16);
}

function interviewQuestionsFor(answers: Answers): Record<string, string[]> {
  const questions: Record<string, string[]> = {
    'Board / Senior Management': [
      'Which AI risks are material to the institution?',
      'How does the board or senior management receive visibility over material AI use?',
      'What risk appetite applies to AI systems that affect customers, markets, or critical operations?',
      'What would cause management to pause, restrict, or withdraw this AI system?',
    ],
    'Business Owner / First Line': [
      'What problem is the AI system solving, and what decisions or actions does it influence?',
      'What are the known limitations, failure modes, and prohibited uses?',
      'How do users challenge, override, or escalate AI output?',
      'How do you know the system is working safely in production?',
    ],
    'Risk / Compliance / Model Risk / Second Line': [
      'How is AI identified and inventoried across the institution?',
      'How is materiality assessed and updated when the use case changes?',
      'What independent challenge occurs before deployment and after material changes?',
      'What monitoring thresholds trigger escalation or remediation?',
    ],
    'Technology / Cyber / Data Teams': [
      'What systems, data, and tools can the AI access?',
      'How are permissions limited and reviewed?',
      'How are prompts, outputs, retrieval, tool calls, and approvals logged?',
      'What controls exist for prompt injection, data leakage, unauthorized actions, and model/provider changes?',
    ],
    'Internal Audit': [
      'Has AI governance or this AI use case been audited?',
      'What deficiencies were found and how severe were they?',
      'Are remediation actions tracked to closure with accountable owners?',
    ],
  };

  if (isAgentic(answers)) {
    questions['Technology / Cyber / Data Teams'].push('Which actions require human approval before execution, and how is that enforced technically?');
    questions['Business Owner / First Line'].push('What compounding-error or excessive-agency scenarios have been tested?');
  }

  return questions;
}

function checklistFor(answers: Answers): Record<string, string[]> {
  const checklist: Record<string, string[]> = {
    'Identification and Inventory': [
      'AI use cases are identified across business units.',
      'Inventory includes owner, purpose, model/system type, vendor, data, risk rating, deployment status, and review date.',
      'Materiality is updated when use, customer impact, autonomy, tools, or context changes.',
    ],
    'Governance and Accountability': [
      'Board/senior management has visibility over material AI risk.',
      'First-line ownership is clear.',
      'Second-line challenge is documented.',
      'AI risk appetite is defined and linked to escalation decisions.',
    ],
    'Data and Model/System Lifecycle': [
      'Data provenance and quality are assessed.',
      'Intended use, prohibited use, and limitations are documented.',
      'Pre-deployment testing is documented.',
      'Independent validation occurs for material AI.',
      'Change management controls exist for model, prompt, data, tool, and workflow changes.',
    ],
    'Human Oversight': [
      'Human reviewers understand their role.',
      'Reviewers receive usable explanations.',
      'Reviewers have authority to override.',
      'Review capacity is adequate for system speed and volume.',
      'Escalation paths are defined.',
    ],
    'Monitoring and Incident Response': [
      'Performance, drift, quality, fairness, and operational metrics are monitored.',
      'Thresholds trigger escalation.',
      'Incidents are classified and reported.',
      'Lessons learned feed into model/system updates.',
    ],
  };

  if (isGenAI(answers)) {
    checklist['GenAI Controls'] = [
      'Hallucination risk is tested.',
      'Prompt injection is tested.',
      'Retrieval sources are controlled.',
      'Sensitive information is protected.',
      'Output quality is monitored.',
      'Acceptable use rules are documented and enforced.',
    ];
  }

  if (isAgentic(answers)) {
    checklist['Agentic AI Controls'] = [
      'Tool permissions are least-privilege and mapped to approved tasks.',
      'Agent actions are logged.',
      'Autonomy boundaries are explicit.',
      'Human approval is required for high-impact actions.',
      'Kill switch / rollback exists.',
      'Compounding-error scenarios are tested.',
      'Excessive-agency risk is assessed.',
    ];
  }

  return checklist;
}

function redFlagsFor(answers: Answers, score: ScoreResult): string[] {
  const redFlags = [...score.redFlags];

  if (answers.q12 <= 2) redFlags.push('Human oversight is asserted but not designed.');
  if (answers.q10 <= 2) redFlags.push('No evidence of validation beyond basic or undocumented testing.');
  if (isGenAI(answers) && answers.q10 <= 2) redFlags.push('No prompt injection or hallucination testing for GenAI.');
  if (answers.q6 >= 3) redFlags.push('Tool permissions or business-system access may be broader than necessary.');
  if (answers.q11 <= 2) redFlags.push('Explainability is generic and not useful to reviewers or supervisors.');
  if (answers.q14 <= 2) redFlags.push('Monitoring exists only informally or lacks thresholds and escalation.');
  if (answers.q13 <= 2) redFlags.push('Vendor dependency is material but due diligence, audit rights, or exit planning is weak.');

  return unique(redFlags);
}

function nextStepsFor(score: ScoreResult): string[] {
  if (score.intensity === 'immediateAttention') {
    return [
      'Request an urgent briefing on live exposure, affected customers, systems, and current control status.',
      'Ask the institution to identify whether the AI system is live, paused, restricted, or in pilot.',
      'Request logs, incident history, validation evidence, monitoring alerts, and control-owner attestations.',
      'Challenge whether temporary restrictions, enhanced monitoring, or remediation commitments are appropriate.',
      'Escalate internally within the supervisory authority and agree the decision timeline.',
    ];
  }

  if (score.intensity === 'deepDive') {
    return [
      'Launch a structured review of the use case and its control environment.',
      'Interview first line, second line, technology/cyber/data teams, and senior management.',
      'Review testing, validation, human oversight, monitoring, and incident response evidence.',
      'Compare control design with runtime logs, exceptions, user overrides, and production monitoring.',
      'Require a remediation timeline for material gaps and define supervisory follow-up points.',
    ];
  }

  if (score.intensity === 'targetedReview') {
    return [
      'Send a focused evidence request covering the weakest risk dimensions.',
      'Hold a supervisory meeting with the business owner and second line.',
      'Review the inventory entry, materiality assessment, and accountability map.',
      'Request remediation actions for weak or undocumented controls.',
      'Set a follow-up date to confirm closure or escalation need.',
    ];
  }

  return [
    'Request the AI inventory extract and confirm the use-case classification.',
    'Confirm the accountable owner, next scheduled review date, and materiality rationale.',
    'Track maturity over the next supervisory cycle.',
    'Ask for notification if scope, autonomy, customer impact, or tool access changes.',
  ];
}

export function generatePlaybook(answers: Answers, score: ScoreResult): Playbook {
  return {
    diagnosis: diagnosisFor(answers, score),
    profileSummary: profileSummary(answers),
    evidenceRequests: evidenceRequestsFor(answers),
    interviewQuestions: interviewQuestionsFor(answers),
    controlChecklist: checklistFor(answers),
    redFlags: redFlagsFor(answers, score),
    nextSteps: nextStepsFor(score),
  };
}
