interface HomeProps {
  onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
  return (
    <main className="home shell">
      <section className="hero card">
        <div className="eyebrow">Structured supervisory planning aid</div>
        <h1>AI Risk Supervision Playbook</h1>
        <p className="hero__lede">
          A practical supervision planner for AI, GenAI, and agentic systems in financial institutions.
        </p>
        <p className="hero__copy">
          Answer a short set of supervisory questions. Get a risk-based playbook covering evidence requests,
          interview questions, control checks, red flags, and next actions.
        </p>
        <div className="hero__actions">
          <button className="primary-button" onClick={onStart} type="button">
            Start playbook
          </button>
          <span>No login. No backend. No confidential data required.</span>
        </div>
      </section>

      <section className="home-grid">
        <div className="card mini-card">
          <h2>Built for supervisors</h2>
          <p>For regulators, central-bank teams, prudential supervisors, conduct supervisors, and policy analysts.</p>
        </div>
        <div className="card mini-card">
          <h2>Evidence over slogans</h2>
          <p>Turns AI governance themes into evidence requests, challenge questions, control checks, and red flags.</p>
        </div>
        <div className="card mini-card">
          <h2>Agentic-aware</h2>
          <p>Handles LLMs, tool access, autonomy boundaries, permission matrices, kill switches, and runtime logs.</p>
        </div>
      </section>

      <p className="disclaimer">
        This tool is not legal advice and does not replace supervisory judgment. It is a structured planning aid.
      </p>
    </main>
  );
}
