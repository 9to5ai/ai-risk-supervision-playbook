interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const width = `${Math.round((current / total) * 100)}%`;

  return (
    <div className="progress" aria-label={`Question ${current} of ${total}`}>
      <div className="progress__meta">
        <span>Question {current}</span>
        <span>{total} total</span>
      </div>
      <div className="progress__track">
        <div className="progress__bar" style={{ width }} />
      </div>
    </div>
  );
}
