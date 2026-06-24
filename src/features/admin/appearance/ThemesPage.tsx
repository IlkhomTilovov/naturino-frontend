import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { themesApi } from "../../../api/endpoints/themes";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/ui/button";
import { PlusIcon, RefreshIcon } from "../../../components/admin/icons";
import { useToastStore } from "../../../store/toastStore";
import { ThemeCard } from "./ThemeCard";

type Filter = "all" | "light" | "dark";

export function ThemesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const [filter, setFilter] = useState<Filter>("all");

  const { data: themes = [], isLoading, refetch } = useQuery({
    queryKey: ["themes"],
    queryFn: themesApi.getAll,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["themes"] });

  const activate = useMutation({
    mutationFn: (id: string) => themesApi.activate(id),
    onSuccess: () => {
      invalidate();
      addToast("Mavzu qo'llandi");
    },
  });

  const duplicate = useMutation({
    mutationFn: (id: string) => themesApi.duplicate(id),
    onSuccess: () => {
      invalidate();
      addToast("Mavzu nusxalandi");
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => themesApi.remove(id),
    onSuccess: () => {
      invalidate();
      addToast("Mavzu o'chirildi");
    },
    onError: (error) => {
      const message = isAxiosError(error) ? error.response?.data?.detail : null;
      addToast(message ?? "Mavzuni o'chirishda xatolik yuz berdi.", "error");
    },
  });

  const filtered = themes.filter((t) => {
    if (filter === "light") return !t.isDarkMode;
    if (filter === "dark") return t.isDarkMode;
    return true;
  });

  const lightCount = themes.filter((t) => !t.isDarkMode).length;
  const darkCount = themes.filter((t) => t.isDarkMode).length;
  const active = themes.find((t) => t.isActive);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mavzular"
        description="Sayt dizaynini bir marta bosish bilan o'zgartiring"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshIcon className="mr-2 h-4 w-4" /> Yangilash
            </Button>
            <Button className="bg-admin-primary hover:bg-admin-primary-600" onClick={() => navigate("/admin/appearance/themes/new")}>
              <PlusIcon className="mr-2 h-4 w-4" /> Yangi mavzu
            </Button>
          </div>
        }
      />

      {active && (
        <div className="flex items-center justify-between rounded-xl border border-admin-border bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">🎨</span>
            <div>
              <p className="text-sm font-semibold text-admin-primary">
                Joriy mavzu <span className="text-admin-muted">•</span> {active.name}
              </p>
              <div className="mt-1.5 flex gap-1">
                {["#0A4B3A", "#E5E7EB", "#487d25", "#FFFFFF", "#0F172A"].map((c, i) => (
                  <span key={i} className="h-4 w-6 rounded" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-admin-muted">
              {active.isDarkMode ? "Qorong'i" : "Yorug'"}
            </span>
            <span className="rounded-full bg-admin-accent-50 px-3 py-1 font-semibold text-admin-accent">✓ Faol</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {[
          { key: "all" as Filter, label: `Barcha (${themes.length})` },
          { key: "light" as Filter, label: `Yorug' (${lightCount})` },
          { key: "dark" as Filter, label: `Qorong'i (${darkCount})` },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key ? "bg-white text-admin-primary shadow-sm ring-1 ring-admin-border" : "text-admin-muted hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-admin-muted">Yuklanmoqda...</p>}

      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onActivate={() => activate.mutate(theme.id)}
              onDuplicate={() => duplicate.mutate(theme.id)}
              onPreview={() => navigate(`/admin/appearance/themes/${theme.id}`)}
              onDelete={() => {
                if (confirm(`"${theme.name}" mavzusini o'chirmoqchimisiz?`)) remove.mutate(theme.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
