import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { themesApi } from "./api/endpoints/themes";
import { applyTheme } from "./lib/theme/applyTheme";
import "./index.css";

themesApi
  .getActive()
  .then(applyTheme)
  .catch(() => undefined);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
