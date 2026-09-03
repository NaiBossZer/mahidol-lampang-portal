import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const checks = [];

function check(label, passed, detail = "") {
  checks.push({ label, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

const app = readFileSync(resolve(root, "src/App.tsx"), "utf8");
const requiredRoutes = [
  "/",
  "/login",
  "/dashboard",
  "/storefront",
  "/admin",
  "/smart-farm",
  "/clean-energy",
  "/rac",
  "/survey",
];
for (const route of requiredRoutes)
  check(
    `route ${route}`,
    app.includes(`path=\"${route}\"`) || (route === "/" && app.includes('path="/"')),
  );

const requiredAssets = [
  "public/main banner.jpg",
  "public/intro-enlp.mp4",
  "public/site-map-3d.glb",
  "public/mahidol-logo.png",
  "public/envi-logo.jpg",
  "public/social-engagement-logo.png",
];
for (const asset of requiredAssets) check(`asset ${asset}`, existsSync(resolve(root, asset)));

const hub = readFileSync(resolve(root, "src/components/pages/MahidolLampangHub.tsx"), "utf8");
check("primary identity wording", hub.includes("งานพันธกิจเพื่อสังคม"));
check("secondary learning wording", hub.includes("พื้นที่เรียนรู้"));
check(
  "legacy content modules retained",
  ["Smart Farm", "CLEAN ENERGY", "ตลาดผักมหิดล"].every((item) => hub.includes(item)),
);

const styles = readFileSync(resolve(root, "src/styles.css"), "utf8");
check("design tokens loaded", styles.includes("--brand-navy") && styles.includes("--focus-ring"));
check("reduced motion support", styles.includes("prefers-reduced-motion"));

const failed = checks.filter((item) => !item.passed);
console.log(`\nSmoke test: ${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) process.exitCode = 1;
