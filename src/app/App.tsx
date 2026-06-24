import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../routes/AppRoutes";
import { ScrollToTop } from "../routes/ScrollToTop";
import { ToastContainer } from "../components/shared/ToastContainer";
import { LanguageProvider } from "../i18n/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
            <ToastContainer />
          </BrowserRouter>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
