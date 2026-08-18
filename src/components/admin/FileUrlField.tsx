import { useRef, useState } from "react";
import { mediaApi } from "../../api/endpoints/media";

// For fields that hold either an internal route ("/contact") or an uploaded
// file's URL ("/uploads/2026/08/....pdf") — a plain text input (so a route
// can still be typed by hand) plus an upload button that fills it in from a
// real file (PDF or image), matching CTA buttonUrl's dual use.
export function FileUrlField({
  value,
  onChange,
  placeholder = "/contact yoki fayl yuklang",
}: {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const media = await mediaApi.upload(file);
      onChange(media.url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        className="input flex-1"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="shrink-0 rounded-md border border-admin-border px-3 py-2 text-xs font-medium text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary disabled:opacity-50"
      >
        {isUploading ? "Yuklanmoqda..." : "Fayl yuklash"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
