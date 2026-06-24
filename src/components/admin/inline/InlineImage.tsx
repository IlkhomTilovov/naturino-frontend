import { useRef, useState } from "react";
import { mediaApi } from "../../../api/endpoints/media";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../../lib/utils/media";

export function InlineImage({
  imageUrl,
  alt,
  className = "h-96 w-full object-cover",
  onChange,
}: {
  imageUrl?: string;
  alt?: string;
  className?: string;
  onChange: (url: string | null) => void;
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
    <div className="group relative h-full">
      {imageUrl ? (
        <img
          src={resolveMediaUrl(imageUrl) ?? FALLBACK_IMAGE}
          alt={alt ?? ""}
          className={className}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      ) : (
        <div className={`${className} bg-slate-100`} />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="invisible absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-admin-primary hover:bg-slate-100"
        >
          {isUploading ? "Yuklanmoqda..." : "Almashtirish"}
        </button>
        {imageUrl && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-admin-danger hover:bg-slate-100"
          >
            O'chirish
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
