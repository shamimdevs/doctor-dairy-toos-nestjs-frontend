import { CategorySkeleton } from "@/src/components/shared/Loading/CategorySkeleton";
import { HeroSkeleton } from "@/src/components/shared/Loading/HeroSkeleton";
import { ProductShowcaseSkeleton } from "@/src/components/shared/Loading/ProductShowcaseSkeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <CategorySkeleton />
      <ProductShowcaseSkeleton />
    </>
  );
}
