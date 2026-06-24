import { useRef, useState } from "react";
import { mediaApi } from "../../api/endpoints/media";
import { FALLBACK_IMAGE, resolveMediaUrl } from "../../lib/utils/media";

export function MediaUploaderField({
  imageUrl,
  onChange,
}: {
  imageUrl?: string | null;
  onChange: (url: string | null, mediaFileId?: string | null) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const media = await mediaApi.upload(file);
      onChange(media.url, media.id);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void handleFile(file);
      }}
      className={`flex h-40 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors ${
        isDragOver ? "border-admin-accent bg-admin-accent-50" : "border-admin-border"
      }`}
    >
      {imageUrl ? (
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <img
            src={resolveMediaUrl(imageUrl) ?? FALLBACK_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/50 p-1">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded bg-white/90 px-2 py-0.5 text-xs font-medium">
              Almashtirish
            </button>
            <button type="button" onClick={() => onChange(null, null)} className="rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-admin-danger">
              O'chirish
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 text-admin-muted">
          <span className="text-2xl">+</span>
          <span className="text-xs font-medium">{isUploading ? "Yuklanmoqda..." : "Rasm yuklash yoki torting"}</span>
        </button>
      )}
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
