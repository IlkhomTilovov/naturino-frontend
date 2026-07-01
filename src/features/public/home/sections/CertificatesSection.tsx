import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, FileText, Stamp, Award, ExternalLink, CalendarDays, Building2 } from "lucide-react";
import { certificatesApi, type Certificate } from "../../../../api/endpoints/certificates";
import { useLanguage } from "../../../../i18n/LanguageContext";

const ICON_MAP: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  document: FileText,
  seal: Stamp,
  award: Award,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  quality:     { bg: "bg-emerald-50",  text: "text-emerald-700",  dot: "bg-emerald-500" },
  safety:      { bg: "bg-blue-50",     text: "text-blue-700",     dot: "bg-blue-500" },
  halal:       { bg: "bg-teal-50",     text: "text-teal-700",     dot: "bg-teal-500" },
  export:      { bg: "bg-violet-50",   text: "text-violet-700",   dot: "bg-violet-500" },
  veterinary:  { bg: "bg-amber-50",    text: "text-amber-700",    dot: "bg-amber-500" },
  laboratory:  { bg: "bg-sky-50",      text: "text-sky-700",      dot: "bg-sky-500" },
};

const CATEGORY_LABELS: Record<string, string> = {
  quality:    "Sifat boshqaruvi",
  safety:     "Xavfsizlik",
  halal:      "Halol",
  export:     "Eksport",
  veterinary: "Veterinariya",
  laboratory: "Laboratoriya",
};

const SCOPE_LABELS: Record<string, string> = {
  international: "Xalqaro",
  eu:            "Yevropa Ittifoqi",
  cis:           "MDH",
  uzbekistan:    "O'zbekiston",
};

function formatDate(d?: string | null) {
  if (!d) return null;
  const date = new Date(d);
  return date.toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });
}

function CertCard({ cert, lang }: { cert: Certificate; lang: string }) {
  const Icon = ICON_MAP[cert.icon ?? "shield"] ?? ShieldCheck;
  const color = CATEGORY_COLORS[cert.category ?? ""] ?? { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };

  const translation = cert.translations?.[lang];
  const title = translation?.title || cert.title;
  const description = translation?.description || cert.description;

  const isExpired = cert.expiryDate ? new Date(cert.expiryDate) < new Date() : false;
  const expiresLabel = cert.expiryDate
    ? isExpired
      ? `Muddati o'tgan: ${formatDate(cert.expiryDate)}`
      : `Amal qiladi: ${formatDate(cert.expiryDate)}`
    : null;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* header row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color.bg}`}>
          <Icon className={`h-6 w-6 ${color.text}`} strokeWidth={1.8} />
        </div>
        {cert.category && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${color.bg} ${color.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${color.dot}`} />
            {CATEGORY_LABELS[cert.category] ?? cert.category}
          </span>
        )}
      </div>

      {/* title */}
      <h3 className="mb-2 text-base font-semibold leading-snug text-slate-900">{title}</h3>

      {/* description */}
      {description && (
        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">{description}</p>
      )}

      {/* meta */}
      <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        {cert.issuedBy && (
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{cert.issuedBy}</span>
          </div>
        )}
        {cert.certificateNumber && (
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="font-mono">{cert.certificateNumber}</span>
          </div>
        )}
        {expiresLabel && (
          <div className={`flex items-center gap-1.5 ${isExpired ? "text-red-500" : "text-slate-500"}`}>
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{expiresLabel}</span>
          </div>
        )}
        {cert.scope && (
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {SCOPE_LABELS[cert.scope] ?? cert.scope}
            </span>
          </div>
        )}
      </div>

      {/* verification link */}
      {cert.verificationUrl && (
        <a
          href={cert.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Tasdiqlash
        </a>
      )}
    </div>
  );
}

interface Props {
  content: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
}

export function CertificatesSection({ content }: Props) {
  const { language } = useLanguage();
  const lang = language ?? "uz";

  const { data: certs = [], isLoading } = useQuery({
    queryKey: ["certificates-public"],
    queryFn: certificatesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const active = certs.filter((c) => c.isActive);

  return (
    <section className="bg-[#FAFAF7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* section header */}
        <div className="mb-12 text-center">
          {(content.eyebrow || "SERTIFIKATLAR") && (
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
              {content.eyebrow ?? "SERTIFIKATLAR"}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {content.title ?? "Sertifikatlar va muvofiqlik"}
          </h2>
          {content.subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">{content.subtitle}</p>
          )}
        </div>

        {/* grid */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : active.length === 0 ? null : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((cert) => (
              <CertCard key={cert.id} cert={cert} lang={lang} />
            ))}
          </div>
        )}

        {/* trust line */}
        {active.length > 0 && (
          <p className="mt-10 text-center text-sm text-slate-400">
            Barcha sertifikatlar joriy va amal qilmoqda · Tekshirish uchun sertifikat raqamiga murojaat qiling
          </p>
        )}
      </div>
    </section>
  );
}
