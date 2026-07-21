// src/utils/slugify.ts
export const slugify = (text: string): string => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
};

// Test cases
// slugify("Baby Care") → "baby-care"
// slugify("Men's Health") → "mens-health"
// slugify("Vitamins & Supplements") → "vitamins-supplements"
