import { describe, expect, it } from 'vitest';
import { calculateRisk, type Answers } from '../lib/scoring';
import { generatePlaybook } from '../lib/playbook';

const baseAnswers: Answers = {
  q1: 2,
  q2: 2,
  q3: 2,
  q4: 2,
  q5: 2,
  q6: 2,
  q7: 3,
  q8: 3,
  q9: 3,
  q10: 3,
  q11: 3,
  q12: 3,
  q13: 3,
  q14: 3,
  q15: 2,
};

function buildPlaybook(answers: Answers) {
  const score = calculateRisk(answers);
  return { score, playbook: generatePlaybook(answers, score) };
}

describe('generatePlaybook', () => {
  it('includes prompt injection evidence request for GenAI use cases', () => {
    const { playbook } = buildPlaybook({ ...baseAnswers, q4: 3 });

    expect(playbook.evidenceRequests).toContain('Prompt injection and jailbreak testing results.');
  });

  it('includes tool permission matrix for agentic AI use cases', () => {
    const { playbook } = buildPlaybook({ ...baseAnswers, q4: 4, q5: 4, q6: 4 });

    expect(playbook.evidenceRequests).toContain('Tool permission matrix covering data, systems, actions, approval thresholds, and privileged access.');
    expect(playbook.controlChecklist['Agentic AI Controls']).toContain('Tool permissions are least-privilege and mapped to approved tasks.');
  });

  it('includes human oversight red flag when oversight is weak', () => {
    const { playbook } = buildPlaybook({ ...baseAnswers, q12: 1 });

    expect(playbook.redFlags).toContain('Human oversight is asserted but not designed.');
  });

  it('includes vendor due diligence request when third-party dependency is weak', () => {
    const { playbook } = buildPlaybook({ ...baseAnswers, q13: 1 });

    expect(playbook.evidenceRequests).toContain('Third-party or foundation-model vendor due diligence, contractual controls, audit rights, model-change process, and exit plan.');
  });

  it('includes urgent next steps for immediate attention', () => {
    const { score, playbook } = buildPlaybook({
      ...baseAnswers,
      q1: 4,
      q2: 4,
      q3: 4,
      q4: 4,
      q5: 4,
      q6: 4,
      q7: 1,
      q8: 1,
      q9: 1,
      q10: 1,
      q12: 1,
      q13: 1,
      q14: 1,
      q15: 4,
    });

    expect(score.intensity).toBe('immediateAttention');
    expect(playbook.nextSteps).toContain('Request an urgent briefing on live exposure, affected customers, systems, and current control status.');
  });

  it('does not overstate urgency for monitor results', () => {
    const { score, playbook } = buildPlaybook({
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
    });

    expect(score.intensity).toBe('monitor');
    expect(playbook.nextSteps.join(' ')).not.toMatch(/urgent|restriction|escalate internally/i);
  });
});
