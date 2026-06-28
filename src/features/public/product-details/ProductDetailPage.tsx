import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Award,
  Bone,
  ChevronLeft,
  ChevronRight,
  Factory,
  FileText,
  Globe2,
  Leaf,
  Package,
  Ship,
  ShieldCheck,
} from "lucide-react";
import { productsApi } from "../../../api/endpoints/products";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../lib/utils/media";
import { ProductCard } from "../../../components/shared/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { StatsSection } from "../home/sections/StatsSection";
import { CtaSection } from "../home/sections/CtaSection";
import type { Product } from "../../../types/product";
import { localizedProductField } from "../../../lib/product/localizedProduct";
import { useLanguage } from "../../../i18n/LanguageContext";

const HIGHLIGHTS = [
  { Icon: Bone, title: "Yuqori protein retsepti" },
  { Icon: Leaf, title: "Tabiiy ingredientlar" },
  { Icon: ShieldCheck, title: "Veterinariya tasdiqlangan" },
  { Icon: Factory, title: "ISO 22000 ishlab chiqarish" },
  { Icon: Package, title: "Eksportga tayyor qadoqlash" },
  { Icon: Globe2, title: "Xalqaro distribyutsiya" },
];

const EXPORT_INFO = [
  { label: "MOQ", value: "5 tonnadan" },
  { label: "Logistika", value: "FOB / CIF" },
  { label: "Ta'minot", value: "Barqaror ishlab chiqarish" },
  { label: "Hujjatlar", value: "Eksportga tayyor" },
  { label: "Bozorlar", value: "20+ davlat" },
];

const CERTIFICATES = [
  { Icon: ShieldCheck, title: "ISO 22000", description: "Oziq-ovqat xavfsizligi boshqaruvi" },
  { Icon: Award, title: "HACCP", description: "Xavf tahlili va nazorat tizimi" },
  { Icon: FileText, title: "Veterinariya tasdig'i", description: "Mahsulot muntazam nazorati" },
  { Icon: Ship, title: "Eksport hujjatlari", description: "Xalqaro yetkazib berishga tayyor" },
];

function categoryBadges(categoryName: string): string[] {
  return categoryName
    .split(/[-·]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function extractField(description: string | null | undefined, label: string): string | null {
  if (!description) return null;
  const match = description.match(new RegExp(`${label}:\\s*([^.]+)\\.`, "i"));
  return match ? match[1].trim() : null;
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", "by-slug", slug],
    queryFn: () => productsApi.getBySlug(slug!),
    enabled: Boolean(slug),
  });

  const { data: related } = useQuery({
    queryKey: ["product", "related", product?.id],
    queryFn: () => productsApi.getRelated(product!.id, 4),
    enabled: Boolean(product?.id),
  });

  if (isLoading) {
    return <div className="px-6 py-32 text-center text-slate-400">Yuklanmoqda...</div>;
  }

  if (!product) {
    return (
      <div className="px-6 py-32 text-center text-slate-400">
        Mahsulot topilmadi.{" "}
        <Link to="/products" className="font-semibold text-[var(--rt-brand-secondary)]">
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  return <ProductDetailContent product={product} related={related ?? []} activeImage={activeImage} setActiveImage={setActiveImage} />;
}

function NutritionBar({ label, percent }: { label: string; percent: number | null }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-[#0F172A]">{label}</span>
        <span className="font-semibold text-[var(--rt-brand-secondary)]">{percent != null ? `${percent}%` : "—"}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E7EBDD]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--rt-brand-secondary)] to-[var(--rt-brand-secondary)] transition-all duration-1000 ease-out"
          style={{ width: percent != null ? `${Math.min(100, percent)}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function RelatedCarousel({ items }: { items: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div className="relative">
      <div ref={trackRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div key={item.id} className="w-[260px] shrink-0 sm:w-[280px]">
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      {items.length > 2 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            aria-label="Oldingi"
            onClick={() => scrollBy(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rt-brand-secondary)] bg-white text-[var(--rt-brand-secondary)] transition-colors hover:bg-[var(--rt-brand-secondary)] hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Keyingi"
            onClick={() => scrollBy(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rt-brand-secondary)] bg-white text-[var(--rt-brand-secondary)] transition-colors hover:bg-[var(--rt-brand-secondary)] hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function ProductDetailContent({
  product,
  related,
  activeImage,
  setActiveImage,
}: {
  product: Product;
  related: Product[];
  activeImage: number;
  setActiveImage: (i: number) => void;
}) {
  const { language } = useLanguage();
  const name = localizedProductField(product, language, "name");
  const shortDescription = localizedProductField(product, language, "shortDescription");
  const description = localizedProductField(product, language, "description");

  const images = product.images.length > 0 ? product.images : [{ id: "fallback", url: "", isPrimary: true, sortOrder: 0, mediaFileId: "" }];
  const mainImage = resolveMediaUrl(images[Math.min(activeImage, images.length - 1)]?.url) ?? FALLBACK_IMAGE;
  const badges = categoryBadges(product.categoryName);

  const protein = extractField(description, "Protein");
  const shelfLife = extractField(description, "Saqlash muddati");
  const proteinNum = protein ? Number(protein.replace(/[^\d.]/g, "")) : null;

  const specCards = [
    { label: "Protein", value: protein ? `${protein}%` : "—" },
    { label: "Qadoq", value: product.weight != null ? `${product.weight} kg` : "—" },
    { label: "Yosh guruhi", value: product.ageGroup ?? "—" },
    { label: "SKU", value: product.sku },
  ];

  const packagingOptions = [product.weight != null ? `${product.weight} kg` : null].filter(Boolean) as string[];

  return (
    <>
      <Helmet>
        <title>{name} — Naturino</title>
        {shortDescription && <meta name="description" content={shortDescription} />}
      </Helmet>

      <div className="bg-[#F8F9F4] pt-28 pb-3 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 text-xs font-medium text-slate-500 sm:px-6">
          <Link to="/" className="hover:text-[var(--rt-brand-secondary)]">
            Bosh sahifa
          </Link>{" "}
          / <Link to="/products" className="hover:text-[var(--rt-brand-secondary)]">Mahsulotlar</Link> / <span className="text-[#0F172A]">{name}</span>
        </div>
      </div>

      {/* 1 — Premium hero */}
      <section className="bg-[#F8F9F4] px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Floating gallery */}
          <div>
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white to-[#EFF3E6] p-10 shadow-[0_25px_60px_-15px_rgba(10,75,58,0.18)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[var(--rt-brand-secondary)]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-[var(--rt-accent)]/10 blur-3xl" />
              <img
                key={mainImage}
                src={mainImage}
                alt={name}
                className="relative z-10 mx-auto aspect-square w-full max-w-sm object-contain drop-shadow-2xl transition-opacity duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ${
                      i === activeImage ? "border-[var(--rt-brand-secondary)] shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={resolveMediaUrl(img.url) ?? FALLBACK_IMAGE} alt="" className="h-full w-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-[var(--rt-brand-secondary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-secondary)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl">{name}</h1>

            {shortDescription && <p className="mt-4 text-lg text-slate-500">{shortDescription}</p>}

            {/* Premium mini stat cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specCards.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-2xl border border-[#E7EBDD] bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">{spec.label}</p>
                  <p className="mt-1 font-bold text-[#0F172A]">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Export information card */}
            <div className="mt-5 rounded-2xl border border-[#E7EBDD] bg-gradient-to-br from-[var(--rt-brand-primary)] to-[color-mix(in_srgb,var(--rt-brand-primary),black_15%)] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rt-accent)]">Eksportga tayyor mahsulot</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {EXPORT_INFO.map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] uppercase tracking-wide text-white/50">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--rt-brand-primary)] px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--rt-accent)] hover:text-slate-900 hover:shadow-xl"
              >
                Eksport taklifini olish <span aria-hidden>→</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--rt-brand-primary)]/20 bg-white px-7 py-4 font-semibold text-[var(--rt-brand-primary)] transition-colors hover:bg-[#F8F9F4]"
              >
                Katalogni so'rash
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Highlights */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-[#0F172A] sm:text-3xl">Mahsulot afzalliklari</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-2xl border border-[#E7EBDD] bg-[#F8F9F4] px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--rt-brand-secondary)]/30 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                  <item.Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="font-medium text-[#0F172A]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Sticky tabs */}
      <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="overview">
            <TabsList className="sticky top-[88px] z-40 h-auto flex-wrap gap-1 rounded-2xl bg-white/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
              <TabsTrigger
                value="overview"
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 data-active:bg-[var(--rt-brand-secondary)] data-active:text-white"
              >
                Umumiy
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 data-active:bg-[var(--rt-brand-secondary)] data-active:text-white"
              >
                Ozuqaviy tahlil
              </TabsTrigger>
              <TabsTrigger
                value="packaging"
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 data-active:bg-[var(--rt-brand-secondary)] data-active:text-white"
              >
                Qadoqlash
              </TabsTrigger>
              <TabsTrigger
                value="export"
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 data-active:bg-[var(--rt-brand-secondary)] data-active:text-white"
              >
                Eksport
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-300 data-active:bg-[var(--rt-brand-secondary)] data-active:text-white"
              >
                Sertifikatlar
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-6 rounded-2xl bg-white p-6 text-slate-600 shadow-sm sm:p-8">
              {description ?? "Tavsif hali qo'shilmagan."}
            </TabsContent>

            {/* Nutrition — progress bars instead of plain table */}
            <TabsContent value="nutrition" className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <NutritionBar label="Protein" percent={proteinNum} />
              <NutritionBar label="Yog'" percent={null} />
              <NutritionBar label="Tola" percent={null} />
              <NutritionBar label="Namlik" percent={null} />
              {shelfLife && <p className="pt-2 text-sm text-slate-500">Saqlash muddati: {shelfLife}</p>}
            </TabsContent>

            {/* Packaging — selectable size cards */}
            <TabsContent value="packaging" className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--rt-brand-secondary)]">Mavjud qadoqlash</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {packagingOptions.length > 0 ? (
                  packagingOptions.map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-2 rounded-2xl border-2 border-[var(--rt-brand-secondary)] bg-[var(--rt-brand-secondary)]/5 px-5 py-3 font-semibold text-[var(--rt-brand-primary)]"
                    >
                      <Package className="h-4 w-4 text-[var(--rt-brand-secondary)]" /> {size}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Qadoq ma'lumoti hali kiritilmagan.</p>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-500">Boshqa qadoq hajmlari uchun eksport jamoamiz bilan bog'laning.</p>
            </TabsContent>

            {/* Export */}
            <TabsContent value="export" className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {EXPORT_INFO.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-[#F8F9F4] px-4 py-3 text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-[#0F172A]">{item.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Certificates */}
            <TabsContent value="certificates" className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CERTIFICATES.map((cert) => (
                  <div
                    key={cert.title}
                    className="rounded-2xl border border-[#E7EBDD] bg-[#F8F9F4] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <cert.Icon className="mx-auto h-7 w-7 text-[var(--rt-brand-secondary)]" strokeWidth={1.75} />
                    <p className="mt-3 font-semibold text-[#0F172A]">{cert.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{cert.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 9 — Related products carousel */}
      {related.length > 0 && (
        <section className="bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-[#0F172A] sm:text-3xl">O'xshash mahsulotlar</h2>
            <div className="mt-10">
              <RelatedCarousel items={related} />
            </div>
          </div>
        </section>
      )}

      {/* 10 — Trust metrics */}
      <StatsSection
        content={{
          eyebrow: "NEGA IMPORTYORLAR NATURINO'NI TANLAYDI",
          title: "Naturino raqamlarda",
          items: [
            { icon: "factory", value: "12 000+", label: "Tonna/yil ishlab chiqarish quvvati" },
            { icon: "globe", value: "20+", label: "Eksport bozori" },
            { icon: "box", value: "40+", label: "SKU assortiment" },
            { icon: "badge", value: "100%", label: "ISO 22000 sertifikatlangan" },
          ],
        }}
      />

      {/* 11 — Final CTA */}
      <CtaSection
        content={{
          title: "Xalqaro hamkorlikni ",
          highlight: "boshlashga tayyormisiz?",
          subtitle: "Distribyutorlar va importyorlar uchun premium pet food mahsulotlari, eksport qo'llab-quvvatlashi va barqaror ta'minot.",
          trustBadges: ["ISO 22000", "HACCP", "20+ eksport bozori", "12 000+ tonna/yil quvvat"],
          buttonUrl: "/contact",
          buttonText: "Eksport taklifini olish",
          secondaryButtonUrl: "/contact",
          secondaryButtonText: "Katalogni so'rash",
        }}
      />
    </>
  );
}
