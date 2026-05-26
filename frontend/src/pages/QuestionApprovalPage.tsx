import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";

export default function QuestionApprovalPage() {
  const { currentQuestion, session, fetchQuestion, decideQuestion, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentQuestion && session) {
      fetchQuestion().catch(() => null);
    }
  }, [currentQuestion, fetchQuestion, session]);

  const handleApprove = async () => {
    await decideQuestion("approve");
    navigate("/vote");
  };

  const handleReject = async () => {
    await decideQuestion("reject");
    await fetchQuestion();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">سؤال للمراجعة</p>
          <h1 className="text-3xl font-semibold text-white">هل هذا سؤال يستحق النقاش؟</h1>
          <p className="text-sm leading-7 text-white/70">
            اقرأ السؤال مع المجموعة. إذا كان جيدًا، تابع للتصويت. إذا أردتم سؤالًا أكثر حدة، اختر تخطي.
          </p>
        </div>
        <div className="mt-8 rounded-[32px] border border-white/10 bg-surfaceCold/80 p-8 text-white/80">
          {currentQuestion ? (
            <>
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">السؤال الحالي</p>
              <p className="mt-4 text-2xl font-semibold leading-tight text-white">{currentQuestion.content}</p>
            </>
          ) : (
            <p className="text-sm text-white/60">جارٍ جلب سؤال جديد...</p>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="button" onClick={handleApprove} disabled={!currentQuestion}>
            احتفظ بالسؤال
          </Button>
          <Button type="button" variant="secondary" onClick={handleReject} disabled={!currentQuestion}>
            أريد سؤالاً جديدًا
          </Button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
