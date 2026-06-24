import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mediaApi } from "../../../api/endpoints/media";
import { productImagesApi } from "../../../api/endpoints/products";
import { resolveMediaUrl, FALLBACK_IMAGE } from "../../../lib/utils/media";
import { useToastStore } from "../../../store/toastStore";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import type { ProductImage } from "../../../types/product";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

interface UploadingFile {
  key: string;
  name: string;
  progress: number;
  error?: string;
}

export function ProductImageManager({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadingFile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const queryKey = ["product-images", productId];

  const { data: images = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => productImagesApi.getAll(productId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["product", productId] });
  };

  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Faqat JPG, PNG yoki WEBP formatlari qo'llab-quvvatlanadi.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return "Fayl hajmi 10 MB dan oshmasligi kerak.";
    }
    return null;
  };

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      const key = `${file.name}-${Date.now()}-${Math.random()}`;
      const validationError = validateFile(file);
      if (validationError) {
        addToast(`${file.name}: ${validationError}`, "error");
        continue;
      }

      setUploads((prev) => [...prev, { key, name: file.name, progress: 0 }]);

      try {
        const media = await mediaApi.upload(file, (percent) => {
          setUploads((prev) => prev.map((u) => (u.key === key ? { ...u, progress: percent } : u)));
        });
        await productImagesApi.add(productId, [media.id]);
        invalidate();
      } catch {
        setUploads((prev) =>
          prev.map((u) => (u.key === key ? { ...u, error: "Yuklashda xatolik" } : u)),
        );
        addToast(`${file.name} yuklanmadi`, "error");
        continue;
      }

      setUploads((prev) => prev.filter((u) => u.key !== key));
    }
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    void uploadFiles(Array.from(fileList));
  };

  const handleDelete = async (image: ProductImage) => {
    if (!window.confirm("Rasmni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await productImagesApi.remove(productId, image.id);
      invalidate();
      addToast("Rasm o'chirildi");
    } catch {
      addToast("Rasmni o'chirishda xatolik", "error");
    }
  };

  const handleSetCover = async (image: ProductImage) => {
    try {
      await productImagesApi.setCover(productId, image.id);
      invalidate();
    } catch {
      addToast("Asosiy rasmni belgilashda xatolik", "error");
    }
  };

  const startEditAlt = (image: ProductImage) => {
    setEditingId(image.id);
    setAltDraft(image.altText ?? "");
  };

  const saveAltText = async (image: ProductImage) => {
    try {
      await productImagesApi.update(productId, image.id, altDraft.trim() || null);
      invalidate();
    } catch {
      addToast("Tasvir matnini saqlashda xatolik", "error");
    } finally {
      setEditingId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedImages.findIndex((i) => i.id === active.id);
    const newIndex = sortedImages.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sortedImages, oldIndex, newIndex);
    queryClient.setQueryData(queryKey, reordered);

    try {
      await productImagesApi.reorder(productId, reordered.map((i) => i.id));
      invalidate();
    } catch {
      addToast("Tartiblashda xatolik yuz berdi", "error");
      invalidate();
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragOver ? "border-admin-accent bg-admin-accent-50" : "border-admin-border hover:border-admin-accent"
        }`}
      >
        <span className="text-3xl">📸</span>
        <p className="text-sm font-medium text-admin-primary">
          {isDragOver ? "Fayllarni qo'yib yuboring" : "Rasmlarni shu yerga tashlang"}
        </p>
        <p className="text-xs text-admin-muted">
          yoki <span className="font-medium text-admin-accent">fayl tanlash</span> uchun bosing
        </p>
        <p className="text-xs text-admin-muted">JPG • PNG • WEBP • Max 10 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFilesSelected(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((u) => (
            <div key={u.key} className="rounded-lg border border-admin-border p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate text-admin-primary">{u.name}</span>
                <span className={u.error ? "text-admin-danger" : "text-admin-muted"}>
                  {u.error ?? `${u.progress}%`}
                </span>
              </div>
              {!u.error && (
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-admin-accent transition-all"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isLoading && <p className="text-sm text-admin-muted">Yuklanmoqda...</p>}

      {!isLoading && sortedImages.length === 0 && uploads.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <span className="text-3xl">📸</span>
          <p className="font-medium text-admin-primary">Hali rasm yuklanmagan</p>
          <p className="text-sm text-admin-muted">Mahsulot galereyasi uchun rasmlar yuklang.</p>
        </div>
      )}

      {sortedImages.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedImages.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sortedImages.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  isEditing={editingId === image.id}
                  altDraft={altDraft}
                  onAltDraftChange={setAltDraft}
                  onStartEdit={() => startEditAlt(image)}
                  onSaveAlt={() => saveAltText(image)}
                  onCancelEdit={() => setEditingId(null)}
                  onSetCover={() => handleSetCover(image)}
                  onDelete={() => handleDelete(image)}
                  onPreview={() => {
                    setPreviewIndex(index);
                    setIsZoomed(false);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={previewIndex !== null} onOpenChange={(open) => !open && setPreviewIndex(null)}>
        <DialogContent className="max-w-3xl bg-black p-0 sm:max-w-3xl">
          {previewIndex !== null && sortedImages[previewIndex] && (
            <div className="relative flex flex-col items-center justify-center p-6">
              <img
                src={resolveMediaUrl(sortedImages[previewIndex].url) ?? FALLBACK_IMAGE}
                alt={sortedImages[previewIndex].altText ?? ""}
                onClick={() => setIsZoomed((z) => !z)}
                className={`max-h-[70vh] cursor-zoom-in rounded-lg object-contain transition-transform ${
                  isZoomed ? "scale-150 cursor-zoom-out" : ""
                }`}
              />
              <div className="mt-4 flex w-full items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    setPreviewIndex((i) => (i !== null ? (i - 1 + sortedImages.length) % sortedImages.length : i));
                  }}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                >
                  ← Oldingi
                </button>
                <span className="text-sm text-white/70">
                  {previewIndex + 1} / {sortedImages.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomed(false);
                    setPreviewIndex((i) => (i !== null ? (i + 1) % sortedImages.length : i));
                  }}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                >
                  Keyingi →
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ImageCard({
  image,
  isEditing,
  altDraft,
  onAltDraftChange,
  onStartEdit,
  onSaveAlt,
  onCancelEdit,
  onSetCover,
  onDelete,
  onPreview,
}: {
  image: ProductImage;
  isEditing: boolean;
  altDraft: string;
  onAltDraftChange: (v: string) => void;
  onStartEdit: () => void;
  onSaveAlt: () => void;
  onCancelEdit: () => void;
  onSetCover: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm transition-all hover:shadow-md ${
        isDragging ? "z-10 scale-105 opacity-80" : ""
      }`}
    >
      <img
        src={resolveMediaUrl(image.url) ?? FALLBACK_IMAGE}
        alt={image.altText ?? ""}
        onClick={onPreview}
        className="h-full w-full cursor-pointer object-cover transition-transform group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />

      {image.isPrimary && (
        <span className="absolute left-2 top-2 rounded-full bg-admin-accent px-2 py-0.5 text-[11px] font-medium text-white">
          ⭐ Asosiy rasm
        </span>
      )}

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute right-2 top-2 cursor-grab rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
        title="Tartibni o'zgartirish"
      >
        ↕
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        {!image.isPrimary && (
          <button
            type="button"
            onClick={onSetCover}
            className="rounded bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
            title="Asosiy rasm qilish"
          >
            ⭐
          </button>
        )}
        <button
          type="button"
          onClick={onStartEdit}
          className="rounded bg-white/90 px-2 py-1 text-xs font-medium hover:bg-white"
          title="Tasvir matnini tahrirlash"
        >
          ✏
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded bg-white/90 px-2 py-1 text-xs font-medium text-admin-danger hover:bg-white"
          title="O'chirish"
        >
          🗑
        </button>
      </div>

      {isEditing && (
        <div className="absolute inset-0 z-20 flex flex-col gap-2 bg-white/95 p-3">
          <label className="text-xs font-medium text-admin-primary">Tasvir matni (alt)</label>
          <input
            autoFocus
            value={altDraft}
            onChange={(e) => onAltDraftChange(e.target.value)}
            className="rounded border border-admin-border px-2 py-1 text-xs"
          />
          <div className="mt-auto flex justify-end gap-1.5">
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded px-2 py-1 text-xs text-admin-muted hover:bg-slate-100"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={onSaveAlt}
              className="rounded bg-admin-primary px-2 py-1 text-xs font-medium text-white hover:bg-admin-primary-600"
            >
              Saqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
