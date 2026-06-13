export default function OptionButton({ option, selectedKey, correctKey, isLocked, onSelect }) {
  const isSelected = selectedKey === option.key;
  const isCorrect = correctKey === option.key;

  let stateClass = 'border-white/10 bg-white/5 hover:border-cyan-300/50 hover:bg-cyan-400/10';

  if (isLocked && isCorrect) {
    stateClass = 'border-emerald-400/70 bg-emerald-500/15 text-emerald-50';
  } else if (isLocked && isSelected && !isCorrect) {
    stateClass = 'border-rose-400/70 bg-rose-500/15 text-rose-50';
  }

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={() => onSelect(option.key, 'click')}
      className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-right transition ${stateClass} ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-black text-cyan-200 ring-1 ring-white/10">
        {option.key}
      </span>
      <span className="leading-8 text-slate-100">{option.text}</span>
    </button>
  );
}
