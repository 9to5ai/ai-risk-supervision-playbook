import { describe, expect, it } from 'vitest';
import { calculateRisk, type Answers } from '../lib/scoring';
import { generatePlaybook } from '../lib/playbook';
import { generateMarkdownReport } from '../lib/markdown';

const answers: Answers = {
  q1: 3,
  q2: 3,
  q3: 4,
  q4: 3,
  q5: 2,
  q6: 2,
  q7: 2,
  q8: 2,
  q9: 2,
  q10: 2,
  q11: 2,
  q12: 2,
  q13: 2,
  q14: 2,
  q15: 3,
};

const score = calculateRisk(answers);
const playbook = generatePlaybook(answers, score);
const markdown = generateMarkdownReport(answers, score, playbook);

describe('generateMarkdownReport', () => {
  it('includes title', () => {
    expect(markdown).toContain('# AI Risk Supervision Playbook');
  });

  it('includes disclaimer', () => {
    expect(markdown).toContain('not legal advice');
  });

  it('includes supervisory intensity', () => {
    expect(markdown).toContain('Supervisory Intensity');
  });

  it('includes evidence requests', () => {
    expect(markdown).toContain('## Evidence Request List');
  });

  it('includes interview questions', () => {
    expect(markdown).toContain('## Interview Guide');
  });

  it('includes control checklist', () => {
    expect(markdown).toContain('## Control Checklist');
  });

  it('includes red flags', () => {
    expect(markdown).toContain('## Red Flags');
  });

  it('includes next steps', () => {
    expect(markdown).toContain('## Recommended Supervisory Next Steps');
  });
});
