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
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className="glass-panel p-5 sm:p-8">
        <h1 className="text-xl sm:text-3xl font-bold text-white">جاهز للبدء</h1>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed sm:leading-7 text-white/70">
          عندما يكون العدد كافياً، استعرض السؤال الأول وقرّر مع المجموعة إذا كان يستحق النقاش.
        </p>
        <div className="mt-5 sm:mt-8 rounded-2xl border border-white/10 bg-surfaceCold/80 p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-white/50">الجلسة</p>
              <p className="mt-1 text-sm sm:text-xl font-bold text-white uppercase">{session?.topic ?? "موضوع عشوائي"}</p>
            </div>
            <div className="text-xs sm:text-sm font-semibold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-white/80">
              اللاعبين: {players.length}
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-8 flex flex-col gap-3">
          <Button type="button" onClick={fetchQuestion} className="w-full py-3.5 text-sm font-bold">
            طلب سؤال جديد
          </Button>
          <p className="text-[10px] sm:text-xs text-white/50 text-center leading-normal">إذا كنت تريد تغيير السؤال قبل التصويت، يمكنك طلب سؤال آخر.</p>
        </div>
        {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
