import { useEffect, useState, type FormEvent } from "react";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import { createQuestion, getQuestions } from "../lib/api";
import type { Question, Topic } from "../lib/types";

const topics: Array<{ value: Topic; label: string }> = [
  { value: "random", label: "متنوع" },
  { value: "debate", label: "جدل" },
  { value: "trendy", label: "تريند" },
  { value: "relationships", label: "علاقات" },
  { value: "deep", label: "عميق" },
  { value: "gym", label: "ELGYM" },
];

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState<Topic>("random");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getQuestions()
      .then(setQuestions)
      .catch(() => setMessage("فشل تحميل الأسئلة"));
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const question = await createQuestion({ content, topic, mood: "medium" });
      setQuestions((current) => [question, ...current]);
      setContent("");
      setMessage("تم إنشاء السؤال بنجاح.");
    } catch {
      setMessage("خطأ في إنشاء السؤال. حاول مرة أخرى.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SectionHeader
        eyebrow="إدارة الأسئلة"
        title="لوحة التحكم السريعة لأسئلة النقاش"
        description="أضف أسئلة جديدة وراجع المجموعة الحالية من الأسئلة التي يمكن أن تظهر في الجلسة." 
      />
      <div className="mt-8 space-y-8">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-white">إضافة سؤال جديد</h2>
          <form onSubmit={handleCreate} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">النص</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="اكتب السؤال هنا"
                className="h-36 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">الموضوع</label>
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value as Topic)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                {topics.map((option) => (
                  <option key={option.value} value={option.value} className="bg-surface">{option.label}</option>
                ))}
              </select>
            </div>
            <Button type="submit">حفظ السؤال</Button>
            {message ? <p className="text-sm text-white/70">{message}</p> : null}
          </form>
        </div>

        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-white">قائمة الأسئلة الحالية</h2>
          <div className="mt-6 space-y-3">
            {questions.length ? (
              questions.map((question) => (
                <div key={question._id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p>{question.content}</p>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">{question.topic}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/60">
                لا يوجد أسئلة بعد.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
