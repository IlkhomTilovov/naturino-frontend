import { Link } from "react-router-dom";
import { Award, FileCheck2, ShieldCheck, Stamp, type LucideIcon } from "lucide-react";
import type { PageSectionContent } from "../../../types/page";
import { resolveMediaUrl } from "../../../lib/utils/media";

interface CertificateItem {
  imageUrl?: string;
  name?: string;
  description?: string;
  downloadUrl?: string;
  icon?: string;
}

const CERT_ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  document: FileCheck2,
  seal: Stamp,
  award: Award,
};

export function ContentSection({ content }: { content: PageSectionContent }) {
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const body = content.content as string | undefined;
  const buttonText = content.buttonText as string | undefined;
  const buttonUrl = (content.buttonUrl as string | undefined) ?? "/";
  const imageSrc = resolveMediaUrl(content.imageUrl as string | undefined);
  const items = (content.items as CertificateItem[] | undefined) ?? [];
  const anchorId = content.anchorId as string | undefined;
  const hasText = title || subtitle || body;

  if (!hasText && !imageSrc && items.length === 0) return null;

  return (
    <section id={anchorId} className="mx-auto max-w-4xl px-6 py-16 text-center scroll-mt-32">
      {title && <h2 className="text-3xl font-bold text-slate-900">{title}</h2>}
      {subtitle && <p className="mt-2 text-lg text-slate-500">{subtitle}</p>}
      {imageSrc && (
        <img src={imageSrc} alt={title ?? ""} className="mx-auto mt-6 max-h-80 w-full max-w-md object-contain" />
      )}
      {body && <p className="mx-auto mt-6 whitespace-pre-line text-slate-600">{body}</p>}

      {items.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, i) => {
            const imageSrc = resolveMediaUrl(item.imageUrl);
            const Icon = CERT_ICONS[item.icon ?? ""] ?? ShieldCheck;

            if (imageSrc) {
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <img src={imageSrc} alt={item.name ?? ""} className="aspect-square w-full rounded-lg object-contain" />
                  {item.name && <p className="mt-3 text-sm font-medium text-slate-700">{item.name}</p>}
                </div>
              );
            }

            return (
              <a
                key={i}
                href={item.downloadUrl ?? "#"}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                {item.name && <p className="mt-4 text-base font-semibold text-slate-900">{item.name}</p>}
                {item.description && <p className="mt-1.5 flex-1 text-sm text-slate-500">{item.description}</p>}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--rt-brand-primary)] transition-colors group-hover:text-[var(--rt-accent)]">
                  Hujjatni ko'rish <span aria-hidden>→</span>
                </span>
              </a>
            );
          })}
        </div>
      )}

      {buttonText && (
        <Link
          to={buttonUrl}
          className="mt-6 inline-flex items-center rounded-full bg-[var(--rt-brand-primary)] px-6 py-3 font-semibold text-white hover:brightness-90"
        >
          {buttonText}
        </Link>
      )}
    </section>
  );
}
