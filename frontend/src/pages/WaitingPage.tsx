import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";

export default function WaitingPage() {
  const { session, players, currentQuestion, fetchQuestion, error } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentQuestion) {
      navigate("/approval");
    }
  }, [currentQuestion, navigate]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="glass-panel p-8">
        <h1 className="text-3xl font-semibold text-white">جاهز للبدء</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          عندما يكون العدد كافياً، استعرض السؤال الأول وقرّر مع المجموعة إذا كان يستحق النقاش.
        </p>
        <div className="mt-8 rounded-[28px] border border-white/10 bg-surfaceCold/80 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">الجلسة</p>
              <p className="mt-2 text-xl font-semibold text-white">{session?.topic ?? "موضوع عشوائي"}</p>
            </div>
            <div className="text-sm text-white/70">عدد اللاعبين: {players.length}</div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="button" onClick={fetchQuestion}>
            طلب سؤال جديد
          </Button>
          <p className="text-sm text-white/60">إذا كنت تريد تغيير السؤال قبل التصويت، يمكنك طلب سؤال آخر.</p>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
