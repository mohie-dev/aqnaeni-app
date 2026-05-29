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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.32em] text-white/50">إضافة أصدقاء</p>
          <h1 className="text-3xl font-semibold text-white">شارك الكود وجمع اللاعبين</h1>
          <p className="text-sm leading-7 text-white/70">
            أدخل أسماء الأصدقاء واحدًا تلو الآخر، واقرأ الكود ليستخدمه الجميع عند الانضمام إلى الجلسة.
          </p>
        </div>
        <div className="mt-8 rounded-[28px] border border-white/10 bg-surfaceCold/80 p-6">
          <div className="flex flex-col gap-3 text-white/80 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">رمز الجلسة</p>
              <p className="mt-2 text-2xl font-semibold text-white">{session?.code ?? "----"}</p>
            </div>
            <p className="text-sm text-white/60">عدد اللاعبين: {players.length}</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="player-name">
            اسم اللاعب
          </label>
          <input
            id="player-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="اسم اللاعب"
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <Button type="submit" disabled={loading || submitted}>
            {loading && submitted ? "جارٍ الإضافة..." : "إضافة لاعب"}
          </Button>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

        <div className="mt-8 space-y-4">
          <p className="text-sm text-white/70">قائمة اللاعبين</p>
          <div className="space-y-2">
            {players.length ? (
              players.map((player) => (
                <div
                  key={player._id}
                  className="flex flex-row items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80"
                >
                  <span className="flex-1">{player.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-shrink-0"
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
                    {loading && removingPlayerId === player._id ? "جارٍ الحذف..." : "حذف"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-white/50">
                لم يضف أحد نفسه بعد — ادعُ أصدقاءك!
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" onClick={() => navigate("/waiting")} disabled={players.length < 2}>
            بدء الجلسة
          </Button>
          <p className="text-sm text-white/60">
            نحتاج لاعبين اثنين على الأقل — لا تكن اللاعب الوحيد.
          </p>
        </div>
      </div>
    </div>
  );
}
