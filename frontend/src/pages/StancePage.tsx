import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";
import { CheckIcon, CrossIcon, HourglassIcon } from "../components/Icons";

export default function StancePage() {
  const { currentQuestion, players, stances, submitStance, error, loading } = useSession();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const navigate = useNavigate();

  const remainingPlayers = useMemo(
    () => players.filter((player) => !stances[player._id]),
    [players, stances]
  );

  useEffect(() => {
    if (!activePlayerId && remainingPlayers.length) {
      setActivePlayerId(remainingPlayers[0]._id);
    }
  }, [activePlayerId, remainingPlayers]);

  const handleStance = async (value: "agree" | "disagree") => {
    if (!activePlayerId || !currentQuestion) return;
    await submitStance(activePlayerId, value);

    const next = remainingPlayers.find((player) => player._id !== activePlayerId);
    setActivePlayerId(next ? next._id : null);

    if (remainingPlayers.length <= 1) {
      navigate("/speaking");
    }
  };

  const handleSkipToSpeaking = () => {
    navigate("/speaking");
  };

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">تحديد الموقف</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">مع أم ضد؟</h1>
          <p className="text-xs leading-relaxed text-white/70">
            حدد موقفك الآن قبل أن تبدأ في التحدث! سيتم عرض موقفك للجميع أثناء المناقشة.
          </p>
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/40">السؤال</p>
          <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed text-white">{currentQuestion?.content ?? "جاري تحميل السؤال..."}</p>
        </div>

        <div className="mt-5 sm:mt-8 grid gap-4 grid-cols-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">اللاعب الحالي</p>
              <p className="mt-1 text-base sm:text-lg font-bold text-brand">
                {activePlayerId
                  ? players.find((player) => player._id === activePlayerId)?.name
                  : "جميع المواقف مسجلة"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">التقدم</p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-white/80">
                {players.length - remainingPlayers.length} من {players.length}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-white/70 mb-3">حالة اللاعبين</p>
            <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
              {players.map((player) => {
                const stance = stances[player._id];
                const isCurrent = activePlayerId === player._id;
                
                const stanceBadge =
                  stance === "agree" ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckIcon className="w-3.5 h-3.5" /> موافق
                    </span>
                  ) : stance === "disagree" ? (
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <CrossIcon className="w-3.5 h-3.5" /> معارض
                    </span>
                  ) : (
                    // <span className="flex items-center gap-1 text-white/40 font-medium">
                    //   <HourglassIcon className="w-3.5 h-3.5 text-white/30" /> لم يحدد
                    // </span>
                    <div className="w-2 h-2 rounded-full bg-white/30"></div>
                  );

                return (
                  <button
                    key={player._id}
                    type="button"
                    onClick={() => setActivePlayerId(player._id)}
                    className={`w-full rounded-xl px-3 py-2 text-right transition-all duration-200 border ${
                      isCurrent
                        ? "border-brand bg-brand/10 text-white scale-[1.02] shadow-sm shadow-brand/5"
                        : "border-white/5 bg-white/5 text-white/80 hover:border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex flex-row items-center justify-between gap-1 text-[11px] sm:text-xs">
                      <span className="font-semibold truncate max-w-[80px]">{player.name}</span>
                      <span className="text-[10px] whitespace-nowrap">{stanceBadge}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => handleStance("agree")}
              disabled={!activePlayerId || loading}
              className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white border-0 disabled:opacity-50"
            >
              <CheckIcon className="w-4 h-4" /> أنا موافق
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleStance("disagree")}
              disabled={!activePlayerId || loading}
              className="flex items-center justify-center gap-2 py-3 text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white border-0 hover:bg-opacity-100 disabled:opacity-50"
            >
              <CrossIcon className="w-4 h-4" /> أنا معارض
            </Button>
          </div>
          
          <Button type="button" variant="ghost" onClick={handleSkipToSpeaking} className="w-full py-2.5 text-xs text-white/50 hover:text-white transition">
            تخطي والذهاب للتحدث
          </Button>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
