// src/utils/slugify.ts
export const slugify = (text: string): string => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\p{L}\p{N}\-]+/gu, "") // Remove all chars except unicode letters/numbers/hyphens (keeps Bangla and other scripts)
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
};

// Test cases
// slugify("Baby Care") → "baby-care"
// slugify("Men's Health") → "mens-health"
// slugify("Vitamins & Supplements") → "vitamins-supplements"
// slugify("গবাদি পশুর খাদ্য") → "গবাদি-পশুর-খাদ্য"
