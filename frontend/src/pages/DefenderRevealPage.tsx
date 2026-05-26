import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";

export default function DefenderRevealPage() {
  const { defender, loadDefender, currentQuestion, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!defender && currentQuestion) {
      loadDefender().catch(() => null);
    }
  }, [currentQuestion, defender, loadDefender]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">كشف المدافع</p>
          <h1 className="text-3xl font-semibold text-white">من سيُجبر على الدفاع عن الرأي الآخر؟</h1>
          <p className="text-sm leading-7 text-white/70">
            استعد لجولة جديدة من الحكاوي، لأن هذه المرة اللعب يتحول إلى تعديل الرأي في الوقت الحقيقي.
          </p>
        </div>

        <div className="mt-8 rounded-[32px] border border-white/10 bg-surfaceCold/80 p-8 text-white/80">
          {defender ? (
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm text-white/60">اللاعب</p>
                <p className="mt-2 text-3xl font-semibold text-white">{defender.player}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-white/60">تصويت اللاعب</p>
                  <p className="mt-2 text-xl font-semibold text-white">{defender.originalVote}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-white/60">الجانب المطلوب الدفاع عنه</p>
                  <p className="mt-2 text-xl font-semibold text-brand">{defender.mustDefend}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/60">جارٍ اختيار المدافع... دراما قادمة!</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button type="button" onClick={() => navigate("/waiting")}>السؤال التالي</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/")}>عودة للرئيسية</Button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
