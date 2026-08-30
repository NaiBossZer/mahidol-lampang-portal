/**
 * Centralized Configuration Constants
 * Single source of truth for all external URLs and configuration
 */

// Sub-system URLs
export const SUB_SYSTEM_URLS = {
  RAC: "https://mahidol-shellac.vercel.app",
  CLEAN_ENERGY: "https://mahidol-clean-energy.vercel.app",
  SMART_FARM: "https://mahidol-smart-farm.vercel.app/",
} as const;

// Google Apps Script URLs
export const GOOGLE_SCRIPTS = {
  DASHBOARD: "https://script.google.com/macros/s/AKfycbxIXYFkonDlYf8sb1VqTDoJXlsZ58Pd53qYSP-rxeLc-9_hiHA4kKIUVAUEM-IdcrLIkQ/exec",
  SURVEY: "https://script.google.com/macros/s/AKfycbx6MoINngMyK4Jf4JgCTQHY_B_iydnYqtqSKcT2-UbslV23ZBX__k-ez7gbeixDXq8rPQ/exec",
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "Mahidol University Lampang Hub",
  DEFAULT_LOCALE: "th",
  TIMEZONE: "Asia/Bangkok",
} as const;

// Color Palette (for TypeScript reference)
export const COLORS = {
  NAVY: "#002D62",
  GOLD: "#F2A900", 
  GREEN: "#2E7D32",
  WHITE: "#FFFFFF",
} as const;