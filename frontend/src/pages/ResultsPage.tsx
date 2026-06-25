import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";
import { ArrowRightIcon } from "../components/Icons";

export default function ResultsPage() {
  const { currentQuestion, results, loadResults, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!results && currentQuestion) {
      loadResults().catch(() => null);
    }
  }, [currentQuestion, loadResults, results]);

  const maxVotesCount = results?.voteCounts ? Math.max(...Object.values(results.voteCounts), 0) : 0;

  const roundWinnerNames = (() => {
    if (!results?.voteCounts || maxVotesCount === 0) return [];
    
    const winnerIds = Object.entries(results.voteCounts)
      .filter(([id, count]) => count === maxVotesCount)
      .map(([id]) => id);

    return winnerIds.map(id => results.leaderboard?.find(p => p.id === id)?.name || "مجهول");
  })();

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">نتائج الجولة</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">الأكثر إقناعاً</h1>
        </div>

        <div className="mt-6 sm:mt-8 rounded-2xl border border-brand/20 bg-brand/10 p-6 text-center">
          {roundWinnerNames.length > 0 ? (
            <>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand/70 font-semibold mb-2">
                {roundWinnerNames.length > 1 ? "الفائزون في هذه الجولة" : "الفائز في هذه الجولة"}
              </p>
              <p className="text-3xl sm:text-5xl font-black text-brand mb-1 leading-snug">
                {roundWinnerNames.join(" و ")}
              </p>
              <p className="text-xs text-white/70">
                {roundWinnerNames.length > 1 ? "حصل كل منهم على" : "حصل على"} {maxVotesCount} {maxVotesCount === 1 ? "صوت" : "أصوات"}
              </p>
            </>
          ) : (
            <p className="text-sm text-white/70">لا يوجد فائز (لم يكتمل التصويت)</p>
          )}
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50 font-semibold mb-3">تفاصيل الأصوات</p>
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {results?.votes.length ? (
              results.votes.map((vote, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-white/80">
                  <span className="font-semibold">{vote.playerName}</span>
                  <span className="text-white/40 px-2 text-[10px]">صوت لـ</span>
                  <span className="font-bold text-brand">{vote.votedForName}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/50 text-center py-4">لا توجد أصوات بعد.</p>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-amber-400/50 font-semibold mb-3">لوحة الشرف (Leaderboard)</p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {results?.leaderboard?.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 font-mono text-xs w-4">{index + 1}.</span>
                  <span className="font-semibold">{player.name}</span>
                </div>
                <span className="font-bold text-amber-400">{player.score} <span className="text-[10px] text-amber-400/50">نقطة</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 sm:mt-8 flex flex-col gap-2.5">
          <Button type="button" onClick={() => navigate("/waiting")} className="w-full py-3.5 text-sm font-bold bg-brand text-surface hover:bg-brand/90 border-0 flex items-center justify-center gap-2">
            السؤال التالي <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
