import { Camera, CameraOff, Loader2, ShieldAlert } from 'lucide-react';
import { gestureNameFa, MIN_GESTURE_CONFIDENCE } from '../constants/gestures';
import GestureLegend from './GestureLegend';

function getStatusText(status) {
  switch (status) {
    case 'loading-model':
      return 'در حال بارگذاری مدل تشخیص ژست...';
    case 'requesting-camera':
      return 'در انتظار اجازه دسترسی به وب‌کم...';
    case 'running':
      return 'وب‌کم فعال است';
    case 'error':
      return 'خطا در فعال‌سازی';
    default:
      return 'وب‌کم غیرفعال است';
  }
}

export default function WebcamGesturePanel({
  videoRef,
  canvasRef,
  gesture,
  status,
  error,
  isRunning,
  onStart,
  onStop,
}) {
  const percentage = Math.round((gesture.score || 0) * 100);
  const isConfident = gesture.score >= MIN_GESTURE_CONFIDENCE;

  return (
    <section className="glass-card rounded-3xl p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black">دوربین و تشخیص ژست</h2>
          <p className="mt-1 text-sm text-slate-400">برای انتخاب گزینه، یکی از ژست‌های راهنما را جلوی وب‌کم نگه دارید.</p>
        </div>
        {isRunning ? (
          <button onClick={onStop} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400">
            <CameraOff size={18} />
            خاموش کردن
          </button>
        ) : (
          <button onClick={onStart} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">
            {status === 'loading-model' || status === 'requesting-camera' ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            فعال‌سازی وب‌کم
          </button>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
        <video ref={videoRef} className="video-mirror aspect-video w-full object-cover opacity-90" />
        <canvas ref={canvasRef} className="video-mirror pointer-events-none absolute inset-0 h-full w-full" />
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-center text-slate-300">
            <div className="px-6">
              <Camera size={44} className="mx-auto mb-3 text-slate-500" />
              <p className="font-bold">برای شروع، وب‌کم را فعال کنید</p>
              <p className="mt-2 text-sm text-slate-500">در مرورگر باید اجازه دسترسی Camera بدهید.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">وضعیت</p>
            <p className="mt-1 font-bold text-cyan-100">{getStatusText(status)}</p>
          </div>
          <div className="text-right md:text-left">
            <p className="text-sm text-slate-400">ژست فعلی</p>
            <p className="ltr mt-1 font-black text-white">{gesture.name}</p>
            <p className="mt-1 text-sm text-slate-300">{gestureNameFa[gesture.name] || gesture.name}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Confidence</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${isConfident ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">حداقل confidence قابل قبول: {Math.round(MIN_GESTURE_CONFIDENCE * 100)}%</p>
        </div>

        {error && (
          <div className="mt-4 flex gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="mb-3 font-black">راهنمای ژست‌ها</h3>
        <GestureLegend />
      </div>
    </section>
  );
}
