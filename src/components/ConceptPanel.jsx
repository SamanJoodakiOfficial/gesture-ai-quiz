import { Bot, Eye, Goal, MousePointerClick } from 'lucide-react';
import { getAgentDescription } from '../utils/adaptiveAgent';

export default function ConceptPanel() {
  const agent = getAgentDescription();
  const cards = [
    { title: 'Percept', value: agent.percept, icon: Eye },
    { title: 'Action', value: agent.action, icon: MousePointerClick },
    { title: 'Performance', value: agent.performance, icon: Goal },
    { title: 'Environment', value: agent.environment, icon: Bot },
  ];

  return (
    <section className="glass-card rounded-3xl p-5">
      <h2 className="text-xl font-black">ارتباط پروژه با کتاب Russell</h2>
      <p className="mt-2 leading-7 text-slate-400">
        این پروژه را می‌توان به عنوان یک عامل هوشمند مدل کرد: حسگر آن وب‌کم است، ادراک آن ژست تشخیص داده‌شده است و عمل آن ثبت پاسخ یا انتخاب سوال بعدی است.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Icon className="mb-3 text-cyan-300" />
              <p className="ltr text-sm font-black text-white">{card.title}</p>
              <p className="mt-2 leading-7 text-slate-300">{card.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
