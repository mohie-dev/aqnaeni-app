import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";

export default function ResultsPage() {
  const { currentQuestion, results, loadResults, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!results && currentQuestion) {
      loadResults().catch(() => null);
    }
  }, [currentQuestion, loadResults, results]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">نتائج التصويت</p>
          <h1 className="text-3xl font-semibold text-white">ماذا قرر الرفاق المتحيّرون؟</h1>
          <p className="text-sm leading-7 text-white/70">
            شاهد نتيجة التصويت — ثم اختر المدافع الذي سيجعل الجميع يستمعون (رغم تذمرهم).
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">موافق</p>
            <p className="mt-4 text-5xl font-semibold text-brand">{results?.agree ?? 0}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">معارض</p>
            <p className="mt-4 text-5xl font-semibold text-white">{results?.disagree ?? 0}</p>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-surfaceCold/80 p-6">
          <p className="text-sm uppercase tracking-[0.32em] text-white/50">تفاصيل الأصوات</p>
          <div className="mt-4 space-y-2">
            {results?.votes.length ? (
              results.votes.map((vote, index) => (
                <div key={index} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                  <span>{vote.playerName}</span>
                  <span className={vote.vote === "agree" ? "text-brand" : "text-white"}>{vote.vote}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">لا توجد أصوات بعد — الهدوء قبل العاصفة.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button type="button" onClick={() => navigate("/defender")}>كشف المدافع</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/waiting")}>السؤال التالي</Button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
