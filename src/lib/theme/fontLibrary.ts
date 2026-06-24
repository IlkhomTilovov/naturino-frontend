export type FontCategory = "sans" | "serif" | "luxury";
export type FontBadge = "recommended" | "popular" | "luxury" | "modern" | "corporate";

export interface FontDefinition {
  name: string;
  categories: FontCategory[];
  type: string;
  tags: string[];
  badges?: FontBadge[];
  weights: number[];
  recommendedFor?: string[];
}

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  sans: "Sans Serif Collection",
  serif: "Serif Collection",
  luxury: "Luxury Collection",
};

export const FONT_BADGE_LABELS: Record<FontBadge, string> = {
  recommended: "Recommended",
  popular: "Most Popular",
  luxury: "Luxury",
  modern: "Modern",
  corporate: "Corporate",
};

export const FONT_LIBRARY: FontDefinition[] = [
  // Sans Serif Collection
  {
    name: "Inter",
    categories: ["sans"],
    type: "Modern Sans Serif",
    tags: ["Corporate", "Modern", "Export", "Recommended"],
    badges: ["recommended"],
    weights: [300, 400, 500, 600, 700, 800],
    recommendedFor: ["Corporate websites", "Export companies", "SaaS", "CMS"],
  },
  {
    name: "Geist",
    categories: ["sans"],
    type: "Modern Product UI",
    tags: ["Modern UI", "Tech", "Minimal"],
    badges: ["modern"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Montserrat",
    categories: ["sans"],
    type: "Corporate & Strong",
    tags: ["Corporate", "Strong", "Geometric"],
    badges: ["corporate"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "Poppins",
    categories: ["sans"],
    type: "Friendly Modern",
    tags: ["Friendly", "Modern", "Rounded"],
    badges: ["popular"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Manrope",
    categories: ["sans"],
    type: "Clean & Technical",
    tags: ["Clean", "Technical", "SaaS"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "Plus Jakarta Sans",
    categories: ["sans"],
    type: "Warm Geometric",
    tags: ["Warm", "Geometric", "Friendly"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "Outfit",
    categories: ["sans"],
    type: "Minimal Geometric",
    tags: ["Minimal", "Geometric", "Modern"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Urbanist",
    categories: ["sans"],
    type: "Light & Airy",
    tags: ["Light", "Airy", "Modern"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "DM Sans",
    categories: ["sans"],
    type: "Low-Contrast Grotesque",
    tags: ["Neutral", "Versatile", "UI"],
    weights: [400, 500, 700],
  },
  {
    name: "Nunito Sans",
    categories: ["sans"],
    type: "Soft & Rounded",
    tags: ["Soft", "Rounded", "Friendly"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "Work Sans",
    categories: ["sans"],
    type: "Versatile Grotesque",
    tags: ["Versatile", "Editorial", "Web"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Open Sans",
    categories: ["sans"],
    type: "Friendly & Clear",
    tags: ["Friendly", "Clear", "Readable"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "Roboto",
    categories: ["sans"],
    type: "Neutral & Readable",
    tags: ["Neutral", "Readable", "Android"],
    weights: [400, 500, 700, 900],
  },
  {
    name: "Source Sans Pro",
    categories: ["sans"],
    type: "Technical & Clear",
    tags: ["Technical", "Clear", "Adobe"],
    weights: [400, 600, 700],
  },

  // Serif Collection
  {
    name: "Playfair Display",
    categories: ["serif", "luxury"],
    type: "Luxury Editorial Serif",
    tags: ["Luxury", "Furniture", "Premium"],
    badges: ["luxury"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "Lora",
    categories: ["serif"],
    type: "Elegant Serif",
    tags: ["Elegant", "Editorial", "Classic"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Cormorant Garamond",
    categories: ["serif", "luxury"],
    type: "Refined Display Serif",
    tags: ["Luxury", "Fashion", "Editorial"],
    badges: ["luxury"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Libre Baskerville",
    categories: ["serif"],
    type: "Classic Book Serif",
    tags: ["Classic", "Editorial", "Print"],
    weights: [400, 700],
  },
  {
    name: "Merriweather",
    categories: ["serif"],
    type: "Readable Text Serif",
    tags: ["Readable", "Editorial", "Blog"],
    weights: [400, 700, 900],
  },
  {
    name: "Crimson Pro",
    categories: ["serif"],
    type: "Refined Text Serif",
    tags: ["Refined", "Editorial", "Print"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "EB Garamond",
    categories: ["serif"],
    type: "Classic Old-Style Serif",
    tags: ["Classic", "Elegant", "Print"],
    weights: [400, 500, 600, 700],
  },
  {
    name: "Spectral",
    categories: ["serif"],
    type: "Contemporary Serif",
    tags: ["Contemporary", "Editorial", "Screen"],
    weights: [400, 500, 600, 700],
  },

  // Luxury Collection (additional, beyond serif overlap above)
  {
    name: "Prata",
    categories: ["luxury"],
    type: "High-Fashion Display Serif",
    tags: ["Luxury", "Fashion", "Display"],
    badges: ["luxury"],
    weights: [400],
  },
  {
    name: "Bodoni Moda",
    categories: ["luxury"],
    type: "High-Contrast Editorial",
    tags: ["Luxury", "Editorial", "Fashion"],
    badges: ["luxury"],
    weights: [400, 500, 600, 700, 800],
  },
  {
    name: "DM Serif Display",
    categories: ["luxury"],
    type: "Bold Display Serif",
    tags: ["Luxury", "Display", "Premium"],
    badges: ["luxury"],
    weights: [400],
  },
];

export function findFont(name: string): FontDefinition | undefined {
  return FONT_LIBRARY.find((f) => f.name === name);
}
