import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { pagesApi } from "../../../api/endpoints/pages";
import { PageHeader } from "../../../components/admin/PageHeader";
import { EmptyState } from "../../../components/admin/EmptyState";
import { SearchIcon } from "../../../components/admin/icons";
import { timeAgo } from "../../../lib/utils/timeAgo";
import type { Page } from "../../../types/page";

type StatusFilter = "all" | "published" | "draft";
type SortOption = "updated" | "name";

export function PagesListPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["pages"], queryFn: pagesApi.getAll });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("updated");

  const pages = data ?? [];
  const publishedCount = pages.filter((p) => p.isPublished).length;
  const draftCount = pages.length - publishedCount;

  const filtered = useMemo(() => {
    let list = pages.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || (statusFilter === "published" ? p.isPublished : !p.isPublished);
      return matchesSearch && matchesStatus;
    });
    list = [...list].sort((a, b) =>
      sort === "name" ? a.title.localeCompare(b.title) : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return list;
  }, [pages, search, statusFilter, sort]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sahifalar"
        description={
          <>
            Veb-sayt kontenti va dinamik sahifalarni boshqaring — {pages.length} ta sahifa
            <span className="ml-2 text-admin-accent">{publishedCount} chop etilgan</span>
            <span className="ml-2 text-admin-warning">{draftCount} qoralama</span>
          </>
        }
      />

      {isError && <p className="text-sm text-admin-danger">Sahifalarni yuklashda xatolik.</p>}

      <div className="rounded-xl border border-admin-border bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
            <input
              type="text"
              placeholder="Sahifa nomi yoki slug bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-admin-border py-2 pl-9 pr-3 text-sm focus:border-admin-primary focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
          >
            <option value="all">Barchasi</option>
            <option value="published">Chop etilgan</option>
            <option value="draft">Qoralama</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-admin-border px-3 py-2 text-sm focus:border-admin-primary focus:outline-none"
          >
            <option value="updated">So'nggi yangilangan</option>
            <option value="name">Nomi bo'yicha</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-xl border border-admin-border bg-white">
          <EmptyState title="Sahifalar topilmadi" description="Qidiruv yoki filtrlarni o'zgartirib ko'ring." />
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageCard({ page }: { page: Page }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-admin-border bg-white p-5 transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            {page.isHomePage && (
              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-admin-accent-50 px-2 py-0.5 text-xs font-semibold text-admin-accent">
                🏠 Homepage
              </span>
            )}
            <h3 className="font-semibold text-admin-primary">{page.title}</h3>
            <code className="text-xs text-admin-muted">/{page.slug}</code>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              page.isPublished ? "bg-admin-primary text-white" : "border border-admin-warning/30 bg-admin-warning-50 text-admin-warning"
            }`}
          >
            {page.isPublished ? "Chop etilgan" : "Qoralama"}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-admin-muted">
          <span>{page.sections.length} bo'lim</span>
          <span>{page.sections.filter((s) => s.isEnabled).length} faol</span>
          <span>Yangilandi: {timeAgo(page.updatedAt)}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link to={`/admin/pages/${page.id}`} className="flex-1 rounded-lg bg-admin-primary px-3 py-2 text-center text-sm font-medium text-white hover:bg-admin-primary-600">
          Tahrirlash
        </Link>
        <Link
          to={`/live-edit/${page.id}`}
          className="rounded-lg border border-admin-border px-3 py-2 text-sm font-medium text-admin-muted hover:bg-slate-50"
        >
          Ko'rish
        </Link>
      </div>
    </div>
  );
}
