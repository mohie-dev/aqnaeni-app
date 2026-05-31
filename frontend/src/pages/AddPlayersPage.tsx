import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";

export default function AddPlayersPage() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState<string | null>(null);
  const { session, players, addPlayer, deletePlayer, loading, error } = useSession();
  const navigate = useNavigate();

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !session) return;
    setSubmitted(true);
    try {
      await addPlayer(name.trim());
      setName("");
    } catch {
      // error state handled by context
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">إضافة أصدقاء</p>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">شارك الكود وجمع اللاعبين</h1>
          <p className="text-xs sm:text-sm leading-relaxed sm:leading-7 text-white/70">
            أدخل أسماء الأصدقاء واحدًا تلو الآخر، واقرأ الكود ليستخدمه الجميع عند الانضمام إلى الجلسة.
          </p>
        </div>
        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between gap-3 text-white/80">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.24em] text-white/40">رمز الجلسة</p>
              <p className="mt-1 text-xl sm:text-2xl font-bold text-white tracking-wider">{session?.code ?? "----"}</p>
            </div>
            <p className="text-xs sm:text-sm font-semibold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-white/80">
              اللاعبين: {players.length}
            </p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="mt-5 sm:mt-8 grid gap-2.5 sm:gap-4 grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="player-name">
            اسم اللاعب
          </label>
          <input
            id="player-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="اسم اللاعب"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <Button type="submit" disabled={loading || submitted} className="py-3 text-xs sm:text-sm">
            {loading && submitted ? "جاري الإضافة..." : "إضافة لاعب"}
          </Button>
        </form>

        {error ? <p className="mt-3 text-xs sm:text-sm text-rose-400">{error}</p> : null}

        <div className="mt-5 sm:mt-8 space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-white/70">قائمة اللاعبين</p>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {players.length ? (
              players.map((player) => (
                <div
                  key={player._id}
                  className="flex flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 sm:py-3 text-xs sm:text-sm text-white/80"
                >
                  <span className="flex-1 font-medium">{player.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-shrink-0 text-xs text-rose-400 hover:text-rose-300 py-1 px-3"
                    disabled={loading && removingPlayerId === player._id}
                    onClick={async () => {
                      setRemovingPlayerId(player._id);
                      try {
                        await deletePlayer(player._id);
                      } catch {
                        // error handled by context
                      } finally {
                        setRemovingPlayerId(null);
                      }
                    }}
                  >
                    {loading && removingPlayerId === player._id ? "جاري الحذف..." : "حذف"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-5 text-xs text-white/50 text-center">
                لم ينضم أحد بعد — ادعُ أصدقاءك!
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 sm:mt-8 flex flex-col gap-2.5">
          <Button type="button" onClick={() => navigate("/waiting")} disabled={players.length < 2} className="w-full py-3.5 text-sm font-bold">
            بدء الجلسة
          </Button>
          <p className="text-[10px] sm:text-xs text-white/50 text-center leading-normal">
            نحتاج لاعبين اثنين على الأقل لبدء اللعبة.
          </p>
        </div>
      </div>
    </div>
  );
}
