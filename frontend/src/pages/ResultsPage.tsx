import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";
import { CheckIcon, CrossIcon, ShieldIcon, ArrowRightIcon } from "../components/Icons";

export default function ResultsPage() {
  const { currentQuestion, results, loadResults, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!results && currentQuestion) {
      loadResults().catch(() => null);
    }
  }, [currentQuestion, loadResults, results]);

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">نتائج التصويت</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">ماذا قرر الرفاق المتحيّرون؟</h1>
          <p className="text-xs leading-relaxed text-white/70">
            شاهد نتيجة التصويت — ثم اختر المدافع الذي سيجعل الجميع يستمعون (رغم تذمرهم).
          </p>
        </div>

        <div className="mt-5 sm:mt-8 grid gap-3 grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4 text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold flex items-center justify-center gap-1">
              <CheckIcon className="w-3.5 h-3.5" /> موافق
            </p>
            <p className="mt-1 text-3xl sm:text-5xl font-bold text-emerald-400">{results?.agree ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-rose-400 font-semibold flex items-center justify-center gap-1">
              <CrossIcon className="w-3.5 h-3.5" /> معارض
            </p>
            <p className="mt-1 text-3xl sm:text-5xl font-bold text-rose-400">{results?.disagree ?? 0}</p>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50 font-semibold mb-3">تفاصيل الأصوات</p>
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {results?.votes.length ? (
              results.votes.map((vote, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-white/80">
                  <span className="font-semibold">{vote.playerName}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${vote.vote === "agree" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {vote.vote === "agree" ? "موافق" : "معارض"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/50 text-center py-4">لا توجد أصوات بعد — الهدوء قبل العاصفة.</p>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-8 flex flex-col gap-2.5">
          <Button type="button" onClick={() => navigate("/defender")} className="w-full py-3.5 text-sm font-bold bg-brand text-surface hover:bg-brand/90 border-0 flex items-center justify-center gap-2">
            <ShieldIcon className="w-4 h-4" /> كشف المدافع
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/waiting")} className="w-full py-3 text-sm flex items-center justify-center gap-2">
            السؤال التالي <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
