import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";

export default function VotingPage() {
  const { currentQuestion, players, votes, submitVote, error, loadResults } = useSession();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const navigate = useNavigate();

  const remainingPlayers = useMemo(
    () => players.filter((player) => !votes[player._id]),
    [players, votes]
  );

  useEffect(() => {
    if (!activePlayerId && remainingPlayers.length) {
      setActivePlayerId(remainingPlayers[0]._id);
    }
  }, [activePlayerId, remainingPlayers]);

  const handleVote = async (value: "agree" | "disagree") => {
    if (!activePlayerId || !currentQuestion) return;
    await submitVote(activePlayerId, value);

    const next = remainingPlayers.find((player) => player._id !== activePlayerId);
    setActivePlayerId(next ? next._id : null);

    if (remainingPlayers.length <= 1) {
      await loadResults();
      navigate("/results");
    }
  };

  const handleSeeResults = async () => {
    await loadResults();
    navigate("/results");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">التصويت الجماعي</p>
          <h1 className="text-xl font-semibold text-white">صوت لكل لاعب في المجموعة</h1>
          <p className="text-xs leading-7 text-white/70">
            اختر اللاعب ثم سجّل رأيه في السؤال. يمكنك تحويل الجلسة من نقاش هادئ إلى حماس سريع.
          </p>
        </div>

        <div className="mt-8 rounded-[32px] border border-white/10 bg-surfaceCold/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">السؤال</p>
          <p className="mt-4 text-l font-semibold text-white">{currentQuestion?.content ?? "جارٍ تحميل السؤال..."}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/70">اللاعب الذي يصوت الآن</p>
            <div className="mt-4 rounded-3xl bg-surface/95 px-4 py-5 text-lg font-semibold text-white">
              {activePlayerId
                ? players.find((player) => player._id === activePlayerId)?.name
                : "جميع التصويتات مكتملة"}
            </div>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <p>مكتمل: {players.length - remainingPlayers.length}/{players.length}</p>
              <p>متبقي: {remainingPlayers.length}</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/70">قائمة اللاعبين</p>
            <div className="mt-4 grid gap-2">
              {players.map((player) => (
                <button
                  key={player._id}
                  type="button"
                  onClick={() => setActivePlayerId(player._id)}
                  className={`w-full rounded-3xl px-4 py-3 text-left text-sm transition ${
                    activePlayerId === player._id
                      ? "border border-brand bg-brand/10 text-white"
                      : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{player.name}</span>
                    <span className="text-xs text-white/50">{votes[player._id] ? votes[player._id] : "مخترش"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="button" onClick={() => handleVote("agree")} disabled={!activePlayerId}>
            موافق
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleVote("disagree")} disabled={!activePlayerId}>
            معارض
          </Button>
          <Button type="button" variant="ghost" onClick={handleSeeResults}>
            عرض النتائج الآن
          </Button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
