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
  DASHBOARD:
    "https://script.google.com/macros/s/AKfycbxIXYFkonDlYf8sb1VqTDoJXlsZ58Pd53qYSP-rxeLc-9_hiHA4kKIUVAUEM-IdcrLIkQ/exec",
  SURVEY:
    "https://script.google.com/macros/s/AKfycbx6MoINngMyK4Jf4JgCTQHY_B_iydnYqtqSKcT2-UbslV23ZBX__k-ez7gbeixDXQ8rPQ/exec",
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "Mahidol Social Engagement Platform",
  DEFAULT_LOCALE: "th",
  TIMEZONE: "Asia/Bangkok",
  PROMPTPAY_ID: import.meta.env.VITE_PROMPTPAY_ID ?? "",
  PROMPTPAY_NAME: import.meta.env.VITE_PROMPTPAY_NAME ?? "Mahidol University",
} as const;
