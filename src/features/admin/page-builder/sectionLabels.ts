export const SECTION_TYPE_LABELS: Record<string, string> = {
  Hero: "Bosh banner",
  TrustBar: "Ishonch paneli",
  Stats: "Statistika",
  Features: "Nega biz",
  Comparison: "Qiyoslash",
  Products: "Mahsulotlar",
  PrivateLabel: "Private Label",
  Process: "Jarayon",
  Quality: "Sifat",
  Partners: "Hamkorlar",
  CTA: "Chaqiriq (CTA)",
  About: "Kompaniya haqida",
  Certificates: "Sertifikatlar",
  Contact: "Aloqa",
  WhyPartner: "Nega hamkor bo'lish",
  WhoWeWorkWith: "Kimlar bilan ishlaymiz",
  ProductRange: "Mahsulot assortimenti",
  ExportCapabilities: "Eksport imkoniyatlari",
  Gallery: "Galereya",
  FAQ: "Savol-javoblar",
};

export function sectionTypeLabel(typeName: string): string {
  return SECTION_TYPE_LABELS[typeName] ?? typeName;
}
