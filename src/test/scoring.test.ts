import { describe, expect, it } from 'vitest';
import { calculateRisk, type Answers } from '../lib/scoring';

const lowRiskAnswers: Answers = {
  q1: 1,
  q2: 1,
  q3: 1,
  q4: 1,
  q5: 1,
  q6: 1,
  q7: 4,
  q8: 4,
  q9: 4,
  q10: 4,
  q11: 4,
  q12: 4,
  q13: 4,
  q14: 4,
  q15: 1,
};

const moderateAnswers: Answers = {
  ...lowRiskAnswers,
  q1: 2,
  q2: 2,
  q3: 2,
  q4: 2,
  q7: 3,
  q8: 3,
  q10: 3,
  q14: 3,
  q15: 2,
};

const weakControls = {
  q7: 1,
  q8: 1,
  q9: 1,
  q10: 1,
  q11: 1,
  q12: 1,
  q13: 1,
  q14: 1,
};

describe('calculateRisk', () => {
  it('returns monitor for a low-risk internal productivity case', () => {
    const result = calculateRisk(lowRiskAnswers);

    expect(result.intensity).toBe('monitor');
    expect(result.totalRiskScore).toBeLessThan(35);
  });

  it('returns targetedReview for a moderate case', () => {
    const result = calculateRisk(moderateAnswers);

    expect(result.intensity).toBe('targetedReview');
    expect(result.totalRiskScore).toBeGreaterThanOrEqual(35);
    expect(result.totalRiskScore).toBeLessThan(60);
  });

  it('returns deepDive for customer-impacting GenAI with weak controls', () => {
    const result = calculateRisk({
      ...lowRiskAnswers,
      ...weakControls,
      q1: 3,
      q2: 3,
      q3: 4,
      q4: 3,
      q5: 2,
      q6: 2,
      q15: 4,
    });

    expect(result.intensity).toBe('deepDive');
    expect(result.topRiskDrivers.join(' ')).toMatch(/customer|GenAI|control/i);
  });

  it('returns immediateAttention for agentic AI with privileged tool access and weak oversight', () => {
    const result = calculateRisk({
      ...lowRiskAnswers,
      ...weakControls,
      q1: 4,
      q2: 4,
      q3: 4,
      q4: 4,
      q5: 4,
      q6: 4,
      q12: 1,
      q14: 1,
    });

    expect(result.intensity).toBe('immediateAttention');
    expect(result.redFlags).toContain('Agent has privileged tool access and weak monitoring.');
  });

  it('creates red flags for no inventory and no materiality for material AI', () => {
    const result = calculateRisk({
      ...lowRiskAnswers,
      q2: 4,
      q3: 4,
      q7: 1,
      q8: 1,
    });

    expect(result.redFlags).toContain('No inventory and no materiality assessment for material AI.');
  });

  it('treats autonomous live-system action as high autonomy risk', () => {
    const result = calculateRisk({ ...lowRiskAnswers, q5: 4 });

    expect(result.dimensions.aiComplexityAutonomy).toBeGreaterThanOrEqual(50);
    expect(result.topRiskDrivers).toContain('Autonomous live-system action increases speed, oversight, and error-propagation risk.');
  });

  it('keeps all dimension scores between 0 and 100', () => {
    const result = calculateRisk({ ...lowRiskAnswers, ...weakControls, q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4 });

    Object.values(result.dimensions).forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it('keeps total risk score between 0 and 100', () => {
    const result = calculateRisk({ ...lowRiskAnswers, ...weakControls, q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4 });

    expect(result.totalRiskScore).toBeGreaterThanOrEqual(0);
    expect(result.totalRiskScore).toBeLessThanOrEqual(100);
  });
});
