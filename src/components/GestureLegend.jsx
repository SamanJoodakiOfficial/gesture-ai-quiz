import { GESTURE_ACTIONS } from '../constants/gestures';

export default function GestureLegend() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {Object.entries(GESTURE_ACTIONS).map(([gesture, action]) => (
        <div key={gesture} className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-xl shadow-lg`}>
            {action.emoji}
          </div>
          <p className="text-sm font-bold text-white">{action.label}</p>
          <p className="ltr mt-1 text-xs text-slate-400">{gesture}</p>
        </div>
      ))}
    </div>
  );
}
