import { questions, type QuestionId } from '../data/questions';
import type { Answers } from '../lib/scoring';
import { OptionButton } from './OptionButton';
import { ProgressBar } from './ProgressBar';

interface WizardProps {
  answers: Partial<Answers>;
  onAnswer: (questionId: QuestionId, value: number) => void;
  onBack: () => void;
  onComplete: () => void;
}

export function Wizard({ answers, onAnswer, onBack, onComplete }: WizardProps) {
  const answeredCount = questions.findIndex((question) => answers[question.id] === undefined);
  const currentIndex = answeredCount === -1 ? questions.length - 1 : answeredCount;
  const currentQuestion = questions[currentIndex];
  const currentValue = answers[currentQuestion.id];
  const isLast = currentIndex === questions.length - 1;

  function selectAnswer(value: number) {
    onAnswer(currentQuestion.id, value);
    if (isLast) {
      window.setTimeout(onComplete, 80);
    }
  }

  return (
    <main className="shell wizard-shell">
      <section className="card wizard-card">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <div className="question-meta">
          <span>{currentQuestion.section}</span>
          <span>{currentQuestion.riskLogic}</span>
        </div>
        <h1>{currentQuestion.prompt}</h1>
        <div className="option-list">
          {currentQuestion.options.map((option) => (
            <OptionButton
              key={option.value}
              option={option}
              selected={currentValue === option.value}
              onSelect={() => selectAnswer(option.value)}
            />
          ))}
        </div>
        <div className="wizard-actions">
          <button className="secondary-button" onClick={onBack} type="button">
            {currentIndex === 0 ? 'Back to home' : 'Back'}
          </button>
          <span>{isLast ? 'Results appear after this answer.' : 'Select one answer to continue.'}</span>
        </div>
      </section>
    </main>
  );
}
