import { Activity, Brain, CheckCircle2, Trophy, XCircle } from 'lucide-react';
import { getDifficultyLabel } from '../utils/adaptiveAgent';

export default function ScorePanel({ score, wrong, skipped, streak, difficulty, mastery, utility, lastAction }) {
  const items = [
    { label: 'درست', value: score, icon: CheckCircle2, className: 'text-emerald-300' },
    { label: 'اشتباه', value: wrong, icon: XCircle, className: 'text-rose-300' },
    { label: 'رد شده', value: skipped, icon: Activity, className: 'text-amber-300' },
    { label: 'Streak', value: streak, icon: Trophy, className: 'text-cyan-300' },
  ];

  return (
    <section className="glass-card rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">وضعیت عامل</h2>
        <Brain className="text-cyan-300" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Icon className={`mb-3 ${item.className}`} />
              <p className="text-2xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">سطح فعلی</span>
          <span className="font-bold text-amber-100">{getDifficultyLabel(difficulty)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-400">Mastery</span>
          <span className="font-bold text-emerald-100">{mastery}%</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-400">Utility تقریبی</span>
          <span className="font-bold text-cyan-100">{utility}</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
        <p className="text-sm text-cyan-100">آخرین عمل عامل</p>
        <p className="mt-2 leading-7 text-slate-200">{lastAction || 'هنوز عملی انجام نشده است.'}</p>
      </div>
    </section>
  );
}
