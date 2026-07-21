"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Award,
  Users,
  Package,
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
  icon: React.ReactNode;
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "What products do you offer?",
      questionBn: "আপনারা কী কী পণ্য সরবরাহ করেন?",
      answer:
        "We offer a comprehensive range of veterinary and farm products including surgical instruments, artificial insemination supplies, dairy farm tools and machinery, poultry equipment, veterinary lab items, animal nutrition supplements, and medicines.",
      answerBn:
        "আমরা ভেটেরিনারি এবং খামার পণ্যের একটি বিস্তৃত পরিসর অফার করি যার মধ্যে রয়েছে অস্ত্রোপচারের যন্ত্রপাতি, কৃত্রিম প্রজনন সরবরাহ, ডেইরি ফার্মের সরঞ্জাম ও যন্ত্রপাতি, পোল্ট্রি সরঞ্জাম, ভেটেরিনারি ল্যাব আইটেম, পশু পুষ্টি সাপ্লিমেন্ট এবং ওষুধ।",
      icon: <Package className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 2,
      question: "How can I place an order?",
      questionBn: "কীভাবে আমি অর্ডার দিতে পারি?",
      answer:
        "You can place an order through our website by browsing products, adding them to your cart, and proceeding to checkout. You can also contact our customer support for assistance with bulk orders.",
      answerBn:
        "আপনি আমাদের ওয়েবসাইটের মাধ্যমে পণ্য ব্রাউজ করে, কার্টে যোগ করে এবং চেকআউটে গিয়ে অর্ডার দিতে পারেন। বাল্ক অর্ডারের জন্য আপনি আমাদের গ্রাহক সহায়তার সাথে যোগাযোগ করতে পারেন।",
      icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      questionBn: "আপনারা কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?",
      answer:
        "We accept various payment methods including credit/debit cards (Visa, MasterCard), mobile banking (bKash, Nagad, Rocket), bank transfers, and cash on delivery for eligible areas.",
      answerBn:
        "আমরা ক্রেডিট/ডেবিট কার্ড (ভিসা, মাস্টারকার্ড), মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট), ব্যাংক ট্রান্সফার এবং যোগ্য এলাকায় ডেলিভারির সময় নগদ সহ বিভিন্ন পেমেন্ট পদ্ধতি গ্রহণ করি।",
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 4,
      question: "Are your products genuine and high quality?",
      questionBn: "আপনাদের পণ্যগুলো কি আসল এবং উচ্চ মানের?",
      answer:
        "Absolutely! All our products are sourced from reputable manufacturers and suppliers. We maintain strict quality control standards and only offer products that meet international quality certifications.",
      answerBn:
        "একেবারেই! আমাদের সকল পণ্য সম্মানিত প্রস্তুতকারক এবং সরবরাহকারীদের থেকে সংগ্রহ করা হয়। আমরা কঠোর মান নিয়ন্ত্রণ মান বজায় রাখি এবং শুধুমাত্র আন্তর্জাতিক মানের সার্টিফিকেশন পূরণ করে এমন পণ্য অফার করি।",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 5,
      question: "Do you offer product warranties?",
      questionBn: "আপনারা কি পণ্যের ওয়ারেন্টি দেন?",
      answer:
        "Yes, we provide manufacturer warranties on all equipment and machinery. The warranty period varies by product and is clearly mentioned on each product page. We also offer after-sales support for all products.",
      answerBn:
        "হ্যাঁ, আমরা সকল যন্ত্রপাতি এবং মেশিনারিতে প্রস্তুতকারকের ওয়ারেন্টি প্রদান করি। ওয়ারেন্টি সময়কাল পণ্য অনুযায়ী পরিবর্তিত হয় এবং প্রতিটি পণ্য পৃষ্ঠায় স্পষ্টভাবে উল্লেখ করা আছে। আমরা সকল পণ্যের জন্য বিক্রয়োত্তর সহায়তা প্রদান করি।",
      icon: <Award className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 6,
      question: "What are your delivery charges?",
      questionBn: "আপনাদের ডেলিভারি চার্জ কত?",
      answer:
        "Delivery charges depend on your location and the weight of your order. We offer free delivery on orders above a certain amount. You can see the exact delivery cost at checkout based on your address.",
      answerBn:
        "ডেলিভারি চার্জ আপনার অবস্থান এবং অর্ডারের ওজনের উপর নির্ভর করে। আমরা নির্দিষ্ট পরিমাণের উপরে অর্ডারে বিনামূল্যে ডেলিভারি অফার করি। আপনার ঠিকানার ভিত্তিতে চেকআউটে সঠিক ডেলিভারি খরচ দেখতে পাবেন।",
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 7,
      question: "How long does delivery take?",
      questionBn: "ডেলিভারি পেতে কত সময় লাগে?",
      answer:
        "Delivery time varies by location. Major cities typically receive orders within 24-48 hours, while rural areas may take 2-4 days. We provide tracking information once your order is shipped.",
      answerBn:
        "ডেলিভারি সময় অবস্থান অনুযায়ী পরিবর্তিত হয়। প্রধান শহরগুলিতে সাধারণত ২৪-৪৮ ঘন্টার মধ্যে অর্ডার পৌঁছায়, গ্রামীণ এলাকায় ২-৪ দিন সময় লাগতে পারে। আপনার অর্ডার পাঠানোর পরে আমরা ট্র্যাকিং তথ্য প্রদান করি।",
      icon: <Clock className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 8,
      question: "What is your return policy?",
      questionBn: "আপনাদের রিটার্ন নীতি কী?",
      answer:
        "We offer a hassle-free return policy. If you're not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange. Products must be in original condition and packaging.",
      answerBn:
        "আমরা একটি ঝামেলামুক্ত রিটার্ন নীতি অফার করি। আপনার কেনাকাটা নিয়ে সন্তুষ্ট না হলে, আপনি সম্পূর্ণ ফেরত বা বিনিময়ের জন্য ডেলিভারির ৭ দিনের মধ্যে ফেরত দিতে পারেন। পণ্যগুলি অবশ্যই আসল অবস্থায় এবং প্যাকেজিংয়ে থাকতে হবে।",
      icon: <RefreshCw className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 9,
      question: "Do you offer bulk discounts?",
      questionBn: "আপনারা কি বাল্ক ডিসকাউন্ট দেন?",
      answer:
        "Yes, we offer attractive bulk discounts for wholesale and commercial orders. The discount rate depends on the order volume and product category. Please contact our wholesale team for a custom quote.",
      answerBn:
        "হ্যাঁ, আমরা পাইকারি ও বাণিজ্যিক অর্ডারের জন্য আকর্ষণীয় বাল্ক ডিসকাউন্ট অফার করি। ডিসকাউন্ট হার অর্ডারের পরিমাণ এবং পণ্য বিভাগের উপর নির্ভর করে। কাস্টম উদ্ধৃতির জন্য আমাদের পাইকারি দলের সাথে যোগাযোগ করুন।",
      icon: <Users className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 10,
      question: "How can I contact customer support?",
      questionBn: "কীভাবে আমি গ্রাহক সহায়তার সাথে যোগাযোগ করতে পারি?",
      answer:
        "You can reach our customer support team via phone, email, or live chat. We're available Monday to Saturday from 8 AM to 8 PM. For urgent queries, please call our hotline or use the live chat feature.",
      answerBn:
        "আপনি ফোন, ইমেল বা লাইভ চ্যাটের মাধ্যমে আমাদের গ্রাহক সহায়তা দলের সাথে যোগাযোগ করতে পারেন। আমরা সোমবার থেকে শনিবার সকাল ৮টা থেকে রাত ৮টা পর্যন্ত উপলব্ধ। জরুরী প্রশ্নের জন্য, দয়া করে আমাদের হটলাইনে কল করুন বা লাইভ চ্যাট বৈশিষ্ট্যটি ব্যবহার করুন।",
      icon: <MessageCircle className="w-5 h-5 text-emerald-600" />,
    },
  ];

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.questionBn.includes(searchTerm) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answerBn.includes(searchTerm),
  );

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <HelpCircle className="w-4 h-4" />
          Frequently Asked Questions
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          Got Questions? We've Got Answers
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          Find answers to commonly asked questions about our products, services,
          ordering process, and more
        </p>
      </div>

      {/* FAQ List with Image */}
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            No questions found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Image */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl overflow-hidden shadow-xl h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop"
                alt="Veterinary and Farm Products"
                fill
                className="object-cover opacity-40"
              />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mb-4">
                  <HelpCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
                <p className="text-emerald-100 text-sm mb-6">
                  Can't find your question? We're here to help!
                </p>
                <div className="space-y-3 w-full max-w-xs">
                  <a
                    href="tel:+8801234567890"
                    className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    +880 1234-567890
                  </a>
                  <a
                    href="mailto:support@example.com"
                    className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                  >
                    <Mail className="w-4 h-4" />
                    support@example.com
                  </a>
                </div>
                <p className="text-xs text-emerald-200 mt-4">
                  Available Mon-Sat, 8AM - 8PM
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredFAQs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full px-4 md:px-6 py-4 flex items-start md:items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1 md:mt-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                        {item.question}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.questionBn}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-1 md:mt-0">
                    {openId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      openId === item.id
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }
                  `}
                >
                  <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 border-t border-slate-100">
                    <div className="pl-8 md:pl-10">
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        {item.answer}
                      </p>
                      <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-2">
                        {item.answerBn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Help Section */}
      <div className="mt-8 lg:hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-semibold">Still Have Questions?</h3>
          </div>
          <p className="text-sm text-emerald-100 mb-4">
            Call or email us for immediate assistance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+8801234567890"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors text-sm font-semibold w-full sm:w-auto justify-center"
            >
              <Phone className="w-4 h-4" />
              +880 1234-567890
            </a>
            <a
              href="mailto:support@example.com"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors text-sm font-semibold w-full sm:w-auto justify-center"
            >
              <Mail className="w-4 h-4" />
              support@example.com
            </a>
          </div>
          <p className="text-xs text-emerald-200 mt-3">
            Available Mon-Sat, 8AM - 8PM
          </p>
        </div>
      </div>
    </section>
  );
}
