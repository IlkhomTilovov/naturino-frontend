import type { PageSectionContent } from "../../types/page";

// Any language code works (driven by the Languages admin list) — "uz" is always the
// default/base slot that flat (pre-localization) legacy content migrates into.
export type ContentLanguage = string;

function isLocalizedShape(content: PageSectionContent): boolean {
  // A localized shape has at least one key whose value is a non-null object AND
  // whose key looks like a short language code (2-5 lowercase letters). This avoids
  // false-positives on flat content that happens to have an object-valued field.
  return Object.keys(content).some(
    (key) => /^[a-z]{2,5}$/.test(key) && typeof content[key] === "object" && content[key] !== null,
  );
}

/** Reads a section's content for the given language, falling back to the flat legacy shape (treated as "uz") when the section hasn't been migrated to per-language content yet. */
export function getLocalized(content: PageSectionContent, lang: ContentLanguage): PageSectionContent {
  if (!isLocalizedShape(content)) return content;
  const forLang = content[lang] as PageSectionContent | undefined;
  // An empty {} (no translation ever entered for this language) must fall back to uz too —
  // otherwise sections render with all fields blank instead of the default-language content.
  if (forLang && Object.keys(forLang).length > 0) return forLang;
  return (content.uz as PageSectionContent | undefined) ?? {};
}

/** Writes a patch into the given language's slot, migrating a legacy flat section to the per-language shape on first edit. */
export function setLocalized(
  content: PageSectionContent,
  lang: ContentLanguage,
  patch: PageSectionContent,
): PageSectionContent {
  if (!isLocalizedShape(content)) {
    if (lang === "uz") return { uz: { ...content, ...patch } };
    return { uz: content, [lang]: { ...content, ...patch } };
  }
  return { ...content, [lang]: { ...getLocalized(content, lang), ...patch } };
}
