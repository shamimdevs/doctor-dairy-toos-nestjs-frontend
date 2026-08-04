interface LegalSectionProps {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function LegalSection({
  id,
  number,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="flex items-center gap-3 text-lg sm:text-xl font-bold text-foreground mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold shrink-0">
          {number}
        </span>
        {title}
      </h2>
      <div className="pl-10 text-sm sm:text-[15px] leading-relaxed text-slate-600 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_strong]:text-foreground [&_a]:text-emerald-700 [&_a]:font-medium [&_a]:hover:underline">
        {children}
      </div>
    </section>
  );
}
