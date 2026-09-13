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
  "/admin/cms",
  "/smart-farm",
  "/clean-energy",
  "/rac",
  "/survey",
  "/activities",
  "/centers",
  "/projects",
  "/shellac",
  "/site-map",
  "/support-vegetables",
];
for (const route of requiredRoutes) {
  check(`route ${route}`, app.includes(`path=\"${route}\"`));
}

for (const asset of [
  "public/main banner.jpg",
  "public/intro-enlp.mp4",
  "public/mahidol-logo.png",
  "public/envi-logo.jpg",
  "public/social-engagement-logo.png",
]) {
  check(`asset ${asset}`, existsSync(resolve(root, asset)));
}

const mapViewer = readFileSync(resolve(root, "src/components/Map3DViewer.tsx"), "utf8");
check(
  "3D map uses external model fallback",
  mapViewer.includes("FALLBACK_MODEL_URL") &&
    mapViewer.includes("huggingface.co/BossLampang/site-map-3d-MU-Lampang"),
);
check("oversized local 3D asset excluded", !existsSync(resolve(root, "public/site-map-3d.glb")));

const hub = readFileSync(resolve(root, "src/pages/HomePage.tsx"), "utf8");
const systems = readFileSync(resolve(root, "src/config/systems.ts"), "utf8");
const centers = readFileSync(resolve(root, "src/pages/social/CentersPage.tsx"), "utf8");
const shellac = readFileSync(
  resolve(root, "src/pages/social/ShellacLearningCenterPage.tsx"),
  "utf8",
);
const activityData = readFileSync(resolve(root, "src/data/socialEngagement.ts"), "utf8");

check("primary identity wording", hub.includes("งานพันธกิจเพื่อสังคม"));
check("secondary learning wording", hub.includes("พื้นที่เรียนรู้"));
check(
  "core architecture retained",
  ["Smart Farm", "Clean Energy", "Shellac Learning Center"].every((item) =>
    systems.includes(item),
  ) &&
    (centers.includes("Learning Experience") || shellac.includes("LEARNING EXPERIENCE")),
);
check(
  "core registry centralized",
  systems.includes("CORE_SYSTEMS") && !activityData.includes("SYSTEMS"),
);
check("removed diagnostic endpoint", !existsSync(resolve(root, "api/admin/db-check.ts")));
check("building safety remains excluded", !app.toLowerCase().includes("building safety"));

const styles = readFileSync(resolve(root, "src/styles.css"), "utf8");
check(
  "design tokens loaded",
  styles.includes("--brand-navy") && styles.includes("--ring") && styles.includes(":focus-visible"),
);
check("reduced motion support", styles.includes("prefers-reduced-motion"));

check("legacy Vercel config removed", !existsSync(resolve(root, "vercel.json")));
check("Vite config exists", existsSync(resolve(root, "vite.config.ts")));
check(
  "Vite build script exists",
  readFileSync(resolve(root, "package.json"), "utf8").includes('"build": "vite build"'),
);
check("API function directory exists", existsSync(resolve(root, "api")));
check("API health function exists", existsSync(resolve(root, "api/health.ts")));
check("API activity function exists", existsSync(resolve(root, "api/activities.ts")));
check("API auth directory exists", existsSync(resolve(root, "api/auth")));
check("API admin directory exists", existsSync(resolve(root, "api/admin")));

check("CMS schema exists", existsSync(resolve(root, "src/db/cms.ts")));
check("CMS migration exists", existsSync(resolve(root, "drizzle/0002_canonical_cms.sql")));
check("CMS services API exists", existsSync(resolve(root, "api/admin/services.ts")));
check("CMS home API exists", existsSync(resolve(root, "api/admin/home.ts")));
check("CMS navigation API exists", existsSync(resolve(root, "api/admin/navigation.ts")));
check("CMS footer API exists", existsSync(resolve(root, "api/admin/footer.ts")));
check("CMS projects API exists", existsSync(resolve(root, "api/admin/projects.ts")));
check("CMS centers API exists", existsSync(resolve(root, "api/admin/learning-centers.ts")));
check("CMS partners API exists", existsSync(resolve(root, "api/admin/partners.ts")));
check("public CMS home API exists", existsSync(resolve(root, "api/cms/home.ts")));
check("CMS page exists", existsSync(resolve(root, "src/pages/admin/CmsPage.tsx")));
check(
  "CMS auth boundary reused",
  readFileSync(resolve(root, "api/admin/_cms.ts"), "utf8").includes("requirePermission"),
);

const migration = readFileSync(resolve(root, "drizzle/0002_canonical_cms.sql"), "utf8");
check(
  "CMS database RLS enabled",
  ["services", "home_sections", "navigation_items", "footer_settings"].every((table) =>
    migration.includes(`ALTER TABLE \"public\".\"${table}\" ENABLE ROW LEVEL SECURITY`),
  ),
);
check(
  "canonical home sections seeded",
  migration.includes("HOME_HERO") &&
    migration.includes("FEATURED_ACTIVITIES") &&
    migration.includes("PARTNERS"),
);

const failed = checks.filter((item) => !item.passed);
console.log(`\nSmoke test: ${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) process.exitCode = 1;
