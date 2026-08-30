import { createFileRoute } from "@tanstack/react-router";
import { MahidolLampangHub } from "@/components/pages/MahidolLampangHub";

export const Route = createFileRoute("/")({
  component: MahidolLampangHub,
});
