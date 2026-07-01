import { Route, Routes } from "react-router-dom";
import { ComingSoonPage } from "../components/shared/ComingSoonPage";
import { DashboardPage } from "../features/admin/dashboard/DashboardPage";
import { LoginPage } from "../features/admin/auth/LoginPage";
import { ProductsListPage } from "../features/admin/products/ProductsListPage";
import { ProductFormPage } from "../features/admin/products/ProductFormPage";
import { ProductCategoriesPage } from "../features/admin/categories/ProductCategoriesPage";
import { ContentHubPage } from "../features/admin/content-hub/ContentHubPage";
import { PagesListPage } from "../features/admin/page-builder/PagesListPage";
import { PageDetailPage } from "../features/admin/page-builder/PageDetailPage";
import { LiveEditPage } from "../features/admin/page-builder/LiveEditPage";
import { LanguagesPage } from "../features/admin/languages/LanguagesPage";
import { CertificatesPage } from "../features/admin/certificates/CertificatesPage";
import { ThemesPage } from "../features/admin/appearance/ThemesPage";
import { ThemeEditorPage } from "../features/admin/appearance/ThemeEditorPage";
import { HomePage } from "../features/public/home/HomePage";
import { ProductsPage } from "../features/public/products/ProductsPage";
import { DynamicPage } from "../features/public/shared/DynamicPage";
import { ContactPage } from "../features/public/contact/ContactPage";
import { ProductDetailPage } from "../features/public/product-details/ProductDetailPage";
import { AdminLayout } from "../layouts/AdminLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about-us" element={<DynamicPage slug="about-us" fallbackTitle="About Us" />} />
        <Route path="ishlab-chiqarish" element={<DynamicPage slug="production" fallbackTitle="Ishlab chiqarish" />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
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
        <Route path="categories" element={<ProductCategoriesPage />} />
        <Route path="content" element={<ContentHubPage />} />
        <Route path="pages" element={<PagesListPage />} />
        <Route path="languages" element={<LanguagesPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="appearance/themes" element={<ThemesPage />} />
        <Route path="appearance/themes/new" element={<ThemeEditorPage />} />
        <Route path="appearance/themes/:id" element={<ThemeEditorPage />} />
        <Route path="settings" element={<ComingSoonPage title="Umumiy sozlamalar" />} />
        <Route path="settings/seo" element={<ComingSoonPage title="SEO sozlamalari" />} />
        <Route path="settings/media" element={<ComingSoonPage title="Media Manager" />} />
        <Route path="settings/users" element={<ComingSoonPage title="Foydalanuvchilar" />} />
      </Route>

      <Route path="*" element={<ComingSoonPage title="Page not found" />} />
    </Routes>
  );
}
