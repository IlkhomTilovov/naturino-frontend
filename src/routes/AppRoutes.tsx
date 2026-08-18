import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ComingSoonPage } from "../components/shared/ComingSoonPage";
import { HomePage } from "../features/public/home/HomePage";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Admin and heavier public pages are code-split so a first-time public visitor
// doesn't download the entire admin panel (page-builder, theme editor, product
// forms) up front. React.lazy needs a default export, so each named export is
// re-wrapped inline.
const DashboardPage = lazy(() => import("../features/admin/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const LoginPage = lazy(() => import("../features/admin/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const ProductsListPage = lazy(() => import("../features/admin/products/ProductsListPage").then((m) => ({ default: m.ProductsListPage })));
const ProductFormPage = lazy(() => import("../features/admin/products/ProductFormPage").then((m) => ({ default: m.ProductFormPage })));
const ProductCategoriesPage = lazy(() => import("../features/admin/categories/ProductCategoriesPage").then((m) => ({ default: m.ProductCategoriesPage })));
const ContentHubPage = lazy(() => import("../features/admin/content-hub/ContentHubPage").then((m) => ({ default: m.ContentHubPage })));
const PagesListPage = lazy(() => import("../features/admin/page-builder/PagesListPage").then((m) => ({ default: m.PagesListPage })));
const PageDetailPage = lazy(() => import("../features/admin/page-builder/PageDetailPage").then((m) => ({ default: m.PageDetailPage })));
const LiveEditPage = lazy(() => import("../features/admin/page-builder/LiveEditPage").then((m) => ({ default: m.LiveEditPage })));
const LanguagesPage = lazy(() => import("../features/admin/languages/LanguagesPage").then((m) => ({ default: m.LanguagesPage })));
const CertificatesPage = lazy(() => import("../features/admin/certificates/CertificatesPage").then((m) => ({ default: m.CertificatesPage })));
const ThemesPage = lazy(() => import("../features/admin/appearance/ThemesPage").then((m) => ({ default: m.ThemesPage })));
const ThemeEditorPage = lazy(() => import("../features/admin/appearance/ThemeEditorPage").then((m) => ({ default: m.ThemeEditorPage })));
const SettingsPage = lazy(() => import("../features/admin/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const AdminLayout = lazy(() => import("../layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AuthLayout = lazy(() => import("../layouts/AuthLayout").then((m) => ({ default: m.AuthLayout })));

const ProductsPage = lazy(() => import("../features/public/products/ProductsPage").then((m) => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import("../features/public/product-details/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })));
const DynamicPage = lazy(() => import("../features/public/shared/DynamicPage").then((m) => ({ default: m.DynamicPage })));
const CategoryPage = lazy(() => import("../features/public/shared/CategoryPage").then((m) => ({ default: m.CategoryPage })));
const CategoryTabPage = lazy(() => import("../features/public/shared/CategoryTabPage").then((m) => ({ default: m.CategoryTabPage })));
const ContactPage = lazy(() => import("../features/public/contact/ContactPage").then((m) => ({ default: m.ContactPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<DynamicPage slug="about-us" fallbackTitle="About Us" />} />
          <Route path="ishlab-chiqarish" element={<DynamicPage slug="production" fallbackTitle="Ishlab chiqarish" />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="categories/:slug" element={<CategoryPage />} />
          <Route path="categories/:slug/:tab" element={<CategoryTabPage />} />
          {/* Product reached from within a category's own product listing — kept under
              /categories/... (not /products/...) so the navbar's "Mahsulotlar" link doesn't
              falsely light up as active while the visitor is still inside a category. The
              last segment is still named :slug so ProductDetailPage's own useParams works
              unmodified. */}
          <Route path="categories/:catSlug/:tab/:slug" element={<ProductDetailPage />} />
          <Route path="certificates" element={<DynamicPage slug="certificates" fallbackTitle="Certificates" />} />
          <Route path="quality" element={<DynamicPage slug="quality" fallbackTitle="Sifat" />} />
          <Route path="partnership" element={<DynamicPage slug="partnership" fallbackTitle="Partnership / Dealers" />} />
          <Route path="blog" element={<DynamicPage slug="blog" fallbackTitle="Blog / News" />} />
          <Route path="blog/:slug" element={<ComingSoonPage title="Blog Post" />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="live-edit/:id"
            element={
              <ProtectedRoute>
                <LiveEditPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Full-screen editor takeover — deliberately outside AdminLayout so its own
            toolbar/section-list/inspector panels get the whole viewport instead of
            competing with the permanent admin sidebar for width. */}
        <Route
          path="/admin/pages/:id"
          element={
            <ProtectedRoute>
              <PageDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductFormPage />} />
          <Route path="categories" element={<ProductCategoriesPage scope="top" />} />
          <Route path="subcategories" element={<ProductCategoriesPage scope="sub" />} />
          <Route path="content" element={<ContentHubPage />} />
          <Route path="pages" element={<PagesListPage />} />
          <Route path="languages" element={<LanguagesPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="appearance/themes" element={<ThemesPage />} />
          <Route path="appearance/themes/new" element={<ThemeEditorPage />} />
          <Route path="appearance/themes/:id" element={<ThemeEditorPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/seo" element={<ComingSoonPage title="SEO sozlamalari" />} />
          <Route path="settings/media" element={<ComingSoonPage title="Media Manager" />} />
          <Route path="settings/users" element={<ComingSoonPage title="Foydalanuvchilar" />} />
        </Route>

        <Route path="*" element={<ComingSoonPage title="Page not found" />} />
      </Routes>
    </Suspense>
  );
}
