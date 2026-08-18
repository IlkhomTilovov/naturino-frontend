import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { CategoryTabsSection } from "../home/sections/CategoryTabsSection";
import {
  Clock,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Package,
  Phone,
  Ship,
  ShieldCheck,
  Factory,
  ChevronDown,
  Search,
  Store,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { contactsApi } from "../../../api/endpoints/contacts";
import { settingsApi } from "../../../api/endpoints/settings";
import { shopsApi, type Shop } from "../../../api/endpoints/shops";
import { useToastStore } from "../../../store/toastStore";
import { useInView } from "../../../lib/hooks/useInView";
import { useLanguage } from "../../../i18n/LanguageContext";
import { StatsSection } from "../home/sections/StatsSection";
import { CtaSection } from "../home/sections/CtaSection";

const CONTACT_ICONS = [MapPin, Phone, Mail, Globe2];
const WHY_ICONS = [Factory, Globe2, ShieldCheck, Package];
const EXPORT_ICONS = [Package, Ship, FileText, Globe2, Factory, ShieldCheck];

type ContactText = {
  breadcrumbHome: string;
  breadcrumbContact: string;
  back: string;
  heroTitle: string;
  heroSubtitle: string;
  contactCards: { title: string; lines: [string, string] }[];
  formHeading: string;
  fieldName: string;
  fieldCompany: string;
  fieldCountry: string;
  fieldEmail: string;
  fieldPhone: string;
  fieldProductType: string;
  fieldMessage: string;
  messagePlaceholder: string;
  submitting: string;
  submitButton: string;
  submitSuccess: string;
  submitError: string;
  whyHeading: string;
  whyCards: string[];
  mapHeading: string;
  mapEmpty: string;
  shopsHeading: string;
  shopsSubtitle: (count: number) => string;
  shopsSearchPlaceholder: string;
  shopsEmpty: string;
  shopsCount: (n: number) => string;
  shopsViewOnMap: string;
  exportHeading: string;
  exportSubtitle: string;
  exportInfo: string[];
  faqHeading: string;
  faqItems: { q: string; a: string }[];
  hoursHeading: string;
  workingHours: { day: string; hours: string }[];
  productInterests: string[];
  statsEyebrow: string;
  statsTitle: string;
  statsItems: { icon: string; value: string; label: string }[];
  ctaTitle: string;
  ctaHighlight: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaSecondaryButtonText: string;
  pageTitle: string;
};

const TEXT: Record<string, ContactText> = {
  uz: {
    breadcrumbHome: "Bosh sahifa",
    breadcrumbContact: "Aloqa",
    back: "← Orqaga",
    heroTitle: "Biz bilan bog'laning",
    heroSubtitle: "Distribyutorlik, eksport, mahsulot assortimenti va logistika bo'yicha savollaringiz uchun Naturino jamoasi bilan bog'laning.",
    contactCards: [
      { title: "Manzil", lines: ["Toshkent, O'zbekiston", "Ishlab chiqarish va eksport markazi"] },
      { title: "Telefon", lines: ["+998 XX XXX XX XX", "Dushanba-Juma, 09:00-18:00"] },
      { title: "Email", lines: ["export@naturino.uz", "Eksport va hamkorlik so'rovlari"] },
      { title: "Eksport", lines: ["20+ eksport bozori", "FOB va CIF yetkazib berish"] },
    ],
    formHeading: "Hamkorlik bo'yicha so'rov yuboring",
    fieldName: "Ism",
    fieldCompany: "Kompaniya nomi",
    fieldCountry: "Mamlakat",
    fieldEmail: "Email",
    fieldPhone: "Telefon",
    fieldProductType: "Qiziqayotgan mahsulot turi",
    fieldMessage: "Xabar",
    messagePlaceholder: "MOQ, katalog yoki eksport bo'yicha ma'lumot.",
    submitting: "Yuborilmoqda...",
    submitButton: "Eksport taklifini olish",
    submitSuccess: "So'rovingiz muvaffaqiyatli yuborildi. Tez orada bog'lanamiz.",
    submitError: "So'rovni yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
    whyHeading: "Nega Naturino bilan ishlashadi?",
    whyCards: ["O'z ishlab chiqarish majmuasi", "20+ eksport bozori", "Xalqaro sifat standartlari", "Barqaror logistika va ta'minot"],
    mapHeading: "Bizning manzilimiz",
    mapEmpty: "Xarita hozircha bo'sh — admin panelda Do'konlar bo'limiga koordinatali manzil qo'shilgach, shu yerda ko'rinadi.",
    shopsHeading: "Qayerdan sotib olish mumkin",
    shopsSubtitle: (n) => `${n}+ do'kon orqali mahsulotlarimizni sotib olishingiz mumkin. Davlat yoki shahar bo'yicha qidiring.`,
    shopsSearchPlaceholder: "Davlat, shahar yoki diler nomi...",
    shopsEmpty: "Hech narsa topilmadi.",
    shopsCount: (n) => `${n} ta`,
    shopsViewOnMap: "Xaritada ko'rish",
    exportHeading: "Eksport va distribyutorlik bo'yicha",
    exportSubtitle: "Naturino xalqaro hamkorlar uchun eksport hujjatlari, logistika qo'llab-quvvatlashi va barqaror ta'minotni taqdim etadi.",
    exportInfo: ["MOQ 5 tonnadan", "FOB va CIF", "Eksport hujjatlari", "Logistika qo'llab-quvvatlashi", "Mahsulot katalogi", "Xalqaro hamkorlik"],
    faqHeading: "Ko'p beriladigan savollar",
    faqItems: [
      { q: "MOQ qancha?", a: "Standart minimal buyurtma hajmi 5 tonnadan boshlanadi, mahsulot turiga qarab o'zgarishi mumkin." },
      { q: "Qaysi davlatlarga eksport qilasiz?", a: "Hozirda 20 dan ortiq davlatga, jumladan Markaziy Osiyo, MDH, Yaqin Sharq va Janubiy Osiyo bozorlariga yetkazib beramiz." },
      { q: "Mahsulot katalogini qanday olish mumkin?", a: "So'rov formasi orqali murojaat qiling — jamoamiz to'liq katalog va narxlar ro'yxatini yuboradi." },
      { q: "Namuna yuborasizmi?", a: "Ha, distribyutorlik va importyorlik so'rovlari uchun namuna yetkazib berish imkoniyati mavjud." },
      { q: "FOB yoki CIF shartlarida ishlaysizmi?", a: "Ha, mijozning ehtiyojiga qarab FOB va CIF yetkazib berish shartlarining ikkisi ham qo'llab-quvvatlanadi." },
    ],
    hoursHeading: "Ish vaqti",
    workingHours: [
      { day: "Dushanba - Juma", hours: "09:00 - 18:00" },
      { day: "Shanba", hours: "09:00 - 13:00" },
      { day: "Yakshanba", hours: "Dam olish kuni" },
    ],
    productInterests: ["It ozuqasi", "Mushuk ozuqasi", "Ho'l ozuqa", "Tortmalar", "Boshqa"],
    statsEyebrow: "HAMKORLAR ISHONCHI",
    statsTitle: "Naturino raqamlarda",
    statsItems: [
      { icon: "globe", value: "20+", label: "Eksport bozori" },
      { icon: "factory", value: "12 000+", label: "Tonna/yil ishlab chiqarish quvvati" },
      { icon: "box", value: "40+", label: "SKU assortiment" },
      { icon: "badge", value: "100%", label: "Xalqaro sertifikatlangan ishlab chiqarish" },
    ],
    ctaTitle: "Xalqaro hamkorlikni boshlashga ",
    ctaHighlight: "tayyormisiz?",
    ctaSubtitle: "Distribyutorlar va importyorlar uchun premium pet food mahsulotlari, eksport qo'llab-quvvatlashi va barqaror ta'minot.",
    ctaButtonText: "Eksport taklifini olish",
    ctaSecondaryButtonText: "Hamkorlik bo'yicha bog'lanish",
    pageTitle: "Aloqa — Naturino",
  },
  ru: {
    breadcrumbHome: "Главная",
    breadcrumbContact: "Контакты",
    back: "← Назад",
    heroTitle: "Свяжитесь с нами",
    heroSubtitle: "Свяжитесь с командой Naturino по вопросам дистрибуции, экспорта, ассортимента продукции и логистики.",
    contactCards: [
      { title: "Адрес", lines: ["Ташкент, Узбекистан", "Центр производства и экспорта"] },
      { title: "Телефон", lines: ["+998 XX XXX XX XX", "Понедельник-пятница, 09:00-18:00"] },
      { title: "Email", lines: ["export@naturino.uz", "Запросы по экспорту и сотрудничеству"] },
      { title: "Экспорт", lines: ["20+ экспортных рынков", "Поставка на условиях FOB и CIF"] },
    ],
    formHeading: "Отправьте запрос по сотрудничеству",
    fieldName: "Имя",
    fieldCompany: "Название компании",
    fieldCountry: "Страна",
    fieldEmail: "Email",
    fieldPhone: "Телефон",
    fieldProductType: "Интересующий тип продукции",
    fieldMessage: "Сообщение",
    messagePlaceholder: "Информация о MOQ, каталоге или экспорте.",
    submitting: "Отправка...",
    submitButton: "Получить экспортное предложение",
    submitSuccess: "Ваш запрос успешно отправлен. Мы скоро свяжемся с вами.",
    submitError: "Произошла ошибка при отправке запроса. Попробуйте ещё раз.",
    whyHeading: "Почему работают с Naturino?",
    whyCards: ["Собственный производственный комплекс", "20+ экспортных рынков", "Международные стандарты качества", "Стабильная логистика и поставки"],
    mapHeading: "Наш адрес",
    mapEmpty: "Карта пока пуста — после добавления адреса с координатами в разделе «Магазины» админ-панели, он появится здесь.",
    shopsHeading: "Где можно купить",
    shopsSubtitle: (n) => `Вы можете приобрести нашу продукцию через ${n}+ магазинов. Ищите по стране или городу.`,
    shopsSearchPlaceholder: "Страна, город или название дилера...",
    shopsEmpty: "Ничего не найдено.",
    shopsCount: (n) => `${n} шт.`,
    shopsViewOnMap: "Посмотреть на карте",
    exportHeading: "По вопросам экспорта и дистрибуции",
    exportSubtitle: "Naturino предоставляет международным партнёрам экспортную документацию, логистическую поддержку и стабильные поставки.",
    exportInfo: ["MOQ от 5 тонн", "FOB и CIF", "Экспортные документы", "Логистическая поддержка", "Каталог продукции", "Международное сотрудничество"],
    faqHeading: "Часто задаваемые вопросы",
    faqItems: [
      { q: "Какой MOQ?", a: "Стандартный минимальный объём заказа начинается от 5 тонн, может меняться в зависимости от типа продукции." },
      { q: "В какие страны вы экспортируете?", a: "На данный момент поставляем более чем в 20 стран, включая рынки Центральной Азии, СНГ, Ближнего Востока и Южной Азии." },
      { q: "Как получить каталог продукции?", a: "Обратитесь через форму запроса — наша команда отправит полный каталог и прайс-лист." },
      { q: "Отправляете ли вы образцы?", a: "Да, для запросов дистрибьюторов и импортёров возможна отправка образцов." },
      { q: "Работаете ли вы на условиях FOB или CIF?", a: "Да, в зависимости от потребностей клиента поддерживаются оба условия поставки — FOB и CIF." },
    ],
    hoursHeading: "Часы работы",
    workingHours: [
      { day: "Понедельник - Пятница", hours: "09:00 - 18:00" },
      { day: "Суббота", hours: "09:00 - 13:00" },
      { day: "Воскресенье", hours: "Выходной" },
    ],
    productInterests: ["Корм для собак", "Корм для кошек", "Влажный корм", "Лакомства", "Другое"],
    statsEyebrow: "ДОВЕРИЕ ПАРТНЁРОВ",
    statsTitle: "Naturino в цифрах",
    statsItems: [
      { icon: "globe", value: "20+", label: "Экспортных рынков" },
      { icon: "factory", value: "12 000+", label: "Тонн/год производственной мощности" },
      { icon: "box", value: "40+", label: "SKU в ассортименте" },
      { icon: "badge", value: "100%", label: "Производство сертифицировано международно" },
    ],
    ctaTitle: "Готовы начать международное ",
    ctaHighlight: "сотрудничество?",
    ctaSubtitle: "Премиальные корма для домашних животных, экспортная поддержка и стабильные поставки для дистрибьюторов и импортёров.",
    ctaButtonText: "Получить экспортное предложение",
    ctaSecondaryButtonText: "Связаться по вопросам сотрудничества",
    pageTitle: "Контакты — Naturino",
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbContact: "Contact",
    back: "← Back",
    heroTitle: "Get in touch",
    heroSubtitle: "Contact the Naturino team about distribution, export, product range and logistics.",
    contactCards: [
      { title: "Address", lines: ["Tashkent, Uzbekistan", "Production and export center"] },
      { title: "Phone", lines: ["+998 XX XXX XX XX", "Monday-Friday, 09:00-18:00"] },
      { title: "Email", lines: ["export@naturino.uz", "Export and partnership inquiries"] },
      { title: "Export", lines: ["20+ export markets", "FOB and CIF delivery"] },
    ],
    formHeading: "Send a partnership inquiry",
    fieldName: "Name",
    fieldCompany: "Company name",
    fieldCountry: "Country",
    fieldEmail: "Email",
    fieldPhone: "Phone",
    fieldProductType: "Product type of interest",
    fieldMessage: "Message",
    messagePlaceholder: "Information about MOQ, catalog, or export.",
    submitting: "Sending...",
    submitButton: "Get an export offer",
    submitSuccess: "Your inquiry has been sent successfully. We'll be in touch soon.",
    submitError: "There was an error sending your inquiry. Please try again.",
    whyHeading: "Why work with Naturino?",
    whyCards: ["Our own production facility", "20+ export markets", "International quality standards", "Stable logistics and supply"],
    mapHeading: "Our location",
    mapEmpty: "The map is empty for now — once a shop with coordinates is added in the admin panel's Shops section, it will appear here.",
    shopsHeading: "Where to buy",
    shopsSubtitle: (n) => `You can buy our products through ${n}+ shops. Search by country or city.`,
    shopsSearchPlaceholder: "Country, city or dealer name...",
    shopsEmpty: "Nothing found.",
    shopsCount: (n) => `${n}`,
    shopsViewOnMap: "View on map",
    exportHeading: "Export and distribution",
    exportSubtitle: "Naturino provides international partners with export documentation, logistics support and stable supply.",
    exportInfo: ["MOQ from 5 tons", "FOB and CIF", "Export documents", "Logistics support", "Product catalog", "International partnership"],
    faqHeading: "Frequently asked questions",
    faqItems: [
      { q: "What is the MOQ?", a: "The standard minimum order quantity starts from 5 tons and may vary depending on the product type." },
      { q: "Which countries do you export to?", a: "We currently deliver to more than 20 countries, including markets in Central Asia, the CIS, the Middle East and South Asia." },
      { q: "How can I get the product catalog?", a: "Reach out through the inquiry form — our team will send the full catalog and price list." },
      { q: "Do you send samples?", a: "Yes, samples can be provided for distributor and importer inquiries." },
      { q: "Do you work under FOB or CIF terms?", a: "Yes, both FOB and CIF delivery terms are supported depending on the client's needs." },
    ],
    hoursHeading: "Working hours",
    workingHours: [
      { day: "Monday - Friday", hours: "09:00 - 18:00" },
      { day: "Saturday", hours: "09:00 - 13:00" },
      { day: "Sunday", hours: "Day off" },
    ],
    productInterests: ["Dog food", "Cat food", "Wet food", "Treats", "Other"],
    statsEyebrow: "PARTNER TRUST",
    statsTitle: "Naturino in numbers",
    statsItems: [
      { icon: "globe", value: "20+", label: "Export markets" },
      { icon: "factory", value: "12,000+", label: "Tons/year production capacity" },
      { icon: "box", value: "40+", label: "SKU range" },
      { icon: "badge", value: "100%", label: "Internationally certified production" },
    ],
    ctaTitle: "Ready to start international ",
    ctaHighlight: "cooperation?",
    ctaSubtitle: "Premium pet food products, export support, and stable supply for distributors and importers.",
    ctaButtonText: "Get an export offer",
    ctaSecondaryButtonText: "Contact us about cooperation",
    pageTitle: "Contact — Naturino",
  },
};

function ShopsDirectory({ t }: { t: ContactText }) {
  const { data: shops } = useQuery({ queryKey: ["shops", "public"], queryFn: shopsApi.getAllActive });
  const [search, setSearch] = useState("");
  const [openCountry, setOpenCountry] = useState<string | null>(null);

  const list = shops ?? [];
  if (list.length === 0) return null;

  const q = search.trim().toLowerCase();
  const filtered = q
    ? list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q),
      )
    : list;

  const grouped = filtered.reduce<Record<string, Shop[]>>((acc, s) => {
    (acc[s.country] ??= []).push(s);
    return acc;
  }, {});
  const countries = Object.keys(grouped).sort();

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#294A34] sm:text-3xl">{t.shopsHeading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-taupe">{t.shopsSubtitle(list.length)}</p>
        </div>

        <div className="relative mx-auto mt-8 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.shopsSearchPlaceholder}
            className="w-full rounded-xl border border-[#E7EBDD] bg-[#F3EDE1] py-2.5 pl-9 pr-3 text-sm text-[#294A34] focus:border-[var(--rt-brand-primary)] focus:outline-none"
          />
        </div>

        <div className="mt-8 space-y-3">
          {countries.length === 0 && (
            <p className="text-center text-sm text-taupe">{t.shopsEmpty}</p>
          )}

          {countries.map((country) => {
            const items = grouped[country];
            const expanded = Boolean(q) || openCountry === country;
            return (
              <div key={country} className="overflow-hidden rounded-2xl border border-[#E7EBDD]">
                <button
                  type="button"
                  onClick={() => setOpenCountry((c) => (c === country ? null : country))}
                  className="flex w-full items-center justify-between gap-3 bg-[#F3EDE1] px-5 py-3.5 text-left transition-colors hover:bg-[#EFE8D8]"
                >
                  <span className="flex items-center gap-2 font-semibold text-[#294A34]">
                    <Store className="h-4 w-4 text-[var(--rt-brand-secondary)]" /> {country}
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-taupe">{t.shopsCount(items.length)}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-taupe transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>

                {expanded && (
                  <ul className="divide-y divide-[#E7EBDD]">
                    {items.map((s) => (
                      <li key={s.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                        <div>
                          <p className="font-medium text-[#294A34]">{s.name}</p>
                          <p className="mt-0.5 text-sm text-taupe">
                            {s.city} — {s.address}
                          </p>
                          {s.phone && <p className="mt-0.5 text-sm text-taupe">{s.phone}</p>}
                        </div>
                        {s.latitude != null && s.longitude != null && (
                          <a
                            href={`https://yandex.uz/maps/?pt=${s.longitude},${s.latitude}&z=16&l=map`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 whitespace-nowrap text-sm font-medium text-[var(--rt-brand-primary)] hover:underline"
                          >
                            {t.shopsViewOnMap}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function fadeUp(inView: boolean, delayMs = 0) {
  return {
    style: { transitionDelay: inView ? `${delayMs}ms` : "0ms" },
    className: `transition-all duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`,
  };
}

export function ContactPage() {
  const { language } = useLanguage();
  const t = TEXT[language] ?? TEXT.uz;

  // Reached via the "Qayerdan sotib olish" tab from within a category — keep
  // that tab bar visible instead of the page's own hero, same treatment as
  // DynamicPage gets for the "Zavodchilarga" tab.
  const [searchParams] = useSearchParams();
  const fromCategory = searchParams.get("fromCategory") ?? undefined;
  const fromTab = searchParams.get("fromTab") || undefined;
  const categoryBackPath = fromCategory ? (fromTab ? `/categories/${fromCategory}/${fromTab}` : `/categories/${fromCategory}`) : null;

  const { data: locationSettings } = useQuery({
    queryKey: ["settings", "General"],
    queryFn: () => settingsApi.getGroup("General"),
  });
  // Shares the ["shops", "public"] cache key with ShopsDirectory below, so
  // this doesn't fire a second network request.
  const { data: mapShops } = useQuery({ queryKey: ["shops", "public"], queryFn: shopsApi.getAllActive });

  const mapAddress = locationSettings?.Address || t.contactCards[0].lines[0];
  // The map only ever plots pins we actually placed (admin-entered shop
  // coordinates) — never a generic geocoded search result, which used to
  // surface unrelated nearby businesses baked into Yandex's own map tiles.
  const shopPoints = (mapShops ?? []).filter(
    (s): s is typeof s & { latitude: number; longitude: number } => s.latitude != null && s.longitude != null,
  ).slice(0, 100);
  const mapSrc =
    shopPoints.length > 0
      ? `https://yandex.ru/map-widget/v1/?ll=${shopPoints[0].longitude}%2C${shopPoints[0].latitude}&z=${
          shopPoints.length > 5 ? 5 : shopPoints.length > 1 ? 10 : 15
        }&pt=${shopPoints.map((s) => `${s.longitude},${s.latitude},pm2rdl`).join("~")}`
      : null;

  const addToast = useToastStore((s) => s.addToast);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    productType: t.productInterests[0],
    message: "",
  });

  const infoRef = useInView<HTMLDivElement>();
  const formRef = useInView<HTMLDivElement>();
  const exportRef = useInView<HTMLDivElement>();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactsApi.submit({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        subject: form.productType,
        message: `Mamlakat: ${form.country || "—"}\n\n${form.message}`,
      });
      addToast(t.submitSuccess);
      setForm({ name: "", company: "", country: "", email: "", phone: "", productType: t.productInterests[0], message: "" });
    } catch {
      addToast(t.submitError, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
      </Helmet>

      {fromCategory && <CategoryTabsSection categorySlug={fromCategory} activeTab="qayerdan-sotib-olish" />}

      <div className="relative">
        {categoryBackPath && (
          <div className="absolute inset-x-0 top-0 z-10 mx-auto max-w-[1400px] px-4 pt-4 sm:px-6">
            <Link
              to={categoryBackPath}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#294A34]/70 transition-colors hover:text-[var(--rt-brand-primary)]"
            >
              {t.back}
            </Link>
          </div>
        )}

        {/* SECTION 01 — HERO (skipped when reached from a category's tab bar, which already
            shows where the visitor is — repeating it here would be redundant) */}
        {!fromCategory && (
          <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-6 pb-14 pt-16 text-center text-white sm:pb-16 sm:pt-20">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--rt-accent) 12%, transparent) 0%, transparent 55%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--rt-brand-secondary) 25%, transparent) 0%, transparent 55%)",
              }}
            />
            <div className="relative z-10 mx-auto max-w-3xl">
              <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                <Link to="/" className="transition-colors hover:text-white">
                  {t.breadcrumbHome}
                </Link>
                <span aria-hidden>/</span>
                <span className="text-[var(--rt-accent)]">{t.breadcrumbContact}</span>
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{t.heroTitle}</h1>
              <p className="mx-auto mt-4 max-w-xl text-white/70">{t.heroSubtitle}</p>
            </div>
          </section>
        )}

        {/* SECTION 02 — CONTACT INFO CARDS */}
      <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6">
        <div ref={infoRef.ref} className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.contactCards.map((card, i) => {
            const Icon = CONTACT_ICONS[i];
            return (
              <div
                key={card.title}
                {...fadeUp(infoRef.inView, i * 100)}
                className={`rounded-3xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] ${fadeUp(infoRef.inView, i * 100).className}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-semibold text-[#294A34]">{card.title}</h3>
                <div className="mt-1.5 space-y-0.5">
                  {card.lines.map((line) => (
                    <p key={line} className="text-sm text-taupe">{line}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 03 — FORM + WHY NATURINO */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div ref={formRef.ref} className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div {...fadeUp(formRef.inView)}>
            <h2 className="text-2xl font-bold text-[#294A34] sm:text-3xl">{t.formHeading}</h2>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.fieldName}>
                  <input required value={form.name} onChange={onChange("name")} className="input" />
                </Field>
                <Field label={t.fieldCompany}>
                  <input value={form.company} onChange={onChange("company")} className="input" />
                </Field>
                <Field label={t.fieldCountry}>
                  <input value={form.country} onChange={onChange("country")} className="input" />
                </Field>
                <Field label={t.fieldEmail}>
                  <input required type="email" value={form.email} onChange={onChange("email")} className="input" />
                </Field>
                <Field label={t.fieldPhone}>
                  <input value={form.phone} onChange={onChange("phone")} className="input" />
                </Field>
                <Field label={t.fieldProductType}>
                  <select value={form.productType} onChange={onChange("productType")} className="input">
                    {t.productInterests.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={t.fieldMessage}>
                <textarea
                  required
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  value={form.message}
                  onChange={onChange("message")}
                  className="input"
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--rt-brand-primary)] py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-90 disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {submitting ? t.submitting : t.submitButton} <span aria-hidden>→</span>
              </button>
            </form>
          </div>

          <div {...fadeUp(formRef.inView, 150)}>
            <h2 className="text-2xl font-bold text-[#294A34] sm:text-3xl">{t.whyHeading}</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {t.whyCards.map((title, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <div
                    key={title}
                    className="rounded-2xl border border-[#E7EBDD] bg-[#F3EDE1] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <p className="mt-4 font-semibold text-[#294A34]">{title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — MAP */}
      <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-[#294A34] sm:text-3xl">{t.mapHeading}</h2>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-taupe">
            <MapPin className="h-4 w-4 text-[var(--rt-brand-secondary)]" /> {mapAddress}
          </p>
          {mapSrc ? (
            <div className="mt-8 overflow-hidden rounded-[28px] border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
              <iframe
                key={mapSrc}
                title={`Naturino — ${mapAddress}`}
                src={mapSrc}
                className="h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-black/5 bg-white/60 px-6 py-16 text-sm text-taupe">{t.mapEmpty}</div>
          )}
        </div>
      </section>

      <ShopsDirectory t={t} />

      {/* SECTION 05 — EXPORT INFORMATION */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div ref={exportRef.ref} className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-[#294A34] sm:text-3xl">{t.exportHeading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-taupe">{t.exportSubtitle}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.exportInfo.map((title, i) => {
              const Icon = EXPORT_ICONS[i];
              return (
              <div
                key={title}
                {...fadeUp(exportRef.inView, i * 80)}
                className={`flex items-center gap-3 rounded-2xl border border-[#E7EBDD] bg-[#F3EDE1] px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${fadeUp(exportRef.inView, i * 80).className}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="font-medium text-[#294A34]">{title}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 06 — FAQ */}
      <section className="bg-[#F3EDE1] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-[#294A34] sm:text-3xl">{t.faqHeading}</h2>

          <div className="mt-10 divide-y divide-herb/50 overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            {t.faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#F3EDE1]"
                  >
                    <span className="font-semibold text-[#294A34]">{item.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--rt-brand-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-taupe">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 07 — WORKING HOURS */}
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-[#294A34] sm:text-3xl">{t.hoursHeading}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {t.workingHours.map((item) => (
              <div
                key={item.day}
                className="rounded-2xl border border-[#E7EBDD] bg-[#F3EDE1] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Clock className="mx-auto h-6 w-6 text-[var(--rt-brand-secondary)]" strokeWidth={1.75} />
                <p className="mt-3 font-semibold text-[#294A34]">{item.day}</p>
                <p className="mt-1 text-sm text-taupe">{item.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 08 — TRUST / KPI */}
      <StatsSection
        content={{
          eyebrow: t.statsEyebrow,
          title: t.statsTitle,
          items: t.statsItems,
        }}
      />

      {/* SECTION 09 — FINAL CTA */}
      <CtaSection
        content={{
          title: t.ctaTitle,
          highlight: t.ctaHighlight,
          subtitle: t.ctaSubtitle,
          buttonUrl: "/contact",
          buttonText: t.ctaButtonText,
          secondaryButtonUrl: "/partnership",
          secondaryButtonText: t.ctaSecondaryButtonText,
        }}
      />
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#294A34]">{label}</span>
      {children}
    </label>
  );
}
