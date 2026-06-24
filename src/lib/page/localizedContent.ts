import type { PageSectionContent } from "../../types/page";

export type ContentLanguage = "uz" | "ru";

const LANG_KEYS: ContentLanguage[] = ["uz", "ru"];

function isLocalizedShape(content: PageSectionContent): boolean {
  return LANG_KEYS.some((lang) => typeof content[lang] === "object" && content[lang] !== null);
}

/** Reads a section's content for the given language, falling back to the flat legacy shape (treated as "uz") when the section hasn't been migrated to per-language content yet. */
export function getLocalized(content: PageSectionContent, lang: ContentLanguage): PageSectionContent {
  if (!isLocalizedShape(content)) return content;
  return (content[lang] as PageSectionContent | undefined) ?? (content.uz as PageSectionContent | undefined) ?? {};
}

/** Writes a patch into the given language's slot, migrating a legacy flat section to the per-language shape on first edit. */
export function setLocalized(
  content: PageSectionContent,
  lang: ContentLanguage,
  patch: PageSectionContent,
): PageSectionContent {
  if (!isLocalizedShape(content)) {
    return { uz: lang === "uz" ? { ...content, ...patch } : content, ru: lang === "ru" ? { ...content, ...patch } : {} };
  }
  return { ...content, [lang]: { ...getLocalized(content, lang), ...patch } };
}
