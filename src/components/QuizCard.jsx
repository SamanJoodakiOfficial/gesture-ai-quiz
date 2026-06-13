import { CheckCircle2, Layers3, SkipForward, XCircle } from 'lucide-react';
import { getDifficultyLabel } from '../utils/adaptiveAgent';
import OptionButton from './OptionButton';

export default function QuizCard({
  question,
  selectedKey,
  feedback,
  isLocked,
  onSelect,
  onNext,
  onSkip,
  totalQuestions,
  currentIndex,
}) {
  if (!question) {
    return (
      <section className="glass-card rounded-3xl p-8 text-center">
        <CheckCircle2 size={56} className="mx-auto mb-4 text-emerald-300" />
        <h2 className="text-2xl font-black">آزمون تمام شد</h2>
        <p className="mt-3 text-slate-300">نتیجه نهایی را در پنل پایین ببینید.</p>
      </section>
    );
  }

  const isCorrect = feedback?.isCorrect;

  return (
    <section className="glass-card rounded-3xl p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
            سوال {currentIndex + 1} از {totalQuestions}
          </span>
          <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-sm text-violet-100">
            {question.topic}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-sm text-amber-100">
            <Layers3 size={14} />
            {getDifficultyLabel(question.difficulty)}
          </span>
        </div>

        <button
          type="button"
          onClick={onSkip}
          disabled={isLocked}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-rose-300/40 hover:bg-rose-500/10 disabled:cursor-default disabled:opacity-50"
        >
          <SkipForward size={17} />
          رد کردن
        </button>
      </div>

      <h2 className="text-xl font-black leading-10 md:text-2xl">{question.question}</h2>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {question.options.map((option) => (
          <OptionButton
            key={option.key}
            option={option}
            selectedKey={selectedKey}
            correctKey={question.answer}
            isLocked={isLocked}
            onSelect={onSelect}
          />
        ))}
      </div>

      {feedback && (
        <div className={`mt-5 rounded-3xl border p-4 ${isCorrect ? 'border-emerald-400/30 bg-emerald-500/10' : feedback.skipped ? 'border-amber-400/30 bg-amber-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}>
          <div className="flex gap-3">
            {isCorrect ? <CheckCircle2 className="mt-1 shrink-0 text-emerald-300" /> : <XCircle className="mt-1 shrink-0 text-rose-300" />}
            <div>
              <p className="font-black text-white">{feedback.text}</p>
              <p className="mt-2 leading-8 text-slate-300">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-400">می‌توانید با ژست دست یا کلیک موس جواب دهید.</p>
        <button
          type="button"
          disabled={!isLocked}
          onClick={onNext}
          className="rounded-2xl bg-white px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          سوال بعدی
        </button>
      </div>
    </section>
  );
}
