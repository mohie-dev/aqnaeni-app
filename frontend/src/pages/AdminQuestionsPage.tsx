import { useEffect, useState, type FormEvent } from "react";
import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
import { createQuestion, deleteQuestion, getQuestions, updateQuestion } from "../lib/api";
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
  const [filterTopic, setFilterTopic] = useState<"all" | Topic>("all");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTopic, setEditTopic] = useState<Topic>("random");
  const [message, setMessage] = useState<string | null>(null);

  const loadQuestions = async (topicFilter: "all" | Topic = filterTopic) => {
    setMessage(null);

    try {
      const questions = await getQuestions(topicFilter === "all" ? undefined : topicFilter);
      setQuestions(questions);
    } catch {
      setMessage("فشل تحميل الأسئلة");
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [filterTopic]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const question = await createQuestion({ content, topic, mood: "medium" });

      if (filterTopic === "all" || filterTopic === question.topic) {
        setQuestions((current) => [question, ...current]);
      }

      setContent("");
      setMessage("تم إنشاء السؤال بنجاح.");
    } catch {
      setMessage("خطأ في إنشاء السؤال. حاول مرة أخرى.");
    }
  };

  const startEditing = (question: Question) => {
    setEditingQuestionId(question._id);
    setEditContent(question.content);
    setEditTopic(question.topic);
    setMessage(null);
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditContent("");
    setEditTopic("random");
  };

  const handleUpdate = async (questionId: string) => {
    setMessage(null);

    try {
      const updatedQuestion = await updateQuestion(questionId, {
        content: editContent,
        topic: editTopic,
      });

      setQuestions((current) =>
        current.map((question) =>
          question._id === questionId ? updatedQuestion : question
        )
      );
      setMessage("تم تحديث السؤال بنجاح.");
      cancelEditing();
    } catch {
      setMessage("خطأ في تحديث السؤال. حاول مرة أخرى.");
    }
  };

  const handleDelete = async (questionId: string) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا السؤال؟");

    if (!confirmed) {
      return;
    }

    setMessage(null);

    try {
      await deleteQuestion(questionId);
      setQuestions((current) => current.filter((question) => question._id !== questionId));
      setMessage("تم حذف السؤال بنجاح.");
    } catch {
      setMessage("خطأ في حذف السؤال. حاول مرة أخرى.");
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">قائمة الأسئلة الحالية</h2>
              <p className="text-sm text-white/70">فلتر الأسئلة حسب الموضوع للعرض السريع.</p>
            </div>
            <div className="max-w-sm">
              <label className="mb-2 block text-sm font-medium text-white/80">عرض حسب الموضوع</label>
              <select
                value={filterTopic}
                onChange={(event) => setFilterTopic(event.target.value as "all" | Topic)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="all" className="bg-surface">الكل</option>
                {topics.map((option) => (
                  <option key={option.value} value={option.value} className="bg-surface">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {questions.length ? (
              questions.map((question) => (
                <div key={question._id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  {editingQuestionId === question._id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">تعديل النص</label>
                        <textarea
                          value={editContent}
                          onChange={(event) => setEditContent(event.target.value)}
                          className="h-28 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">الموضوع</label>
                        <select
                          value={editTopic}
                          onChange={(event) => setEditTopic(event.target.value as Topic)}
                          className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        >
                          {topics.map((option) => (
                            <option key={option.value} value={option.value} className="bg-surface">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button type="button" onClick={() => handleUpdate(question._id)}>
                          حفظ التعديلات
                        </Button>
                        <Button type="button" variant="secondary" onClick={cancelEditing}>
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p>{question.content}</p>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">{question.topic}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button type="button" variant="secondary" onClick={() => startEditing(question)}>
                          تعديل
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => handleDelete(question._id)}>
                          حذف
                        </Button>
                      </div>
                    </>
                  )}
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
