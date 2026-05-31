import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import { useSession } from "../lib/session-context";
import type { Topic } from "../lib/types";

import { UsersIcon, BrainIcon, DumbbellIcon, FlameIcon } from "../components/Icons";

const topics: Array<{ value: Topic; label: string; icon: React.ReactNode; description: string }> = [
  { value: "relationships", label: "علاقات", icon: <UsersIcon className="w-6 h-6 text-brand mb-1" />, description: "عن العلاقات والأصدقاء" },
  { value: "deep", label: "أسئلة عميقة", icon: <BrainIcon className="w-6 h-6 text-brand mb-1" />, description: "أسئلة تكشف الشخصية" },
  { value: "gym", label: "ELGYM", icon: <DumbbellIcon className="w-6 h-6 text-brand mb-1" />, description: "تحديات رياضية وحماسية" },
  { value: "trendy", label: "تريند", icon: <FlameIcon className="w-6 h-6 text-brand mb-1" />, description: "مواضيع الساعة الرائجة" },
];

export default function CreateSessionPage() {
  const [topic, setTopic] = useState<Topic>("deep");
  const [submitted, setSubmitted] = useState(false);
  const { createSession, loading, error, session } = useSession();
  const navigate = useNavigate();

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    try {
      const sessionData = await createSession(topic);
      navigate("/players", { replace: true });
      return sessionData;
    } catch {
      return null;
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <SectionHeader
          eyebrow="ابدأ جلسة"
          title="اختر موضوع الجلسة واستعد للنقاش"
          description="حدد توجه الجلسة، ثم شارك الكود مع الأصدقاء لبدء جمع اللاعبين على نفس الجهاز." 
        />
        <form onSubmit={handleCreate} className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
          <label className="block text-xs sm:text-sm font-semibold text-white/80">اختر موضوعًا</label>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {topics.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTopic(option.value)}
                className={`flex flex-col items-center justify-center text-center rounded-2xl border p-3 transition-all duration-300 ${
                  topic === option.value
                    ? "border-brand bg-brand/15 text-white scale-[1.02] shadow-lg shadow-brand/10"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:scale-[1.01]"
                }`}
              >
                <span className="mb-1">{option.icon}</span>
                <span className="block font-bold text-xs sm:text-sm text-white">{option.label}</span>
                <span className="mt-1 block text-[10px] text-white/50 leading-tight hidden xs:block">{option.description}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <p className="text-xs text-white/60">الكود سيُستخدم لإضافة اللاعبين ومتابعة الجلسة.</p>
            <Button type="submit" disabled={loading || submitted} className="w-full py-3 text-sm font-bold">
              {loading ? "جارٍ الإنشاء..." : "إنشاء جلسة"}
            </Button>
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            {session ? (
              <p className="text-xs sm:text-sm text-white/70 text-center font-medium bg-white/5 py-1.5 rounded-lg border border-white/10">
                الجلسة الحالية: <span className="font-bold text-brand">{session.code}</span>
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
