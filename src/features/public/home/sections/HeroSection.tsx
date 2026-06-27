import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { PageSectionContent } from "../../../../types/page";
import { ScrollFrameAnimation } from "../../../../components/shared/ScrollFrameAnimation";
import { useScrollProgress } from "../../../../lib/hooks/useScrollProgress";
import { useIsMobile } from "../../../../lib/hooks/useIsMobile";
import { useInView } from "../../../../lib/hooks/useInView";
import { resolveMediaUrl } from "../../../../lib/utils/media";

function fadeUpClass(inView: boolean) {
  return `transition-all duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;
}

function fadeUpStyle(inView: boolean, delayMs: number): CSSProperties {
  return { transitionDelay: inView ? `${delayMs}ms` : "0ms" };
}

interface HeroStat {
  value: string;
  label: string;
}

interface HeroBanner {
  isActive?: boolean;
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  imageStats?: HeroStat[];
  checklist?: string[];
  framePattern?: string;
  frameCount?: number;
}

function legacyBanner(content: PageSectionContent): HeroBanner {
  return {
    isActive: true,
    badge: content.badge as string | undefined,
    title: content.title as string | undefined,
    highlight: content.highlight as string | undefined,
    subtitle: content.subtitle as string | undefined,
    primaryButtonText: content.primaryButtonText as string | undefined,
    primaryButtonUrl: content.primaryButtonUrl as string | undefined,
    secondaryButtonText: content.secondaryButtonText as string | undefined,
    secondaryButtonUrl: content.secondaryButtonUrl as string | undefined,
    imageUrl: content.imageUrl as string | undefined,
    mobileImageUrl: content.mobileImageUrl as string | undefined,
    imageStats: content.imageStats as HeroStat[] | undefined,
    checklist: content.checklist as string[] | undefined,
    framePattern: content.framePattern as string | undefined,
    frameCount: content.frameCount as number | undefined,
  };
}

export function HeroSection({ content, enableScrollFrames }: { content: PageSectionContent; enableScrollFrames?: boolean }) {
  const rawBanners = content.banners as HeroBanner[] | undefined;
  const banners = (rawBanners && rawBanners.length > 0 ? rawBanners : [legacyBanner(content)]).filter(
    (b) => b.isActive !== false,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref: scrollWrapperRef, progress: scrollProgress } = useScrollProgress<HTMLDivElement>();
  const isMobile = useIsMobile();
  const { ref: heroInViewRef, inView: heroInView } = useInView<HTMLDivElement>();

  if (banners.length === 0) return null;
  const banner = banners[Math.min(activeIndex, banners.length - 1)];
  const checklist = banner.checklist ?? [];

  if (enableScrollFrames && isMobile) {
    return (
      <div ref={scrollWrapperRef} className="relative h-[280vh]">
        <section className="sticky top-0 isolate h-[100vh] min-h-[32rem] overflow-hidden bg-slate-900">
          <ScrollFrameAnimation
            framePattern="/hero-frames-mobile/frame-{n}.webp"
            frameCount={207}
            progress={scrollProgress}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        </section>
      </div>
    );
  }

  if (enableScrollFrames && !isMobile) {
    return (
      <div ref={scrollWrapperRef} className="relative h-[400vh]">
        <section className="sticky top-0 isolate h-screen overflow-hidden bg-slate-900">
          <ScrollFrameAnimation
            framePattern={banner.framePattern ?? "/hero-frames/frame-{n}.webp"}
            frameCount={banner.frameCount ?? 221}
            progress={scrollProgress}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

        <div ref={heroInViewRef} className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          {banner.badge && (
            <p
              style={fadeUpStyle(heroInView, 0)}
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/80 ${fadeUpClass(heroInView)}`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--rt-accent)]" />
              {banner.badge}
            </p>
          )}

          {banner.title && (
            <h1
              style={fadeUpStyle(heroInView, 100)}
              className={`mt-4 max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl ${fadeUpClass(heroInView)}`}
            >
              {banner.title}
              {banner.highlight && <span className="text-[var(--rt-accent)]">{banner.highlight}</span>}
            </h1>
          )}

          {banner.subtitle && (
            <p style={fadeUpStyle(heroInView, 200)} className={`mt-5 max-w-xl text-lg text-white/80 ${fadeUpClass(heroInView)}`}>
              {banner.subtitle}
            </p>
          )}

          <div style={fadeUpStyle(heroInView, 300)} className={`mt-8 flex flex-wrap items-center gap-3 ${fadeUpClass(heroInView)}`}>
            {banner.primaryButtonText && (
              <Link
                to={banner.primaryButtonUrl ?? "/products"}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900 transition-colors hover:brightness-110"
              >
                {banner.primaryButtonText} <span aria-hidden>→</span>
              </Link>
            )}
            {banner.secondaryButtonText && (
              <Link
                to={banner.secondaryButtonUrl ?? "/contact"}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/15"
              >
                {banner.secondaryButtonText}
              </Link>
            )}
          </div>

          {checklist.length > 0 && (
            <ul
              style={fadeUpStyle(heroInView, 400)}
              className={`mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 ${fadeUpClass(heroInView)}`}
            >
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/85">
                  <span className="mt-0.5 text-[var(--rt-accent)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {banners.length > 1 && (
            <div className="mt-6 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Banner ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-[var(--rt-accent)]" : "w-2 bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>
        </section>
      </div>
    );
  }

  // Static-image hero — same layout as the scroll-frame hero, but with a fixed
  // background photo instead of frame-by-frame scroll animation.
  if (!enableScrollFrames && banner.imageUrl) {
    return (
      <section className="relative isolate h-screen min-h-[32rem] overflow-hidden bg-[var(--rt-brand-primary)]">
        {/* Desktop uses a landscape crop close to the hero's own aspect ratio, so object-cover
            fills it edge-to-edge without zooming in awkwardly. Mobile gets its own portrait
            crop via mobileImageUrl. */}
        <img
          src={(() => {
            const src = isMobile && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl;
            return resolveMediaUrl(src) ?? src;
          })()}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Mobile: single column over the photo needs a flat, even-darker scrim for the text to stay readable. */}
        <div className="absolute inset-0 bg-black/60 sm:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/35 to-transparent sm:block" />

        <div ref={heroInViewRef} className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          {banner.badge && (
            <p
              style={fadeUpStyle(heroInView, 0)}
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/80 ${fadeUpClass(heroInView)}`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--rt-accent)]" />
              {banner.badge}
            </p>
          )}

          {banner.title && (
            <h1
              style={fadeUpStyle(heroInView, 100)}
              className={`mt-4 max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl ${fadeUpClass(heroInView)}`}
            >
              {banner.title}
              {banner.highlight && <span className="text-[var(--rt-accent)]">{banner.highlight}</span>}
            </h1>
          )}

          {banner.subtitle && (
            <p style={fadeUpStyle(heroInView, 200)} className={`mt-5 max-w-xl text-lg text-white/80 ${fadeUpClass(heroInView)}`}>
              {banner.subtitle}
            </p>
          )}

          <div style={fadeUpStyle(heroInView, 300)} className={`mt-8 flex flex-wrap items-center gap-3 ${fadeUpClass(heroInView)}`}>
            {banner.primaryButtonText && (
              <Link
                to={banner.primaryButtonUrl ?? "/products"}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--rt-accent)] px-6 py-3 font-semibold text-slate-900 transition-colors hover:brightness-110"
              >
                {banner.primaryButtonText} <span aria-hidden>→</span>
              </Link>
            )}
            {banner.secondaryButtonText && (
              <Link
                to={banner.secondaryButtonUrl ?? "/contact"}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/15"
              >
                {banner.secondaryButtonText}
              </Link>
            )}
          </div>

          {checklist.length > 0 && (
            <ul
              style={fadeUpStyle(heroInView, 400)}
              className={`mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 ${fadeUpClass(heroInView)}`}
            >
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/85">
                  <span className="mt-0.5 text-[var(--rt-accent)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {banners.length > 1 && (
            <div className="mt-6 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Banner ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-[var(--rt-accent)]" : "w-2 bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Inner-page hero banner (no scroll-jacking, no image column) — used for every
  // non-Home page so navigation always lands on a proper hero, not bare text.
  return (
    <section className="relative overflow-hidden bg-[var(--rt-brand-primary)] px-6 pb-14 pt-32 text-center text-white sm:pb-16 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--rt-accent) 12%, transparent) 0%, transparent 55%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--rt-brand-secondary) 25%, transparent) 0%, transparent 55%)",
        }}
      />

      <div ref={heroInViewRef} className="relative z-10 mx-auto max-w-3xl">
        {banner.badge && (
          <p
            style={fadeUpStyle(heroInView, 0)}
            className={`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rt-accent)] ${fadeUpClass(heroInView)}`}
          >
            {banner.badge}
          </p>
        )}

        {banner.title && (
          <h1
            style={fadeUpStyle(heroInView, 100)}
            className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${fadeUpClass(heroInView)}`}
          >
            {banner.title}
            {banner.highlight && <span className="text-[var(--rt-accent)]">{banner.highlight}</span>}
          </h1>
        )}

        {banner.subtitle && (
          <p style={fadeUpStyle(heroInView, 200)} className={`mx-auto mt-4 max-w-xl text-white/70 ${fadeUpClass(heroInView)}`}>
            {banner.subtitle}
          </p>
        )}

        <div
          style={fadeUpStyle(heroInView, 300)}
          className={`mt-7 flex flex-wrap items-center justify-center gap-3 ${fadeUpClass(heroInView)}`}
        >
          {banner.primaryButtonText && (
            <Link
              to={banner.primaryButtonUrl ?? "/products"}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--rt-accent)] px-6 py-3 font-semibold text-[var(--rt-brand-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              {banner.primaryButtonText} <span aria-hidden>→</span>
            </Link>
          )}
          {banner.secondaryButtonText && (
            <Link
              to={banner.secondaryButtonUrl ?? "/contact"}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/15"
            >
              {banner.secondaryButtonText}
            </Link>
          )}
        </div>

        {checklist.length > 0 && (
          <ul
            style={fadeUpStyle(heroInView, 400)}
            className={`mt-7 flex flex-wrap items-center justify-center gap-2.5 ${fadeUpClass(heroInView)}`}
          >
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80"
              >
                <span className="text-[var(--rt-accent)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        {banners.length > 1 && (
          <div className="mt-7 flex justify-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Banner ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-[var(--rt-accent)]" : "w-2 bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
