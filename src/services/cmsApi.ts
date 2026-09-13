export type CmsHome = {
  sections: Array<{
    sectionKey: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    sortOrder: number;
    isEnabled: boolean;
  }>;
  services: Array<{
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    description: string | null;
    icon: string | null;
    featuredImage: string | null;
    linkType: string;
    linkUrl: string | null;
    sortOrder: number;
    status: string;
  }>;
};

export async function getPublicHomeCms(): Promise<CmsHome | null> {
  try {
    const response = await fetch("/api/cms/home", { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    const body = (await response.json()) as { data?: CmsHome };
    return body.data ?? null;
  } catch {
    return null;
  }
}
