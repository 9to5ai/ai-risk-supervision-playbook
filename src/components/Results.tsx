import { useMemo, useState } from 'react';
import { dimensionLabels, type RiskDimension } from '../data/questions';
import { generateMarkdownReport } from '../lib/markdown';
import { generatePlaybook } from '../lib/playbook';
import { calculateRisk, type Answers } from '../lib/scoring';
import { MarkdownPreview } from './MarkdownPreview';
import { RiskBadge } from './RiskBadge';

interface ResultsProps {
  answers: Answers;
  onRestart: () => void;
}

export function Results({ answers, onRestart }: ResultsProps) {
  const score = useMemo(() => calculateRisk(answers), [answers]);
  const playbook = useMemo(() => generatePlaybook(answers, score), [answers, score]);
  const markdown = useMemo(() => generateMarkdownReport(answers, score, playbook), [answers, score, playbook]);
  const [copyStatus, setCopyStatus] = useState('');

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus('Copied.');
    } catch {
      setCopyStatus('Copy failed. Select the report below and copy manually.');
    }
  }

  return (
    <main className="shell results-shell">
      <section className="card results-hero">
        <div>
          <div className="eyebrow">Generated supervisory playbook</div>
          <h1>AI Risk Supervision Playbook</h1>
          <p>{playbook.diagnosis}</p>
        </div>
        <div className="score-panel">
          <RiskBadge intensity={score.intensity} />
          <strong>{score.totalRiskScore} / 100</strong>
          <span>Risk score</span>
        </div>
      </section>

      <section className="results-grid">
        <article className="card section-card">
          <h2>Top risk drivers</h2>
          <ul>{score.topRiskDrivers.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="card section-card">
          <h2>Dimension scores</h2>
          <div className="dimension-list">
            {(Object.keys(score.dimensions) as RiskDimension[]).map((dimension) => (
              <div className="dimension-row" key={dimension}>
                <span>{dimensionLabels[dimension]}</span>
                <strong>{score.dimensions[dimension]}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <PlaybookSection title="AI profile summary" items={playbook.profileSummary} />
      <PlaybookSection title="Evidence request list" items={playbook.evidenceRequests} />
      <GroupedSection title="Interview guide" groups={playbook.interviewQuestions} />
      <GroupedSection title="Control checklist" groups={playbook.controlChecklist} />
      <PlaybookSection title="Red flags" items={playbook.redFlags.length ? playbook.redFlags : ['No critical red flags identified from the structured answers.']} tone="red" />
      <PlaybookSection title="Recommended supervisory next steps" items={playbook.nextSteps} />

      <section className="card markdown-card">
        <div className="markdown-card__header">
          <div>
            <h2>Copyable Markdown report</h2>
            <p>Includes profile, score, risk drivers, evidence requests, interviews, checklist, red flags, next steps, and source notes.</p>
          </div>
          <button className="primary-button" onClick={copyMarkdown} type="button">
            Copy playbook as Markdown
          </button>
        </div>
        {copyStatus && <p className="copy-status">{copyStatus}</p>}
        <MarkdownPreview markdown={markdown} />
      </section>

      <div className="restart-row">
        <button className="secondary-button" onClick={onRestart} type="button">
          Restart
        </button>
      </div>
    </main>
  );
}

function PlaybookSection({ title, items, tone }: { title: string; items: string[]; tone?: 'red' }) {
  return (
    <section className={`card section-card ${tone === 'red' ? 'section-card--red' : ''}`}>
      <h2>{title}</h2>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

function GroupedSection({ title, groups }: { title: string; groups: Record<string, string[]> }) {
  return (
    <section className="card section-card">
      <h2>{title}</h2>
      <div className="group-list">
        {Object.entries(groups).map(([group, items]) => (
          <div className="group" key={group}>
            <h3>{group}</h3>
            <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
