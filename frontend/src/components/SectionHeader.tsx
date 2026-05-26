interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.28em] text-white/50">{eyebrow}</p>
      <h2 className="max-w-2xl text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{description}</p>
    </div>
  );
}
