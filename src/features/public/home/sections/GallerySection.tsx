import { useState } from "react";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../../lib/utils/media";
import type { PageSectionContent } from "../../../../types/page";

interface GalleryImage {
  imageUrl?: string;
  category?: string;
  caption?: string;
}

export function GallerySection({ content }: { content: PageSectionContent }) {
  const eyebrow = content.eyebrow as string | undefined;
  const title = content.title as string | undefined;
  const images = (content.images as GalleryImage[] | undefined) ?? [];
  const categories = Array.from(new Set(images.map((i) => i.category).filter(Boolean))) as string[];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!title && images.length === 0) return null;

  const visible = activeCategory ? images.filter((i) => i.category === activeCategory) : images;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rt-brand-primary)]">{eyebrow}</p>}
        {title && <h2 className="mt-3 text-3xl font-bold text-slate-900">{title}</h2>}
      </div>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === null ? "bg-[var(--rt-brand-primary)] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Barchasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat ? "bg-[var(--rt-brand-primary)] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {visible.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((image, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="overflow-hidden">
                <img
                  src={resolveMediaUrl(image.imageUrl) ?? FALLBACK_IMAGE}
                  alt={image.caption ?? ""}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              {image.caption && (
                <p className="px-4 py-3 text-sm font-medium text-slate-600">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
