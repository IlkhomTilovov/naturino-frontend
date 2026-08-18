import { useQuery } from "@tanstack/react-query";
import { certificatesApi } from "../../api/endpoints/certificates";

// Shared "trust badge" source for sections that used to hardcode a static
// list (["ISO 22000", "HACCP", ...]) — pulls the real, active certificates
// from the Certificates admin module instead, so the badges never drift
// out of sync with whatever certificates are actually on file.
export function useCertificateBadges(lang: string = "uz") {
  const { data } = useQuery({ queryKey: ["certificates", "public"], queryFn: certificatesApi.getAll });

  return (data ?? [])
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => {
      const title = lang === "uz" ? c.title : c.translations?.[lang]?.title || c.title;
      // Certificate titles are "SHORT NAME — long description" (e.g. "ISO
      // 9001:2015 — Sifat menejmenti tizimi") — badges only want the short name.
      return title.split(/\s[—-]\s/)[0].trim();
    });
}
