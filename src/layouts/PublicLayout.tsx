import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { LinkedInIcon, TelegramIcon, WhatsAppIcon } from "../components/shared/SocialIcons";
import { useLanguage } from "../i18n/LanguageContext";
import { LANGUAGES } from "../i18n/translations";
import { useLiveEditStore } from "../store/liveEditStore";
import { pagesApi } from "../api/endpoints/pages";
import { languagesApi } from "../api/endpoints/languages";
import { ROUTE_TO_SLUG } from "../lib/page/publicPath";

const NAV_LINKS = [
  { to: "/about-us", key: "nav.company" },
  { to: "/products", key: "nav.products" },
  { to: "/ishlab-chiqarish", key: "nav.production" },
  { to: "/quality", key: "nav.quality" },
  { to: "/partnership", key: "nav.export" },
  { to: "/contact", key: "nav.contact" },
];

const FOOTER_TRUST = ["ISO 22000 sertifikatlangan", "HACCP standartlari", "20+ eksport bozori", "12 000+ tonna/yil ishlab chiqarish quvvati"];

const FOOTER_COLUMNS = [
  {
    title: "Kompaniya",
    titleKey: "footer.companyHeading",
    links: [
      { to: "/about-us", label: "Kompaniya haqida" },
      { to: "/ishlab-chiqarish", label: "Ishlab chiqarish" },
      { to: "/quality", label: "Sifat nazorati" },
      { to: "/certificates", label: "Sertifikatlar" },
      { to: "/partnership", label: "Eksport" },
      { to: "/contact", label: "Aloqa" },
    ],
  },
  {
    title: "Mahsulotlar",
    titleKey: "footer.productsHeading",
    links: [
      { to: "/products", label: "Quruq it ozuqasi" },
      { to: "/products", label: "Ho'l it ozuqasi" },
      { to: "/products", label: "Quruq mushuk ozuqasi" },
      { to: "/products", label: "Ho'l mushuk ozuqasi" },
      { to: "/products", label: "Barcha mahsulotlar" },
    ],
  },
  {
    title: "Eksport va aloqa",
    titleKey: "footer.exportHeading",
    links: [
      { to: "/partnership", label: "Eksport bozorlari" },
      { to: "/partnership", label: "Logistika" },
      { to: "/partnership", label: "Distribyutorlik" },
      { to: "/products", label: "Katalog yuklash" },
      { to: "/contact", label: "Narx so'rash" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
  { label: "Telegram", href: "https://t.me", Icon: TelegramIcon },
  { label: "WhatsApp", href: "https://wa.me", Icon: WhatsAppIcon },
];

function LanguageSwitcher({ glass = false }: { glass?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const { data: languages } = useQuery({ queryKey: ["languages"], queryFn: languagesApi.getAll });

  const options = languages
    ? languages
        .filter((l) => l.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((l) => ({ code: l.code, label: l.code.toUpperCase() }))
    : LANGUAGES;

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full p-1 text-xs font-semibold ${
        glass ? "bg-transparent" : "bg-[#F8F9F4]"
      }`}
    >
      {options.map(({ code, label }) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={isActive}
            className={`cursor-pointer rounded-full px-2.5 py-1 transition-colors ${
              isActive
                ? glass
                  ? "bg-white text-[var(--rt-brand-primary)]"
                  : "bg-[var(--rt-brand-primary)] text-white"
                : glass
                  ? "text-white/70 hover:text-white"
                  : "text-[#0F172A]/60 hover:text-[#0F172A]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function PublicLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  const liveEditActive = useLiveEditStore((s) => s.active);
  // Shares the ["pages"] cache key with PagesListPage/PageDetailPage — since entering
  // live-edit always starts from one of those admin screens, this is already warm by the
  // time the visitor reaches live-edit, avoiding a race where a nav click fires before the
  // list has loaded and falls back to the plain (non-editable) route.
  const { data: liveEditPages } = useQuery({
    queryKey: ["pages"],
    queryFn: pagesApi.getAll,
    enabled: liveEditActive,
    staleTime: 60_000,
  });

  const resolveNavTo = (path: string): string => {
    if (!liveEditActive) return path;
    const slug = ROUTE_TO_SLUG[path];
    if (slug === undefined) return path;
    const page = liveEditPages?.find((p) => p.slug === slug);
    return page ? `/live-edit/${page.id}` : path;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className={`fixed inset-x-0 top-0 z-[60] px-4 transition-all duration-300 ${
          scrolled
            ? "bg-[color-mix(in_srgb,var(--rt-brand-primary),black_12%)]/85 pb-3 pt-3 shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-lg"
            : "bg-transparent pt-5"
        }`}
      >
        <header
          aria-label="Asosiy navigatsiya"
          className={`mx-auto flex max-w-[1400px] items-center gap-3 transition-all duration-300 ${
            scrolled ? "h-14" : "h-[76px]"
          }`}
        >
          {/* 1 — Logo */}
          <Link to={resolveNavTo("/")} className="flex h-full items-center gap-2.5 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rt-brand-primary)] text-white">🌿</span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-semibold text-[#0F172A]">Naturino</span>
              <span
                className={`hidden text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--rt-brand-primary)]/70 transition-opacity duration-300 md:block ${
                  scrolled ? "opacity-0" : "opacity-100"
                }`}
              >
                {t("logo.subtitle")}
              </span>
            </span>
          </Link>

          {/* 2 — Nav links — centered in the space between logo and the right-side group, so it stays balanced regardless of how wide either side is. */}
          <div className="flex flex-1 items-center justify-center">
            <nav
              aria-label="Asosiy menyu"
              className="hidden h-11 items-center gap-1 rounded-full border border-white/10 bg-[var(--rt-brand-primary)]/50 px-2 text-sm font-medium text-white shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md lg:flex"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.key}
                  to={resolveNavTo(link.to)}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rt-accent)] ${
                      isActive ? "bg-white/15 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex h-full items-center gap-5">
            {/* 3 — Til */}
            <div className="hidden h-10 items-center rounded-full border border-white/10 bg-[var(--rt-brand-primary)]/50 px-1 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md sm:flex">
              <LanguageSwitcher glass />
            </div>

            {/* 4 — CTA */}
            <Link
              to={resolveNavTo("/partnership")}
              className="hidden h-10 items-center gap-2 rounded-full bg-[var(--rt-brand-primary)] px-5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-90 hover:shadow-[0_10px_25px_-8px_rgba(77,124,47,0.5)] lg:flex"
            >
              {t("nav.partnership")} <span aria-hidden>→</span>
            </Link>

            <button
              type="button"
              aria-label={t("menu.open")}
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/60 text-[#0F172A] shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md transition-colors hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rt-brand-primary)] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="right" className="flex w-3/4 flex-col bg-[#F8F9F4] px-4 py-4">
          <SheetHeader>
            <SheetTitle>Naturino</SheetTitle>
          </SheetHeader>

          <nav aria-label="Mobil menyu" className="flex flex-col gap-1 px-4 text-base font-medium text-[#0F172A]">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.key}
                to={resolveNavTo(link.to)}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 transition-colors hover:bg-white hover:text-[var(--rt-brand-primary)] ${
                    isActive ? "bg-white text-[var(--rt-brand-primary)]" : ""
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-4 px-4">
            <LanguageSwitcher />
            <Link
              to={resolveNavTo("/partnership")}
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--rt-brand-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-90"
            >
              {t("nav.partnership")} <span aria-hidden>→</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[#F8F9F4]">
        <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20">
          {/* Pre-footer CTA card */}
          <div className="grid gap-10 rounded-[2rem] bg-[var(--rt-brand-primary)] p-8 shadow-2xl sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                {t("footer.ctaHeading")}
              </h2>
              <p className="mt-4 max-w-md text-white/70">{t("footer.ctaDescription")}</p>

              <ul className="mt-6 flex flex-wrap gap-2.5">
                {FOOTER_TRUST.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80"
                  >
                    <span className="text-[var(--rt-accent)]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-7 py-4 font-semibold text-[var(--rt-brand-primary)] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_15px_35px_-10px_rgba(232,162,58,0.5)]"
              >
                {t("footer.ctaButton")} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* Main footer grid */}
          <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to={resolveNavTo("/")} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--rt-brand-primary)] text-white">🌿</span>
                <span className="text-lg font-semibold text-[#0F172A]">Naturino</span>
              </Link>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]">
                {t("footer.brandTagline")}
              </p>
              <p className="mt-3 max-w-xs text-sm text-slate-500">{t("footer.brandDescription")}</p>

              <ul className="mt-5 space-y-1.5 text-sm font-medium text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--rt-brand-primary)]">✓</span> 20+ eksport bozori
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--rt-brand-primary)]">✓</span> 12 000+ tonna/yil
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--rt-brand-primary)]">✓</span> ISO 22000
                </li>
              </ul>
            </div>

            {FOOTER_COLUMNS.slice(0, 2).map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-[#0F172A]">{t(col.titleKey)}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={resolveNavTo(link.to)} className="transition-colors hover:text-[var(--rt-brand-primary)]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{t(FOOTER_COLUMNS[2].titleKey)}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
                {FOOTER_COLUMNS[2].links.map((link) => (
                  <li key={link.label}>
                    <Link to={resolveNavTo(link.to)} className="transition-colors hover:text-[var(--rt-brand-primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2.5 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--rt-brand-primary)]" /> Toshkent, O'zbekiston
                </p>
                <a href="mailto:export@naturino.uz" className="flex items-center gap-2 transition-colors hover:text-[var(--rt-brand-primary)]">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--rt-brand-primary)]" /> export@naturino.uz
                </a>
                <a href="tel:+998901234567" className="flex items-center gap-2 transition-colors hover:text-[var(--rt-brand-primary)]">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--rt-brand-primary)]" /> +998 90 123 45 67
                </a>
              </div>

              <div className="mt-5 flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[var(--rt-brand-primary)] hover:text-[var(--rt-brand-primary)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200">
          <div className="mx-auto flex h-auto min-h-[72px] max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Naturino</p>
            <div className="flex items-center gap-5">
              <Link to="/contact" className="transition-colors hover:text-[var(--rt-brand-primary)]">
                {t("footer.privacy")}
              </Link>
              <Link to="/contact" className="transition-colors hover:text-[var(--rt-brand-primary)]">
                {t("footer.terms")}
              </Link>
              <Link to={resolveNavTo("/certificates")} className="transition-colors hover:text-[var(--rt-brand-primary)]">
                {t("footer.exportDocs")}
              </Link>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
}
