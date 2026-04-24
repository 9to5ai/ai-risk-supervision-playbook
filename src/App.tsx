import { useState } from 'react';
import { questions, type QuestionId } from './data/questions';
import type { Answers } from './lib/scoring';
import { Home } from './components/Home';
import { Results } from './components/Results';
import { Wizard } from './components/Wizard';

type View = 'home' | 'wizard' | 'results';

function hasAllAnswers(answers: Partial<Answers>): answers is Answers {
  return questions.every((question) => answers[question.id] !== undefined);
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  function handleAnswer(questionId: QuestionId, value: number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function handleBack() {
    if (view === 'wizard') {
      const answeredIds = questions.filter((question) => answers[question.id] !== undefined).map((question) => question.id);
      if (answeredIds.length === 0) {
        setView('home');
        return;
      }
      const lastAnswered = answeredIds[answeredIds.length - 1];
      setAnswers((current) => {
        const next = { ...current };
        delete next[lastAnswered];
        return next;
      });
    }
  }

  function complete() {
    setAnswers((current) => {
      if (hasAllAnswers(current)) {
        setView('results');
      }
      return current;
    });
  }

  function restart() {
    setAnswers({});
    setView('home');
  }

  if (view === 'home') {
    return <Home onStart={() => setView('wizard')} />;
  }

  if (view === 'results' && hasAllAnswers(answers)) {
    return <Results answers={answers} onRestart={restart} />;
  }

  return <Wizard answers={answers} onAnswer={handleAnswer} onBack={handleBack} onComplete={complete} />;
}
