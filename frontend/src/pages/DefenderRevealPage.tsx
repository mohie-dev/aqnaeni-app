import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";
import { ShieldIcon, CheckIcon, CrossIcon, ArrowRightIcon, HomeIcon, HourglassIcon } from "../components/Icons";

export default function DefenderRevealPage() {
  const { defender, loadDefender, currentQuestion, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!defender && currentQuestion) {
      loadDefender().catch(() => null);
    }
  }, [currentQuestion, defender, loadDefender]);

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">كشف المدافع</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">من سيُجبر على الدفاع عن الرأي الآخر؟</h1>
          <p className="text-xs leading-relaxed text-white/70">
            استعد لجولة جديدة من الحكاوي، لأن هذه المرة اللعب يتحول إلى تعديل الرأي في الوقت الحقيقي.
          </p>
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6 text-white/80">
          {defender ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-white/5 p-4 text-center border border-white/5 flex flex-col items-center justify-center gap-1">
                <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <ShieldIcon className="w-3.5 h-3.5 text-brand" /> اللاعب المدافع
                </p>
                <p className="mt-1 text-2xl sm:text-3xl font-bold text-brand">{defender.player}</p>
              </div>
              <div className="grid gap-3 grid-cols-2">
                <div className="rounded-xl bg-white/5 p-3.5 text-center border border-white/5 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] mb-1">تصويت اللاعب</p>
                  {defender.originalVote === "agree" ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm sm:text-base">
                      <CheckIcon className="w-4 h-4" /> موافق
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 font-bold text-sm sm:text-base">
                      <CrossIcon className="w-4 h-4" /> معارض
                    </span>
                  )}
                </div>
                <div className="rounded-xl bg-brand/10 p-3.5 text-center border border-brand/20 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-white/60 uppercase tracking-[0.15em] font-semibold mb-1">مطلوب يدافع عن</p>
                  {defender.mustDefend === "agree" ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm sm:text-base">
                      <CheckIcon className="w-4 h-4" /> موافق
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-400 font-bold text-sm sm:text-base">
                      <CrossIcon className="w-4 h-4" /> معارض
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50 text-center py-4 flex items-center justify-center gap-1.5">
              <HourglassIcon className="w-4 h-4 animate-spin text-white/30" /> جاري اختيار المدافع... استعد للنقاش!
            </p>
          )}
        </div>

        <div className="mt-5 sm:mt-8 flex flex-col gap-2.5">
          <Button type="button" onClick={() => navigate("/waiting")} className="w-full py-3.5 text-sm font-bold bg-brand text-surface hover:bg-brand/90 border-0 flex items-center justify-center gap-2">
            السؤال التالي <ArrowRightIcon className="w-4 h-4" />
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/")} className="w-full py-3 text-sm flex items-center justify-center gap-2">
            <HomeIcon className="w-4 h-4" /> عودة للرئيسية
          </Button>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
