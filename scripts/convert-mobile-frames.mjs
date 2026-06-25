import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("ezgif-76a5b598005e34a5-png-split");
const OUT_DIR = path.resolve("public/hero-frames-mobile");

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR)
  .filter((f) => f.toLowerCase().endsWith(".png"))
  .sort();

console.log(`Converting ${files.length} frames...`);

let total = 0;
for (let i = 0; i < files.length; i++) {
  const inputPath = path.join(SRC_DIR, files[i]);
  const outputPath = path.join(OUT_DIR, `frame-${String(i + 1).padStart(3, "0")}.webp`);
  const info = await sharp(inputPath).webp({ quality: 72 }).toFile(outputPath);
  total += info.size;
  if ((i + 1) % 50 === 0 || i === files.length - 1) {
    console.log(`  ${i + 1}/${files.length} done`);
  }
}

console.log(`Done. Total output size: ${(total / 1024 / 1024).toFixed(2)} MB for ${files.length} frames.`);
