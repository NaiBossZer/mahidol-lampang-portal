import { SYSTEM_KEYS } from "./constants";

export type CoreSystem = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  systemKey: string;
};

/** Single source of truth for the portal's core systems. */
export const CORE_SYSTEMS: readonly CoreSystem[] = [
  {
    slug: "smart-farm",
    title: "Smart Farm",
    subtitle: "เกษตรอัจฉริยะและข้อมูลจากพื้นที่จริง",
    image: "/Smart Farm.jpg",
    systemKey: SYSTEM_KEYS.SMART_FARM,
  },
  {
    slug: "clean-energy",
    title: "Clean Energy",
    subtitle: "พลังงานสะอาดและการใช้พลังงานอย่างมีประสิทธิภาพ",
    image: "/EVCharger.jpg",
    systemKey: SYSTEM_KEYS.CLEAN_ENERGY,
  },
  {
    slug: "shellac",
    title: "Shellac Learning Center",
    subtitle: "ศูนย์เรียนรู้ครั่งครบวงจร",
    image: "/Shellac banner.jpg",
    systemKey: SYSTEM_KEYS.RAC,
  },
] as const;
