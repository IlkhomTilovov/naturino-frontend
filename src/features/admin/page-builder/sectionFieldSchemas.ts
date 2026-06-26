import type { RepeaterFieldDef } from "../../../components/admin/RepeaterEditor";

export type FieldType = "text" | "textarea" | "stringlist" | "repeater" | "image";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  itemFields?: RepeaterFieldDef[];
  itemLabel?: string;
}

export const SECTION_FIELD_SCHEMAS: Record<string, FieldDef[]> = {
  Hero: [
    { key: "badge", label: "Badge matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "highlight", label: "Sarlavhadagi ajratilgan qism (yashil)", type: "text" },
    { key: "subtitle", label: "Tasvir matni", type: "textarea" },
    { key: "primaryButtonText", label: "Asosiy tugma matni", type: "text" },
    { key: "primaryButtonUrl", label: "Asosiy tugma havolasi", type: "text" },
    { key: "secondaryButtonText", label: "Ikkinchi tugma matni", type: "text" },
    { key: "secondaryButtonUrl", label: "Ikkinchi tugma havolasi", type: "text" },
    { key: "imageUrl", label: "Rasm", type: "image" },
    {
      key: "imageStats",
      label: "Rasm ustidagi statistika",
      type: "repeater",
      itemLabel: "Statistika",
      itemFields: [
        { key: "value", label: "Qiymat" },
        { key: "label", label: "Yorlik" },
      ],
    },
    { key: "checklist", label: "Belgilar ro'yxati", type: "stringlist" },
  ],
  TrustBar: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "badges", label: "Sertifikat belgilari", type: "stringlist" },
    { key: "highlight", label: "Oxirgi ajratilgan matn", type: "text" },
  ],
  Stats: [
    {
      key: "items",
      label: "Statistika kartalari",
      type: "repeater",
      itemLabel: "Karta",
      hint: "icon: factory, globe, badge, box",
      itemFields: [
        { key: "icon", label: "Ikon (factory/globe/badge/box)" },
        { key: "value", label: "Qiymat" },
        { key: "label", label: "Yorlik" },
      ],
    },
  ],
  Features: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
  ],
  Comparison: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    { key: "leftLabel", label: "Chap ustun nomi", type: "text" },
    { key: "leftTitle", label: "Chap ustun sarlavhasi", type: "text" },
    { key: "leftItems", label: "Chap ustun bandlari", type: "stringlist" },
    { key: "rightBadge", label: "O'ng ustun belgisi", type: "text" },
    { key: "rightLabel", label: "O'ng ustun nomi", type: "text" },
    { key: "rightTitle", label: "O'ng ustun sarlavhasi", type: "text" },
    { key: "rightItems", label: "O'ng ustun bandlari", type: "stringlist" },
  ],
  Products: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    { key: "buttonText", label: "Tugma matni", type: "text" },
    { key: "buttonUrl", label: "Tugma havolasi", type: "text" },
  ],
  PrivateLabel: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "steps",
      label: "Bosqichlar",
      type: "repeater",
      itemLabel: "Bosqich",
      itemFields: [
        { key: "number", label: "Raqam" },
        { key: "label", label: "Nomi" },
        { key: "title", label: "Sarlavha (ixtiyoriy)" },
        { key: "description", label: "Tavsif", type: "textarea" },
        { key: "icon", label: "Ikon (formula/packaging/quality/export)" },
      ],
    },
    { key: "buttonText", label: "Tugma matni", type: "text" },
    { key: "buttonUrl", label: "Tugma havolasi", type: "text" },
    { key: "ctaTitle", label: "CTA sarlavhasi", type: "text" },
    { key: "ctaSubtitle", label: "CTA matni", type: "textarea" },
  ],
  Process: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "steps",
      label: "Bosqichlar",
      type: "repeater",
      itemLabel: "Bosqich",
      itemFields: [
        { key: "number", label: "Raqam" },
        { key: "title", label: "Sarlavha" },
        { key: "description", label: "Tavsif", type: "textarea" },
        { key: "icon", label: "Ikon (inquiry/agreement/export/wheat/formula/factory/quality/packaging/shipping)" },
      ],
    },
    { key: "buttonText", label: "Tugma matni", type: "text" },
    { key: "buttonUrl", label: "Tugma havolasi", type: "text" },
    { key: "ctaTitle", label: "CTA sarlavhasi", type: "text" },
    { key: "ctaSubtitle", label: "CTA matni", type: "textarea" },
  ],
  Quality: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    { key: "items", label: "Bandlar", type: "stringlist" },
    { key: "imageUrl", label: "Rasm", type: "image" },
  ],
  Partners: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "cards",
      label: "Kartalar",
      type: "repeater",
      itemLabel: "Karta",
      hint: "icon: globe, factory, shield, package",
      itemFields: [
        { key: "icon", label: "Ikon (globe/factory/shield/package)" },
        { key: "title", label: "Sarlavha" },
        { key: "description", label: "Tavsif", type: "textarea" },
      ],
    },
  ],
  CTA: [
    { key: "title", label: "Sarlavha (boshlanishi)", type: "text" },
    { key: "highlight", label: "Ajratilgan qism", type: "text" },
    { key: "titleEnd", label: "Sarlavha (davomi)", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    { key: "buttonText", label: "Tugma matni", type: "text" },
    { key: "buttonUrl", label: "Tugma havolasi", type: "text" },
  ],
  About: [
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Kichik sarlavha", type: "text" },
    { key: "content", label: "Matn", type: "textarea" },
    { key: "buttonText", label: "Tugma matni", type: "text" },
    { key: "buttonUrl", label: "Tugma havolasi", type: "text" },
    { key: "imageUrl", label: "Rasm", type: "image" },
  ],
  Certificates: [
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Kichik sarlavha", type: "text" },
    { key: "content", label: "Matn", type: "textarea" },
    { key: "imageUrl", label: "Rasm (yagona, ixtiyoriy)", type: "image" },
    {
      key: "items",
      label: "Sertifikatlar to'plami",
      type: "repeater",
      itemLabel: "Sertifikat",
      itemFields: [
        { key: "imageUrl", label: "Rasm", type: "image" },
        { key: "name", label: "Nomi" },
        { key: "downloadUrl", label: "PDF havolasi (bo'lsa, rasm o'rniga yuklab olish tugmasi ko'rsatiladi)" },
      ],
    },
  ],
  Contact: [
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Kichik sarlavha", type: "text" },
    { key: "content", label: "Matn", type: "textarea" },
    { key: "buttonText", label: "Tugma matni", type: "text" },
    { key: "buttonUrl", label: "Tugma havolasi", type: "text" },
  ],
  WhyPartner: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "cards",
      label: "Kartalar",
      type: "repeater",
      itemLabel: "Karta",
      hint: "icon: factory, globe, badge, box, truck, shield, handshake, document, chart, support, store, warehouse",
      itemFields: [
        { key: "icon", label: "Ikon" },
        { key: "title", label: "Sarlavha" },
        { key: "description", label: "Tavsif", type: "textarea" },
      ],
    },
    { key: "imageUrl", label: "Rasm", type: "image" },
  ],
  WhoWeWorkWith: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "cards",
      label: "Hamkor turlari",
      type: "repeater",
      itemLabel: "Hamkor turi",
      itemFields: [
        { key: "icon", label: "Ikon" },
        { key: "title", label: "Sarlavha" },
        { key: "description", label: "Tavsif", type: "textarea" },
      ],
    },
    { key: "imageUrl", label: "Rasm", type: "image" },
  ],
  ExportCapabilities: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "cards",
      label: "Kartalar",
      type: "repeater",
      itemLabel: "Karta",
      itemFields: [
        { key: "icon", label: "Ikon" },
        { key: "title", label: "Sarlavha" },
        { key: "description", label: "Tavsif", type: "textarea" },
      ],
    },
    { key: "imageUrl", label: "Rasm", type: "image" },
  ],
  ProductRange: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    { key: "subtitle", label: "Matn", type: "textarea" },
    {
      key: "categorySlugs",
      label: "Ko'rsatiladigan toifalar (slug)",
      type: "stringlist",
      hint: "Bo'sh qoldirilsa barcha faol toifalar ko'rsatiladi",
    },
  ],
  Gallery: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    {
      key: "images",
      label: "Rasmlar",
      type: "repeater",
      itemLabel: "Rasm",
      itemFields: [
        { key: "imageUrl", label: "Rasm", type: "image" },
        { key: "category", label: "Toifa (masalan: Ishlab chiqarish)" },
        { key: "caption", label: "Izoh" },
      ],
    },
  ],
  FAQ: [
    { key: "eyebrow", label: "Eyebrow matni", type: "text" },
    { key: "title", label: "Sarlavha", type: "text" },
    {
      key: "items",
      label: "Savol-javoblar",
      type: "repeater",
      itemLabel: "Savol",
      itemFields: [
        { key: "question", label: "Savol" },
        { key: "answer", label: "Javob", type: "textarea" },
      ],
    },
  ],
};
