/**
 * Centralized Configuration Constants
 * Single source of truth for all external URLs and configuration
 */

// Central system registry keys. URLs are stored in Supabase system_registry.
export const SYSTEM_KEYS = {
  RAC: "lac-learning",
  CLEAN_ENERGY: "clean-energy",
  SMART_FARM: "smart-farm",
  FACILITY_SAFETY: "facility-safety",
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "Mahidol Social Engagement Platform",
  DEFAULT_LOCALE: "th",
  TIMEZONE: "Asia/Bangkok",
  PROMPTPAY_ID: import.meta.env.VITE_PROMPTPAY_ID ?? "",
  PROMPTPAY_NAME: import.meta.env.VITE_PROMPTPAY_NAME ?? "Mahidol University",
} as const;
