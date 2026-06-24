import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";
import { CheckIcon, HourglassIcon } from "../components/Icons";

export default function VotingPage() {
  const { currentQuestion, players, votes, submitVote, error, loadResults, loading } = useSession();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [selectedVotedForId, setSelectedVotedForId] = useState<string | null>(null);
  const navigate = useNavigate();

  const remainingPlayers = useMemo(
    () => players.filter((player) => !votes[player._id]),
    [players, votes]
  );

  useEffect(() => {
    if (!activePlayerId && remainingPlayers.length) {
      setActivePlayerId(remainingPlayers[0]._id);
      setSelectedVotedForId(null);
    }
  }, [activePlayerId, remainingPlayers]);

  const handleVote = async () => {
    if (!activePlayerId || !currentQuestion || !selectedVotedForId) return;
    await submitVote(activePlayerId, selectedVotedForId);

    const next = remainingPlayers.find((player) => player._id !== activePlayerId);
    setActivePlayerId(next ? next._id : null);
    setSelectedVotedForId(null);

    if (remainingPlayers.length <= 1) {
      await loadResults();
      navigate("/results");
    }
  };

  const handleSeeResults = async () => {
    await loadResults();
    navigate("/results");
  };

  const activePlayerName = activePlayerId ? players.find((p) => p._id === activePlayerId)?.name : "";

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">تصويت الإقناع</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">من كان الأكثر إقناعاً؟</h1>
          <p className="text-xs leading-relaxed text-white/70">
            صوت للاعب الذي قدم أفضل الحجج في هذه الجولة. لا يمكنك التصويت لنفسك.
          </p>
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">اللاعب الذي يصوت الآن</p>
            <p className="mt-1 text-base sm:text-lg font-bold text-brand">
              {activePlayerName || "جميع التصويتات مكتملة"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">التقدم</p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-white/80">
              {players.length - remainingPlayers.length} من {players.length}
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-white/70 mb-3">اختر اللاعب الأكثر إقناعاً:</p>
          <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1">
            {players.map((player) => {
              if (player._id === activePlayerId) return null; // Cannot vote for self

              const isSelected = selectedVotedForId === player._id;

              return (
                <button
                  key={player._id}
                  type="button"
                  onClick={() => setSelectedVotedForId(player._id)}
                  className={`w-full rounded-xl px-4 py-3 text-right transition-all duration-200 border flex justify-between items-center ${
                    isSelected
                      ? "border-brand bg-brand/10 text-white shadow-sm shadow-brand/5"
                      : "border-white/5 bg-white/5 text-white/80 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="font-semibold text-sm">{player.name}</span>
                  {isSelected && <CheckIcon className="w-4 h-4 text-brand" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 sm:mt-8 space-y-2.5">
          <Button
            type="button"
            onClick={handleVote}
            disabled={!activePlayerId || !selectedVotedForId || loading}
            className="w-full py-3.5 text-sm font-bold bg-brand text-surface hover:bg-brand/90 border-0 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            تأكيد التصويت
          </Button>
          
          <Button type="button" variant="ghost" onClick={handleSeeResults} className="w-full py-2.5 text-xs text-white/50 hover:text-white transition">
            تخطي وعرض النتائج الآن
          </Button>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
