import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import WebcamGesturePanel from './components/WebcamGesturePanel';
import QuizCard from './components/QuizCard';
import ScorePanel from './components/ScorePanel';
import ConceptPanel from './components/ConceptPanel';
import ResultDashboard from './components/ResultDashboard';
import { questions } from './data/questions';
import { ACTION_COOLDOWN_MS, GESTURE_ACTIONS, MIN_GESTURE_CONFIDENCE } from './constants/gestures';
import { calculateMastery, calculateUtility, chooseNextQuestion, getFeedbackText } from './utils/adaptiveAgent';
import { useGestureRecognizer } from './hooks/useGestureRecognizer';

const initialQuestion = questions.find((question) => question.difficulty === 1) || questions[0];

export default function App() {
  const {
    videoRef,
    canvasRef,
    gesture,
    status,
    error,
    startCamera,
    stopCamera,
    isRunning,
  } = useGestureRecognizer();

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [askedIds, setAskedIds] = useState([initialQuestion.id]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [streak, setStreak] = useState(0);
  const [lastAction, setLastAction] = useState('');
  const lastGestureAtRef = useRef(0);

  const score = history.filter((item) => item.isCorrect).length;
  const wrong = history.filter((item) => !item.isCorrect && !item.skipped).length;
  const skipped = history.filter((item) => item.skipped).length;
  const mastery = useMemo(() => calculateMastery(history), [history]);
  const utility = useMemo(
    () => calculateUtility({ difficulty: currentDifficulty, streak, mastery }),
    [currentDifficulty, streak, mastery],
  );

  const handleSelect = useCallback((optionKey, source = 'click') => {
    if (!currentQuestion || feedback) return;

    const isCorrect = optionKey === currentQuestion.answer;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const text = getFeedbackText({
      selectedKey: optionKey,
      correctKey: currentQuestion.answer,
      isCorrect,
      skipped: false,
    });

    const record = {
      questionId: currentQuestion.id,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      selectedKey: optionKey,
      correctKey: currentQuestion.answer,
      isCorrect,
      skipped: false,
      source,
      createdAt: new Date().toISOString(),
    };

    setSelectedKey(optionKey);
    setFeedback({ text, isCorrect, skipped: false });
    setHistory((prev) => [...prev, record]);
    setStreak(nextStreak);
    setLastAction(
      source === 'gesture'
        ? `ژست ${gesture.name} تشخیص داده شد و گزینه ${optionKey} ثبت شد.`
        : `گزینه ${optionKey} با کلیک ثبت شد.`,
    );
  }, [currentQuestion, feedback, gesture.name, streak]);

  const handleSkip = useCallback((source = 'click') => {
    if (!currentQuestion || feedback) return;

    const text = getFeedbackText({
      selectedKey: null,
      correctKey: currentQuestion.answer,
      isCorrect: false,
      skipped: true,
    });

    const record = {
      questionId: currentQuestion.id,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty,
      selectedKey: null,
      correctKey: currentQuestion.answer,
      isCorrect: false,
      skipped: true,
      source,
      createdAt: new Date().toISOString(),
    };

    setSelectedKey(null);
    setFeedback({ text, isCorrect: false, skipped: true });
    setHistory((prev) => [...prev, record]);
    setStreak(0);
    setLastAction(source === 'gesture' ? 'ژست شست پایین تشخیص داده شد و سوال رد شد.' : 'سوال با کلیک رد شد.');
  }, [currentQuestion, feedback]);

  const handleNext = useCallback((source = 'click') => {
    if (!feedback) return;

    const lastRecord = history[history.length - 1];
    if (!lastRecord) return;

    const { question, nextDifficulty } = chooseNextQuestion({
      questions,
      askedIds,
      currentDifficulty,
      wasCorrect: lastRecord.isCorrect,
      streak,
    });

    setCurrentDifficulty(nextDifficulty);
    setCurrentQuestion(question);
    setSelectedKey(null);
    setFeedback(null);

    if (question) {
      setAskedIds((prev) => [...prev, question.id]);
      setLastAction(
        source === 'gesture'
          ? `با ژست اشاره به بالا، سوال بعدی با سطح ${nextDifficulty} انتخاب شد.`
          : `عامل سوال بعدی را با سطح ${nextDifficulty} انتخاب کرد.`,
      );
    } else {
      setLastAction('همه سوال‌ها تمام شد و عامل نتیجه نهایی را نمایش داد.');
    }
  }, [askedIds, currentDifficulty, feedback, history, streak]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(initialQuestion);
    setAskedIds([initialQuestion.id]);
    setSelectedKey(null);
    setFeedback(null);
    setHistory([]);
    setCurrentDifficulty(1);
    setStreak(0);
    setLastAction('آزمون از ابتدا شروع شد.');
    lastGestureAtRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    if (!gesture?.name || gesture.name === 'None') return;
    if (gesture.score < MIN_GESTURE_CONFIDENCE) return;

    const action = GESTURE_ACTIONS[gesture.name];
    if (!action) return;

    const now = Date.now();
    if (now - lastGestureAtRef.current < ACTION_COOLDOWN_MS) return;

    if (action.type === 'ANSWER' && !feedback && currentQuestion) {
      lastGestureAtRef.current = now;
      handleSelect(action.optionKey, 'gesture');
      return;
    }

    if (action.type === 'SKIP' && !feedback && currentQuestion) {
      lastGestureAtRef.current = now;
      handleSkip('gesture');
      return;
    }

    if (action.type === 'NEXT' && feedback) {
      lastGestureAtRef.current = now;
      handleNext('gesture');
    }
  }, [currentQuestion, feedback, gesture, handleNext, handleSelect, handleSkip, isRunning]);

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_32%),#020617] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Header />

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <WebcamGesturePanel
            videoRef={videoRef}
            canvasRef={canvasRef}
            gesture={gesture}
            status={status}
            error={error}
            isRunning={isRunning}
            onStart={startCamera}
            onStop={stopCamera}
          />

          <div className="space-y-6">
            <QuizCard
              question={currentQuestion}
              selectedKey={selectedKey}
              feedback={feedback}
              isLocked={Boolean(feedback)}
              onSelect={handleSelect}
              onNext={handleNext}
              onSkip={handleSkip}
              totalQuestions={questions.length}
              currentIndex={Math.max(askedIds.length - 1, 0)}
            />

            <ScorePanel
              score={score}
              wrong={wrong}
              skipped={skipped}
              streak={streak}
              difficulty={currentDifficulty}
              mastery={mastery}
              utility={utility}
              lastAction={lastAction}
            />
          </div>
        </div>

        <ConceptPanel />
        <ResultDashboard history={history} mastery={mastery} onRestart={handleRestart} />
      </div>
    </main>
  );
}
