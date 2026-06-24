import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { contactsApi } from "../../../api/endpoints/contacts";
import { useToastStore } from "../../../store/toastStore";
import { useInView } from "../../../lib/hooks/useInView";
import { StatsSection } from "../home/sections/StatsSection";
import { CtaSection } from "../home/sections/CtaSection";

const CONTACT_CARDS = [
  {
    Icon: MapPin,
    title: "Manzil",
    lines: ["Toshkent, O'zbekiston", "Ishlab chiqarish va eksport markazi"],
  },
  {
    Icon: Phone,
    title: "Telefon",
    lines: ["+998 XX XXX XX XX", "Dushanba-Juma, 09:00-18:00"],
  },
  {
    Icon: Mail,
    title: "Email",
    lines: ["export@naturino.uz", "Eksport va hamkorlik so'rovlari"],
  },
  {
    Icon: Globe2,
    title: "Eksport",
    lines: ["20+ eksport bozori", "FOB va CIF yetkazib berish"],
  },
];

const WHY_CARDS = [
  { Icon: Factory, title: "O'z ishlab chiqarish majmuasi" },
  { Icon: Globe2, title: "20+ eksport bozori" },
  { Icon: ShieldCheck, title: "ISO 22000 va HACCP" },
  { Icon: Package, title: "Barqaror logistika va ta'minot" },
];

const EXPORT_INFO = [
  { Icon: Package, title: "MOQ 5 tonnadan" },
  { Icon: Ship, title: "FOB va CIF" },
  { Icon: FileText, title: "Eksport hujjatlari" },
  { Icon: Globe2, title: "Logistika qo'llab-quvvatlashi" },
  { Icon: Factory, title: "Mahsulot katalogi" },
  { Icon: ShieldCheck, title: "Xalqaro hamkorlik" },
];

const FAQ_ITEMS = [
  { q: "MOQ qancha?", a: "Standart minimal buyurtma hajmi 5 tonnadan boshlanadi, mahsulot turiga qarab o'zgarishi mumkin." },
  { q: "Qaysi davlatlarga eksport qilasiz?", a: "Hozirda 20 dan ortiq davlatga, jumladan Markaziy Osiyo, MDH, Yaqin Sharq va Janubiy Osiyo bozorlariga yetkazib beramiz." },
  { q: "Mahsulot katalogini qanday olish mumkin?", a: "So'rov formasi orqali murojaat qiling — jamoamiz to'liq katalog va narxlar ro'yxatini yuboradi." },
  { q: "Namuna yuborasizmi?", a: "Ha, distribyutorlik va importyorlik so'rovlari uchun namuna yetkazib berish imkoniyati mavjud." },
  { q: "FOB yoki CIF shartlarida ishlaysizmi?", a: "Ha, mijozning ehtiyojiga qarab FOB va CIF yetkazib berish shartlarining ikkisi ham qo'llab-quvvatlanadi." },
];

const WORKING_HOURS = [
  { day: "Dushanba - Juma", hours: "09:00 - 18:00" },
  { day: "Shanba", hours: "09:00 - 13:00" },
  { day: "Yakshanba", hours: "Dam olish kuni" },
];

const PRODUCT_INTERESTS = ["It ozuqasi", "Mushuk ozuqasi", "Ho'l ozuqa", "Tortmalar", "Boshqa"];

function fadeUp(inView: boolean, delayMs = 0) {
  return {
    style: { transitionDelay: inView ? `${delayMs}ms` : "0ms" },
    className: `transition-all duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`,
  };
}

export function ContactPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    phone: "",
    productType: PRODUCT_INTERESTS[0],
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
      addToast("So'rovingiz muvaffaqiyatli yuborildi. Tez orada bog'lanamiz.");
      setForm({ name: "", company: "", country: "", email: "", phone: "", productType: PRODUCT_INTERESTS[0], message: "" });
    } catch {
      addToast("So'rovni yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Aloqa — Naturino</title>
      </Helmet>

      {/* SECTION 01 — HERO */}
      <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-6 pb-14 pt-32 text-center text-white sm:pb-16 sm:pt-36">
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
              Bosh sahifa
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--rt-accent)]">Aloqa</span>
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Biz bilan bog'laning</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Distribyutorlik, eksport, mahsulot assortimenti va logistika bo'yicha savollaringiz uchun Naturino jamoasi bilan bog'laning.
          </p>
        </div>
      </section>

      {/* SECTION 02 — CONTACT INFO CARDS */}
      <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6">
        <div ref={infoRef.ref} className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((card, i) => (
            <div
              key={card.title}
              {...fadeUp(infoRef.inView, i * 100)}
              className={`rounded-3xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] ${fadeUp(infoRef.inView, i * 100).className}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                <card.Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-semibold text-[#0F172A]">{card.title}</h3>
              <div className="mt-1.5 space-y-0.5">
                {card.lines.map((line) => (
                  <p key={line} className="text-sm text-slate-500">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 03 — FORM + WHY NATURINO */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div ref={formRef.ref} className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div {...fadeUp(formRef.inView)}>
            <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Hamkorlik bo'yicha so'rov yuboring</h2>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ism">
                  <input required value={form.name} onChange={onChange("name")} className="input" />
                </Field>
                <Field label="Kompaniya nomi">
                  <input value={form.company} onChange={onChange("company")} className="input" />
                </Field>
                <Field label="Mamlakat">
                  <input value={form.country} onChange={onChange("country")} className="input" />
                </Field>
                <Field label="Email">
                  <input required type="email" value={form.email} onChange={onChange("email")} className="input" />
                </Field>
                <Field label="Telefon">
                  <input value={form.phone} onChange={onChange("phone")} className="input" />
                </Field>
                <Field label="Qiziqayotgan mahsulot turi">
                  <select value={form.productType} onChange={onChange("productType")} className="input">
                    {PRODUCT_INTERESTS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Xabar">
                <textarea
                  required
                  rows={4}
                  placeholder="MOQ, katalog yoki eksport bo'yicha ma'lumot."
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
                {submitting ? "Yuborilmoqda..." : "Eksport taklifini olish"} <span aria-hidden>→</span>
              </button>
            </form>
          </div>

          <div {...fadeUp(formRef.inView, 150)}>
            <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Nega Naturino bilan ishlashadi?</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {WHY_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#E7EBDD] bg-[#F8F9F4] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                    <card.Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-4 font-semibold text-[#0F172A]">{card.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — MAP */}
      <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Bizning manzilimiz</h2>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-[var(--rt-brand-secondary)]" /> Toshkent, O'zbekiston
          </p>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <iframe
              title="Naturino manzili — Toshkent, O'zbekiston"
              src="https://maps.google.com/maps?q=Tashkent,Uzbekistan&z=12&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* SECTION 05 — EXPORT INFORMATION */}
      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div ref={exportRef.ref} className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Eksport va distribyutorlik bo'yicha</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Naturino xalqaro hamkorlar uchun eksport hujjatlari, logistika qo'llab-quvvatlashi va barqaror ta'minotni taqdim etadi.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPORT_INFO.map((item, i) => (
              <div
                key={item.title}
                {...fadeUp(exportRef.inView, i * 80)}
                className={`flex items-center gap-3 rounded-2xl border border-[#E7EBDD] bg-[#F8F9F4] px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${fadeUp(exportRef.inView, i * 80).className}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--rt-brand-secondary)]/10 text-[var(--rt-brand-secondary)]">
                  <item.Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="font-medium text-[#0F172A]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06 — FAQ */}
      <section className="bg-[#F8F9F4] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-[#0F172A] sm:text-3xl">Ko'p beriladigan savollar</h2>

          <div className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#F8F9F4]"
                  >
                    <span className="font-semibold text-[#0F172A]">{item.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--rt-brand-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ maxHeight: isOpen ? "200px" : "0px" }}
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">{item.a}</p>
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
          <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Ish vaqti</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {WORKING_HOURS.map((item) => (
              <div
                key={item.day}
                className="rounded-2xl border border-[#E7EBDD] bg-[#F8F9F4] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Clock className="mx-auto h-6 w-6 text-[var(--rt-brand-secondary)]" strokeWidth={1.75} />
                <p className="mt-3 font-semibold text-[#0F172A]">{item.day}</p>
                <p className="mt-1 text-sm text-slate-500">{item.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 08 — TRUST / KPI */}
      <StatsSection
        content={{
          eyebrow: "HAMKORLAR ISHONCHI",
          title: "Naturino raqamlarda",
          items: [
            { icon: "globe", value: "20+", label: "Eksport bozori" },
            { icon: "factory", value: "12 000+", label: "Tonna/yil ishlab chiqarish quvvati" },
            { icon: "box", value: "40+", label: "SKU assortiment" },
            { icon: "badge", value: "100%", label: "ISO 22000 sertifikatlangan ishlab chiqarish" },
          ],
        }}
      />

      {/* SECTION 09 — FINAL CTA */}
      <CtaSection
        content={{
          title: "Xalqaro hamkorlikni boshlashga ",
          highlight: "tayyormisiz?",
          subtitle: "Distribyutorlar va importyorlar uchun premium pet food mahsulotlari, eksport qo'llab-quvvatlashi va barqaror ta'minot.",
          trustBadges: ["ISO 22000", "HACCP", "20+ eksport bozori", "12 000+ tonna/yil quvvat"],
          buttonUrl: "/contact",
          buttonText: "Eksport taklifini olish",
          secondaryButtonUrl: "/partnership",
          secondaryButtonText: "Hamkorlik bo'yicha bog'lanish",
        }}
      />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#0F172A]">{label}</span>
      {children}
    </label>
  );
}
