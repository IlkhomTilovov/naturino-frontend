// Any language code works at runtime (driven by the Languages admin list) — these three
// have hand-written UI string translations; other codes fall back to "uz" via t() below.
export type Language = string;

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export const translations: Record<string, Record<string, string>> = {
  uz: {
    "nav.company": "Kompaniya",
    "nav.products": "Mahsulotlar",
    "nav.production": "Ishlab chiqarish",
    "nav.quality": "Sifat",
    "nav.export": "Eksport",
    "nav.contact": "Aloqa",
    "nav.partnership": "Hamkorlik",
    "logo.subtitle": "Pet Food Export",
    "footer.companyHeading": "Kompaniya",
    "footer.productsHeading": "Mahsulotlar",
    "footer.exportHeading": "Eksport va aloqa",
    "footer.brandTagline": "Premium Pet Food Manufacturer & Export Partner",
    "footer.brandDescription":
      "Naturino mushuk va itlar uchun premium ozuqa mahsulotlarini ishlab chiqaruvchi va eksport qiluvchi kompaniya. Xalqaro bozorlarda distribyutorlar va importyorlar uchun ishonchli hamkor.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "footer.exportDocs": "Export Documentation",
    "footer.ctaHeading": "Xalqaro hamkorlikni boshlashga tayyormisiz?",
    "footer.ctaDescription":
      "Distribyutorlar va importyorlar uchun premium pet food mahsulotlari, eksport qo'llab-quvvatlashi va barqaror ta'minot.",
    "footer.ctaButton": "Hamkorlik bo'yicha bog'lanish",
    "menu.open": "Menyuni ochish",
  },
  ru: {
    "nav.company": "Компания",
    "nav.products": "Продукция",
    "nav.production": "Производство",
    "nav.quality": "Качество",
    "nav.export": "Экспорт",
    "nav.contact": "Контакты",
    "nav.partnership": "Партнерство",
    "logo.subtitle": "Экспорт кормов",
    "footer.companyHeading": "Компания",
    "footer.productsHeading": "Продукция",
    "footer.exportHeading": "Экспорт и контакты",
    "footer.brandTagline": "Премиальный производитель и экспортер кормов",
    "footer.brandDescription":
      "Naturino производит и экспортирует премиальные корма для кошек и собак. Надежный партнер для дистрибьюторов и импортеров на международных рынках.",
    "footer.privacy": "Политика конфиденциальности",
    "footer.terms": "Условия использования",
    "footer.exportDocs": "Экспортная документация",
    "footer.ctaHeading": "Готовы начать международное партнерство?",
    "footer.ctaDescription":
      "Премиальная продукция для домашних животных, экспортная поддержка и стабильные поставки для дистрибьюторов и импортеров.",
    "footer.ctaButton": "Связаться по партнерству",
    "menu.open": "Открыть меню",
  },
  en: {
    "nav.company": "Company",
    "nav.products": "Products",
    "nav.production": "Manufacturing",
    "nav.quality": "Quality",
    "nav.export": "Export",
    "nav.contact": "Contact",
    "nav.partnership": "Partnership",
    "logo.subtitle": "Pet Food Export",
    "footer.companyHeading": "Company",
    "footer.productsHeading": "Products",
    "footer.exportHeading": "Export & Contact",
    "footer.brandTagline": "Premium Pet Food Manufacturer & Export Partner",
    "footer.brandDescription":
      "Naturino manufactures and exports premium pet food for cats and dogs. A trusted partner for distributors and importers in international markets.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "footer.exportDocs": "Export Documentation",
    "footer.ctaHeading": "Ready to start an international partnership?",
    "footer.ctaDescription":
      "Premium pet food products, export support and reliable supply for distributors and importers.",
    "footer.ctaButton": "Contact about partnership",
    "menu.open": "Open menu",
  },
};
