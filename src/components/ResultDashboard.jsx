import { RotateCcw } from 'lucide-react';
import { getDifficultyLabel } from '../utils/adaptiveAgent';

export default function ResultDashboard({ history, mastery, onRestart }) {
  if (!history.length) return null;

  const correct = history.filter((item) => item.isCorrect).length;
  const wrong = history.filter((item) => !item.isCorrect && !item.skipped).length;
  const skipped = history.filter((item) => item.skipped).length;

  return (
    <section className="glass-card rounded-3xl p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black">داشبورد نتیجه</h2>
          <p className="mt-2 text-slate-400">خلاصه عملکرد کاربر و تصمیم‌های عامل تطبیقی</p>
        </div>
        <button onClick={onRestart} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-300">
          <RotateCcw size={18} />
          شروع دوباره
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Stat label="Mastery" value={`${mastery}%`} />
        <Stat label="پاسخ درست" value={correct} />
        <Stat label="پاسخ اشتباه" value={wrong} />
        <Stat label="رد شده" value={skipped} />
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
        <div className="hidden grid-cols-6 gap-2 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-300 md:grid">
          <span>سوال</span>
          <span>موضوع</span>
          <span>سطح</span>
          <span>پاسخ کاربر</span>
          <span>پاسخ درست</span>
          <span>نتیجه</span>
        </div>
        <div className="divide-y divide-white/10">
          {history.map((item, index) => (
            <div key={`${item.questionId}-${index}`} className="grid gap-2 px-4 py-4 text-sm text-slate-200 md:grid-cols-6">
              <span className="font-bold">{index + 1}</span>
              <span>{item.topic}</span>
              <span>{getDifficultyLabel(item.difficulty)}</span>
              <span>{item.selectedKey || '-'}</span>
              <span>{item.correctKey}</span>
              <span className={item.isCorrect ? 'text-emerald-300' : item.skipped ? 'text-amber-300' : 'text-rose-300'}>
                {item.isCorrect ? 'درست' : item.skipped ? 'رد شده' : 'اشتباه'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  );
}
