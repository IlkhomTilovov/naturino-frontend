import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { pagesApi } from "../../../api/endpoints/pages";
import { slugify } from "../../../lib/utils/slugify";
import { useToastStore } from "../../../store/toastStore";

export function CreatePageModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setSlug("");
      setSlugTouched(false);
    }
  }, [open]);

  const create = useMutation({
    mutationFn: () => pagesApi.create({ title: title.trim(), slug: slug.trim() }),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      onOpenChange(false);
      navigate(`/admin/pages/${page.id}`);
    },
    onError: () => addToast("Sahifa yaratishda xatolik yuz berdi. Slug band bo'lishi mumkin.", "error"),
  });

  const canSubmit = title.trim().length > 0 && slug.trim().length > 0 && !create.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[20px] p-6">
        <DialogTitle className="text-xl font-semibold text-admin-primary">Yangi sahifa</DialogTitle>
        <p className="mt-1 text-sm text-admin-muted">
          Masalan, mahsulot kategoriyasi uchun sahifa yaratsangiz, slug kategoriya slug'i bilan bir xil bo'lishi kerak.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) create.mutate();
          }}
        >
          <div>
            <label className="text-sm font-medium text-admin-primary">Sarlavha</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                const value = e.target.value;
                setTitle(value);
                if (!slugTouched) setSlug(slugify(value));
              }}
              placeholder="Masalan: It uchun quruq ozuqa"
              className="mt-1.5 w-full rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-admin-primary">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="masalan: it-quruq-ozuqa"
              className="mt-1.5 w-full rounded-lg border border-admin-border px-3 py-2 font-mono text-sm focus:border-admin-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!canSubmit} className="bg-admin-primary hover:bg-admin-primary-600">
              {create.isPending ? "Yaratilmoqda..." : "Yaratish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
