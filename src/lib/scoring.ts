import { dimensionLabels, questionById, type QuestionId, type RiskDimension } from '../data/questions';

export type { RiskDimension } from '../data/questions';
export type Answers = Record<QuestionId, number>;

export type SupervisoryIntensity = 'monitor' | 'targetedReview' | 'deepDive' | 'immediateAttention';
export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

export interface ScoreResult {
  intensity: SupervisoryIntensity;
  totalRiskScore: number;
  dimensions: Record<RiskDimension, number>;
  topRiskDrivers: string[];
  redFlags: string[];
}

const weights: Record<RiskDimension, number> = {
  institutionalImpact: 1.2,
  aiComplexityAutonomy: 1.5,
  governanceInventory: 1.5,
  controlEffectiveness: 1.5,
  thirdPartyOperationalResilience: 1.2,
};

const dimensionQuestionIds: Record<RiskDimension, QuestionId[]> = {
  institutionalImpact: ['q1', 'q2', 'q3'],
  aiComplexityAutonomy: ['q4', 'q5', 'q6'],
  governanceInventory: ['q7', 'q8', 'q9'],
  controlEffectiveness: ['q10', 'q11', 'q12', 'q14'],
  thirdPartyOperationalResilience: ['q13', 'q14', 'q6'],
};

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function riskContribution(questionId: QuestionId, answers: Answers): number {
  const question = questionById[questionId];
  const selected = answers[questionId] ?? 1;

  if (question.riskDirection === 'inverse') {
    return 5 - selected;
  }

  if (question.riskDirection === 'neutral') {
    return 0;
  }

  return selected;
}

function calculateDimensionScore(dimension: RiskDimension, answers: Answers): number {
  const contributions = dimensionQuestionIds[dimension].map((questionId) => riskContribution(questionId, answers));
  const average = contributions.reduce((sum, value) => sum + value, 0) / contributions.length;
  return clampScore((average / 4) * 100);
}

function hasMaterialDecisioning(answers: Answers): boolean {
  return answers.q2 === 4;
}

function hasDirectCustomerMarketImpact(answers: Answers): boolean {
  return answers.q3 === 4;
}

function buildRedFlags(answers: Answers): string[] {
  const redFlags: string[] = [];

  if (hasMaterialDecisioning(answers) && answers.q7 === 1 && answers.q8 === 1) {
    redFlags.push('No inventory and no materiality assessment for material AI.');
  } else if ((answers.q2 >= 3 || answers.q3 >= 3) && (answers.q7 <= 2 || answers.q8 <= 2)) {
    redFlags.push('Inventory or materiality evidence is weak for a customer-impacting or higher-risk AI use case.');
  }

  if (answers.q5 === 4 && answers.q12 <= 2) {
    redFlags.push('Autonomous AI acts in live systems with weak oversight.');
  }

  if (hasMaterialDecisioning(answers) && hasDirectCustomerMarketImpact(answers) && answers.q10 === 1) {
    redFlags.push('Customer or market-impacting material AI has no documented testing or validation.');
  }

  if (answers.q4 === 4 && answers.q6 === 4 && answers.q14 <= 2) {
    redFlags.push('Agent has privileged tool access and weak monitoring.');
  }

  if (hasMaterialDecisioning(answers) && answers.q9 === 1) {
    redFlags.push('No clear owner for high-impact AI.');
  }

  if (hasMaterialDecisioning(answers) && answers.q13 === 1) {
    redFlags.push('Third-party foundation model reliance is unmanaged for material or GenAI use.');
  }

  return redFlags;
}

function buildRiskDrivers(answers: Answers, dimensions: Record<RiskDimension, number>): string[] {
  const drivers: string[] = [];

  if (answers.q5 === 4) {
    drivers.push('Autonomous live-system action increases speed, oversight, and error-propagation risk.');
  }

  if (answers.q6 >= 3) {
    drivers.push('AI has access to business systems, customer records, workflow tools, or privileged actions.');
  }

  if (answers.q4 === 4) {
    drivers.push('Agentic AI introduces excessive-agency, tool-use, and compounding-error risk.');
  } else if (answers.q4 === 3) {
    drivers.push('GenAI / LLM use introduces hallucination, prompt-injection, leakage, and output-quality risk.');
  }

  if (answers.q3 >= 3) {
    drivers.push('Customer, counterparty, market, or operational impact increases supervisory materiality.');
  }

  if (answers.q10 <= 2 || answers.q12 <= 2 || answers.q14 <= 2) {
    drivers.push('Control evidence is incomplete or unproven across testing, oversight, monitoring, or incident response.');
  }

  if (answers.q7 <= 2 || answers.q8 <= 2) {
    drivers.push('AI identification, inventory, or materiality assessment is weak.');
  }

  const weakDimension = (Object.keys(dimensions) as RiskDimension[])
    .filter((dimension) => dimensions[dimension] >= 67)
    .sort((a, b) => dimensions[b] - dimensions[a])[0];

  if (weakDimension) {
    drivers.push(`${dimensionLabels[weakDimension]} is a high-scoring risk dimension.`);
  }

  return Array.from(new Set(drivers)).slice(0, 4);
}

function chooseIntensity(totalRiskScore: number, redFlags: string[], answers: Answers): SupervisoryIntensity {
  const immediateFlags = new Set([
    'No inventory and no materiality assessment for material AI.',
    'Autonomous AI acts in live systems with weak oversight.',
    'Customer or market-impacting material AI has no documented testing or validation.',
    'Agent has privileged tool access and weak monitoring.',
    'No clear owner for high-impact AI.',
    'Third-party foundation model reliance is unmanaged for material or GenAI use.',
  ]);

  if (redFlags.some((flag) => immediateFlags.has(flag))) {
    return 'immediateAttention';
  }

  if (totalRiskScore >= 67 || (answers.q4 >= 3 && answers.q3 >= 3 && (answers.q10 <= 2 || answers.q12 <= 2))) {
    return 'deepDive';
  }

  if (totalRiskScore >= 35 || redFlags.length > 0) {
    return 'targetedReview';
  }

  return 'monitor';
}

export function intensityLabel(intensity: SupervisoryIntensity): string {
  const labels: Record<SupervisoryIntensity, string> = {
    monitor: 'Monitor',
    targetedReview: 'Targeted Review',
    deepDive: 'Deep Dive',
    immediateAttention: 'Immediate Supervisory Attention',
  };
  return labels[intensity];
}

export function riskLevelForScore(score: number): RiskLevel {
  if (score >= 75) return 'high';
  if (score >= 55) return 'elevated';
  if (score >= 35) return 'moderate';
  return 'low';
}

export function calculateRisk(answers: Answers): ScoreResult {
  const dimensions = (Object.keys(weights) as RiskDimension[]).reduce((accumulator, dimension) => {
    accumulator[dimension] = calculateDimensionScore(dimension, answers);
    return accumulator;
  }, {} as Record<RiskDimension, number>);

  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const weightedScore = (Object.keys(weights) as RiskDimension[]).reduce(
    (sum, dimension) => sum + dimensions[dimension] * weights[dimension],
    0,
  );
  const totalRiskScore = clampScore(weightedScore / totalWeight);
  const redFlags = buildRedFlags(answers);
  const topRiskDrivers = buildRiskDrivers(answers, dimensions);
  const intensity = chooseIntensity(totalRiskScore, redFlags, answers);

  return {
    intensity,
    totalRiskScore,
    dimensions,
    topRiskDrivers,
    redFlags,
  };
}
