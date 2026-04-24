import { sourceFrameworkNotes } from '../data/sourceNotes';
import { dimensionLabels, type RiskDimension } from '../data/questions';
import { intensityLabel, type Answers, type ScoreResult } from './scoring';
import type { Playbook } from './playbook';

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function grouped(groups: Record<string, string[]>): string {
  return Object.entries(groups)
    .map(([group, items]) => `### ${group}\n${list(items)}`)
    .join('\n\n');
}

function dimensionList(score: ScoreResult): string {
  return (Object.keys(score.dimensions) as RiskDimension[])
    .map((dimension) => `- ${dimensionLabels[dimension]}: ${score.dimensions[dimension]} / 100`)
    .join('\n');
}

export function generateMarkdownReport(_answers: Answers, score: ScoreResult, playbook: Playbook): string {
  const generatedDate = new Date().toISOString().slice(0, 10);

  return `# AI Risk Supervision Playbook

Generated: ${generatedDate}

Disclaimer: This tool is not legal advice and does not replace supervisory judgment. It is a structured planning aid. Do not include confidential supervisory or institution data in the tool.

## Supervisory View

- Supervisory Intensity: ${intensityLabel(score.intensity)}
- Risk Score: ${score.totalRiskScore} / 100

${playbook.diagnosis}

### Dimension Scores
${dimensionList(score)}

### Top Risk Drivers
${list(score.topRiskDrivers)}

## AI Profile Summary
${list(playbook.profileSummary)}

## Evidence Request List
${list(playbook.evidenceRequests)}

## Interview Guide
${grouped(playbook.interviewQuestions)}

## Control Checklist
${grouped(playbook.controlChecklist)}

## Red Flags
${playbook.redFlags.length ? list(playbook.redFlags) : '- No critical red flags identified from the structured answers.'}

## Recommended Supervisory Next Steps
${list(playbook.nextSteps)}

## Source Framework Notes
${list(sourceFrameworkNotes)}
`;
}
