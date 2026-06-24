import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../lib/session-context";
import { HourglassIcon, ArrowRightIcon, CheckIcon, CrossIcon } from "../components/Icons";

export default function SpeakingPage() {
  const { session, players, currentQuestion, stances, loadStances, error } = useSession();
  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Try to load a generic alert sound if possible, or we could just rely on visual
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  useEffect(() => {
    if (!session || !currentQuestion) {
      navigate("/");
    }
  }, [session, currentQuestion, navigate]);

  useEffect(() => {
    if (session && currentQuestion) {
      loadStances().catch(() => null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleTimeUp = () => {
    setIsTimeUp(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => null);
    }

    // Auto-advance after 3 seconds
    setTimeout(() => {
      handleNextPlayer();
    }, 3000);
  };

  const handleStartSpeaking = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeRemaining(seconds);
    setIsActive(true);
    setIsTimeUp(false);
  };

  const handleNextPlayer = () => {
    setIsTimeUp(false);
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setTimeRemaining(selectedTime || 60);
      setIsActive(true);
    } else {
      navigate("/vote");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (selectedTime === null) {
    return (
      <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
        <div className="glass-panel p-5 sm:p-8">
          <div className="space-y-2 text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.32em] text-white/50">وقت التحدث</p>
            <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">اختر مدة التحدث لكل لاعب</h1>
            <p className="text-xs leading-relaxed text-white/70">
              سيحصل كل لاعب على هذا الوقت بالكامل لإبداء رأيه (موافق/معارض) وتبريره.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button type="button" onClick={() => handleStartSpeaking(60)} className="w-full py-4 text-lg font-bold">
              60 ثانية
            </Button>
            <Button type="button" onClick={() => handleStartSpeaking(90)} className="w-full py-4 text-lg font-bold bg-brand/80">
              90 ثانية
            </Button>
            <Button type="button" onClick={() => handleStartSpeaking(120)} className="w-full py-4 text-lg font-bold bg-brand/60">
              120 ثانية
            </Button>
          </div>
          {error ? <p className="mt-4 text-xs sm:text-sm text-rose-400 text-center">{error}</p> : null}
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];
  const currentStance = currentPlayer ? stances[currentPlayer._id] : null;

  return (
    <div className="mx-auto max-w-xl px-2 py-4 sm:px-6 sm:py-8">
      <div className={`glass-panel p-5 sm:p-8 transition-colors duration-500 ${isTimeUp ? 'border-rose-500/50 bg-rose-500/10 shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)]' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/50">
            لاعب {currentPlayerIndex + 1} من {players.length}
          </p>
          <div className="flex gap-2">
            {currentStance && (
              <span className={`text-[10px] sm:text-xs px-2 py-1 rounded flex items-center gap-1 font-bold ${currentStance === 'agree' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {currentStance === 'agree' ? <><CheckIcon className="w-3 h-3"/> موافق</> : <><CrossIcon className="w-3 h-3"/> معارض</>}
              </span>
            )}
            <p className="text-[10px] sm:text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
              {formatTime(selectedTime)}
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-white/70">الدور الآن على</p>
          <h2 className="text-3xl sm:text-5xl font-black text-brand break-words">{currentPlayer?.name}</h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className={`relative flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 rounded-full border-[6px] ${isTimeUp ? 'border-rose-500 text-rose-500 animate-pulse' : timeRemaining <= 10 ? 'border-amber-400 text-amber-400' : 'border-brand text-brand'} bg-surface shadow-2xl`}>
            {isTimeUp ? (
              <div className="text-center">
                <span className="block text-4xl sm:text-5xl font-black mb-2">انتهى الوقت!</span>
                <span className="text-xs text-white/70">جاري الانتقال...</span>
              </div>
            ) : (
              <span className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums">
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-10">
          {!isTimeUp && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsActive(false);
                handleNextPlayer();
              }}
              className="w-full py-3.5 text-sm flex items-center justify-center gap-2 border-white/10 hover:bg-white/10"
            >
              إنهاء الدور مبكراً <ArrowRightIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
