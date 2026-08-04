import { AlertTriangle, Info } from "lucide-react";

interface LegalNoticeProps {
  variant?: "info" | "warning";
  title: string;
  children: React.ReactNode;
}

export default function LegalNotice({
  variant = "info",
  title,
  children,
}: LegalNoticeProps) {
  const isWarning = variant === "warning";
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div
      className={`rounded-xl border p-4 flex gap-3 ${
        isWarning
          ? "bg-amber-50 border-amber-200"
          : "bg-emerald-50 border-emerald-200"
      }`}
    >
      <Icon
        size={18}
        className={`shrink-0 mt-0.5 ${
          isWarning ? "text-amber-600" : "text-emerald-600"
        }`}
        aria-hidden="true"
      />
      <div className="text-sm text-slate-700 leading-relaxed">
        <p className={`font-bold mb-1 ${isWarning ? "text-amber-800" : "text-emerald-800"}`}>
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}
