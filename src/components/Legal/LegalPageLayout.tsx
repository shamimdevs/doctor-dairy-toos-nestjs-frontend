import Link from "next/link";
import { Mail, Phone, type LucideIcon } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
};

interface LegalPageLayoutProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export default function LegalPageLayout({
  icon: Icon,
  eyebrow,
  title,
  description,
  effectiveDate,
  lastUpdated,
  sections,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="bg-foreground border-b border-slate-700/50">
        <div className="container py-14 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2">
              <Link
                href="/"
                className="hover:text-emerald-300 transition-colors"
              >
                Home
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">{eyebrow}</span>
            </nav>
          </div>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Icon size={28} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
                {description}
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Effective Date:{" "}
                <span className="text-slate-300 font-medium">
                  {effectiveDate}
                </span>
                <span className="mx-2 text-slate-600">|</span>
                Last Updated:{" "}
                <span className="text-slate-300 font-medium">
                  {lastUpdated}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* Table of contents */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <nav
              aria-label="Table of contents"
              className="a-card shadow-none! lg:shadow-xs! p-4"
            >
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 border-l-2 border-emerald-500 pl-2">
                On this page
              </p>
              <ul className="space-y-1 text-sm max-h-[60vh] overflow-y-auto scrollbar-sm pr-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block py-1.5 px-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="a-card shadow-none! lg:shadow-xs! mt-4 p-4">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 border-l-2 border-emerald-500 pl-2">
                Need help?
              </p>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Mail
                    size={15}
                    className="text-emerald-600 shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:doctordairytoolsbd@gmail.com"
                    className="hover:text-emerald-700 transition-colors focus:outline-none focus:underline break-all"
                  >
                    doctordairytoolsbd@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    size={15}
                    className="text-emerald-600 shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href="tel:+8801797980777"
                    className="hover:text-emerald-700 transition-colors focus:outline-none focus:underline"
                  >
                    +880 1797-980777
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
