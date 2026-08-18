import { Dialog } from "@base-ui/react/dialog";
import { useQuery } from "@tanstack/react-query";
import { FileText, X } from "lucide-react";
import { certificatesApi } from "../../../api/endpoints/certificates";
import { resolveMediaUrl } from "../../../lib/utils/media";
import { useLanguage } from "../../../i18n/LanguageContext";

// Opened from a CTA button whose buttonUrl is the "certificates" sentinel —
// lets a visitor browse every real, active certificate on file and open
// whichever one they actually want, instead of the button linking to a
// single hardcoded (and often irrelevant) PDF.
export function CertificatesModal({ trigger }: { trigger: React.ReactElement }) {
  const { language } = useLanguage();
  const { data } = useQuery({ queryKey: ["certificates", "public"], queryFn: certificatesApi.getAll });
  const certificates = (data ?? []).filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Dialog.Root>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0_25px_60px_rgba(0,0,0,0.25)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold text-[#294A34] sm:text-2xl">Sertifikatlarimiz</Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm text-taupe">
                Ko'rmoqchi bo'lgan hujjatni tanlang — yangi tabda ochiladi.
              </Dialog.Description>
            </div>
            <Dialog.Close className="shrink-0 rounded-full p-1.5 text-taupe transition-colors hover:bg-[#F3EDE1] hover:text-[#294A34]">
              <X className="h-5 w-5" />
              <span className="sr-only">Yopish</span>
            </Dialog.Close>
          </div>

          <div className="mt-6 space-y-2.5">
            {certificates.length === 0 && <p className="text-sm text-taupe">Hozircha sertifikatlar qo'shilmagan.</p>}
            {certificates.map((cert) => {
              const title = language === "uz" ? cert.title : cert.translations?.[language]?.title || cert.title;
              const fileHref = resolveMediaUrl(cert.fileUrl);
              return (
                <a
                  key={cert.id}
                  href={fileHref ?? undefined}
                  target={fileHref ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-disabled={!fileHref}
                  className={`flex items-center gap-3 rounded-2xl border border-[#E7EBDD] bg-[#F3EDE1] px-4 py-3.5 transition-all duration-200 ${
                    fileHref ? "hover:-translate-y-0.5 hover:border-[var(--rt-brand-primary)] hover:shadow-md" : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={(e) => {
                    if (!fileHref) e.preventDefault();
                  }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--rt-brand-primary)]/10 text-[var(--rt-brand-primary)]">
                    <FileText className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#294A34]">{title}</span>
                    {cert.issuedBy && <span className="block truncate text-xs text-taupe">{cert.issuedBy}</span>}
                  </span>
                  {!fileHref && <span className="shrink-0 text-xs text-taupe">Fayl yo'q</span>}
                </a>
              );
            })}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
