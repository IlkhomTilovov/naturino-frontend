import type { Product } from "../../types/product";

export interface SeoIssue {
  message: string;
  severity: "warning" | "danger";
}

export interface SeoReport {
  score: number;
  label: "Zaif" | "O'rtacha" | "Yaxshi" | "SEO tayyor";
  issues: SeoIssue[];
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function computeSeoScore(product: Pick<Product, "name" | "slug" | "shortDescription" | "description" | "images">): SeoReport {
  const issues: SeoIssue[] = [];
  let score = 100;

  if (!product.name || product.name.trim().length < 10) {
    issues.push({ message: "Nomi qisqa — kamida 10 belgi tavsiya etiladi", severity: "warning" });
    score -= 15;
  }

  if (!product.slug) {
    issues.push({ message: "Slug mavjud emas", severity: "danger" });
    score -= 25;
  } else if (!SLUG_PATTERN.test(product.slug)) {
    issues.push({ message: "Slug formati tavsiya etilmaydi (faqat kichik harf va chiziqcha)", severity: "warning" });
    score -= 10;
  }

  if (!product.shortDescription || product.shortDescription.trim().length < 20) {
    issues.push({ message: "Qisqa tavsif yo'q yoki juda qisqa", severity: "warning" });
    score -= 15;
  }

  if (!product.description || product.description.trim().length < 50) {
    issues.push({ message: "To'liq tavsif yo'q yoki juda qisqa", severity: "danger" });
    score -= 20;
  } else if (product.description.trim().length > 2000) {
    issues.push({ message: "To'liq tavsif juda uzun — qisqartirish tavsiya etiladi", severity: "warning" });
    score -= 5;
  }

  if (!product.images || product.images.length === 0) {
    issues.push({ message: "Mahsulot rasmi yo'q", severity: "danger" });
    score -= 20;
  }

  score = Math.max(0, score);

  const label: SeoReport["label"] = score >= 90 ? "SEO tayyor" : score >= 70 ? "Yaxshi" : score >= 40 ? "O'rtacha" : "Zaif";

  return { score, label, issues };
}
