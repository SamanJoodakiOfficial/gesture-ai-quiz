import {
  BookOpen,
  BrainCircuit,
  Building2,
  CalendarDays,
  Camera,
  GraduationCap,
  IdCard,
  Sparkles,
  UserRound,
} from 'lucide-react';

const projectInfo = [
  { label: 'نام دانشگاه', value: 'دانشگاه ملی مهارت', icon: GraduationCap },
  { label: 'نام دانشکده', value: 'دانشکده شهید شمسی‌پور تهران', icon: Building2 },
  { label: 'نام استاد', value: 'جناب آقای دکتر سید روح‌اله میرحسینی', icon: UserRound },
  { label: 'نام درس', value: 'آزمایشگاه هوش مصنوعی', icon: BookOpen },
  { label: 'نام دانشجو', value: 'سامان جودکی', icon: UserRound },
  { label: 'شماره دانشجویی', value: '03221142705019', icon: IdCard },
  { label: 'تاریخ', value: 'یکشنبه 24 خرداد 1405', icon: CalendarDays },
];

export default function Header() {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 text-right shadow-2xl">
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 right-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-center text-xl font-black text-cyan-100 md:text-2xl">به نام خدا</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {projectInfo.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 transition hover:border-cyan-300/35 hover:bg-slate-900/70"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-200">
                  <Icon size={17} />
                  <span>{label}</span>
                </div>
                <p className="mt-2 text-sm font-bold leading-7 text-white md:text-base">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={18} />
              پروژه درس هوش مصنوعی، الهام‌گرفته از Agent در کتاب Russell
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                آزمون تطبیقی هوشمند با تشخیص ژست دست
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                این وب‌اپ با استفاده از وب‌کم، ژست دست کاربر را تشخیص می‌دهد و مثل یک عامل هوشمند، پاسخ‌ها را ثبت کرده و سطح سوال بعدی را با عملکرد کاربر تطبیق می‌دهد.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200 md:min-w-80">
            <div className="glass-card rounded-2xl p-4">
              <BrainCircuit className="mb-3 text-cyan-300" />
              <p className="font-bold">AI Agent</p>
              <p className="mt-1 text-slate-400 ltr text-left">Percept → Decision → Action</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <Camera className="mb-3 text-emerald-300" />
              <p className="font-bold">Webcam</p>
              <p className="mt-1 text-slate-400 ltr text-left">Real-time Gesture Recognition</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
