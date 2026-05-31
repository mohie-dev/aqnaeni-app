interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] text-white/50">{eyebrow}</p>
      <h2 className="max-w-2xl text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">{title}</h2>
      <p className="max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed sm:leading-7 text-white/70">{description}</p>
    </div>
  );
}
