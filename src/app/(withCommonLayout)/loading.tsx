import { CategorySkeleton } from "@/src/components/shared/Loading/CategorySkeleton";
import { FAQItemSkeleton } from "@/src/components/shared/Loading/FAQSectionSkeleton";
import { HeroSkeleton } from "@/src/components/shared/Loading/HeroSkeleton";
import { ProductShowcaseSkeleton } from "@/src/components/shared/Loading/ProductShowcaseSkeleton";
import TestimonialSectionSkeleton from "@/src/components/shared/Loading/TestimonialSectionSkeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <CategorySkeleton />
      <ProductShowcaseSkeleton />
      <TestimonialSectionSkeleton />
      <FAQItemSkeleton />
    </>
  );
}
