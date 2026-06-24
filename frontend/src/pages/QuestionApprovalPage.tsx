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
    navigate("/stance");
  };

  const handleReject = async () => {
    await decideQuestion("reject");
    await fetchQuestion();
  };

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">سؤال للمراجعة</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">هل هذا سؤال يستحق النقاش؟</h1>
          <p className="text-xs leading-relaxed text-white/70">
            اقرأ السؤال مع المجموعة. إذا كان جيدًا، تابع للتصويت. إذا أردتم سؤالًا أكثر حدة، اختر تخطي.
          </p>
        </div>
        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-5 sm:p-8 text-white/80">
          {currentQuestion ? (
            <>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/40">السؤال الحالي</p>
              <p className="mt-3 text-base sm:text-lg font-semibold leading-relaxed text-white">{currentQuestion.content}</p>
            </>
          ) : (
            <p className="text-xs sm:text-sm text-white/60">جاري جلب سؤال جديد...</p>
          )}
        </div>
        <div className="mt-5 sm:mt-8 flex flex-col gap-3">
          <Button type="button" onClick={handleApprove} disabled={!currentQuestion} className="w-full py-3.5 text-sm font-bold">
            احتفظ بالسؤال
          </Button>
          <Button type="button" variant="secondary" onClick={handleReject} disabled={!currentQuestion} className="w-full py-3 text-sm">
            أريد سؤالاً جديدًا
          </Button>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
