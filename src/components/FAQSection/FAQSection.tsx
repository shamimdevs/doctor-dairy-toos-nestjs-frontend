"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

export interface IFAQItem {
  id: string;
  question: string;
  answer: string;
  questionBn?: string;
  answerBn?: string;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FAQSectionProps {
  faqs?: IFAQItem[];
}

export default function FAQSection({ faqs = [] }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <HelpCircle className="w-4 h-4" />
          সচরাচর জিজ্ঞাসিত প্রশ্ন
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          আপনার প্রশ্নের উত্তর এখানেই
        </h2>

        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto mb-6">
          ডক্টর ডেইরি টুলস সম্পর্কে আপনার সাধারণ প্রশ্নগুলোর উত্তর এখানে পাবেন।
        </p>
      </div>

      <div className="grid my-28 md:grid-cols-2 grid-cols-1 gap-4">
        {/* Left Side: Image/Illustration */}
        <div className=" ">
          <Image
            src="/images/faq.png"
            alt="Doctor Dairy Tools Knowledge Base FAQ Hub illustration"
            width={700}
            height={600}
            className=" p-4"
          />
        </div>

        {/* Right Side: Accordion Items */}
        <div className="pr-3 h-96 overflow-y-scroll  space-y-3">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white  rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                      {item.question}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}
                    `}
                >
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed pl-11">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
