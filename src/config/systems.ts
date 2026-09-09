export type CoreSystem = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

import { SUB_SYSTEM_URLS } from "./constants";

/** Single source of truth for the portal's core systems. */
export const CORE_SYSTEMS: readonly CoreSystem[] = [
  {
    slug: "smart-farm",
    title: "Smart Farm",
    subtitle: "เกษตรอัจฉริยะและข้อมูลจากพื้นที่จริง",
    image: "/Smart Farm.jpg",
    href: SUB_SYSTEM_URLS.SMART_FARM,
  },
  {
    slug: "clean-energy",
    title: "Clean Energy",
    subtitle: "พลังงานสะอาดและการใช้พลังงานอย่างมีประสิทธิภาพ",
    image: "/EVCharger.jpg",
    href: SUB_SYSTEM_URLS.CLEAN_ENERGY,
  },
  {
    slug: "shellac",
    title: "Shellac Learning Center",
    subtitle: "ศูนย์เรียนรู้ครั่งครบวงจร",
    image: "/Shellac banner.jpg",
    href: SUB_SYSTEM_URLS.RAC,
  },
] as const;
