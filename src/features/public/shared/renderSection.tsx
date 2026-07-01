import type { PageSection } from "../../../types/page";
import { getLocalized, type ContentLanguage } from "../../../lib/page/localizedContent";
import { HeroSection } from "../home/sections/HeroSection";
import { FeaturesSection } from "../home/sections/FeaturesSection";
import { ProductsSection } from "../home/sections/ProductsSection";
import { CtaSection } from "../home/sections/CtaSection";
import { TrustBarSection } from "../home/sections/TrustBarSection";
import { StatsSection } from "../home/sections/StatsSection";
import { ComparisonSection } from "../home/sections/ComparisonSection";
import { PrivateLabelSection } from "../home/sections/PrivateLabelSection";
import { ProcessSection } from "../home/sections/ProcessSection";
import { QualitySection } from "../home/sections/QualitySection";
import { PartnersSection } from "../home/sections/PartnersSection";
import { FeatureCardsSection } from "../home/sections/FeatureCardsSection";
import { ProductRangeSection } from "../home/sections/ProductRangeSection";
import { GallerySection } from "../home/sections/GallerySection";
import { FaqSection } from "../home/sections/FaqSection";
import { ContentSection } from "./ContentSection";
import { CertificatesSection } from "../home/sections/CertificatesSection";

export const SECTION_TYPE_NAMES = [
  "Hero",
  "Features",
  "Products",
  "About",
  "Certificates",
  "CTA",
  "Contact",
  "TrustBar",
  "Stats",
  "Comparison",
  "PrivateLabel",
  "Process",
  "Quality",
  "Partners",
  "WhyPartner",
  "WhoWeWorkWith",
  "ProductRange",
  "ExportCapabilities",
  "Gallery",
  "FAQ",
];

export function getSectionTypeName(sectionType: number | string): string {
  return SECTION_TYPE_NAMES[Number(sectionType)] ?? String(sectionType);
}

/** `lang` resolves the section's content for the active site language (CMS page content only — falls back to legacy flat content for sections never edited per-language). */
export function renderSection(section: PageSection, lang?: ContentLanguage) {
  const typeName = getSectionTypeName(section.sectionType);
  const content = lang ? getLocalized(section.content, lang) : section.content;

  switch (typeName) {
    case "Hero":
      return (
        <HeroSection
          key={section.id}
          content={content}
          enableScrollFrames={Boolean(content.enableScrollFrames)}
        />
      );
    case "Features":
      return <FeaturesSection key={section.id} content={content} />;
    case "Products":
      return <ProductsSection key={section.id} content={content} />;
    case "CTA":
      return <CtaSection key={section.id} content={content} />;
    case "TrustBar":
      return <TrustBarSection key={section.id} content={content} />;
    case "Stats":
      return <StatsSection key={section.id} content={content} />;
    case "Comparison":
      return <ComparisonSection key={section.id} content={content} />;
    case "PrivateLabel":
      return <PrivateLabelSection key={section.id} content={content} />;
    case "Process":
      return <ProcessSection key={section.id} content={content} />;
    case "Quality":
      return <QualitySection key={section.id} content={content} />;
    case "Partners":
      return <PartnersSection key={section.id} content={content} />;
    case "WhyPartner":
    case "WhoWeWorkWith":
    case "ExportCapabilities":
      return <FeatureCardsSection key={section.id} content={content} />;
    case "ProductRange":
      return <ProductRangeSection key={section.id} content={content} />;
    case "Gallery":
      return <GallerySection key={section.id} content={content} />;
    case "FAQ":
      return <FaqSection key={section.id} content={content} />;
    case "Certificates":
      return <CertificatesSection key={section.id} content={content} />;
    case "About":
    case "Contact":
      return <ContentSection key={section.id} content={content} />;
    default:
      return null;
  }
}
