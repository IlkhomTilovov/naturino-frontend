import type { ComponentType } from "react";
import { renderSection, SECTION_TYPE_NAMES } from "../../public/shared/renderSection";
import type { PageSection, PageSectionContent } from "../../../types/page";
import { getLocalized, type ContentLanguage } from "../../../lib/page/localizedContent";
import { EditableHeroSection, type HeroBanner } from "./EditableHeroSection";
import { EditableStatsSection } from "./EditableStatsSection";
import { EditableCtaSection } from "./EditableCtaSection";
import { EditableTrustBarSection } from "./EditableTrustBarSection";
import { EditableFeaturesSection } from "./EditableFeaturesSection";
import { EditableComparisonSection } from "./EditableComparisonSection";
import { EditableProductsSection } from "./EditableProductsSection";
import { EditablePrivateLabelSection } from "./EditablePrivateLabelSection";
import { EditableProcessSection } from "./EditableProcessSection";
import { EditableQualitySection } from "./EditableQualitySection";
import { EditablePartnersSection } from "./EditablePartnersSection";
import { EditableContentSection } from "./EditableContentSection";
import { EditableFeatureCardsSection } from "./EditableFeatureCardsSection";
import { EditableProductRangeSection } from "./EditableProductRangeSection";
import { EditableGallerySection } from "./EditableGallerySection";
import { EditableFaqSection } from "./EditableFaqSection";
import { EditableProductsHeroSection } from "./EditableProductsHeroSection";

export type DeviceMode = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

type FieldEditableProps = { content: PageSectionContent; onFieldChange: (key: string, value: unknown) => void };

const EDITABLE_SECTIONS: Record<string, ComponentType<FieldEditableProps>> = {
  Stats: EditableStatsSection,
  CTA: EditableCtaSection,
  TrustBar: EditableTrustBarSection,
  Features: EditableFeaturesSection,
  Comparison: EditableComparisonSection,
  Products: EditableProductsSection,
  PrivateLabel: EditablePrivateLabelSection,
  Process: EditableProcessSection,
  Quality: EditableQualitySection,
  Partners: EditablePartnersSection,
  About: EditableContentSection,
  Certificates: EditableContentSection,
  Contact: EditableContentSection,
  WhyPartner: EditableFeatureCardsSection,
  WhoWeWorkWith: EditableFeatureCardsSection,
  ExportCapabilities: EditableFeatureCardsSection,
  ProductRange: EditableProductRangeSection,
  Gallery: EditableGallerySection,
  FAQ: EditableFaqSection,
};

export function LivePreviewPane({
  sections,
  device,
  activeSectionId,
  activeLang,
  onSelect,
  onFieldChange,
}: {
  sections: PageSection[];
  device: DeviceMode;
  activeSectionId: string | null;
  activeLang: ContentLanguage;
  onSelect: (id: string) => void;
  onFieldChange?: (sectionId: string, key: string, value: unknown) => void;
}) {
  const visible = sections.filter((s) => s.isEnabled).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex h-full justify-center overflow-y-auto bg-slate-100 p-6">
      <div
        className="h-fit overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm transition-all"
        style={{ width: DEVICE_WIDTHS[device], maxWidth: "100%" }}
      >
        {visible.length === 0 && <p className="px-6 py-16 text-center text-sm text-admin-muted">Faol bo'limlar yo'q.</p>}

        {visible.map((section) => {
          const typeName = SECTION_TYPE_NAMES[Number(section.sectionType)] ?? String(section.sectionType);
          const isActive = activeSectionId === section.id;
          const localContent = getLocalized(section.content, activeLang);
          const hasBanners = Array.isArray((section.content as Record<string, unknown>).banners)
            && ((section.content as Record<string, unknown>).banners as unknown[]).length > 0;
          const EditableComponent = typeName === "Hero" ? null : EDITABLE_SECTIONS[typeName];
          const isInlineEditable = isActive && Boolean(onFieldChange) && (typeName === "Hero" || Boolean(EditableComponent));

          return (
            <div
              key={section.id}
              data-section-id={section.id}
              onClick={(e) => {
                e.preventDefault();
                onSelect(section.id);
              }}
              className={`relative transition-shadow ${
                isInlineEditable
                  ? "outline outline-2 outline-offset-[-2px] outline-admin-accent"
                  : isActive
                    ? "cursor-pointer outline outline-2 outline-offset-[-2px] outline-admin-primary"
                    : "cursor-pointer hover:outline hover:outline-1 hover:outline-offset-[-1px] hover:outline-admin-accent"
              }`}
            >
              {isInlineEditable && typeName === "Hero" && hasBanners ? (
                <EditableHeroSection
                  banners={(localContent.banners as HeroBanner[] | undefined) ?? []}
                  onChange={(banners) => onFieldChange!(section.id, "banners", banners)}
                />
              ) : isInlineEditable && typeName === "Hero" && !hasBanners ? (
                <EditableProductsHeroSection
                  content={localContent}
                  onFieldChange={(key, value) => onFieldChange!(section.id, key, value)}
                />
              ) : isInlineEditable && EditableComponent ? (
                <EditableComponent
                  content={getLocalized(section.content, activeLang)}
                  onFieldChange={(key, value) => onFieldChange!(section.id, key, value)}
                />
              ) : typeName === "Hero" && !hasBanners ? (
                <EditableProductsHeroSection
                  content={localContent}
                  onFieldChange={() => {}}
                />
              ) : (
                renderSection(section, activeLang)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
