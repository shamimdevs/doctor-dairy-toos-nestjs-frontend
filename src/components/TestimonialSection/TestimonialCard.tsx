import Image from "next/image";
import { Star, Quote, Calendar, Award } from "lucide-react";

export interface ITestimonial {
  id: string;
  name: string;
  designation: string;
  image: string;
  description: string;
  rating: string;
  performance: number;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------
// Extracted Card Component & Props
// ----------------------------------------------------------------------
interface TestimonialCardProps {
  item: ITestimonial;
}

export function TestimonialCard({ item }: TestimonialCardProps) {
  const numericRating = parseFloat(item?.rating) || 5;

  const renderStars = (ratingNum: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingNum);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-slate-300" />,
      );
    }

    return stars;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-md  transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Card Body */}
      <div className="p-6">
        {/* Header info / Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
            <Image
              src={item?.image || "/placeholder.jpg"}
              alt={item?.name || "Client Avatar"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-base font-bold text-slate-800 truncate">
              {item?.name}
            </h3>
            <p className="text-xs text-emerald-600 font-medium truncate">
              {item?.designation}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(numericRating)}
              <span className="text-xs text-slate-400 font-medium ml-1">
                ({numericRating.toFixed(1)})
              </span>
            </div>
          </div>
          <Quote className="w-6 h-6 text-emerald-100 mb-1" />
        </div>

        {/* Quote Content */}
        <div className="relative">
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-5">
            {item?.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
          <Award className="w-3 h-3" /> Verified
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(item?.created_at)}
        </span>
      </div>
    </div>
  );
}
