import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../types/page";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../lib/utils/media";

interface CertificateItem {
  imageUrl?: string;
  name?: string;
}

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
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
              <img
                src={resolveMediaUrl(item.imageUrl) ?? FALLBACK_IMAGE}
                alt={item.name ?? ""}
                className="aspect-square w-full rounded-lg object-contain"
              />
              {item.name && <p className="mt-3 text-sm font-medium text-slate-700">{item.name}</p>}
            </div>
          ))}
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
