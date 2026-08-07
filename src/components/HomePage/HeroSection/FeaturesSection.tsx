import {
  ShieldCheck,
  Truck,
  RefreshCw,
  HandCoins,
  HeartHandshake,
} from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      id: 1,
      title: "মানের নিশ্চয়তা",
      description: "উন্নত মানের প্রিমিয়াম পণ্য",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 2,
      title: "দ্রুত হোম ডেলিভারি",
      description: "দ্রুত ও নির্ভরযোগ্য ডোরস্টেপ ডেলিভারি",
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 3,
      title: "এক্সচেঞ্জ সুবিধা",
      description: "সহজ ও ঝামেলাহীন রিটার্ন সুবিধা",
      icon: <RefreshCw className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 4,
      title: "সেরা দামে পণ্য",
      description: "আপনার খামারের জন্য সাশ্রয়ী মূল্য",
      icon: <HandCoins className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 5,
      title: "বিশেষজ্ঞ পরামর্শ",
      description: "খামার বিষয়ে পেশাদার দিকনির্দেশনা",
      icon: <HeartHandshake className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <section className="container py-6 md:py-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`
              flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left 
              gap-3 p-4 rounded-xl border border-slate-200
              bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200
              ${index === features.length - 1 ? "col-span-2 sm:col-span-2 lg:col-span-1" : ""}
            `}
          >
            {/* Icon Wrapper */}
            <div className="p-2.5 rounded-lg bg-emerald-50 shrink-0">
              {feature.icon}
            </div>

            {/* Text details */}
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                {feature.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
