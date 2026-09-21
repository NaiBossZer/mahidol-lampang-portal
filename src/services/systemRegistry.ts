export type SystemRegistryItem = {
  system_key: string;
  system_name: string;
  system_type: string;
  base_url: string | null;
  status: string;
};

const cache = new Map<string, { expiresAt: number; value: SystemRegistryItem[] }>();

export async function getSystemRegistry(systemKey?: string): Promise<SystemRegistryItem[]> {
  const key = systemKey ?? "*";
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const query = systemKey ? `?systemKey=${encodeURIComponent(systemKey)}` : "";
  const response = await fetch(`/api/systems${query}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error || "ไม่สามารถโหลดการตั้งค่าระบบได้");
  const items = Array.isArray(body?.data) ? (body.data as SystemRegistryItem[]) : [];
  cache.set(key, { expiresAt: Date.now() + 30_000, value: items });
  return items;
}

export async function getSystemUrl(systemKey: string): Promise<string | null> {
  const item = (await getSystemRegistry(systemKey))[0];
  return item?.base_url?.trim() || null;
}
