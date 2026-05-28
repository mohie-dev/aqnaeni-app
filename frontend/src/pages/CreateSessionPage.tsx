import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import { useSession } from "../lib/session-context";
import type { Topic } from "../lib/types";

const topics: Array<{ value: Topic; label: string }> = [
  { value: "relationships", label: "علاقات" },
  { value: "deep", label: "أسئلة عميقة" },
  { value: "gym", label: "ELGYM" },
  { value: "trendy", label: "تريند" },
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <SectionHeader
          eyebrow="ابدأ جلسة"
          title="اختر موضوع الجلسة واستعد للنقاش"
          description="حدد توجه الجلسة، ثم شارك الكود مع الأصدقاء لبدء جمع اللاعبين على نفس الجهاز." 
        />
        <form onSubmit={handleCreate} className="mt-8 space-y-6">
          <label className="block text-sm font-medium text-white/80">اختر موضوعًا</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTopic(option.value)}
                className={`rounded-3xl border px-4 py-4 text-left text-sm transition ${
                  topic === option.value
                    ? "border-brand bg-brand/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span className="block font-semibold text-white">{option.label}</span>
                <span className="mt-2 block text-xs text-white/60">وحدة اللعبة المفضلة لك</span>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-sm text-white/70">الكود سيُستخدم لإضافة اللاعبين ومتابعة الجلسة.</p>
            <Button type="submit" disabled={loading || submitted}>
              {loading ? "جارٍ الإنشاء..." : "إنشاء جلسة"}
            </Button>
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            {session ? (
              <p className="text-sm text-white/70">الجلسة الحالية: {session.code}</p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
