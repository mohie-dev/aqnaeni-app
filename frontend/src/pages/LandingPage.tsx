import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";

const socialCards = [
  {
    title: "جلسة ونقاش حقيقي",
    description: "استخدم هاتف واحد لإدارة جلسة مع ٣ أصدقاء أو أكثر، سواء في مقهى أو سيارتك أو في المنزل.",
  },
  {
    title: "تحكم كامل للمضيف",
    description: "كمضيف، أنت تختار من يتحدث بناءً على جاهزيته بدلاً من الترتيب الإجباري، مع تحكم كامل بوقت التحدث.",
  },
  {
    title: "الكل فائز في التعادل",
    description: "لا مزيد من الظلم! إذا تعادل أكثر من شخص في الإقناع، يشارك الجميع لقب الفائز.",
  },
];

const featureCards = [
  {
    label: "1",
    title: "تحديد الموقف",
    detail: "يقرأ الجميع السؤال، ويختار كل لاعب موقفه (موافق أو معارض) سراً.",
  },
  {
    label: "2",
    title: "دور المتحدث",
    detail: "المضيف يختار من يتحدث، ويبدأ العداد الخاص به ليطرح رأيه ويقنع البقية.",
  },
  {
    label: "3",
    title: "التصويت السري",
    detail: "بعد انتهاء الجميع من التحدث، يصوت اللاعبون لمن كان رأيه الأكثر إقناعاً.",
  },
  {
    label: "4",
    title: "لوحة الشرف",
    detail: "تظهر النتائج فوراً مع عرض الفائزين وتفاصيل تصويت الجميع بشفافية.",
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-14 px-4 py-8 text-white sm:px-6">
      <section className="glass-panel overflow-hidden p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-white/50">لعبة النقاش الاجتماعي</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">اقنعني — جلسة حوارية حقيقية على هاتف واحد</h1>
            <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              سؤال يفتح جدال، صوت يقرر، ونقاش يجمع الأصدقاء في جو فوضوي ممتع. مثالي للجلسات الليلية، الكافيهات، أو أي تجمع صغير.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/create">
                <Button className="w-full sm:w-auto">ابدأ جلسة جديدة</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-surfaceCold/80 p-6 shadow-soft">
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/5 p-5 shadow-glow">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">لقطة الشاشة</p>
                <p className="mt-3 text-lg font-semibold text-white">مع ام ضد: الصحاب الولاد والبنات ينفع يبقوا مجرد صحاب</p>
                <div className="mt-6 space-y-3 rounded-3xl bg-surfaceSoft p-4">
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>السيناريو</span>
                    <span>جلسة أصدقاء</span>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    قعده مع صحابك وبتتكلموا في العلاقات و جاب سيره الصحوبيه بين الولدو البنت 
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                {socialCards.map((card) => (
                  <div key={card.title} className="glass-panel p-4">
                    <h3 className="font-semibold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="glass-panel p-8">
          <SectionHeader
            eyebrow="كيف تعمل"
            title="ثلاث خطوات سريعة لتشغيل النقاش"
            description="اقنعني يصمم تجربة سهلة على شاشة واحدة ويحول كل لحظة إلى نقاش اجتماعي مع أصدقاءك."
          />
          <div className="mt-8 grid gap-4">
            {featureCards.map((item) => (
              <div key={item.label} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-lg font-semibold text-brand">{item.label}</div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-8">
          <SectionHeader
            eyebrow="التجربة الاجتماعية"
            title="صممت للجلسات الواقعية"
            description="سريعة وقابلة للتكرار، وتؤدي إلى لحظات حقيقية من الجدل والضحك والاعتراف." 
          />
          <div className="mt-8 grid gap-4">
            <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/70">الجامعات، الكافيهات، الطريق، أو جلسات الاستراحة في النادي. الاقنعني يبقي النقاش في المركز.</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• أسئلة تكشف آراء مختلفة</li>
                <li>• تصويت سريع مع استجابات بصريّة</li>
                <li>• اختيار مدافع مفاجئ ي ضيف طاقة اجتماعية</li>
              </ul>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-surfaceCold/80 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">لماذا هي ممتعة</p>
              <p className="mt-3 text-lg font-semibold text-white">لأنها تجمع بين رأي الناس، الجدل، ورد الفعل في واجهة واحدة واضحة.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel p-8">
        <SectionHeader
          eyebrow="عرض التطبيق"
          title="شاهد شاشات اللعبة الحقيقية"
          description="من صفحة الإنشاء إلى التصويت، كل صفحة مصممة لتبقي الجلسة مرنة ومركزّة على التفاعل." 
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">إنشاء الجلسة</p>
            <p className="mt-3 text-sm text-white/70">حدد الموضوع وابدأ في دقائق.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">إضافة اللاعبين</p>
            <p className="mt-3 text-sm text-white/70">أضف أسماء الأصدقاء وجاهز للبدء.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">التصويت</p>
            <p className="mt-3 text-sm text-white/70">جميع اللاعبين يصوتون، والأجواء تبقى حماسية.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">كشف المدافع</p>
            <p className="mt-3 text-sm text-white/70">شخص يُطلب منه الدفاع عن الجانب المعاكس ويُشعل الحديث.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
