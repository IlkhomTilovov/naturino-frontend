import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Award,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  FolderTree,
  Images,
  Languages,
  LayoutDashboard,
  Menu,
  Package,
  Palette,
  PenTool,
  Search,
  SearchCheck,
  Settings,
  Users,
} from "lucide-react";
import { authApi } from "../api/endpoints/auth";
import { useAuthStore } from "../store/authStore";
import { Sheet, SheetContent } from "../components/ui/sheet";

const NAV_GROUPS = [
  {
    title: null,
    items: [{ to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard }],
  },
  {
    title: "Kontent",
    items: [
      { to: "/admin/products", label: "Mahsulotlar", end: false, icon: Package },
      { to: "/admin/categories", label: "Kategoriyalar", end: false, icon: FolderTree },
      { to: "/admin/certificates", label: "Sertifikatlar", end: false, icon: Award },
      { to: "/admin/content", label: "Sayt kontenti", end: false, icon: PenTool },
    ],
  },
  {
    title: "Lokalizatsiya",
    items: [{ to: "/admin/languages", label: "Tillar", end: false, icon: Languages }],
  },
  {
    title: "Ko'rinish",
    items: [{ to: "/admin/appearance/themes", label: "Mavzular", end: false, icon: Palette }],
  },
  {
    title: "Sozlamalar",
    items: [
      { to: "/admin/settings", label: "Umumiy sozlamalar", end: true, icon: Settings },
      { to: "/admin/settings/seo", label: "SEO", end: false, icon: SearchCheck },
      { to: "/admin/settings/media", label: "Media Manager", end: false, icon: Images },
      { to: "/admin/settings/users", label: "Foydalanuvchilar", end: false, icon: Users },
    ],
  },
];

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <>
      <Link to="/admin" onClick={onNavigate} className={`flex h-[60px] items-center gap-2 px-5 ${collapsed ? "justify-center px-0" : ""}`}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-admin-primary text-sm font-bold text-white">
          N
        </span>
        {!collapsed && <span className="truncate text-base font-semibold text-admin-primary">Naturino Admin</span>}
      </Link>

      <nav className="admin-scroll flex-1 overflow-y-auto px-3 pb-4 text-sm">
        <div className="flex flex-col gap-4">
          {NAV_GROUPS.map((group, i) => (
            <div key={group.title ?? i} className="flex flex-col gap-1">
              {group.title && !collapsed && (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-admin-muted/70">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium transition-all duration-200 ${
                        collapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-admin-primary text-white shadow-sm"
                          : "text-admin-muted hover:-translate-y-px hover:bg-slate-100 hover:text-admin-primary"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-admin-accent" />}
                        <Icon strokeWidth={1.8} className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {collapsed && (
                          <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-admin-primary px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => undefined);
    }
    clearSession();
    navigate("/admin/login", { replace: true });
  };

  const initial = (user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-admin-bg">
      {/* Desktop sidebar — sticky, full viewport height, never scrolls with content */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-admin-border bg-white transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[80px]" : "w-[280px]"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center gap-2 border-t border-admin-border py-3 text-xs font-medium text-admin-muted transition-colors hover:bg-slate-100 hover:text-admin-primary"
        >
          {collapsed ? <ChevronsRight strokeWidth={1.8} className="h-4 w-4" /> : (
            <>
              <ChevronsLeft strokeWidth={1.8} className="h-4 w-4" /> Yig'ish
            </>
          )}
        </button>
      </aside>

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={false} className="flex w-72 flex-col p-0">
          <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-admin-border bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-admin-muted hover:bg-slate-100 lg:hidden"
            >
              <Menu strokeWidth={1.8} className="h-[18px] w-[18px]" />
            </button>

            <div className="relative hidden sm:block">
              <Search strokeWidth={1.8} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-56 rounded-lg border border-admin-border py-2 pl-9 pr-3 text-sm focus:border-admin-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 rounded-full border border-admin-border p-1 text-xs font-semibold sm:flex">
              <span className="rounded-full bg-admin-primary px-2.5 py-1 text-white">UZ</span>
              <span className="px-2.5 py-1 text-admin-muted">RU</span>
            </div>
            <button type="button" className="relative text-admin-muted hover:text-admin-primary" title="Bildirishnomalar" aria-label="Bildirishnomalar">
              <Bell strokeWidth={1.8} className="h-[18px] w-[18px]" />
            </button>
            <div className="group relative">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-primary text-sm font-semibold text-white"
                title={user?.email ?? "Not signed in"}
              >
                {initial}
              </button>
              <div className="invisible absolute right-0 top-10 z-10 w-48 rounded-lg border border-admin-border bg-white p-2 text-sm shadow-lg group-hover:visible">
                <p className="truncate px-2 py-1.5 text-admin-muted">{user?.email ?? "Not signed in"}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-md px-2 py-1.5 text-left font-medium text-admin-danger hover:bg-admin-danger-50"
                >
                  Chiqish
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-scroll flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
