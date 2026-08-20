import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Clock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Target,
  Truck,
  Users,
} from "lucide-react";
import type { ProductCategory } from "@/src/types/productCategoriesType";
import CategoryCard from "@/src/components/HomePage/CategorySection/CategoryCard";

interface AboutPageProps {
  categories: ProductCategory[];
}

const valueProps = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "Veterinary and farm supplies delivered safely to every district in Bangladesh.",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    description: "Every item is sourced directly from trusted manufacturers.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns & Refunds",
    description:
      "A straightforward, hassle-free return policy on eligible items.",
  },
  {
    icon: Clock,
    title: "Always-On Support",
    description: "Our team is on hand to answer product and order questions.",
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/doctordairytools",
    path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dr-sajeeb-rana-064045423/",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
    evenOdd: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@vetcare2019",
    path: "M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z",
  },
];

export default function AboutPage({ categories }: AboutPageProps) {
  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="bg-foreground border-b border-slate-700/50">
        <div className="container py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mb-5">
              <Award size={14} aria-hidden="true" />
              About Doctor Dairy Tools
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Bangladesh&rsquo;s Trusted Partner in{" "}
              <span className="text-emerald-400">Veterinary</span> &amp;{" "}
              <span className="text-amber-400">Dairy Farm</span> Care
            </h1>
            <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              We supply genuine veterinary surgical instruments, AI supplies,
              dairy farm tools and machinery, poultry equipment, and lab items
              to farmers, veterinarians, and clinics across the country &mdash;
              trusted online since 2019.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/8801797980777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.986.579 3.837 1.579 5.395L2 22l4.72-1.55A9.947 9.947 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.062a8.02 8.02 0 0 1-4.09-1.122l-.293-.174-2.802.92.933-2.732-.19-.28A8.02 8.02 0 1 1 20.02 12a8.03 8.03 0 0 1-8.019 8.062z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative h-56 sm:h-72 lg:h-96 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/sajib.jpg"
              alt="Dairy farm and livestock care in Bangladesh"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className=""
              priority
            />
          </div>
        </div>
      </div>

      {/* Mission / Story */}
      <div className="container py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="relative h-56 sm:h-72 lg:h-96 rounded-3xl overflow-hidden shadow-lg order-2 lg:order-1">
          <Image
            src="/images/abt.jpg"
            alt="Veterinary and farm equipment supplied by Doctor Dairy Tools"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 border-l-2 border-emerald-500 pl-2">
            Our Story
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Built by people who understand farm life
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
            Doctor Dairy Tools started with a simple goal: make it easy for
            farmers, veterinarians, and clinics across Bangladesh to find
            genuine veterinary and dairy equipment without the guesswork. From
            our base in Bogra, we source surgical instruments, AI supplies,
            dairy machinery, poultry equipment, and lab items directly from
            trusted manufacturers and deliver them nationwide.
          </p>
          <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
            Every product we list is chosen with one question in mind: would we
            trust this on our own farm? That standard hasn&rsquo;t changed as
            we&rsquo;ve grown.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="a-card shadow-none! border-slate-200 p-4">
              <p className="text-2xl font-black text-emerald-700">
                {categories.length || 7}+
              </p>
              <p className="text-xs text-slate-500 mt-1">Product Categories</p>
            </div>
            <div className="a-card shadow-none! border-slate-200 p-4">
              <p className="text-2xl font-black text-emerald-700">100%</p>
              <p className="text-xs text-slate-500 mt-1">Genuine Products</p>
            </div>
            <div className="a-card shadow-none! border-slate-200 p-4">
              <p className="text-2xl font-black text-emerald-700">64</p>
              <p className="text-xs text-slate-500 mt-1">Districts Covered</p>
            </div>
            <div className="a-card shadow-none! border-slate-200 p-4">
              <p className="text-2xl font-black text-emerald-700">Vet-Led</p>
              <p className="text-xs text-slate-500 mt-1">Product Expertise</p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      {categories.length > 0 && (
        <div className="bg-secoundary/3 border-y border-slate-200">
          <div className="container py-14 sm:py-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                What We Offer
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Everything your farm or clinic needs, in one place
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <div className="container py-14 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
            Why Choose Us
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Reliable service, from order to delivery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {valueProps.map((item) => (
            <div key={item.title} className="a-card p-5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit mb-4">
                <item.icon size={20} aria-hidden="true" />
              </div>
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet the Founder */}
      <div className="bg-secoundary/3 border-y border-slate-200">
        <div className="container py-14 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
              Meet the Founder
            </p>
            <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto  ring-2 ring-emerald-100">
              <Image
                src="/images/sajizdr.jpg"
                alt="Dr. Sajeeb Rana, Founder of Doctor Dairy Tools"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Dr. Sajeeb Rana
            </h2>
            <p className="text-sm text-emerald-700 font-semibold mt-1">
              Founder, Doctor Dairy Tools
            </p>
            <p className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              A practicing veterinarian with a passion for supporting
              Bangladesh&rsquo;s farming community, Dr. Sajeeb Rana founded
              Doctor Dairy Tools to make genuine veterinary and dairy equipment
              accessible to farmers and clinics nationwide.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Dr. Sajeeb Rana on ${social.label}`}
                  className="text-slate-500 hover:text-emerald-700 transition-colors p-2 bg-white rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {social.evenOdd ? (
                      <path
                        fillRule="evenodd"
                        d={social.path}
                        clipRule="evenodd"
                      />
                    ) : (
                      <path d={social.path} />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="container py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-12 sm:px-12 sm:py-16 text-center">
          <div className="relative flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 mb-5">
              <Target size={24} aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white max-w-xl">
              Ready to equip your farm or clinic?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg">
              Explore our full catalog of veterinary and dairy farm products, or
              reach out and our team will help you find what you need.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Shop Now
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href="mailto:doctordairytoolsbd@gmail.com"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-5 py-3 rounded-xl text-sm border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Mail size={16} aria-hidden="true" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Us */}
      <div className="container pb-14 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <div className="a-card p-5 flex items-start gap-3">
            <MapPin
              size={18}
              className="text-emerald-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Visit Us
              </p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                প্রজাবাহীনী প্রেস লেন (অন্নপূর্ণা হোটেলের গলি), সাতমাথা, বগুড়া
                সদর, Puran Bogra, Bangladesh, 5800
              </p>
            </div>
          </div>
          <div className="a-card p-5 flex items-start gap-3">
            <Phone
              size={18}
              className="text-emerald-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Call Us
              </p>
              <a
                href="tel:+8801797980777"
                className="text-sm text-slate-600 mt-1 leading-relaxed inline-block hover:text-emerald-700 transition-colors focus:outline-none focus:underline"
              >
                +880 1797-980777
              </a>
            </div>
          </div>
          <div className="a-card p-5 flex items-start gap-3">
            <Users
              size={18}
              className="text-emerald-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Email Us
              </p>
              <a
                href="mailto:doctordairytoolsbd@gmail.com"
                className="text-sm text-slate-600 mt-1 leading-relaxed inline-block hover:text-emerald-700 transition-colors focus:outline-none focus:underline break-all"
              >
                doctordairytoolsbd@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
