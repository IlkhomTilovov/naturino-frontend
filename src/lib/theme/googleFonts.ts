const loadedFonts = new Set<string>(["Geist"]);

export function loadGoogleFont(name: string, weights: number[] = [400, 700]): void {
  if (loadedFonts.has(name)) return;
  loadedFonts.add(name);

  const family = name.trim().replace(/\s+/g, "+");
  const weightParam = [...new Set(weights)].sort((a, b) => a - b).join(";");
  const href = `https://fonts.googleapis.com/css2?family=${family}:wght@${weightParam}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.googleFont = name;
  document.head.appendChild(link);
}

export function loadGoogleFonts(names: { name: string; weights?: number[] }[]): void {
  names.forEach(({ name, weights }) => loadGoogleFont(name, weights));
}
