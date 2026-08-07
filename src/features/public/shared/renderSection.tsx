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
import { PageBannerSection } from "../home/sections/PageBannerSection";
import { BackgroundHeroSection } from "../home/sections/BackgroundHeroSection";
import { StatsHeroSection } from "../home/sections/StatsHeroSection";
import { MinimalHeroSection } from "../home/sections/MinimalHeroSection";
import { BadgeListHeroSection } from "../home/sections/BadgeListHeroSection";
import { BreadcrumbHeroSection } from "../home/sections/BreadcrumbHeroSection";
import { QualityIconGridSection } from "../home/sections/QualityIconGridSection";
import { QualityMetricsSection } from "../home/sections/QualityMetricsSection";
import { QualityChecklistSection } from "../home/sections/QualityChecklistSection";
import { QualityBadgeWallSection } from "../home/sections/QualityBadgeWallSection";
import { QualityPledgeSection } from "../home/sections/QualityPledgeSection";
import { ProcessTimelineVerticalSection } from "../home/sections/ProcessTimelineVerticalSection";
import { ProcessCardGridSection } from "../home/sections/ProcessCardGridSection";
import { ProcessSplitImageSection } from "../home/sections/ProcessSplitImageSection";
import { ProcessFlowSection } from "../home/sections/ProcessFlowSection";
import { ProcessAccordionSection } from "../home/sections/ProcessAccordionSection";
import { WhyPartnerIconGridSection } from "../home/sections/WhyPartnerIconGridSection";
import { WhyPartnerMetricsSection } from "../home/sections/WhyPartnerMetricsSection";
import { WhyPartnerSplitImageSection } from "../home/sections/WhyPartnerSplitImageSection";
import { WhyPartnerQuoteSection } from "../home/sections/WhyPartnerQuoteSection";
import { WhyPartnerCtaBandSection } from "../home/sections/WhyPartnerCtaBandSection";
import { ExportCapabilitiesSection } from "../home/sections/ExportCapabilitiesSection";

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
  "CategoryTabs",
  "PageBanner",
  "BackgroundHero",
  "StatsHero",
  "MinimalHero",
  "BadgeListHero",
  "BreadcrumbHero",
  "QualityIconGrid",
  "QualityMetrics",
  "QualityChecklist",
  "QualityBadgeWall",
  "QualityPledge",
  "ProcessTimelineVertical",
  "ProcessCardGrid",
  "ProcessSplitImage",
  "ProcessFlow",
  "ProcessAccordion",
  "WhyPartnerIconGrid",
  "WhyPartnerMetrics",
  "WhyPartnerSplitImage",
  "WhyPartnerQuote",
  "WhyPartnerCtaBand",
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
      return <HeroSection key={section.id} />;
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
      return <FeatureCardsSection key={section.id} content={content} />;
    case "ExportCapabilities":
      return <ExportCapabilitiesSection key={section.id} content={content} />;
    case "ProductRange":
      return <ProductRangeSection key={section.id} content={content} />;
    case "Gallery":
      return <GallerySection key={section.id} content={content} />;
    case "FAQ":
      return <FaqSection key={section.id} content={content} />;
    case "Certificates":
      return <CertificatesSection key={section.id} content={content} />;
    case "PageBanner":
      return <PageBannerSection key={section.id} content={content} />;
    case "BackgroundHero":
      return <BackgroundHeroSection key={section.id} content={content} />;
    case "StatsHero":
      return <StatsHeroSection key={section.id} content={content} />;
    case "MinimalHero":
      return <MinimalHeroSection key={section.id} content={content} />;
    case "BadgeListHero":
      return <BadgeListHeroSection key={section.id} content={content} />;
    case "BreadcrumbHero":
      return <BreadcrumbHeroSection key={section.id} content={content} />;
    case "QualityIconGrid":
      return <QualityIconGridSection key={section.id} content={content} />;
    case "QualityMetrics":
      return <QualityMetricsSection key={section.id} content={content} />;
    case "QualityChecklist":
      return <QualityChecklistSection key={section.id} content={content} />;
    case "QualityBadgeWall":
      return <QualityBadgeWallSection key={section.id} content={content} />;
    case "QualityPledge":
      return <QualityPledgeSection key={section.id} content={content} />;
    case "ProcessTimelineVertical":
      return <ProcessTimelineVerticalSection key={section.id} content={content} />;
    case "ProcessCardGrid":
      return <ProcessCardGridSection key={section.id} content={content} />;
    case "ProcessSplitImage":
      return <ProcessSplitImageSection key={section.id} content={content} />;
    case "ProcessFlow":
      return <ProcessFlowSection key={section.id} content={content} />;
    case "ProcessAccordion":
      return <ProcessAccordionSection key={section.id} content={content} />;
    case "WhyPartnerIconGrid":
      return <WhyPartnerIconGridSection key={section.id} content={content} />;
    case "WhyPartnerMetrics":
      return <WhyPartnerMetricsSection key={section.id} content={content} />;
    case "WhyPartnerSplitImage":
      return <WhyPartnerSplitImageSection key={section.id} content={content} />;
    case "WhyPartnerQuote":
      return <WhyPartnerQuoteSection key={section.id} content={content} />;
    case "WhyPartnerCtaBand":
      return <WhyPartnerCtaBandSection key={section.id} content={content} />;
    case "About":
    case "Contact":
      return <ContentSection key={section.id} content={content} />;
    default:
      return null;
  }
}
